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
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
          Solar Power Forecast
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Visualizing your power output predictions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-900/10 dark:to-cyan-900/10 rounded-2xl p-6 border border-blue-200/30 dark:border-blue-700/30">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-bold text-gray-700 dark:text-gray-300">
              Trend Analysis
            </h4>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Line Chart</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.3} />
              <XAxis
                dataKey="time"
                stroke={axisColor}
                style={{ fontSize: '13px', fontWeight: 600 }}
                tickLine={false}
              />
              <YAxis
                stroke={axisColor}
                style={{ fontSize: '13px', fontWeight: 600 }}
                label={{ value: 'Output (kW)', angle: -90, position: 'insideLeft', fill: axisColor, style: { fontWeight: 600 } }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  border: `2px solid ${isDark ? '#3b82f6' : '#3b82f6'}`,
                  borderRadius: '12px',
                  color: isDark ? '#f3f4f6' : '#1f2937',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                  fontWeight: 600
                }}
              />
              <Legend
                wrapperStyle={{
                  color: axisColor,
                  fontSize: '13px',
                  fontWeight: 600
                }}
              />
              <Line
                type="monotone"
                dataKey="output"
                stroke="#3b82f6"
                strokeWidth={4}
                dot={{ fill: '#3b82f6', r: 7, strokeWidth: 3, stroke: '#fff' }}
                activeDot={{ r: 10, strokeWidth: 3, stroke: '#3b82f6' }}
                name="Power Output"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-2xl p-6 border border-green-200/30 dark:border-green-700/30">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-bold text-gray-700 dark:text-gray-300">
              Comparative View
            </h4>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Bar Chart</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.3} />
              <XAxis
                dataKey="time"
                stroke={axisColor}
                style={{ fontSize: '13px', fontWeight: 600 }}
                tickLine={false}
              />
              <YAxis
                stroke={axisColor}
                style={{ fontSize: '13px', fontWeight: 600 }}
                label={{ value: 'Output (kW)', angle: -90, position: 'insideLeft', fill: axisColor, style: { fontWeight: 600 } }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  border: `2px solid ${isDark ? '#10b981' : '#10b981'}`,
                  borderRadius: '12px',
                  color: isDark ? '#f3f4f6' : '#1f2937',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                  fontWeight: 600
                }}
              />
              <Legend
                wrapperStyle={{
                  color: axisColor,
                  fontSize: '13px',
                  fontWeight: 600
                }}
              />
              <Bar
                dataKey="output"
                fill="#10b981"
                radius={[12, 12, 0, 0]}
                name="Power Output"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {chartData.map((item, idx) => {
          const gradients = [
            'from-blue-500 to-cyan-500',
            'from-green-500 to-emerald-500',
            'from-amber-500 to-yellow-500',
            'from-orange-500 to-red-500'
          ];
          const bgColors = [
            'from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30',
            'from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30',
            'from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30',
            'from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30'
          ];

          return (
            <div key={idx} className={`relative bg-gradient-to-br ${bgColors[idx]} rounded-xl p-4 text-center border border-gray-200/30 dark:border-gray-700/30 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 overflow-hidden group`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2">
                  {item.time}
                </p>
                <div className={`inline-block px-3 py-1.5 bg-gradient-to-r ${gradients[idx]} rounded-lg shadow-lg mb-1`}>
                  <p className="text-lg font-black text-white">
                    {item.output}
                  </p>
                </div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  kW
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
