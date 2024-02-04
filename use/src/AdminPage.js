import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import API_URL from './apiConfig'; // Adjust the path based on your project structure
import Sidebar from './Sidebar';

function AdminPage() {
  const [transactions, setTransactions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      const jwt = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/transactions`, {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      });
      setTransactions(response.data);
    };

    fetchTransactions();
  }, []);

  const handleApprove = async (transactionId) => {
    const jwt = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/admin/transactions/${transactionId}/approve`, {}, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });

    if (response.status === 200) {
      alert('Transaction approved successfully!');
      setTransactions(transactions.map(transaction =>
        transaction._id === transactionId ? { ...transaction, approved: true } : transaction
      ));
    } else {
      alert('Failed to approve transaction.');
    }
  };

  return (
    <div className="d-flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="container-fluid">
        <h1 className="text-center my-4">Admin Page</h1>
        <div className="row">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Username</th>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Coins</th>
                <th>Approved</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction._id}>
                  <td>{transaction._id}</td>
                  <td>{transaction.user}</td>
                  <td>{transaction.transactionId}</td>
                  <td>{transaction.amount}</td>
                  <td>{transaction.coins}</td>
                  <td>{transaction.approved ? 'Yes' : 'No'}</td>
                  <td>
                    {!transaction.approved && (
                      <button className="btn btn-primary" onClick={() => handleApprove(transaction._id)}>Approve</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
