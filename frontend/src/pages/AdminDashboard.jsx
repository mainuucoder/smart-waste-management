import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { 
  Users, 
  FileText, 
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  UserPlus,
  Edit,
  Trash2,
  Shield,
  Calendar,
  MapPin,
  PlayCircle,
  Repeat,
  User,
  Save,
  AtSign
} from 'lucide-react';

const AdminDashboard = () => {
  const [allReports, setAllReports] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allSchedules, setAllSchedules] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [selectedCollectors, setSelectedCollectors] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: 'user',
  });

  useEffect(() => {
    fetchAllData();
    setCurrentAdmin({ role: 'admin' });
  }, []);
const fetchAllData = async () => {
  try {
    setLoading(true);
    setError(null);

    // Fetch all users FIRST (needed for collector names)
    const usersRes = await adminAPI.getUsers();
    const usersData = usersRes.data?.data || usersRes.data || [];
    setAllUsers(Array.isArray(usersData) ? usersData : []);

    // Then fetch all schedules (depends on users data for collector names)
    try {
      const schedulesRes = await adminAPI.getAllSchedules();
      const schedulesData = schedulesRes.data?.data || schedulesRes.data || [];
      setAllSchedules(Array.isArray(schedulesData) ? schedulesData : []);
    } catch (scheduleError) {
      console.error('Error fetching schedules:', scheduleError);
      setAllSchedules([]);
    }

    // Finally fetch reports
    const reportsRes = await adminAPI.getAllReports({ limit: 1000 });
    const reportsData = reportsRes.data?.data || reportsRes.data || [];
    setAllReports(Array.isArray(reportsData) ? reportsData : []);

  } catch (error) {
    console.error('Error fetching admin data:', error);
    setError('Failed to load dashboard data');
    setAllReports([]);
    setAllUsers([]);
    setAllSchedules([]);
  } finally {
    setLoading(false);
  }
};
  // Calculate real-time stats from actual data
  const stats = {
    totalReports: allReports.length,
    pendingReports: allReports.filter(r => r.status === 'pending').length,
    inProgressReports: allReports.filter(r => r.status === 'in_progress' || r.status === 'in-progress').length,
    completedReports: allReports.filter(r => r.status === 'completed' || r.status === 'Resolved').length,
    totalUsers: allUsers.length,
    adminUsers: allUsers.filter(u => u.role === 'admin').length,
    driverUsers: allUsers.filter(u => u.role === 'driver').length,
    regularUsers: allUsers.filter(u => u.role === 'user').length,
    totalSchedules: allSchedules.length,
    scheduledSchedules: allSchedules.filter(s => s.status === 'scheduled').length,
    inProgressSchedules: allSchedules.filter(s => s.status === 'in_progress').length,
    completedSchedules: allSchedules.filter(s => s.status === 'completed').length,
  };
// Get collector names from user database - UPDATE THIS FUNCTION
const getCollectorNames = (collectorIds) => {
  if (!collectorIds || !Array.isArray(collectorIds) || collectorIds.length === 0) {
    return ['No collector assigned'];
  }

  // Filter out any null/undefined IDs and get valid names
  const names = collectorIds
    .filter(id => id && typeof id === 'string')
    .map(collectorId => {
      const user = allUsers.find(u => u._id === collectorId || u._id?.toString() === collectorId);
      return user ? user.name : 'Unknown Collector';
    })
    .filter(name => name !== 'Unknown Collector'); // Remove unknown names

  return names.length > 0 ? names : ['No collector assigned'];
};

  // Get user info by user ID
  const getUserInfo = (userId) => {
    if (!userId) return { name: 'Unknown', username: 'N/A' };
    
    const user = allUsers.find(u => u._id === userId);
    return user ? { 
      name: user.name, 
      username: user.username || 'no-username',
      email: user.email 
    } : { name: 'Unknown', username: 'N/A', email: 'N/A' };
  };

  // Get drivers/collectors for assignment
  const getAvailableCollectors = () => {
    return allUsers.filter(user => user.role === 'driver' || user.role === 'collector');
  };

  // Assign collectors to schedule - UPDATE THIS FUNCTION
const assignCollectors = async (scheduleId, collectorIds) => {
  // Enforce exactly 1 collector
  if (collectorIds.length !== 1) {
    alert('Please select exactly 1 collector');
    return;
  }

  try {
    const response = await adminAPI.assignCollectors(scheduleId, { collector_ids: collectorIds });
    
    // Update the local state immediately
    setAllSchedules(prevSchedules => 
      prevSchedules.map(schedule => 
        schedule._id === scheduleId 
          ? { ...schedule, collector_ids: collectorIds }
          : schedule
      )
    );
    setShowAssignModal(false);
    setSelectedCollectors([]);
    alert('Collector assigned successfully!');
    
    // Optional: Refresh all data to ensure consistency
    // fetchAllData();
    
  } catch (error) {
    console.error('Error assigning collectors:', error);
    alert('Error assigning collectors: ' + (error.response?.data?.message || error.message));
  }
};

// Open assign collectors modal - UPDATE THIS FUNCTION
const openAssignModal = (schedule) => {
  setCurrentSchedule(schedule);
  // Only take the first collector if multiple exist
  setSelectedCollectors(schedule.collector_ids?.length > 0 ? [schedule.collector_ids[0]] : []);
  setShowAssignModal(true);
};

// Handle collector selection - UPDATE THIS FUNCTION
const toggleCollectorSelection = (userId) => {
  setSelectedCollectors(prev => {
    // If already selected, deselect it
    if (prev.includes(userId)) {
      return [];
    }
    // Otherwise, select this one (only one allowed)
    return [userId];
  });
};
  // Schedule Management Functions - Only for Admins
const updateScheduleStatus = async (scheduleId, newStatus) => {
  if (!currentAdmin || currentAdmin.role !== 'admin') {
    alert('Only administrators can update schedule status');
    return;
  }

  try {
    await adminAPI.updateScheduleStatus(scheduleId, { status: newStatus });
    fetchAllData();
  } catch (error) {
    console.error('Error updating schedule status:', error);
    alert('Error updating schedule status: ' + (error.response?.data?.message || error.message));
  }
};

  const getScheduleStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Check if current user is admin
  const isAdmin = () => {
    return currentAdmin && currentAdmin.role === 'admin';
  };

  // Existing user management functions...
  const handleCreateUser = async () => {
    try {
      await adminAPI.createUser(formData);
      alert('User created successfully');
      setShowModal(false);
      fetchAllData();
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating user');
    }
  };

  const handleUpdateUser = async () => {
    try {
      await adminAPI.updateUser(currentUser._id, formData);
      alert('User updated successfully');
      setShowModal(false);
      fetchAllData();
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await adminAPI.deleteUser(userId);
      alert('User deleted successfully');
      fetchAllData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting user');
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await adminAPI.updateUserRole(userId, { role: newRole });
      alert('User role updated successfully');
      fetchAllData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error changing role');
    }
  };

  const handleUpdateReportStatus = async (reportId, newStatus) => {
    try {
      await adminAPI.updateReportStatus(reportId, { status: newStatus });
      fetchAllData();
    } catch (error) {
      alert('Failed to update report status');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) {
      alert('Please select users to delete');
      return;
    }

    if (!window.confirm(`Delete ${selectedUsers.length} user(s)?`)) return;

    try {
      await adminAPI.bulkDeleteUsers({ userIds: selectedUsers });
      alert('Users deleted successfully');
      setSelectedUsers([]);
      fetchAllData();
    } catch (error) {
      alert('Error deleting users');
    }
  };

  const openCreateModal = () => {
    resetForm();
    setModalType('create');
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      phone: user.phone || '',
      address: user.address || '',
      role: user.role,
    });
    setModalType('edit');
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      role: 'user',
    });
    setCurrentUser(null);
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-red-100 text-red-800',
      driver: 'bg-blue-100 text-blue-800',
      user: 'bg-green-100 text-green-800',
      collector: 'bg-purple-100 text-purple-800',
    };
    return styles[role] || styles.user;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      Resolved: 'bg-green-100 text-green-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    return priority === 'urgent' ? 'text-red-600' :
           priority === 'high' ? 'text-orange-600' :
           priority === 'medium' ? 'text-blue-600' :
           'text-gray-600';
  };

  const handleSubmit = () => {
    if (modalType === 'create') {
      handleCreateUser();
    } else {
      handleUpdateUser();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAllData}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">🛡️ Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">System management and monitoring</p>
        {isAdmin() && (
          <div className="mt-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm inline-flex items-center">
            <Shield className="h-4 w-4 mr-1" />
            Administrator Access
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Reports" value={stats.totalReports} icon={FileText} color="bg-blue-500" />
        <StatCard title="Pending Reports" value={stats.pendingReports} icon={Clock} color="bg-yellow-500" />
        <StatCard title="In Progress Reports" value={stats.inProgressReports} icon={AlertTriangle} color="bg-orange-500" />
        <StatCard title="Completed Reports" value={stats.completedReports} icon={CheckCircle} color="bg-green-500" />
        <StatCard title="Total Schedules" value={stats.totalSchedules} icon={Calendar} color="bg-indigo-500" />
        <StatCard title="Scheduled" value={stats.scheduledSchedules} icon={Clock} color="bg-blue-500" />
        <StatCard title="In Progress" value={stats.inProgressSchedules} icon={PlayCircle} color="bg-yellow-500" />
        <StatCard title="Completed" value={stats.completedSchedules} icon={CheckCircle} color="bg-green-500" />
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="bg-purple-500" />
        <StatCard title="Admins" value={stats.adminUsers} icon={Shield} color="bg-red-500" />
        <StatCard title="Drivers" value={stats.driverUsers} icon={Users} color="bg-blue-500" />
        <StatCard title="Regular Users" value={stats.regularUsers} icon={Users} color="bg-green-500" />
      </div>

      {/* Schedules Section - UPDATED to match report table style */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">All Schedules ({stats.totalSchedules})</h2>
          <div className="flex items-center gap-3">
            {isAdmin() && (
              <div className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                Admin Edit Mode
              </div>
            )}
            <button
              onClick={fetchAllData}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Refresh
            </button>
          </div>
        </div>

        {allSchedules.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No schedules in the system</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Frequency</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Collectors</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                  {isAdmin() && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allSchedules.map((schedule) => {
                  const collectorNames = getCollectorNames(schedule.collector_ids);
                  const createdByUser = getUserInfo(schedule.user_id || schedule.createdBy);
                  
                  return (
                    <tr key={schedule._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-blue-500" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {schedule.route_id || 'No address'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{schedule.date}</div>
                        <div className="text-sm text-gray-500">{formatTime(schedule.time)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getFrequencyColor(schedule.frequency)}`}>
                          {schedule.frequency}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {collectorNames.map((name, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <User className="h-3 w-3 text-gray-400" />
                              <span className="text-sm text-gray-700">{name}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{createdByUser.name}</div>
                            <div className="flex items-center space-x-1">
                              <AtSign className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500 font-mono">@{createdByUser.username}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {isAdmin() ? (
                          <select
                            value={schedule.status}
                            onChange={(e) => updateScheduleStatus(schedule._id, e.target.value)}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getScheduleStatusColor(schedule.status)}`}
                          >
                            <option value="scheduled">Scheduled</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        ) : (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getScheduleStatusColor(schedule.status)}`}>
                            {schedule.status?.replace('_', ' ')}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-xs">
                          {schedule.notes || 'No notes'}
                        </div>
                      </td>
                      {isAdmin() && (
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openAssignModal(schedule)}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                              title="Assign Collectors"
                            >
                              <Users className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => updateScheduleStatus(schedule._id, 'in_progress')}
                              className="text-yellow-600 hover:text-yellow-900 transition-colors"
                              title="Start Collection"
                            >
                              <PlayCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => updateScheduleStatus(schedule._id, 'completed')}
                              className="text-green-600 hover:text-green-900 transition-colors"
                              title="Mark Complete"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* All Reports Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">All Reports ({stats.totalReports})</h2>
          <button
            onClick={fetchAllData}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Refresh
          </button>
        </div>

        {allReports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No reports in the system</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reporter</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allReports.map((report) => (
                  <tr key={report._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{report.title}</div>
                      <div className="text-sm text-gray-500 max-w-xs">{report.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{report.createdBy?.name || 'Unknown'}</div>
                      <div className="text-sm text-gray-500">{report.createdBy?.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 text-sm capitalize">
                      {report.category?.replace('_', ' ') || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium capitalize ${getPriorityColor(report.priority)}`}>
                        {report.priority || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={report.status}
                        onChange={(e) => handleUpdateReportStatus(report._id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Management Section - Only for Admins */}
      {isAdmin() && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">User Management ({stats.totalUsers})</h2>
            <div className="flex gap-3">
              {selectedUsers.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Selected ({selectedUsers.length})
                </button>
              )}
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <UserPlus className="w-5 h-5" />
                Create User
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(allUsers.map(u => u._id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                      className="rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {allUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => toggleUserSelection(user._id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleChangeRole(user._id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}
                      >
                        <option value="user">User</option>
                        <option value="driver">Driver</option>
                        <option value="collector">Collector</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.phone || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
{/* Assign Collectors Modal */}
{showAssignModal && isAdmin() && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
      <h2 className="text-2xl font-bold mb-6">
        Assign Collector to Schedule
      </h2>
      <p className="text-gray-600 mb-4">
        Location: <strong>{currentSchedule?.route_id}</strong>
      </p>
      
      {/* Warning Message */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <div className="flex items-center">
          <Users className="h-5 w-5 text-blue-500 mr-2" />
          <span className="text-sm text-blue-700 font-medium">
            Please select exactly 1 collector
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700">Available Collectors/Drivers:</h3>
        <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
          {getAvailableCollectors().length === 0 ? (
            <p className="text-gray-500 text-center py-4">No collectors/drivers available</p>
          ) : (
            getAvailableCollectors().map((collector) => (
              <div key={collector._id} className="flex items-center space-x-3 py-2 border-b border-gray-100 last:border-b-0">
                {/* Radio button for single selection */}
                <input
                  type="radio"
                  name="collector"
                  checked={selectedCollectors.includes(collector._id)}
                  onChange={() => toggleCollectorSelection(collector._id)}
                  className="rounded-full"
                />
                <User className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{collector.name}</div>
                  <div className="text-sm text-gray-500">
                    @{collector.username || 'no-username'} • {collector.role} • {collector.email}
                  </div>
                </div>
                {/* Show selected status */}
                {selectedCollectors.includes(collector._id) && (
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    Selected
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Current selection count */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              Selected Collector:
            </span>
            <span className={`text-sm font-medium ${
              selectedCollectors.length === 1 ? 'text-green-600' : 'text-red-600'
            }`}>
              {selectedCollectors.length} / 1
            </span>
          </div>
          {selectedCollectors.length === 1 && (
            <div className="mt-2 text-sm text-gray-600">
              {getAvailableCollectors().find(c => c._id === selectedCollectors[0])?.name}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => assignCollectors(currentSchedule._id, selectedCollectors)}
          disabled={selectedCollectors.length !== 1}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 ${
            selectedCollectors.length === 1 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Save className="h-4 w-4" />
          {selectedCollectors.length === 1 ? 'Assign Collector' : 'Select 1 Collector'}
        </button>
        <button
          onClick={() => {
            setShowAssignModal(false);
            setSelectedCollectors([]);
          }}
          className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
      {/* User Modal - Only for Admins */}
      {showModal && isAdmin() && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">
              {modalType === 'create' ? 'Create New User' : 'Edit User'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {modalType === 'edit' && '(leave blank to keep current)'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="driver">Driver</option>
                  <option value="collector">Collector</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                {modalType === 'create' ? 'Create User' : 'Update User'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className={`${color} text-white p-3 rounded-lg`}>
        <Icon className="h-8 w-8" />
      </div>
    </div>
  </div>
);

export default AdminDashboard;