import { Calendar, Clock, MapPin, Trash2 } from 'lucide-react';

const ScheduleCard = ({ schedule, isToday = false }) => {
  return (
    <div
      className={`rounded-lg border-2 p-4 transition-all ${
        isToday
          ? 'border-primary-500 bg-primary-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-primary-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">{schedule.area}</h3>
        </div>
        <Trash2 className="h-5 w-5 text-gray-400" />
      </div>

      <div className="flex items-center space-x-2 mb-3">
        <Clock className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">{schedule.time}</span>
      </div>

      <p className="text-sm text-gray-600 capitalize mb-3">{schedule.wasteType} waste</p>

      {schedule.route && (
        <p className="text-sm text-gray-600 mb-3">Route: {schedule.route}</p>
      )}

      <div className="flex flex-wrap gap-1">
        {schedule.days.map((day) => (
          <span
            key={day}
            className={`text-xs px-2 py-1 rounded ${
              isToday ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {day.substring(0, 3)}
          </span>
        ))}
      </div>

      {isToday && (
        <div className="mt-3 pt-3 border-t border-primary-200">
          <span className="inline-flex items-center text-xs font-medium text-primary-700">
            <Calendar className="h-3 w-3 mr-1" />
            Collection Today
          </span>
        </div>
      )}
    </div>
  );
};

export default ScheduleCard;