const express = require('express');
const app = express()
app.use(express.json())

const Lines = [
    {
        id: 'ter4565251ww',
        action: 'open',
        line_type: 'free_kick',
        line_type_name: 'Free Kick:',
        line_question: 'First touch team',
        competition: 'Russian premier league',
        home_team: 'team 1',
        away_team: 'team 2',
        odds: {
            home: 1.5,
            away: 2.2
        }
    },
    {
        id: 'fnw56532525qq',
        action: 'open',
        line_type: 'goal_kick',
        line_type_name: 'Goal Kick:',
        line_question: 'First touch team',
        competition: 'Russian premier league',
        home_team: 'team 3',
        away_team: 'team 4',
        odds: {
            home: 0.8,
            away: 3
        }
    },
    {
        id: 'sqe63578452dw',
        action: 'close',
        line_type: 'corner_kick',
        line_type_name: 'Korner Kick:',
        line_question: 'First touch team',
        competition: 'Buelgian premier league',
        home_team: 'team 11',
        away_team: 'team 7',
        odds: {
            home: 2.9,
            away: 1.1
        }
    },
    {
        id: 'ewv8923475ls',
        action: 'open',
        line_type: 'goal_kick',
        line_type_name: 'Goal Kick:',
        line_question: 'First touch team',
        competition: 'Italian premier league',
        home_team: 'team 78',
        away_team: 'team 21',
        odds: {
            home: 1.5,
            away: 2.2
        }
    },
    {
        id: 'vns47328432xz',
        action: 'close',
        line_type: 'penalty',
        line_type_name: 'Penalty:',
        line_question: 'First touch team',
        competition: 'British premier league',
        home_team: 'team 10',
        away_team: 'team 32',
        odds: {
            home: 3.5,
            away: 0.2
        }
    },
    {
        id: 'ter4565251ww',
        action: 'open',
        line_type: 'free_kick',
        line_type_name: 'Free Kick:',
        line_question: 'First touch team',
        competition: 'Russian premier league',
        home_team: 'team 1',
        away_team: 'team 2',
        odds: {
            home: 1.5,
            away: 2.2
        }
    },
    {
        id: 'fnw56532525qq',
        action: 'open',
        line_type: 'goal_kick',
        line_type_name: 'Goal Kick:',
        line_question: 'First touch team',
        competition: 'Russian premier league',
        home_team: 'team 3',
        away_team: 'team 4',
        odds: {
            home: 0.8,
            away: 3
        }
    },
    {
        id: 'lvd4544982nv',
        action: 'open',
        line_type: 'corner_kick',
        line_type_name: 'Korner Kick:',
        line_question: 'First touch team',
        competition: 'Buelgian premier league',
        home_team: 'team 11',
        away_team: 'team 7',
        odds: {
            home: 2.9,
            away: 1.1
        }
    },
    {
        id: 'nvw57249822kk',
        action: 'open',
        line_type: 'goal_kick',
        line_type_name: 'Goal Kick:',
        line_question: 'First touch team',
        competition: 'Italian premier league',
        home_team: 'team 78',
        away_team: 'team 21',
        odds: {
            home: 1.5,
            away: 2.2
        }
    },
    {
        id: 'kdf7420872ds',
        action: 'open',
        line_type: 'penalty',
        line_type_name: 'Penalty:',
        line_question: 'First touch team',
        competition: 'British premier league',
        home_team: 'team 10',
        away_team: 'team 32',
        odds: {
            home: 3.5,
            away: 0.2
        }
    },

]

const Users = [
    {
        id: 'pnsfruqi413423',
        username: 'George_Bossuy',
        balance: 2000,
        currency: 'USD'
    },
    {
        id: 'nlfsvnsp85242',
        username: 'Aaron_Mortal',
        balance: 12000,
        currency: 'EU'
    },
    {
        id: 'bsdkfsad562784',
        username: 'Nina_Simon',
        balance: 1232,
        currency: 'USD'
    },
    {
        id: 'nvsdfnof348524',
        username: 'Etgar_Keret',
        balance: 2000,
        currency: 'NIS'
    },
]

let Bets = []

// simulates Webhook
app.get('/lines', async (req, res) => {
    const randomLine = Math.floor(Math.random() * Lines.length)
    const data = Lines[randomLine];
    try {
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: `Error to fetch random line:`, error });
    }
})

// get user data
app.get('/api/wallet/:username', async (req, res) => {
    const { username } = req.params;
    const user = Users.find(user => user.username === username);
    console.log(user);
    if (!user) {
        return res.status(400).json({ message: 'username missing' })
    }
    try {
        res.status(200).json({
            username: user.username,
            balance: user.balance
        })
    } catch (error) {
        res.status(500).json({ message: `Error to fetch user data:`, error });
    }
});

// get user balance 
app.post('/api/user/balance', async (req, res) => {
    const { username } = req.body;
    const user = Users.find(user => user.username === username)
    try {
        if (!user) {
            return res.status(400).json({ message: 'username missing' })
        }
        res.status(200).json(user.balance);
    } catch (error) {
        res.status(500).json({ message: `Error to fetch user balance:`, error });
    };
});

// place bet 
app.post('/bet', async (req, res) => {
    const { username, lineId, amount, option } = req.body;
    const user = Users.find(user => user.username === username);
    const line = Lines.find(line => line.id === lineId);
    const balance = user?.balance - amount;
    if (!username || !lineId) {
        return res.status(400).json({ error: "Missing required fields" });
    };
    if (!user) {
        return res.status(400).json({ error: "User not found" });

    };
    if (!line) {
        return res.status(400).json({ error: 'Line not found' });
    };
    if (balance && balance < 0) {
        return res.status(400).json({ error: 'Insufficient balance' });
    };
    try {
        const bet = {
            id: Bets.length + 1,
            username,
            amount,
            option,
            status: 'pending'
        };
        user.balance = balance;
        Bets.push(bet);
        res.status(200).json({
            message: 'Bet placed successfully',
            bet,
            balance,
            Bets
        });
    } catch (error) {
        res.status(500).json({ message: `Error to placed bet:`, error });
    }
})

// get bet by id
app.get('/api/bet/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const bet = Bets.find(bet => bet.id === parseInt(id));
    if (!bet) {
        return res.status(400).json({ error: 'Bet not found' });
    };
    try {
        res.status(200).json(bet);
    } catch (error) {
        res.status(500).json({ message: `Error to fetch bet by ID:`, error });
    }
});

// update bet status
app.put('/api/bet/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const bet = Bets.find(bet => bet.id === parseInt(id));
    if (!bet) {
        return res.status(400).json({ error: 'Bet not found' });
    };
    try {
        bet.status = status;
        res.status(200).json({ message: 'Bet updated successfully' });
    } catch (error) {
        res.status(500).json({ message: `Error to update bet's status:`, error });
    };
});


// record win
app.post('/win', async (req, res) => {
    const { betId } = req.body;
    const bet = Bets.find(bet => bet.id === parseInt(betId));
    const user = Users.find(user => user.username === (bet.username));
    if (!bet || !user) {
        return res.status(400).json({ error: 'Bet or user not found' });
    }
    try {
        const status = bet.status.toUpperCase();
        switch (status) {
            case 'WON':
                user.balance += bet.amount;
                return res.status(200).json({ message: 'User won!' });
            case 'LOST':
                return res.status(200).json({ message: 'User lost' });
            case 'PENDING':
                return res.status(400).json({ message: 'Bet is still pending...' });
                default:
                return res.status(400).json({ message: `Unknown bet status: ${bet.status}` });
        }
    } catch (error) {
        console.error(`Error processing win for betId ${betId}:`, error);
        res.status(500).json({ message: 'Internal server error', error });
    };
});

// roll back 
app.post('/rollback', async (req, res) => {
    const { betId } = req.body;
    const bet = Bets.find(bet => bet.id === bet.id);
    const user = Users.find(user => user.username === bet.username);
    try {
        if (!bet || !user) {
            return res.status(400).json({ error: 'Bet or user not found' });
        }
        user.balance += bet.amount;
        res.status(200).json({ message: 'The money was returned to balance' })
    } catch (error) {
        console.error(`Error processing win for betId ${betId}:`, error);
        res.status(500).json({ message: 'Internal server error', error });
    };
});

const port = process.env.PORT || 7070;

app.listen(port, () => {
    console.log('demo API listening to port', port);
})