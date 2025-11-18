import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reportAPI } from '../services/api';
import { 
  FileText, 
  Plus, 
  MapPin, 
  Clock, 
  AlertCircle,
  RefreshCw,
  TrendingUp,
  User,
  Calendar
} from 'lucide-react';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setRefreshing(true);
    setError('');
    try {
      console.log('Fetching reports...');
      const response = await reportAPI.getAll({ limit: 50 });
      console.log('Reports response:', response.data);
      
      const resp = response?.data;
      const reportsData = resp?.data || resp?.reports || (Array.isArray(resp) ? resp : []);
      setReports(reportsData);
      console.log('Reports set:', reportsData.length);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError(error.response?.data?.message || 'Failed to load reports');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Calculate statistics
  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    inProgress: reports.filter(r => r.status === 'in_progress' || r.status === 'in-progress').length,
    resolved: reports.filter(r => r.status === 'resolved' || r.status === 'completed' || r.status === 'Resolved').length,
  };

  const statCards = [
    {
      title: 'Total Reports',
      value: stats.total,
      icon: FileText,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      description: 'All time reports',
      trend: '+12%'
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      description: 'Awaiting action',
      trend: '+5%'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: AlertCircle,
      color: 'bg-gradient-to-r from-orange-500 to-red-500',
      description: 'Being processed',
      trend: '+8%'
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      icon: FileText,
      color: 'bg-gradient-to-r from-green-500 to-emerald-600',
      description: 'Successfully completed',
      trend: '+15%'
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      in_progress: 'bg-blue-100 text-blue-800 border-blue-300',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-300',
      resolved: 'bg-green-100 text-green-800 border-green-300',
      completed: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-gray-600 bg-gray-100',
      medium: 'text-blue-600 bg-blue-100',
      high: 'text-orange-600 bg-orange-100',
      urgent: 'text-red-600 bg-red-100',
    };
    return colors[priority] || 'text-gray-600 bg-gray-100';
  };

  const getReporterInfo = (report) => {
    // Handle different possible reporter data structures
    if (report.createdBy) {
      if (typeof report.createdBy === 'object') {
        return {
          name: report.createdBy.name || 'Unknown User',
          email: report.createdBy.email || 'No email',
          role: report.createdBy.role || 'user'
        };
      }
      return {
        name: 'User',
        email: 'Loading...',
        role: 'user'
      };
    }
    return {
      name: 'Anonymous',
      email: 'No email',
      role: 'user'
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading your reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            My Reports 📋
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track and manage all your waste management reports in one place
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform hover:scale-105 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-xs text-green-600 font-medium">{stat.trend}</span>
                    <span className="text-xs text-gray-500 ml-1">{stat.description}</span>
                  </div>
                </div>
                <div className={`${stat.color} text-white p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-8 w-8" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button 
              onClick={fetchReports}
              disabled={refreshing}
              className="bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-blue-200"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
          <Link 
            to="/reports/create" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all transform"
          >
            <Plus className="h-5 w-5" />
            <span>New Report</span>
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 mb-6 flex items-center space-x-2 animate-pulse">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Reports List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">All Reports ({reports.length})</h2>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600 font-medium">
                Showing {reports.length} report{reports.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="p-6">
            {reports.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Reports Found</h3>
                <p className="text-gray-600 mb-8 text-lg">
                  Create your first report to get started tracking waste issues
                </p>
                <Link 
                  to="/reports/create" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold inline-flex items-center space-x-3 text-lg hover:shadow-2xl hover:scale-105 transform transition-all"
                >
                  <Plus className="h-6 w-6" />
                  <span>Create Your First Report</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((report, index) => {
                  const reporter = getReporterInfo(report);
                  
                  return (
                    <div 
                      key={report._id}
                      className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-gray-200 hover:border-blue-300 overflow-hidden animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Report Image */}
                      {report.images && report.images.length > 0 && (
                        <div className="mb-4 rounded-t-2xl overflow-hidden">
                          <img 
                            src={report.images[0].url} 
                            alt={report.title}
                            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      {/* Card Content */}
                      <div className="p-6">
                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {report.title}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {report.description}
                        </p>

                        {/* Reporter Info */}
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              {reporter.name}
                            </div>
                            <div className="text-xs text-gray-500 capitalize">
                              {reporter.role} • {reporter.email}
                            </div>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-start text-gray-500 text-sm mb-3">
                          <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{report.location?.address || 'No location specified'}</span>
                        </div>

                        {/* Category & Priority */}
                        <div className="flex items-center space-x-3 mb-4">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium capitalize">
                            {report.category?.replace('_', ' ') || 'general'}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(report.priority)}`}>
                            {report.priority || 'normal'}
                          </span>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <span className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 ${getStatusColor(report.status)}`}>
                            {report.status?.replace('_', ' ')}
                          </span>
                          
                          <div className="flex items-center text-gray-500 text-sm">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Hover Effect Border */}
                      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-2xl transition-all duration-300 pointer-events-none"></div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Helper Text */}
        {reports.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-100 border border-blue-200 rounded-2xl p-8">
            <h4 className="font-bold text-blue-900 text-xl mb-4 flex items-center">
              <AlertCircle className="h-6 w-6 mr-2" />
              Report Management Tips
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-4 border border-blue-100">
                <div className="text-blue-600 text-lg font-semibold mb-2">📝 Detailed Descriptions</div>
                <p className="text-blue-800 text-sm">Provide clear, detailed descriptions with photos for faster issue resolution</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-blue-100">
                <div className="text-blue-600 text-lg font-semibold mb-2">📍 Accurate Locations</div>
                <p className="text-blue-800 text-sm">Pinpoint exact locations to help collection teams find issues quickly</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-blue-100">
                <div className="text-blue-600 text-lg font-semibold mb-2">🔄 Regular Updates</div>
                <p className="text-blue-800 text-sm">Check report status regularly and provide updates if situation changes</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Reports;