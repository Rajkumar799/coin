import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function HomePage() {
  const [userData, setUserData] = useState(null);
  const [coinsToBuy, setCoinsToBuy] = useState(0);
  const [referCode, setReferCode] = useState('');
  const [coinsToShare, setCoinsToShare] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();
  const [transactionMethod, setTransactionMethod] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserData(response.data);
        setNewUsername(response.data.username);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchTransactionMethod = async () => {
      try {
        const response = await axios.get('http://localhost:5000/transaction-method');
        setTransactionMethod(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTransactionMethod();
  }, []);
  const buyCoins = () => {
    navigate('/buy', { state: { coins: coinsToBuy } });
  };

  const shareCoins = async () => {
    const jwt = localStorage.getItem('token');
    const response = await axios.post('http://localhost:5000/share', {
      referCode,
      coins: coinsToShare
    }, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });

    if (response.status === 200) {
      alert('Coins shared successfully!');
    } else {
      alert('Failed to share coins.');
    }
  };

  const saveChanges = async () => {
    const jwt = localStorage.getItem('token');
    const response = await axios.put('http://localhost:5000/user', {
      username: newUsername,
      password: newPassword
    }, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });

    if (response.status === 200) {
      setUserData({ ...userData, username: newUsername });
      setEditMode(false);
      alert('Profile updated successfully!');
    } else {
      alert('Failed to update profile.');
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1 className="text-center my-4">Home Page</h1>
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">
              <h2>User Details</h2>
            </div>
            <div className="card-body">
              {editMode ? (
                <>
                  <div className="form-group mb-3">
                    <input type="text" className="form-control" value={newUsername} onChange={e => setNewUsername(e.target.value)} />
                  </div>
                  <div className="form-group mb-3">
                    <input type="password" className="form-control" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password" />
                  </div>
                  <button className="btn btn-primary" onClick={saveChanges}>Save Changes</button>
                </>
              ) : (
                <>
                  <p>Username: {userData.username}</p>
                  <p>Email: {userData.email}</p>
                  <p>Mobile Number: {userData.mobileNumber}</p>
                  <p>Used Refer Code: {userData.usedReferCode}</p>
                  <p>My Refer Code: {userData.referCode}</p>
                  <button className="btn btn-primary" onClick={() => setEditMode(true)}>Edit Profile</button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h2>Coin Details</h2>
            </div>
            <div className="card-body">
              <p>Coin Price: 1 Coin = {transactionMethod?.coinPrice} Rupees</p>
              <p>Available Coins: {userData.coins}</p>
              <div className="form-group mb-3">
                <input type="number" className="form-control" value={coinsToBuy} onChange={e => setCoinsToBuy(e.target.value)} placeholder="Number of coins to buy" />
              </div>
              <button className="btn btn-primary mb-3" onClick={buyCoins}>Buy Coins</button>
              <div className="form-group mb-3">
                <input type="text" className="form-control" value={referCode} onChange={e => setReferCode(e.target.value)} placeholder="Refer code of the user to share coins with" />
              </div>
              <div className="form-group mb-3">
                <input type="number" className="form-control" value={coinsToShare} onChange={e => setCoinsToShare(e.target.value)} placeholder="Number of coins to share" />
              </div>
              <button className="btn btn-primary" onClick={shareCoins}>Share Coins</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
