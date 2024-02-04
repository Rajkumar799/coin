import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import API_URL from './apiConfig'; // Adjust the path based on your project structure
import { useLocation } from 'react-router-dom';

function RegistrationPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [referCode, setReferCode] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const location = useLocation();
  const urlReferCode = new URLSearchParams(location.search).get('referCode');

  // Set the referCode state with the referCode from the URL
  // If there is no referCode in the URL, it will use an empty string
  React.useEffect(() => {
    setReferCode(urlReferCode || '');
  }, [urlReferCode]);

  const register = async () => {
    try {
      const response = await axios.post(`${API_URL}/register`, { username, password, referCode, mobileNumber, email });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="card" style={{ width: '18rem' }}>
        <div className="card-header text-center">
          <h1>Registration Page</h1>
        </div>
        <div className="card-body">
          <div className="form-group mb-3">
            <input type="text" className="form-control" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div className="form-group mb-3">
            <input type="password" className="form-control" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div className="form-group mb-3">
            <input type="text" className="form-control" placeholder="Referral Code (optional)" value={referCode} onChange={e => setReferCode(e.target.value)} />
          </div>
          <div className="form-group mb-3">
            <input type="text" className="form-control" placeholder="Mobile Number" value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} />
          </div>
          <div className="form-group mb-3">
            <input type="email" className="form-control" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={register}>Register</button>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
