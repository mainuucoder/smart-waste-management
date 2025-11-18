import { MapPin, Clock, AlertCircle } from 'lucide-react';

const ReportCard = ({ report, onClick }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
    >
      {report.images && report.images.length > 0 && (
        <div className="relative h-48 w-full">
          <img
            src={report.images[0].url}
            alt={report.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {report.title}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {report.description}
        </p>

        <div className="flex items-center text-gray-500 text-sm mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="line-clamp-1">{report.location.address}</span>
        </div>

        <div className="flex items-center text-gray-500 text-sm mb-3">
          <AlertCircle className="h-4 w-4 mr-1" />
          <span className="capitalize">{report.category.replace('_', ' ')}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
            {report.status.replace('_', ' ')}
          </span>

          <div className="flex items-center text-gray-500 text-xs">
            <Clock className="h-3 w-3 mr-1" />
            <span>{new Date(report.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;