const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

var corsOptions = {
  origin: 'https://coin-bldf.vercel.app',
  optionsSuccessStatus: 200,
  credentials: true
}


app.options('*', cors(corsOptions));

app.use(express.json()); // for parsing application/json

// Connect to MongoDB
mongoose.connect('mongodb+srv://jinxforever8341:5Pnd3AUHYTrdh41v@cluster0.yxs991t.mongodb.net/', {useNewUrlParser: true, useUnifiedTopology: true});
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  referCode: {
    type: String,
    required: true,
    unique: true
  },
  usedReferCode: {
    type: String,
    default: null
  },
  coins: {
    type: Number,
    default: 0
  },
  referrals: {
    type: [mongoose.Schema.Types.ObjectId],
    default: []
  },
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
  mobileNumber: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
});


const UserTransactionSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    transactionId: {
      type: String,
      required: true
    },
    coins: {
      type: Number,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    approved: {
      type: Boolean,
      default: false
    }
});

const TransactionMethodSchema = new mongoose.Schema({
  coinPrice: Number,
  interestRate: Number,
  upi: String,
  bitcoinWallet: String,
  usdtDetails: String,
  referralCommission: Number
});

const TransactionMethod = mongoose.model('TransactionMethod', TransactionMethodSchema);

const UserTransaction = mongoose.model('Transaction', UserTransactionSchema);


const User = mongoose.model('User', UserSchema);
// Registration route
app.post('/register', async (req, res) => {
  const {username, password, referCode, email, mobileNumber} = req.body;

  // Generate a unique referral code for the new user
  const newReferCode = Math.random().toString(36).substring(2, 15);

  const user = new User({username, password, referCode: newReferCode, usedReferCode: referCode, email, mobileNumber});
  await user.save();

  // If the new user used someone's referral code, add them to that person's referral system
  if (referCode) {
    const referrer = await User.findOne({referCode});
    if (referrer) {
      // Add the new user to the referrer's referral system
      referrer.referrals.push(user._id);
      await referrer.save();
    }
  }

  res.send(user);
});

app.get('/transaction-method', async (req, res) => {
  try {
    const transactionMethod = await TransactionMethod.findOne();
    res.json(transactionMethod);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// Login route
app.post('/login', async (req, res) => {
  const {username, password} = req.body;
  const user = await User.findOne({username, password});
  if (user) {
      // Generate a JWT with the user's ID
      const token = jwt.sign({ id: user._id }, 'your-secret-key'); // replace 'your-secret-key' with your actual secret key
      res.send({ user, token });
  } else {
      res.status(401).send('Invalid username or password');
  }
});

app.get('/user', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]; // get the token from the headers
  const payload = jwt.verify(token, 'your-secret-key'); // verify the token and get the payload

  // Find the user with the ID from the token payload and exclude the password
  const user = await User.findById(payload.id).select('-password');
  if (user) {
      res.send(user);
  } else {
      res.status(404).send('User not found');
  }
});

app.put('/user', async (req, res) => {
const { username, password } = req.body;
const token = req.headers.authorization.split(' ')[1];

try {
  const decoded = jwt.verify(token, 'your-secret-key');
  const user = await User.findById(decoded.id);

  if (username) {
    user.username = username;
  }

  if (password) {
    user.password = password; // Make sure to hash the password before saving it
  }

  await user.save();

  res.status(200).send(user);
} catch (error) {
  console.error(error);
  res.status(500).send('Failed to update profile.');
}
});


app.post('/transactions', async (req, res) => {
    const { transactionId, coins, amount } = req.body;
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(token,'your-secret-key' , async (err, user) => {
      if (err) return res.sendStatus(403);
      const userId = user.id;
  
      // Check if a transaction with the same ID already exists for the user
      const existingTransaction = await UserTransaction.findOne({ user: userId, transactionId: transactionId });
      if (existingTransaction) {
        return res.status(400).json({ message: 'Found similar transaction ID.' });
      }
  
      const transaction = new UserTransaction({
        user: userId,
        transactionId,
        coins,
        amount,
        approved: false // set 'approved' to false by default
      });
  
      await transaction.save();
  
      res.json({ message: 'Transaction saved successfully.' });
    });
  });
  app.get('/admin/users', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'your-secret-key');
    const users = await User.find();
    res.send(users);
  });
  
  app.put('/admin/users/:id', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'your-secret-key');
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(user);
  });
  
  app.get('/admin/transaction-method', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'your-secret-key');
    const transactionMethod = await TransactionMethod.findOne();
    res.send(transactionMethod);
  });
  
  app.put('/admin/transaction-method', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'your-secret-key');
    let transactionMethod = await TransactionMethod.findOne();
    if (!transactionMethod) {
      transactionMethod = new TransactionMethod(req.body);
    } else {
      Object.assign(transactionMethod, req.body);
    }
    await transactionMethod.save();
    res.send(transactionMethod);
  });
  
//   app.get('/admin/transactions', async (req, res) => {
//     const authHeader = req.headers.authorization;
//     const token = authHeader && authHeader.split(' ')[1];
  
//     if (token == null) return res.sendStatus(401);
  
//     jwt.verify(token,'your-secret-key' , async (err, user) => {
//       if (err) return res.sendStatus(403);
  
//       // Check if the user is an admin
//       if (user.role !== 'admin') return res.sendStatus(403);
  
//       const transactions = await UserTransaction.find();
//       res.json(transactions);
//     });
//   });
app.get('/admin/transactions', async (req, res) => {
    const transactions = await UserTransaction.find();
    res.json(transactions);
  });
  

  app.put('/admin/transactions/:id/approve', async (req, res) => {
    const transactionId = req.params.id;
  
    // Find the transaction
    const transaction = await UserTransaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found.' });
    }
  
    // Approve the transaction
    transaction.approved = true;
    await transaction.save();
  
    // Find the user
    const user = await User.findById(transaction.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
  
    // Update the user's coins
    user.coins += transaction.coins;
    await user.save();
  
    res.json({ message: 'Transaction approved successfully.' });
  });
  app.post('/share', async (req, res) => {
    const { referCode, coins } = req.body;
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(token,'your-secret-key' , async (err, user) => {
      if (err) return res.sendStatus(403);
      const userId = user.id;
  
      // Find the user who is sharing the coins
      const fromUser = await User.findById(userId);
      if (!fromUser) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Check if the user has enough coins to share
      if (fromUser.coins < coins) {
        return res.status(400).json({ message: 'Not enough coins to share.' });
      }
  
      // Find the user who is receiving the coins
      const toUser = await User.findOne({ referCode: referCode });
      if (!toUser) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Update the users' coins
      fromUser.coins -= coins;
      toUser.coins += coins;
      await fromUser.save();
      await toUser.save();
  
      res.json({ message: 'Coins shared successfully.' });
    });
  });
    
  

// Start the server
app.listen(5000, () => console.log('Server started on port 5000'));
