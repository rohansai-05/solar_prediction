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
    <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
          Input Parameters
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Weather data auto-populated from your location
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Date & Time</label>
        <div className="relative">
          <input
            type="datetime-local"
            value={formData.DateTime}
            disabled
            className="w-full px-4 py-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 cursor-not-allowed rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium shadow-inner"
          />
          <Calendar className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          ["ApparentTemperature", "Apparent Temp (°C)"],
          ["AirTemperature", "Air Temp (°C)"],
          ["RelativeHumidity", "Humidity (%)"],
          ["WindSpeed", "Wind Speed (m/s)"]
        ].map(([key, label]) => (
          <div key={key}>
            <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">{label}</label>
            <input
              value={(formData as any)[key]}
              disabled
              className="w-full px-4 py-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 cursor-not-allowed rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium shadow-inner"
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
          Dew Point (°C)
        </label>
        <input
          value={formData.DewPointTemperature}
          disabled
          className="w-full px-4 py-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 cursor-not-allowed rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium shadow-inner"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
          Wind Direction (degrees)
        </label>
        <input
          value={formData.WindDirection}
          disabled
          className="w-full px-4 py-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 cursor-not-allowed rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium shadow-inner"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <input
          value={`Lat: ${formData.lat}`}
          disabled
          className="px-3 py-2.5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 cursor-not-allowed rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium shadow-inner"
        />
        <input
          value={`Lon: ${formData.lon}`}
          disabled
          className="px-3 py-2.5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 cursor-not-allowed rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium shadow-inner"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
          Present Solar Output (kW)
        </label>
        <input
          type="number"
          step="0.01"
          name="present_solar"
          value={formData.present_solar}
          onChange={handleChange}
          required
          placeholder="Enter current output..."
          className="w-full px-4 py-3 bg-white dark:bg-gray-700 rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/20 text-gray-900 dark:text-gray-100 font-medium transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Sky Image</label>
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
          className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 bg-gradient-to-br from-gray-50/50 to-blue-50/30 dark:from-gray-700/30 dark:to-blue-900/10 hover:from-blue-50/50 hover:to-blue-100/50 dark:hover:from-blue-900/20 dark:hover:to-blue-800/20"
        >
          {imagePreview ? (
            <div className="relative">
              <img src={imagePreview} className="max-h-40 rounded-lg shadow-lg" alt="Preview" />
              <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1.5 shadow-lg">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Click to upload sky image</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">PNG, JPG up to 10MB</p>
            </div>
          )}
        </label>
      </div>

      <button
        type="submit"
        disabled={loading || !image || fetchingWeather}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl disabled:shadow-none transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Prediction...
          </span>
        ) : fetchingWeather ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading Weather Data...
          </span>
        ) : (
          "Generate Prediction"
        )}
      </button>
    </form>
  );
}
