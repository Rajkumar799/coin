import React, { useState ,useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function BuyPage() {
  const location = useLocation();
  const coins = location.state.coins;
  const [transactionId, setTransactionId] = useState('');
  const [transactionMethod, setTransactionMethod] = useState(null);
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
  const handleSend = async () => {
    const jwt = localStorage.getItem('token');
    const response = await axios.post('http://localhost:5000/transactions', {
      transactionId,
      coins,
      amount: coins * 500
    }, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });

    if (response.status === 200) {
      alert('Transaction details sent successfully!');
    } else {
      alert('Failed to send transaction details.');
    }
  };

  return (
    <div className="container">
      <h1 className="text-center my-4">Buy Page</h1>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h2>Transaction Details</h2>
            </div>
            <div className="card-body">
              <p>Number of coins to buy: {coins}</p>
              <p>Total price: {coins * transactionMethod?.coinPrice} Rupees</p>
              <p>UPI ID: {transactionMethod?.upi}</p>
              <p>bitcoinWallet ID: {transactionMethod?.bitcoinWallet}</p>
              <p>USDT ID: {transactionMethod?.usdtDetails}</p>
              <div className="form-group mb-3">
                <input type="text" className="form-control" placeholder="Enter transaction ID" onChange={e => setTransactionId(e.target.value)} />
              </div>
              <button className="btn btn-primary" onClick={handleSend}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuyPage;
