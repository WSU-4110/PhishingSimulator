const express = require('express');
const path = require('path');

const clickRoutes = require('./routes/click');
const userRoutes = require('./routes/users');
const emailRoutes = require('./backend/email');

const app = express();

app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use(clickRoutes);
app.use(userRoutes);
app.use(emailRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
