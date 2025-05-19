const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); 
const db = require('./models/db'); 
const participantsRoutes = require('./routes/participants');
const winnersRoutes = require('./routes/winners');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Обслуживание статических файлов
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.use('/api/participants', participantsRoutes);
app.use('/api/winners', winnersRoutes);

// Fallback для SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Проверка подключения к БД
db.query('SELECT 1')
  .then(() => {
    console.log('Connected to PostgreSQL');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection error', err);
    process.exit(1);
  });

module.exports = app;