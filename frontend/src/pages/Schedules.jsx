import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Calendar, 
  Plus, 
  MapPin, 
  Clock, 
  AlertCircle, 
  Users, 
  Repeat,
  Trash2,
  RefreshCw,
  TrendingUp,
  User,
  CheckCircle,
  FileText,
  Truck,
  Package,
  Filter,
  Search,
  Edit3
} from 'lucide-react';

const Schedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [frequencyFilter, setFrequencyFilter] = useState('all');
  
  const [newSchedule, setNewSchedule] = useState({
    route_id: '',
    date: '',
    time: '',
    frequency: 'once',
    collector_ids: [],
    notes: '',
    priority: 'medium',
    estimated_duration: '',
    waste_type: 'general',
    vehicle_type: 'standard_truck'
  });

  // Enhanced waste types and vehicle types
  const wasteTypes = [
    { value: 'general', label: 'General Waste', color: 'bg-gray-500' },
    { value: 'recyclable', label: 'Recyclable', color: 'bg-green-500' },
    { value: 'hazardous', label: 'Hazardous', color: 'bg-red-500' },
    { value: 'organic', label: 'Organic', color: 'bg-amber-500' },
    { value: 'electronic', label: 'E-Waste', color: 'bg-blue-500' }
  ];

  const vehicleTypes = [
    { value: 'standard_truck', label: 'Standard Truck', icon: Truck },
    { value: 'compact_truck', label: 'Compact Truck', icon: Package },
    { value: 'hazardous_truck', label: 'Hazardous Waste Truck', icon: AlertCircle },
    { value: 'recycling_truck', label: 'Recycling Truck', icon: RefreshCw }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setRefreshing(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/schedules', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const resp = response?.data;
      const schedulesData = resp?.data || (Array.isArray(resp) ? resp : []);
      setSchedules(schedulesData);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      if (error.response?.status === 401) {
        setError('Please log in again to view schedules');
      } else {
        setError(error.response?.data?.error || 'Failed to load schedules');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Filter schedules based on search and filters
  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.route_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || schedule.status === statusFilter;
    const matchesFrequency = frequencyFilter === 'all' || schedule.frequency === frequencyFilter;
    
    return matchesSearch && matchesStatus && matchesFrequency;
  });

  // Calculate enhanced statistics
  const stats = {
    total: schedules.length,
    scheduled: schedules.filter(s => s.status === 'scheduled').length,
    inProgress: schedules.filter(s => s.status === 'in_progress').length,
    completed: schedules.filter(s => s.status === 'completed').length,
    highPriority: schedules.filter(s => s.priority === 'high' || s.priority === 'urgent').length,
  };

  const statCards = [
    {
      title: 'Total Schedules',
      value: stats.total,
      icon: Calendar,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      description: 'All collection schedules'
    },
    {
      title: 'Scheduled',
      value: stats.scheduled,
      icon: Clock,
      color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      description: 'Upcoming collections'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: RefreshCw,
      color: 'bg-gradient-to-r from-orange-500 to-red-500',
      description: 'Active collections'
    },
    {
      title: 'High Priority',
      value: stats.highPriority,
      icon: AlertCircle,
      color: 'bg-gradient-to-r from-red-500 to-pink-600',
      description: 'Urgent collections'
    },
  ];

  const createSchedule = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      // Enhanced validation
      if (!newSchedule.route_id || !newSchedule.date || !newSchedule.time) {
        setError('Please fill in all required fields (Address, Date, Time)');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/schedules', newSchedule, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      fetchSchedules();
      
      // Reset form with enhanced fields
      setNewSchedule({
        route_id: '',
        date: '',
        time: '',
        frequency: 'once',
        collector_ids: [],
        notes: '',
        priority: 'medium',
        estimated_duration: '',
        waste_type: 'general',
        vehicle_type: 'standard_truck'
      });
      
      document.getElementById('create-schedule-modal').close();
      alert('✅ Schedule created successfully!');
      
    } catch (err) {
      console.error('Error creating schedule:', err);
      setError(`Failed to create schedule: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteSchedule = async (scheduleId) => {
    if (!window.confirm('Are you sure you want to delete this schedule? This action cannot be undone.')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/schedules/${scheduleId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSchedules(schedules.filter(schedule => schedule._id !== scheduleId));
      alert('✅ Schedule deleted successfully!');
    } catch (err) {
      console.error('❌ Error deleting schedule:', err);
      setError(`Failed to delete schedule: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleInputChange = (e) => {
    setNewSchedule({
      ...newSchedule,
      [e.target.name]: e.target.value
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'from-blue-500 to-blue-600',
      in_progress: 'from-yellow-500 to-orange-500',
      completed: 'from-green-500 to-emerald-600',
      cancelled: 'from-red-500 to-rose-600',
    };
    return colors[status] || 'from-gray-500 to-gray-600';
  };

  const getStatusIcon = (status) => {
    const icons = {
      scheduled: <Clock className="h-4 w-4" />,
      in_progress: <RefreshCw className="h-4 w-4" />,
      completed: <CheckCircle className="h-4 w-4" />,
      cancelled: <AlertCircle className="h-4 w-4" />,
    };
    return icons[status] || <Calendar className="h-4 w-4" />;
  };

  const getFrequencyColor = (frequency) => {
    const colors = {
      once: 'text-gray-600 bg-gray-100',
      daily: 'text-green-600 bg-green-100',
      weekly: 'text-blue-600 bg-blue-100',
      monthly: 'text-purple-600 bg-purple-100',
    };
    return colors[frequency] || 'text-gray-600 bg-gray-100';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      urgent: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getWasteTypeColor = (wasteType) => {
    const type = wasteTypes.find(t => t.value === wasteType);
    return type ? type.color : 'bg-gray-500';
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const getCollectorInfo = (collectorIds) => {
    if (!collectorIds || collectorIds.length === 0) {
      return {
        count: 0,
        names: ['No collectors assigned']
      };
    }

    const collectorNames = collectorIds.map(id => {
      const names = ['John Driver', 'Sarah Collector', 'Mike Operator', 'Lisa Manager'];
      return names[Math.floor(Math.random() * names.length)];
    });

    return {
      count: collectorIds.length,
      names: collectorNames
    };
  };

  if (loading && schedules.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading schedules...</p>
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
            Collection Schedules 📅
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage and track waste collection schedules with advanced planning tools
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
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
                <div className={`${stat.color} text-white p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-8 w-8" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Bar with Enhanced Filters */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search schedules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full lg:w-64"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Frequency Filter */}
            <select
              value={frequencyFilter}
              onChange={(e) => setFrequencyFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Frequencies</option>
              <option value="once">Once</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div className="flex items-center space-x-4 w-full lg:w-auto">
            <button 
              onClick={fetchSchedules}
              disabled={refreshing}
              className="bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-blue-200"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button 
              onClick={() => document.getElementById('create-schedule-modal').showModal()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all transform"
            >
              <Plus className="h-5 w-5" />
              <span>New Schedule</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 mb-6 flex items-center space-x-2 animate-pulse">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Schedules Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredSchedules.length} of {schedules.length} schedules
        </div>

        {/* Schedules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSchedules.map((schedule, index) => {
            const collectorInfo = getCollectorInfo(schedule.collector_ids);
            const wasteType = wasteTypes.find(t => t.value === schedule.waste_type);
            const vehicleType = vehicleTypes.find(v => v.value === schedule.vehicle_type);
            const VehicleIcon = vehicleType?.icon || Truck;
            
            return (
              <div 
                key={schedule._id}
                className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-gray-200 hover:border-blue-300 overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Status Ribbon */}
                <div className={`absolute top-0 right-0 bg-gradient-to-r ${getStatusColor(schedule.status)} text-white px-4 py-2 rounded-bl-2xl font-semibold text-sm flex items-center space-x-2 z-10`}>
                  {getStatusIcon(schedule.status)}
                  <span>{schedule.status?.replace('_', ' ')}</span>
                </div>

                {/* Priority Badge */}
                {schedule.priority && schedule.priority !== 'medium' && (
                  <div className={`absolute top-0 left-0 px-3 py-1 rounded-br-2xl font-semibold text-xs border-b border-r ${getPriorityColor(schedule.priority)}`}>
                    {schedule.priority.toUpperCase()}
                  </div>
                )}

                {/* Card Content */}
                <div className="p-6">
                  {/* Address with Icon */}
                  <div className="flex items-start mb-4">
                    <div className="bg-blue-100 p-3 rounded-2xl mr-4 group-hover:scale-110 transition-transform duration-300">
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {schedule.route_id || 'No address specified'}
                      </h3>
                      <div className="flex items-center text-gray-500 text-sm mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="font-medium">{schedule.date}</span>
                        <span className="mx-2">•</span>
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{formatTime(schedule.time)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Waste Type & Vehicle */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getWasteTypeColor(schedule.waste_type)}`}></div>
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {wasteType?.label || schedule.waste_type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <VehicleIcon className="h-4 w-4" />
                      <span className="text-sm">
                        {vehicleType?.label || schedule.vehicle_type}
                      </span>
                    </div>
                  </div>

                  {/* Frequency & Collectors */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getFrequencyColor(schedule.frequency)} capitalize`}>
                      {schedule.frequency}
                    </span>
                    <div className="flex items-center space-x-1 text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      <Users className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {collectorInfo.count}
                      </span>
                    </div>
                  </div>

                  {/* Estimated Duration */}
                  {schedule.estimated_duration && (
                    <div className="mb-3 bg-blue-50 rounded-xl p-2 text-center">
                      <span className="text-sm font-medium text-blue-700">
                        ⏱️ Estimated: {schedule.estimated_duration}
                      </span>
                    </div>
                  )}

                  {/* Collector Information */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Assigned Team:</span>
                    </div>
                    <div className="space-y-1">
                      {collectorInfo.names.map((name, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  {schedule.notes && (
                    <div className="bg-gray-50 rounded-xl p-3 mb-4 border-l-4 border-blue-400 transform group-hover:scale-105 transition-transform duration-300">
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {schedule.notes}
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-400 font-medium">
                      Created {new Date(schedule.createdAt).toLocaleDateString()}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {/* Add edit functionality */}}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                        title="Edit Schedule"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteSchedule(schedule._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="Delete Schedule"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-2xl transition-all duration-300 pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredSchedules.length === 0 && !loading && (
          <div className="text-center py-16 animate-fade-in">
            <div className="bg-white rounded-3xl p-12 shadow-2xl border border-blue-100 max-w-2xl mx-auto">
              <Calendar className="h-24 w-24 text-blue-400 mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-gray-900 mb-4">No Schedules Found</h3>
              <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                {searchTerm || statusFilter !== 'all' || frequencyFilter !== 'all' 
                  ? 'No schedules match your current filters. Try adjusting your search criteria.'
                  : 'Start organizing your waste collection routes by creating your first schedule'
                }
              </p>
              <button 
                onClick={() => document.getElementById('create-schedule-modal').showModal()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold inline-flex items-center space-x-3 text-lg hover:shadow-2xl hover:scale-105 transform transition-all"
              >
                <Plus className="h-6 w-6" />
                <span>Create Your First Schedule</span>
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Create Schedule Modal */}
        <dialog id="create-schedule-modal" className="modal">
          <div className="modal-box max-w-4xl bg-gradient-to-br from-white to-blue-50 border border-blue-200 rounded-2xl p-0 overflow-hidden">
            <div className="p-8">
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-6 top-6 text-gray-500 hover:text-gray-700">✕</button>
              </form>
              
              <h3 className="font-bold text-3xl mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🗓️ New Collection Schedule
              </h3>
              <p className="text-gray-600 mb-8">Plan a comprehensive waste collection route with advanced options</p>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 mb-6 animate-pulse">
                  {error}
                </div>
              )}

              <form onSubmit={createSchedule} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Basic Information */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        📍 Collection Address *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="route_id"
                          placeholder="Enter complete address with landmarks..."
                          value={newSchedule.route_id}
                          onChange={handleInputChange}
                          className="w-full border-2 border-gray-200 rounded-xl px-12 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          📅 Collection Date *
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="date"
                            name="date"
                            value={newSchedule.date}
                            onChange={handleInputChange}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full border-2 border-gray-200 rounded-xl px-12 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          ⏰ Collection Time *
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="time"
                            name="time"
                            value={newSchedule.time}
                            onChange={handleInputChange}
                            className="w-full border-2 border-gray-200 rounded-xl px-12 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          🔄 Frequency *
                        </label>
                        <div className="relative">
                          <Repeat className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <select
                            name="frequency"
                            value={newSchedule.frequency}
                            onChange={handleInputChange}
                            className="w-full border-2 border-gray-200 rounded-xl px-12 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 appearance-none bg-white"
                            required
                          >
                            <option value="once">One-time</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          ⏱️ Estimated Duration
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            name="estimated_duration"
                            placeholder="e.g., 2 hours"
                            value={newSchedule.estimated_duration}
                            onChange={handleInputChange}
                            className="w-full border-2 border-gray-200 rounded-xl px-12 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Advanced Options */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        🚨 Priority Level
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {priorities.map(priority => (
                          <label key={priority.value} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="priority"
                              value={priority.value}
                              checked={newSchedule.priority === priority.value}
                              onChange={handleInputChange}
                              className="hidden"
                            />
                            <div className={`w-full text-center px-3 py-4 rounded-xl border-2 transition-all duration-300 ${
                              newSchedule.priority === priority.value 
                                ? priority.color + ' border-current font-semibold scale-105' 
                                : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                            }`}>
                              {priority.label}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        🗑️ Waste Type
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {wasteTypes.map(type => (
                          <label key={type.value} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="waste_type"
                              value={type.value}
                              checked={newSchedule.waste_type === type.value}
                              onChange={handleInputChange}
                              className="hidden"
                            />
                            <div className={`w-full flex items-center justify-center space-x-2 px-3 py-4 rounded-xl border-2 transition-all duration-300 ${
                              newSchedule.waste_type === type.value 
                                ? 'bg-gray-800 text-white border-gray-800 font-semibold scale-105' 
                                : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                            }`}>
                              <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                              <span className="text-sm">{type.label}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        🚚 Vehicle Type
                      </label>
                      <div className="space-y-3">
                        {vehicleTypes.map(vehicle => {
                          const VehicleIcon = vehicle.icon;
                          return (
                            <label key={vehicle.value} className="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="radio"
                                name="vehicle_type"
                                value={vehicle.value}
                                checked={newSchedule.vehicle_type === vehicle.value}
                                onChange={handleInputChange}
                                className="hidden"
                              />
                              <div className={`w-full flex items-center space-x-3 px-4 py-4 rounded-xl border-2 transition-all duration-300 ${
                                newSchedule.vehicle_type === vehicle.value 
                                  ? 'bg-blue-100 text-blue-800 border-blue-300 font-semibold scale-105' 
                                  : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                              }`}>
                                <VehicleIcon className="h-5 w-5" />
                                <span className="text-sm">{vehicle.label}</span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Full Width Fields */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    📝 Additional Notes & Instructions
                  </label>
                  <textarea
                    name="notes"
                    placeholder="Provide any special instructions, access details, safety precautions, or additional information for the collection team..."
                    value={newSchedule.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none"
                  />
                </div>

                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold flex-1 hover:shadow-xl hover:scale-105 transform transition-all disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Creating Schedule...</span>
                      </div>
                    ) : (
                      '🚀 Create Collection Schedule'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => document.getElementById('create-schedule-modal').close()}
                    className="bg-gray-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-600 hover:scale-105 transform transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </dialog>
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

export default Schedules;