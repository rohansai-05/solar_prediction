from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
import cv2
import joblib
import os
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.resnet50 import preprocess_input

app = Flask(__name__)


CORS(app, resources={r"/api/*": {"origins": "*"}})
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

#loading models
image_model = load_model("solar_image_model_3.keras")
num_model = joblib.load("solar_num_model.pkl")

#prediction function
def predict_single(data_dict, image_path):
    df = pd.DataFrame([data_dict])
    df["DateTime"] = pd.to_datetime(df["DateTime"])
    df["hour"] = df["DateTime"].dt.hour
    df["month"] = df["DateTime"].dt.month
    df["minute"] = df["DateTime"].dt.minute
    df["dayofweek"] = df["DateTime"].dt.dayofweek
    df["day"] = df["DateTime"].dt.day
    df["hour_sin"] = np.sin(2*np.pi*df["hour"]/24)
    df["hour_cos"] = np.cos(2*np.pi*df["hour"]/24)
    df["month_sin"] = np.sin(2*np.pi*df["month"]/12)
    df["month_cos"] = np.cos(2*np.pi*df["month"]/12)
    df["is_day"] = ((df["hour"] >= 6) & (df["hour"] <= 18)).astype(int)
    df["season_winter"] = df["month"].isin([12,1,2]).astype(int)
    df["season_spring"] = df["month"].isin([3,4,5]).astype(int)
    df["season_summer"] = df["month"].isin([6,7,8]).astype(int)
    df["season_autumn"] = df["month"].isin([9,10,11]).astype(int)
    FEATURE_COLS = [
        "ApparentTemperature","AirTemperature","DewPointTemperature",
        "RelativeHumidity","WindSpeed","WindDirection",
        "lat","lon","present_solar",
        "hour","minute","day","month","dayofweek",
        "hour_sin","hour_cos","month_sin","month_cos"
    ]
    X_num = df[FEATURE_COLS].values
    y_pred_num = num_model.predict(X_num)
    TABULAR_FEATURE_ORDER = [
        "present_solar","hour_sin","hour_cos","month_sin","month_cos",
        "is_day","season_winter","season_spring","season_summer","season_autumn"
    ]
    X_tab_img = df[TABULAR_FEATURE_ORDER].values
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (160,160))
    img = preprocess_input(img)
    X_img = np.expand_dims(img, axis=0)
    y_pred_img = image_model.predict([X_img, X_tab_img])
    rmse_img = np.array([0.163096,0.192421,0.185419,0.209397])
    rmse_lgb = np.array([0.15396,0.16268,0.16592,0.16643])

    w_img = (1/rmse_img)/((1/rmse_img)+(1/rmse_lgb))
    w_lgb = 1 - w_img

    y_pred = np.zeros_like(y_pred_img)
    for i in range(4):
        y_pred[:,i] = w_img[i]*y_pred_img[:,i] + w_lgb[i]*y_pred_num[:,i]

    return y_pred


@app.route("/api/predict", methods=["POST"])
def predict():
    try:
        data = {
            "DateTime": request.form["DateTime"],
            "ApparentTemperature": float(request.form["ApparentTemperature"]),
            "AirTemperature": float(request.form["AirTemperature"]),
            "DewPointTemperature": float(request.form["DewPointTemperature"]),
            "RelativeHumidity": float(request.form["RelativeHumidity"]),
            "WindSpeed": float(request.form["WindSpeed"]),
            "WindDirection": float(request.form["WindDirection"]),
            "lat": float(request.form["lat"]),
            "lon": float(request.form["lon"]),
            "present_solar": float(request.form["present_solar"])
        }

        file = request.files["image"]
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)

        pred = predict_single(data, filepath)[0]

        prediction = {
            "p15": round(float(pred[0]),2),
            "p30": round(float(pred[1]),2),
            "p45": round(float(pred[2]),2),
            "p60": round(float(pred[3]),2)
        }

        return jsonify({"success": True, "predictions": prediction})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route("/", methods=["GET","POST"])
def index():

    prediction = None

    if request.method == "POST":

        data = {
            "DateTime": request.form["DateTime"],
            "ApparentTemperature": float(request.form["ApparentTemperature"]),
            "AirTemperature": float(request.form["AirTemperature"]),
            "DewPointTemperature": float(request.form["DewPointTemperature"]),
            "RelativeHumidity": float(request.form["RelativeHumidity"]),
            "WindSpeed": float(request.form["WindSpeed"]),
            "WindDirection": float(request.form["WindDirection"]),
            "lat": float(request.form["lat"]),
            "lon": float(request.form["lon"]),
            "present_solar": float(request.form["present_solar"])
        }

        file = request.files["image"]
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)

        pred = predict_single(data, filepath)[0]

        prediction = {
            "p15": round(float(pred[0]),2),
            "p30": round(float(pred[1]),2),
            "p45": round(float(pred[2]),2),
            "p60": round(float(pred[3]),2)
        }

    return render_template("index.html", prediction=prediction)


if __name__ == "__main__":
    app.run(
        debug=False,
        use_reloader=False,
        host="127.0.0.1",
        port=5000
    )

