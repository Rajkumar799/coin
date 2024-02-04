import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import API_URL from './apiConfig'; // Adjust the path based on your project structure
import Sidebar from './Sidebar';

function AdminManagementPage() {
  const [admins, setAdmins] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [newAdmin, setNewAdmin] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [editAdmin, setEditAdmin] = useState(null);

  useEffect(() => {
    // Fetch admins on component mount
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    const jwt = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/admin/admins`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    setAdmins(response.data);
  };

  const handleAddAdmin = async () => {
    const jwt = localStorage.getItem('token');
    try {
      // Make API call to add a new admin
      const response = await axios.post(
        `${API_URL}/admin/admins`,
        newAdmin,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (response.status === 201) {
        // Admin added successfully, update the admins list
        fetchAdmins();
        // Clear the form
        setNewAdmin({
          username: '',
          email: '',
          password: '',
        });
      } else {
        console.error('Failed to add admin');
      }
    } catch (error) {
      console.error('Error adding admin:', error);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    const jwt = localStorage.getItem('token');
    try {
      // Make API call to delete admin
      const response = await axios.delete(
        `${API_URL}/admin/admins/${adminId}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (response.status === 200) {
        // Admin deleted successfully, update the admins list
        fetchAdmins();
      } else {
        console.error('Failed to delete admin');
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
    }
  };

  const handleEditAdmin = async () => {
    const jwt = localStorage.getItem('token');
    try {
      // Make API call to edit admin
      const response = await axios.put(
        `${API_URL}/admin/admins/${editAdmin._id}`,
        editAdmin,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (response.status === 200) {
        // Admin edited successfully, update the admins list
        fetchAdmins();
        // Close the edit modal
        setEditAdmin(null);
      } else {
        console.error('Failed to edit admin');
      }
    } catch (error) {
      console.error('Error editing admin:', error);
    }
  };

  const openEditModal = (admin) => {
    setEditAdmin({ ...admin });
  };

  const closeEditModal = () => {
    setEditAdmin(null);
  };

  return (
    <div className="d-flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="container-fluid">
        <h1 className="text-center my-4">Admin Management</h1>
        <div className="row">
          <div className="col-md-8">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin._id}>
                    <td>{admin.username}</td>
                    <td>{admin.email}</td>
                    <td>
                      <button
                        className="btn btn-danger mr-2"
                        onClick={() => handleDeleteAdmin(admin._id)}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => openEditModal(admin)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-md-4">
            <h2>{editAdmin ? 'Edit Admin' : 'Add New Admin'}</h2>
            <form>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={editAdmin ? editAdmin.username : newAdmin.username}
                  onChange={(e) =>
                    setEditAdmin
                      ? setEditAdmin({ ...editAdmin, username: e.target.value })
                      : setNewAdmin({ ...newAdmin, username: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={editAdmin ? editAdmin.email : newAdmin.email}
                  onChange={(e) =>
                    setEditAdmin
                      ? setEditAdmin({ ...editAdmin, email: e.target.value })
                      : setNewAdmin({ ...newAdmin, email: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="text"
                  className="form-control"
                  id="password"
                  value={editAdmin ? editAdmin.password : newAdmin.password}
                  onChange={(e) =>
                    setEditAdmin
                      ? setEditAdmin({ ...editAdmin, password: e.target.value })
                      : setNewAdmin({ ...newAdmin, password: e.target.value })
                  }
                />
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={editAdmin ? handleEditAdmin : handleAddAdmin}
              >
                {editAdmin ? 'Save Changes' : 'Add Admin'}
              </button>
            </form>
          </div>
        </div>
        {/* Edit Admin Modal */}
        {editAdmin && (
          <div
            className="modal fade"
            id="editAdminModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="editAdminModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="editAdminModalLabel">
                    Edit Admin
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={closeEditModal}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  {/* Modal form content here */}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                    onClick={closeEditModal}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleEditAdmin}
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminManagementPage;
