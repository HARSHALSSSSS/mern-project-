import { useEffect, useState } from 'react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { FaUsers, FaUserCheck, FaUserTimes } from 'react-icons/fa';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (id, currentStatus) => {
    try {
      await axios.patch(`/api/admin/users/${id}/${currentStatus === 'active' ? 'deactivate' : 'activate'}`);
      fetchUsers();
    } catch (error) {
      console.error('Failed to update:', error);
    }
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true, render: (u) => <div><p className="font-semibold">{u.name}</p><p className="text-sm text-gray-500">{u.email}</p></div> },
    { key: 'role', label: 'Role', sortable: true, render: (u) => <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 capitalize">{u.role}</span> },
    { key: 'status', label: 'Status', sortable: true, render: (u) => <span className={`px-3 py-1 rounded-full text-sm font-semibold ${u.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{u.status}</span> },
    { key: 'createdAt', label: 'Joined', sortable: true, render: (u) => new Date(u.createdAt).toLocaleDateString() },
  ];

  const filteredUsers = filter === 'all' ? users : users.filter(u => u.role === filter);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">Manage all platform users</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-600 mb-1">Total Users</p><p className="text-3xl font-bold">{users.length}</p></div>
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center"><FaUsers className="text-2xl text-blue-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-600 mb-1">Tenants</p><p className="text-3xl font-bold text-green-600">{users.filter(u => u.role === 'tenant').length}</p></div>
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center"><FaUserCheck className="text-2xl text-green-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-600 mb-1">Landlords</p><p className="text-3xl font-bold text-purple-600">{users.filter(u => u.role === 'landlord').length}</p></div>
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center"><FaUserCheck className="text-2xl text-purple-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-600 mb-1">Inactive</p><p className="text-3xl font-bold text-red-600">{users.filter(u => u.status !== 'active').length}</p></div>
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center"><FaUserTimes className="text-2xl text-red-600" /></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4 flex gap-3">
          {['all', 'tenant', 'landlord', 'admin'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg font-semibold ${filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{f === 'all' ? 'All Users' : f.charAt(0).toUpperCase() + f.slice(1) + 's'}</button>
          ))}
        </div>
        <DataTable
          columns={columns}
          data={filteredUsers}
          loading={loading}
          onView={(u) => { setSelectedUser(u); setShowModal(true); }}
          customActions={(u) => (
            <button onClick={() => toggleUserStatus(u._id, u.status)} className={`px-3 py-1 rounded-lg text-sm font-semibold ${u.status === 'active' ? 'bg-red-100 text-red-800 hover:bg-red-200' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}>{u.status === 'active' ? 'Deactivate' : 'Activate'}</button>
          )}
        />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="User Details" size="md">
        {selectedUser && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-sm text-gray-600">Name</p><p className="font-semibold">{selectedUser.name}</p></div>
              <div><p className="text-sm text-gray-600">Email</p><p className="font-semibold">{selectedUser.email}</p></div>
              <div><p className="text-sm text-gray-600">Role</p><p className="font-semibold capitalize">{selectedUser.role}</p></div>
              <div><p className="text-sm text-gray-600">Status</p><p className="font-semibold capitalize">{selectedUser.status}</p></div>
              <div><p className="text-sm text-gray-600">Phone</p><p className="font-semibold">{selectedUser.phone || 'N/A'}</p></div>
              <div><p className="text-sm text-gray-600">Joined</p><p className="font-semibold">{new Date(selectedUser.createdAt).toLocaleDateString()}</p></div>
            </div>
            <div className="flex justify-end pt-4 border-t">
              <button onClick={() => setShowModal(false)} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Close</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;
