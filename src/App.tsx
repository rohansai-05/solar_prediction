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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg">
                <Sun className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                  Solar Power Predictor
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">AI-Powered Forecasting</p>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5 text-gray-700" />
              ) : (
                <Sun className="h-5 w-5 text-yellow-400" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {error && (
          <div className="mb-8 bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10 border-l-4 border-red-500 dark:border-red-400 text-red-800 dark:text-red-200 px-6 py-4 rounded-xl shadow-lg backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
            <InputForm onSubmit={handleSubmit} loading={loading} />
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
            <PredictionDisplay predictions={predictions} />
          </div>
        </div>

        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 overflow-hidden">
          <PredictionChart predictions={predictions} />
        </div>
      </main>

      <footer className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm font-medium">
            Solar Power Prediction System — Made under the guidance of Dr.P.S.R.Murty
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
