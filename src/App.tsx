import { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';
import { InputForm } from './components/InputForm';
import { PredictionDisplay } from './components/PredictionDisplay';
import { PredictionChart } from './components/PredictionChart';

interface Predictions {
  p15: number;
  p30: number;
  p45: number;
  p60: number;
}

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

function App() {
  const { theme, toggleTheme } = useTheme();

  const [predictions, setPredictions] = useState<Predictions | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (formData: FormData, image: File) => {
    setLoading(true);
    setError('');
    setPredictions(null);

    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      formDataToSend.append('image', image);

      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.predictions) {
        const safePredictions: Predictions = {
          p15: Math.max(result.predictions.p15, 0.0001),
          p30: Math.max(result.predictions.p30, 0.0001),
          p45: Math.max(result.predictions.p45, 0.0001),
          p60: Math.max(result.predictions.p60, 0.0001)
        };

        setPredictions(safePredictions);
      } else {
        setError(result.error || 'Prediction failed');
      }
    } catch (err) {
      console.error(err);
      setError(
        'Failed to connect to server. Please ensure the Flask backend is running on port 5000.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sun className="h-8 w-8 text-yellow-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Solar Power Predictor
            </h1>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="h-6 w-6 text-gray-700" />
            ) : (
              <Sun className="h-6 w-6 text-yellow-500" />
            )}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <InputForm onSubmit={handleSubmit} loading={loading} />
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <PredictionDisplay predictions={predictions} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
          <PredictionChart predictions={predictions} />
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            Solar Power Prediction System — Made under the guidance of Dr.P.S.R.Murty
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
