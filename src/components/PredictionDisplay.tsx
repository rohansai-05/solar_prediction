import { Sun, TrendingUp } from 'lucide-react';

interface Predictions {
  p15: number;
  p30: number;
  p45: number;
  p60: number;
}

interface PredictionDisplayProps {
  predictions: Predictions | null;
}

export function PredictionDisplay({ predictions }: PredictionDisplayProps) {
  if (!predictions) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Sun className="mx-auto h-24 w-24 text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Submit the form to see predictions
          </p>
        </div>
      </div>
    );
  }

  const predictionData = [
    { time: '15 min', value: predictions.p15, color: 'bg-blue-500', textColor: 'text-blue-600 dark:text-blue-400' },
    { time: '30 min', value: predictions.p30, color: 'bg-green-500', textColor: 'text-green-600 dark:text-green-400' },
    { time: '45 min', value: predictions.p45, color: 'bg-yellow-500', textColor: 'text-yellow-600 dark:text-yellow-400' },
    { time: '60 min', value: predictions.p60, color: 'bg-orange-500', textColor: 'text-orange-600 dark:text-orange-400' }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Predictions
        </h2>
        <TrendingUp className="h-6 w-6 text-blue-500" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {predictionData.map((pred, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {pred.time}
              </span>
              <div className={`h-3 w-3 rounded-full ${pred.color}`}></div>
            </div>
            <div className="space-y-2">
              <p className={`text-4xl font-bold ${pred.textColor}`}>
                {pred.value}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                kW
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Solar Output</span>
                <span className="font-medium">Forecast</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Prediction Summary
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Average output: <span className="font-semibold text-gray-800 dark:text-gray-200">
            {((predictions.p15 + predictions.p30 + predictions.p45 + predictions.p60) / 4).toFixed(2)} kW
          </span>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Peak: <span className="font-semibold text-gray-800 dark:text-gray-200">
            {Math.max(predictions.p15, predictions.p30, predictions.p45, predictions.p60).toFixed(2)} kW
          </span>
        </p>
      </div>
    </div>
  );
}
