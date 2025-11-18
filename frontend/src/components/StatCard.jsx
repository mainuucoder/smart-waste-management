import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, icon, color, trend, trendDirection = 'up' }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${color} text-white p-3 rounded-lg`}>
          {icon}
        </div>
      </div>

      {trend && (
        <div className="flex items-center space-x-1">
          {trendDirection === 'up' ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
          <span
            className={`text-sm font-medium ${
              trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend}
          </span>
          <span className="text-sm text-gray-500">from last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;