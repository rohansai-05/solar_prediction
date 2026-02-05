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
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 to-orange-200 dark:from-yellow-600/30 dark:to-orange-600/30 rounded-full blur-2xl opacity-50"></div>
            <Sun className="relative mx-auto h-24 w-24 text-gray-300 dark:text-gray-600" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
            Submit the form to see predictions
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
            Your forecast will appear here
          </p>
        </div>
      </div>
    );
  }

  const predictionData = [
    {
      time: '15 min',
      value: predictions.p15,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-500'
    },
    {
      time: '30 min',
      value: predictions.p30,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      textColor: 'text-green-600 dark:text-green-400',
      iconBg: 'bg-green-500'
    },
    {
      time: '45 min',
      value: predictions.p45,
      gradient: 'from-amber-500 to-yellow-500',
      bgGradient: 'from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20',
      textColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-500'
    },
    {
      time: '60 min',
      value: predictions.p60,
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
      textColor: 'text-orange-600 dark:text-orange-400',
      iconBg: 'bg-orange-500'
    }
  ];

  const avgOutput = ((predictions.p15 + predictions.p30 + predictions.p45 + predictions.p60) / 4).toFixed(2);
  const peakOutput = Math.max(predictions.p15, predictions.p30, predictions.p45, predictions.p60).toFixed(2);

  return (
    <div className="space-y-6 p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
            Predictions
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Power output forecast
          </p>
        </div>
        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {predictionData.map((pred, idx) => (
          <div
            key={idx}
            className={`relative bg-gradient-to-br ${pred.bgGradient} rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 transform hover:scale-105 overflow-hidden group`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  {pred.time}
                </span>
                <div className={`h-2.5 w-2.5 rounded-full ${pred.iconBg} shadow-lg animate-pulse`}></div>
              </div>

              <div className="space-y-1">
                <p className={`text-4xl font-black ${pred.textColor} tracking-tight`}>
                  {pred.value}
                </p>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Kilowatts
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-300/30 dark:border-gray-600/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Solar Output</span>
                  <div className={`px-2 py-1 bg-gradient-to-r ${pred.gradient} rounded-md`}>
                    <span className="text-xs font-bold text-white">Forecast</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 dark:from-blue-900/20 dark:via-cyan-900/20 dark:to-green-900/20 rounded-2xl p-6 border-2 border-blue-200/50 dark:border-blue-700/50 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">
              Prediction Summary
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Output</span>
                <span className="text-xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  {avgOutput} kW
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Peak Output</span>
                <span className="text-xl font-black bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  {peakOutput} kW
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
