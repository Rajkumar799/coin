import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import API_URL from './apiConfig'; // Adjust the path based on your project structure
import MyNavbar from './MyNavbar';

function HomePage() {
  const [userData, setUserData] = useState(null);
  const [coinsToBuy, setCoinsToBuy] = useState(0);
  const [referCode, setReferCode] = useState('');
  const [coinsToShare, setCoinsToShare] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [referrals, setReferrals] = useState([]);
  const navigate = useNavigate();
  const [transactionMethod, setTransactionMethod] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserData(response.data);
        setNewUsername(response.data.username);

        // Fetch referrals when user data is available
        fetchReferrals(response.data.referrals);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchTransactionMethod = async () => {
      try {
        const response = await axios.get(`${API_URL}/transaction-method`);
        setTransactionMethod(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTransactionMethod();
  }, []);

  const fetchReferrals = async (referralIds) => {
    try {
      const referralPromises = referralIds.map(async (referralId) => {
        console.log(referralId)
        const referralResponse = await axios.get(`${API_URL}/referral/${referralId}`);
        return referralResponse.data;
      });

      const referralData = await Promise.all(referralPromises);
      setReferrals(referralData);
    } catch (error) {
      console.error(error);
    }
  };

  const buyCoins = () => {
    navigate('/buy', { state: { coins: coinsToBuy } });
  };

  const shareCoins = async () => {
    const jwt = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/share`,
      {
        referCode,
        coins: coinsToShare,
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    if (response.status === 200) {
      alert('Coins shared successfully!');
    } else {
      alert('Failed to share coins.');
    }
  };

  const saveChanges = async () => {
    const jwt = localStorage.getItem('token');
    const response = await axios.put(
      `${API_URL}/user`,
      {
        username: newUsername,
        password: newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    if (response.status === 200) {
      setUserData({ ...userData, username: newUsername });
      setEditMode(false);
      alert('Profile updated successfully!');
    } else {
      alert('Failed to update profile.');
    }
  };

  const copyToClipboard = () => {
    const referralLink = `${window.location.origin}/register?referCode=${userData.referCode}`;
    navigator.clipboard.writeText(referralLink)
      .then(() => setCopySuccess('Copied to clipboard!'))
      .catch(() => setCopySuccess('Copy to clipboard failed!'));
  };
  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div> 
                 <MyNavbar />
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
                    <input type="text" className="form-control" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
                  </div>
                  <div className="form-group mb-3">
                    <input type="password" className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" />
                  </div>
                  <button className="btn btn-primary" onClick={saveChanges}>
                    Save Changes
                  </button>
                </>
              ) : (
                <>
                <p style={{ marginBottom: '10px' }}>Username: {userData.username}</p>
                <p style={{ marginBottom: '10px' }}>Email: {userData.email}</p>
                <p style={{ marginBottom: '10px' }}>Mobile Number: {userData.mobileNumber}</p>
                <p style={{ marginBottom: '10px' }}>Used Refer Code: {userData.usedReferCode}</p>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <p style={{ marginBottom: '0' }}>My Refer Code: {userData.referCode}</p>
                  {userData.referCode && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span
                        role="button"
                        onClick={copyToClipboard}
                        style={{ cursor: 'pointer', padding: '5px', verticalAlign: 'middle' }}
                      >
                        📋
                      </span>
                      {copySuccess && (
                        <p style={{ marginLeft: '5px', marginBottom: '0', verticalAlign: 'middle' }}>{copySuccess}</p>
                      )}
                    </div>
                  )}
                </div>
                {referrals.length > 0 && (
                  <>
                    <p style={{ marginBottom: '10px' }}>Referrals:</p>
                    <ul style={{ marginBottom: '10px' }}>
                      {referrals.map((referral) => (
                        <li key={referral._id}>{referral.username}</li>
                      ))}
                    </ul>
                  </>
                )}
                <button className="btn btn-primary" onClick={() => setEditMode(true)}>
                  Edit Profile
                </button>
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
              <p>INTRESTRATE = {transactionMethod?.interestRate} </p>
              <p>YOUR TARGETCOIN : {userData.coins} TC</p>
              <div className="form-group mb-3">
                <input type="number" className="form-control" value={coinsToBuy} onChange={(e) => setCoinsToBuy(e.target.value)} placeholder="Number of coins to buy" />
              </div>
              <button className="btn btn-primary mb-3" onClick={buyCoins}>
                Buy Coins
              </button>
              <div className="form-group mb-3">
                <input type="text" className="form-control" value={referCode} onChange={(e) => setReferCode(e.target.value)} placeholder="Refer code of the user to share coins with" />
              </div>
              <div className="form-group mb-3">
                <input type="number" className="form-control" value={coinsToShare} onChange={(e) => setCoinsToShare(e.target.value)} placeholder="Number of coins to share" />
              </div>
              <button className="btn btn-primary" onClick={shareCoins}>
                Share Coins
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>

  );
}

export default HomePage;
