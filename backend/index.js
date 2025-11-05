const express = require('express');
const cors = require('cors');
const usersRoutes = require('./routes/usersRoutes.js');
const movementRoutes = require('./routes/movementRoutes.js');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
    origin: ["http://localhost:5173", "https://tblslpvn-5173.inc1.devtunnels.ms"],
    credentials: true,
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Attendify Backend is running');
});

app.use('/users', usersRoutes)
app.use('/movements', movementRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
