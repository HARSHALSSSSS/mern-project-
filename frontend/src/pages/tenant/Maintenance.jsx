import { useEffect, useState } from 'react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { FaTools, FaClock, FaCheckCircle, FaTimesCircle, FaPlus, FaImage } from 'react-icons/fa';
import axios from '../../services/axios';

const Maintenance = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'plumbing',
  });
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/maintenance');
      console.log('🔧 Tenant Maintenance Response:', response.data);
      // Backend returns: { success, count, maintenanceRequests }
      setRequests(response.data.maintenanceRequests || []);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => formDataToSend.append(key, formData[key]));
      images.forEach(image => formDataToSend.append('images', image));
      
      await axios.post('/maintenance', formDataToSend);
      setShowCreateModal(false);
      setFormData({ title: '', description: '', priority: 'medium', category: 'plumbing' });
      setImages([]);
      fetchRequests();
    } catch (error) {
      console.error('Failed to create request:', error);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: FaClock },
      'in-progress': { bg: 'bg-blue-100', text: 'text-blue-800', icon: FaTools },
      completed: { bg: 'bg-green-100', text: 'text-green-800', icon: FaCheckCircle },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: FaTimesCircle },
    };
    const c = config[status] || config.pending;
    const Icon = c.icon;
    return <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${c.bg} ${c.text}`}><Icon className="text-xs" /> {status.charAt(0).toUpperCase() + status.slice(1)}</span>;
  };

  const getPriorityBadge = (priority) => {
    const config = { high: 'bg-red-100 text-red-800', medium: 'bg-yellow-100 text-yellow-800', low: 'bg-green-100 text-green-800' };
    return <span className={`px-3 py-1 rounded-full text-sm font-semibold ${config[priority]}`}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</span>;
  };

  const columns = [
    { key: 'title', label: 'Title', sortable: true, render: (r) => <div><p className="font-semibold">{r.title}</p><p className="text-sm text-gray-500 capitalize">{r.category}</p></div> },
    { key: 'priority', label: 'Priority', sortable: true, render: (r) => getPriorityBadge(r.priority) },
    { key: 'status', label: 'Status', sortable: true, render: (r) => getStatusBadge(r.status) },
    { key: 'createdAt', label: 'Created', sortable: true, render: (r) => new Date(r.createdAt).toLocaleDateString() },
    { key: 'updatedAt', label: 'Last Updated', sortable: true, render: (r) => new Date(r.updatedAt).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header - Consza Style */}
      <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-primary-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-accent-500 mb-2">Maintenance Requests</h1>
            <p className="text-gray-600 text-lg">Submit and track your maintenance requests</p>
          </div>
          <button onClick={() => setShowCreateModal(true)} className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold uppercase text-sm tracking-wide transition-all duration-300 transform hover:-translate-y-1 shadow-lg flex items-center gap-2">
            <FaPlus /> New Request
          </button>
        </div>
      </div>

      {/* Stats Grid - Consza Theme */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 border-b-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 uppercase tracking-wide">Total Requests</p>
              <p className="text-3xl font-bold text-accent-500">{requests.length}</p>
            </div>
            <div className="w-14 h-14 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center">
              <FaTools className="text-2xl text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-b-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 uppercase tracking-wide">Pending</p>
              <p className="text-3xl font-bold text-accent-500">{requests.filter(r => r.status === 'pending').length}</p>
            </div>
            <div className="w-14 h-14 bg-yellow-500 bg-opacity-20 rounded-full flex items-center justify-center">
              <FaClock className="text-2xl text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-b-4 border-primary-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 uppercase tracking-wide">In Progress</p>
              <p className="text-3xl font-bold text-accent-500">{requests.filter(r => r.status === 'in-progress').length}</p>
            </div>
            <div className="w-14 h-14 bg-primary-500 bg-opacity-20 rounded-full flex items-center justify-center">
              <FaTools className="text-2xl text-primary-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-b-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 uppercase tracking-wide">Completed</p>
              <p className="text-3xl font-bold text-accent-500">{requests.filter(r => r.status === 'completed').length}</p>
            </div>
            <div className="w-14 h-14 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center">
              <FaCheckCircle className="text-2xl text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Table */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <DataTable
          columns={columns}
          data={requests}
          loading={loading}
          onView={(r) => { setSelectedRequest(r); setShowDetailModal(true); }}
          emptyMessage="No maintenance requests found"
        />
      </div>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Maintenance Request" size="lg">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Title *</label>
              <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" placeholder="e.g., Leaking faucet in kitchen" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Category *</label>
                <select required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all">
                  <option value="plumbing">Plumbing</option>
                  <option value="electrical">Electrical</option>
                  <option value="hvac">HVAC</option>
                  <option value="appliance">Appliance</option>
                  <option value="structural">Structural</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Priority *</label>
                <select required value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Description *</label>
              <textarea required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="4" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" placeholder="Describe the issue in detail..." />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Images (Optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-all">
                <FaImage className="text-4xl text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                <input type="file" multiple accept="image/*" onChange={(e) => setImages(Array.from(e.target.files))} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="cursor-pointer text-primary-500 hover:text-primary-600 font-semibold">Browse Files</label>
                {images.length > 0 && <p className="text-sm text-green-600 mt-2">✓ {images.length} file(s) selected</p>}
              </div>
            </div>
            <div className="flex gap-3 pt-4 border-t">
              <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-all duration-300">Cancel</button>
              <button type="submit" className="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold uppercase text-sm tracking-wide transition-all duration-300 transform hover:-translate-y-1 shadow-lg">Submit Request</button>
            </div>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Request Details" size="lg">
        {selectedRequest && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-sm text-gray-600">Title</p><p className="font-semibold">{selectedRequest.title}</p></div>
              <div><p className="text-sm text-gray-600">Category</p><p className="font-semibold capitalize">{selectedRequest.category}</p></div>
              <div><p className="text-sm text-gray-600">Priority</p>{getPriorityBadge(selectedRequest.priority)}</div>
              <div><p className="text-sm text-gray-600">Status</p>{getStatusBadge(selectedRequest.status)}</div>
              <div><p className="text-sm text-gray-600">Created</p><p className="font-semibold">{new Date(selectedRequest.createdAt).toLocaleDateString()}</p></div>
              <div><p className="text-sm text-gray-600">Last Updated</p><p className="font-semibold">{new Date(selectedRequest.updatedAt).toLocaleDateString()}</p></div>
            </div>
            <div><p className="text-sm text-gray-600 mb-2">Description</p><p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedRequest.description}</p></div>
            {selectedRequest.images && selectedRequest.images.length > 0 && (
              <div><p className="text-sm text-gray-600 mb-2">Images</p><div className="grid grid-cols-3 gap-2">{selectedRequest.images.map((img, i) => <img key={i} src={img.url} alt={`Request ${i+1}`} className="w-full h-24 object-cover rounded-lg" />)}</div></div>
            )}
            <div className="flex justify-end pt-4 border-t">
              <button onClick={() => setShowDetailModal(false)} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Close</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Maintenance;
