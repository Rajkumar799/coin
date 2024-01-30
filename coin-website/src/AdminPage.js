import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminPage() {
  const [transactions, setTransactions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      const jwt = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/admin/transactions', {
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
    const response = await axios.put(`http://localhost:5000/admin/transactions/${transactionId}/approve`, {}, {
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

  const sidebarStyle = {
    backgroundColor: '#f8f9fa',
    height: '100vh',
    padding: '20px 0',
    position: 'sticky',
    top: 0,
    width: sidebarOpen ? '250px' : '0',
    transition: '0.5s',
    overflow: sidebarOpen ? 'auto' : 'hidden' // Modify this line
  };

  return (
    <div className="container-fluid">
      <h1 className="text-center my-4">Admin Page</h1>
      <div className="row">
        <div className="col-lg-3 col-md-4 col-sm-6" style={sidebarStyle}>
          <button className="btn btn-primary mb-3 d-lg-none" onClick={() => setSidebarOpen(!sidebarOpen)}>Toggle Sidebar</button>
          <div className="list-group">
            <a href="#" className="list-group-item list-group-item-action active">Category 1</a>
            <a href="#" className="list-group-item list-group-item-action">Category 2</a>
            <a href="#" className="list-group-item list-group-item-action">Category 3</a>
            <a href="#" className="list-group-item list-group-item-action">Category 4</a>
          </div>
        </div>
        <div className="col-lg-9 col-md-8 col-sm-6" style={{ marginLeft: sidebarOpen ? '250px' : '0', transition: '0.5s' }}>
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
