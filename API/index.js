const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json())

let users = {
    'Jimmy_Brown': {balance: 1000, currency: 'USD'},
    'Boris Krilenko': {balance: 9800, currency: 'EU'},
    'David Yoom': {balance: 750, currency: 'NIS'},
    'Albert Levi': {balance: 300, currency: 'USD'},
    'Dana Choen': {balance: 12000, currency: 'USD'}
}

let bets = []

app.get('/api/wallet/:username', (req, res) => {
    const { username } = req.params;
    const user = users[username];

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json({
        username,
        balance: user.balance,
        currency: user.currency
    });
});

app.post('/api/bet', (req, res) => {
    const { username, amount, option } = req.body;

    if (!username || !amount || !option) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const user = users[username];

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    if (user.balance < amount) {
        return res.status(400).json({ error: 'Insufficient balance' });
    }

    user.balance -= amount;

    const bet = {
        id: bets.length + 1,
        username,
        amount,
        option,
        status: 'panding'
    };

    bets.push(bet);

    res.json({
        message: 'Bet placed successfully',
        bet,
        balance: user.balance
    });
});

app.get('/api/bet/:id', (req, res) => {
    const { id } = req.params;
    const bet = bets.find((b) => b.id === parseInt(id));

    if (!bet) {
        return res.status(404).json({ error: 'Bet not found' });
    }
    res.json(bet);
});

app.put('/api/bet/:id', (req, res) => {
    const { id } = req.params;
    const { status, winnings } = req.body;

    const bet = bets.find((b) => b.id === parseInt(id));
    
    if (!bet) {
        return res.status(404).json({ error: 'Bet not found' });
    }
    if (status) {
        bet.status = status;
    }
    if (winnings && winnings > 0) {
        const user = users[bet.username];
        user.balance += winnings;
        bet.winnings = winnings;
    }

    res.json({
        message: 'Bet updated successfully'
    });
});

const port = process.env.PORT || 9000;

app.listen(port, () => {
    console.log(`Demo API is running on port ${port}`);
})