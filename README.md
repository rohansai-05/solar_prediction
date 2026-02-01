# Solar Power Predictor

A modern web application for predicting solar power output using machine learning. The application features a React frontend with dark/light theme support and a Flask backend for predictions.

## Features

- Modern, responsive UI with dark/light theme toggle
- Real-time solar power predictions
- Interactive charts (line and bar)
- Support for weather data and sky images
- Clean, professional design

## Prerequisites

### Backend
- Python 3.7+
- Flask
- NumPy
- Pandas
- OpenCV (cv2)
- TensorFlow
- scikit-learn
- flask-cors

### Frontend
- Node.js 16+
- npm or yarn

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install flask flask-cors numpy pandas opencv-python tensorflow scikit-learn joblib
```

3. Make sure you have the required model files:
   - `solar_image_model_3.keras`
   - `solar_num_model.pkl`

4. Run the Flask server:
```bash
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

1. Start the Flask backend server first
2. Start the React frontend development server
3. Open your browser and navigate to the frontend URL
4. Fill in the form with weather data:
   - Date and time
   - Temperature measurements
   - Humidity
   - Wind speed and direction
   - Location (latitude/longitude)
   - Current solar output
   - Upload a sky image
5. Click "Generate Prediction" to see results
6. View predictions for 15, 30, 45, and 60 minutes ahead
7. Analyze the data using the interactive charts below

## Theme Toggle

Click the moon/sun icon in the top-right corner to switch between dark and light themes. Your preference will be saved in browser storage.

## Building for Production

To build the frontend for production:

```bash
npm run build
```

The build output will be in the `dist` directory.

## API Endpoint

The backend exposes a POST endpoint at `/api/predict` that accepts:
- All weather and location data as form fields
- An image file uploaded as 'image'

Returns JSON with prediction values for 15, 30, 45, and 60 minutes ahead.
