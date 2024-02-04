import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import API_URL from './apiConfig'; // Adjust the path based on your project structure

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      const { user, token } = response.data;
      console.log(user);
      localStorage.setItem('token', token);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="card" style={{ width: '18rem' }}>
        <div className="card-header text-center">
          <h1>Login Page</h1>
        </div>
        <div className="card-body">
          <div className="form-group mb-3">
            <input type="text" className="form-control" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div className="form-group mb-3">
            <input type="password" className="form-control" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={login}>Login</button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
