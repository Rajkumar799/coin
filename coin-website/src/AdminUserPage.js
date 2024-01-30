import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import API_URL from './apiConfig'; // Adjust the path based on your project structure

function AdminUserPage() {
  const [users, setUsers] = useState([]);
  const [formValues, setFormValues] = useState({
    username: '',
    email: '',
    mobileNumber: '',
    referCode: '',
    usedReferCode: null,
    coins: 0,
    password:'',
    // Add other fields with default values
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const jwt = localStorage.getItem('token');
      const response = await axios.get( `${API_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      });
      setUsers(response.data);
    };

    fetchUsers();
  }, []);

  const handleSelectUser = (user) => {
    setFormValues({
      username: user.username || '',
      email: user.email || '',
      mobileNumber: user.mobileNumber || '',
      referCode: user.referCode || '',
      usedReferCode: user.usedReferCode || null,
      coins: user.coins || 0,
      password:user.password || '',
      // Add other fields with default values
    });
  };

  const handleChange = (event) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const jwt = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/admin/users/${formValues._id}`, formValues, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });

    if (response.status === 200) {
      alert('User details updated successfully!');
      setUsers(users.map(user =>
        user._id === formValues._id ? formValues : user
      ));
    } else {
      alert('Failed to update user details.');
    }
  };

  return (
    <div className="container">
      <h1 className="text-center my-4">Admin User Page</h1>
      <div className="row">
        <div className="col-md-6">
          <h2>Users</h2>
          <ul className="list-group">
            {users.map(user => (
              <li key={user._id} className="list-group-item" onClick={() => handleSelectUser(user)}>
                {user.username}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-6">
          {formValues && (
            <form onSubmit={handleSubmit}>
              <h2>Edit User</h2>
              <div className="form-group">
                <label>Username</label>
                <input type="text" className="form-control" name="username" value={formValues.username} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" className="form-control" name="email" value={formValues.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>password</label>
                <input type="text" className="form-control" name="password" value={formValues.password} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Mobile Number</label>
                <input type="tel" className="form-control" name="mobileNumber" value={formValues.mobileNumber} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Refer Code</label>
                <input type="text" className="form-control" name="referCode" value={formValues.referCode} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Used Refer Code</label>
                <input type="text" className="form-control" name="usedReferCode" value={formValues.usedReferCode} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Coins</label>
                <input type="number" className="form-control" name="coins" value={formValues.coins} onChange={handleChange} />
              </div>
              {/* Add more fields as needed */}
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
export default AdminUserPage;
