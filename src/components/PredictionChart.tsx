import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

interface Predictions {
  p15: number;
  p30: number;
  p45: number;
  p60: number;
}

interface PredictionChartProps {
  predictions: Predictions | null;
}

export function PredictionChart({ predictions }: PredictionChartProps) {
  const { theme } = useTheme();

  if (!predictions) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No data to display
        </p>
      </div>
    );
  }

  const chartData = [
    { time: '15 min', output: predictions.p15 },
    { time: '30 min', output: predictions.p30 },
    { time: '45 min', output: predictions.p45 },
    { time: '60 min', output: predictions.p60 }
  ];

  const isDark = theme === 'dark';
  const axisColor = isDark ? '#9ca3af' : '#6b7280';
  const gridColor = isDark ? '#374151' : '#e5e7eb';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        Solar Power Forecast
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
            Line Chart
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="time"
                stroke={axisColor}
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke={axisColor}
                style={{ fontSize: '12px' }}
                label={{ value: 'Output (kW)', angle: -90, position: 'insideLeft', fill: axisColor }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: isDark ? '#f3f4f6' : '#1f2937'
                }}
              />
              <Legend
                wrapperStyle={{
                  color: axisColor,
                  fontSize: '12px'
                }}
              />
              <Line
                type="monotone"
                dataKey="output"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 6 }}
                activeDot={{ r: 8 }}
                name="Power Output"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
            Bar Chart
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="time"
                stroke={axisColor}
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke={axisColor}
                style={{ fontSize: '12px' }}
                label={{ value: 'Output (kW)', angle: -90, position: 'insideLeft', fill: axisColor }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: isDark ? '#f3f4f6' : '#1f2937'
                }}
              />
              <Legend
                wrapperStyle={{
                  color: axisColor,
                  fontSize: '12px'
                }}
              />
              <Bar
                dataKey="output"
                fill="#10b981"
                radius={[8, 8, 0, 0]}
                name="Power Output"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">
        {chartData.map((item, idx) => {
          const colors = ['bg-blue-100 dark:bg-blue-900/30', 'bg-green-100 dark:bg-green-900/30', 'bg-yellow-100 dark:bg-yellow-900/30', 'bg-orange-100 dark:bg-orange-900/30'];
          const textColors = ['text-blue-700 dark:text-blue-300', 'text-green-700 dark:text-green-300', 'text-yellow-700 dark:text-yellow-300', 'text-orange-700 dark:text-orange-300'];

          return (
            <div key={idx} className={`${colors[idx]} rounded-lg p-3 text-center`}>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{item.time}</p>
              <p className={`text-lg font-bold ${textColors[idx]}`}>
                {item.output} kW
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
