// Reusable Stats Card Component with CRMS Theme
import PropTypes from 'prop-types';

const StatsCard = ({ title, value, icon: Icon, color = 'primary', trend, trendValue, onClick }) => {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    accent: 'bg-accent-100 text-accent-600',
    success: 'bg-success-100 text-success-500',
    warning: 'bg-warning-100 text-warning-500',
    error: 'bg-error-100 text-error-500',
    blue: 'bg-primary-100 text-primary-600',
    green: 'bg-success-100 text-success-500',
    yellow: 'bg-warning-100 text-warning-500',
    red: 'bg-error-100 text-error-500',
    purple: 'bg-purple-100 text-purple-600',
    indigo: 'bg-indigo-100 text-indigo-600',
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-card hover:shadow-lg transition-all duration-300 p-6 ${
        onClick ? 'cursor-pointer hover:-translate-y-1' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-neutral-500 text-sm font-semibold uppercase tracking-wide">{title}</p>
          <h3 className="text-3xl font-bold text-primary-700 mt-2">{value}</h3>
          {trend && trendValue && (
            <div className="flex items-center gap-1 mt-3">
              <span
                className={`flex items-center text-sm font-bold ${
                  trend === 'up' ? 'text-success-500' : 'text-error-500'
                }`}
              >
                {trend === 'up' ? (
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {trendValue}%
              </span>
              <span className="text-neutral-500 text-xs font-medium">vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-16 h-16 rounded-xl flex items-center justify-center shadow ${colorClasses[color]}`}>
          <Icon className="text-3xl" />
        </div>
      </div>
    </div>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.oneOf(['blue', 'green', 'yellow', 'red', 'purple', 'indigo']),
  trend: PropTypes.oneOf(['up', 'down']),
  trendValue: PropTypes.number,
  onClick: PropTypes.func,
};

export default StatsCard;