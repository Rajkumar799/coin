import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
function AdminTransactionMethodPage() {
    const [transactionMethod, setTransactionMethod] = useState({
      coinPrice: '',
      interestRate: '',
      upi: '',
      bitcoinWallet: '',
      usdtDetails: '',
      referralCommission: ''
    });
  
    useEffect(() => {
      const fetchTransactionMethod = async () => {
        const jwt = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/admin/transaction-method', {
          headers: {
            Authorization: `Bearer ${jwt}`
          }
        });
        setTransactionMethod(response.data);
      };
  
      fetchTransactionMethod();
    }, []);
  
    const handleChange = (event) => {
      setTransactionMethod({
        ...transactionMethod,
        [event.target.name]: event.target.value
      });
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      const jwt = localStorage.getItem('token');
      const response = await axios.put('http://localhost:5000/admin/transaction-method', transactionMethod, {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      });
  
      if (response.status === 200) {
        alert('Transaction method details updated successfully!');
      } else {
        alert('Failed to update transaction method details.');
      }
    };
  
    return (
      <div className="container">
        <h1 className="text-center my-4">Admin Transaction Method Page</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Coin Price</label>
            <input type="number" className="form-control" name="coinPrice" value={transactionMethod.coinPrice} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Interest Rate</label>
            <input type="number" className="form-control" name="interestRate" value={transactionMethod.interestRate} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>UPI</label>
            <input type="text" className="form-control" name="upi" value={transactionMethod.upi} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Bitcoin Wallet</label>
            <input type="text" className="form-control" name="bitcoinWallet" value={transactionMethod.bitcoinWallet} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>USDT Details</label>
            <input type="text" className="form-control" name="usdtDetails" value={transactionMethod.usdtDetails} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Referral Commission</label>
            <input type="number" className="form-control" name="referralCommission" value={transactionMethod.referralCommission} onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    );
  }
  

export default AdminTransactionMethodPage;
