const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); 
const db = require('./models/db'); 
const participantsRoutes = require('./routes/participants');
const winnersRoutes = require('./routes/winners');

const app = express();

// мидлваер
app.use(cors());
app.use(bodyParser.json());

// обслуга статик файлов из публик
app.use(express.static(path.join(__dirname, '../public')));

// апи роутер
app.use('/api/participants', participantsRoutes);
app.use('/api/winners', winnersRoutes);

// запасник для SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// тест базы данных на конект
db.connect()
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