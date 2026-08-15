const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'API GearPlay opérationnelle' }));
app.use('/api/products', require('./routes/products'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API sur http://localhost:${PORT}`));