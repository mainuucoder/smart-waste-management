import { CheckCircle, X } from 'lucide-react';

const SuccessMessage = ({ message, onClose }) => {
  return (
    <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 flex items-start space-x-3">
      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-75 transition-opacity"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default SuccessMessage;