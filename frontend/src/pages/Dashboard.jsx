import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reportAPI, scheduleAPI } from '../services/api';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Plus, 
  Calendar, 
  MapPin,
  Users,
  AlertCircle,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [recentReports, setRecentReports] = useState([]);
  const [todaySchedules, setTodaySchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      
      // Fetch reports - get ALL reports to calculate accurate stats
      const reportsRes = await reportAPI.getAll();
      console.log('Reports response:', reportsRes.data);
      
      // Handle different response structures
      const allReports = reportsRes.data.data || reportsRes.data || [];
      
      console.log('All reports:', allReports);
      console.log('Number of reports:', allReports.length);

      // Calculate statistics from all reports
      const statusCounts = {};
      allReports.forEach(r => {
        statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
      });
      console.log('Status counts:', statusCounts);

      const calculatedStats = {
        total: allReports.length,
        pending: allReports.filter(r => r.status === 'pending').length,
        inProgress: allReports.filter(r => r.status === 'in-progress' || r.status === 'in_progress').length,
        resolved: allReports.filter(r => r.status === 'Resolved' || r.status === 'resolved' || r.status === 'completed').length,
      };

      console.log('Calculated stats:', calculatedStats);
      setStats(calculatedStats);
      
      // Set recent reports (first 5)
      setRecentReports(allReports.slice(0, 5));

      // Fetch schedules
      try {
        const schedulesRes = await scheduleAPI.getToday();
        setTodaySchedules(schedulesRes.data.data || schedulesRes.data || []);
      } catch (scheduleError) {
        console.log('No schedules available:', scheduleError);
        setTodaySchedules([]);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
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
      icon: AlertTriangle,
      color: 'bg-gradient-to-r from-orange-500 to-red-500',
      description: 'Being processed',
      trend: '+8%'
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      icon: CheckCircle,
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
    return priority === 'urgent' ? 'text-red-600 bg-red-50' :
           priority === 'high' ? 'text-orange-600 bg-orange-50' :
           priority === 'medium' ? 'text-blue-600 bg-blue-50' :
           'text-gray-600 bg-gray-50';
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading your dashboard...</p>
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
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Here's what's happening with your waste management activities
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Link
            to="/reports/create"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:scale-105 transform transition-all duration-300 flex items-center justify-between group"
          >
            <div>
              <h3 className="text-2xl font-bold mb-3">Report an Issue 🚨</h3>
              <p className="text-blue-100 text-lg">Submit a new waste management report for immediate attention</p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-2xl group-hover:scale-110 transition-transform">
              <Plus className="h-12 w-12" />
            </div>
          </Link>

          <Link
            to="/schedules"
            className="bg-white border-2 border-blue-200 text-blue-600 rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:scale-105 transform transition-all duration-300 flex items-center justify-between group hover:bg-blue-50"
          >
            <div>
              <h3 className="text-2xl font-bold mb-3">View Schedules 📅</h3>
              <p className="text-blue-600 opacity-80 text-lg">Check collection times and routes for your area</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-2xl group-hover:scale-110 transition-transform">
              <Calendar className="h-12 w-12" />
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Recent Reports */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Recent Reports</h2>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={fetchDashboardData}
                  disabled={refreshing}
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1 transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
                <Link to="/reports" className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
                  <span>View All</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            <div className="p-6">
              {recentReports.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-20 w-20 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Reports Yet</h3>
                  <p className="text-gray-600 mb-8 text-lg">
                    Start by creating your first waste management report
                  </p>
                  <Link 
                    to="/reports/create" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold inline-flex items-center space-x-3 text-lg hover:shadow-2xl hover:scale-105 transform transition-all"
                  >
                    <Plus className="h-6 w-6" />
                    <span>Create First Report</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentReports.map((report, index) => (
                    <div
                      key={report._id}
                      className="border-2 border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-blue-300 transition-all duration-300 bg-gradient-to-br from-white to-gray-50 group animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                            {report.title}
                          </h3>
                          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                            {report.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2 flex-wrap">
                            <span className="text-gray-500 text-sm">
                              {new Date(report.createdAt).toLocaleDateString()}
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-500 text-sm capitalize">
                              {report.category?.replace('_', ' ') || 'General'}
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(report.priority)} capitalize`}>
                              {report.priority}
                            </span>
                          </div>
                        </div>
                        <span className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 ${getStatusColor(report.status)}`}>
                          {report.status?.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Today's Collection Schedule */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Today's Collection Schedule</h2>
              <Link to="/schedules" className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
                <span>View All</span>
                <span>→</span>
              </Link>
            </div>

            <div className="p-6">
              {todaySchedules.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-20 w-20 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Collections Today</h3>
                  <p className="text-gray-600 text-lg">
                    No waste collection schedules for today
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {todaySchedules.map((schedule, index) => (
                    <div
                      key={schedule._id}
                      className="border-2 border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-green-300 transition-all duration-300 bg-gradient-to-br from-white to-gray-50 group animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="bg-green-100 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                            <MapPin className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg group-hover:text-green-600 transition-colors">
                              {schedule.route_id || schedule.area || 'Collection Point'}
                            </h3>
                            <div className="flex items-center text-gray-600 text-sm mt-1">
                              <Clock className="h-4 w-4 mr-1" />
                              <span className="font-medium">{formatTime(schedule.time)}</span>
                              <span className="mx-2 text-gray-300">•</span>
                              <span className="capitalize">{schedule.frequency}</span>
                            </div>
                            {schedule.notes && (
                              <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                                {schedule.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                          <Users className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {schedule.collector_ids?.length || 0}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          schedule.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          schedule.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          schedule.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {schedule.status?.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-400">
                          {schedule.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Helper Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-100 border border-blue-200 rounded-2xl p-8">
          <h4 className="font-bold text-blue-900 text-xl mb-4 flex items-center">
            <AlertCircle className="h-6 w-6 mr-2" />
            Quick Tips for Better Waste Management
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-4 border border-blue-100">
              <div className="text-blue-600 text-lg font-semibold mb-2">🗑️ Proper Segregation</div>
              <p className="text-blue-800 text-sm">Separate recyclables, organic, and general waste for efficient collection</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-blue-100">
              <div className="text-blue-600 text-lg font-semibold mb-2">⏰ Timely Reporting</div>
              <p className="text-blue-800 text-sm">Report issues immediately for faster resolution and cleaner environment</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-blue-100">
              <div className="text-blue-600 text-lg font-semibold mb-2">📅 Schedule Awareness</div>
              <p className="text-blue-800 text-sm">Check collection schedules regularly to avoid missed pickups</p>
            </div>
          </div>
        </div>
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

export default Dashboard;