import { useState, useEffect, FormEvent } from 'react';
import { Upload, Calendar } from 'lucide-react';

const WEATHER_API_KEY = "23f979fba12105a0ca8f7edc6af65193";

interface FormData {
  DateTime: string;
  ApparentTemperature: string;
  AirTemperature: string;
  DewPointTemperature: string;
  RelativeHumidity: string;
  WindSpeed: string;
  WindDirection: string;
  lat: string;
  lon: string;
  present_solar: string;
}

interface InputFormProps {
  onSubmit: (formData: FormData, image: File) => void;
  loading: boolean;
}

const getSystemDateTimeLocal = () => {
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export function InputForm({ onSubmit, loading }: InputFormProps) {
  const [formData, setFormData] = useState<FormData>({
    DateTime: getSystemDateTimeLocal(),
    ApparentTemperature: '',
    AirTemperature: '',
    DewPointTemperature: '',
    RelativeHumidity: '',
    WindSpeed: '',
    WindDirection: '',
    lat: '',
    lon: '',
    present_solar: ''
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [fetchingWeather, setFetchingWeather] = useState<boolean>(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setFetchingWeather(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
          );

          if (!res.ok) throw new Error();

          const data = await res.json();

          const tempC = data.main.temp - 273.15;
          const feelsC = data.main.feels_like - 273.15;
          const humidity = data.main.humidity;
          const dewPoint = tempC - ((100 - humidity) / 5);

          setFormData(prev => ({
            ...prev,
            lat: lat.toString(),
            lon: lon.toString(),
            AirTemperature: tempC.toFixed(2),
            ApparentTemperature: feelsC.toFixed(2),
            DewPointTemperature: dewPoint.toFixed(2),
            RelativeHumidity: humidity.toString(),
            WindSpeed: data.wind.speed.toString(),
            WindDirection: data.wind.deg.toString()
          }));
        } finally {
          setFetchingWeather(false);
        }
      },
      () => setFetchingWeather(false)
    );
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (image) onSubmit(formData, image);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
        Solar Power Prediction
      </h2>

      <div>
        <label className="block text-sm font-medium mb-2">Date & Time</label>
        <div className="relative">
          <input
            type="datetime-local"
            value={formData.DateTime}
            disabled
            className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-600 cursor-not-allowed rounded-lg"
          />
          <Calendar className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          ["ApparentTemperature", "Apparent Temperature (°C)"],
          ["AirTemperature", "Air Temperature (°C)"],
          ["RelativeHumidity", "Relative Humidity (%)"],
          ["WindSpeed", "Wind Speed (m/s)"]
        ].map(([key, label]) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-2">{label}</label>
            <input
              value={(formData as any)[key]}
              disabled
              className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-600 cursor-not-allowed rounded-lg"
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Dew Point Temperature (°C)
        </label>
        <input
          value={formData.DewPointTemperature}
          disabled
          className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-600 cursor-not-allowed rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Wind Direction (degrees)
        </label>
        <input
          value={formData.WindDirection}
          disabled
          className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-600 cursor-not-allowed rounded-lg"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input value={`Lat: ${formData.lat}`} disabled className="bg-gray-100 p-2 rounded" />
        <input value={`Lon: ${formData.lon}`} disabled className="bg-gray-100 p-2 rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Present Solar Output (kW)
        </label>
        <input
          type="number"
          step="0.01"
          name="present_solar"
          value={formData.present_solar}
          onChange={handleChange}
          required
          className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Sky Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer"
        >
          {imagePreview ? (
            <img src={imagePreview} className="max-h-40 rounded" />
          ) : (
            <Upload className="h-10 w-10 text-gray-400" />
          )}
        </label>
      </div>

      <button
        type="submit"
        disabled={loading || !image || fetchingWeather}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold"
      >
        {loading ? "Predicting..." : "Generate Prediction"}
      </button>
    </form>
  );
}
