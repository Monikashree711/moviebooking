const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'moni@0711',
  database: 'movie_booking'
});

db.connect(err => {
  if (err) {
    console.error('❌ Database connection failed:', err.stack);
    return;
  }
  console.log('✅ Connected to database');
});

// Root API check
app.get('/', (req, res) => {
  res.send('✅ API is working!');
});

// Get all movies
app.get('/api/movies', (req, res) => {
  const query = 'SELECT * FROM movies';

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error fetching movies:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
});

// Get single movie by ID
app.get('/api/movies/:id', (req, res) => {
  const movieId = req.params.id;
  const query = 'SELECT * FROM movies WHERE id = ?';

  db.query(query, [movieId], (err, results) => {
    if (err) {
      console.error('❌ Error fetching movie by ID:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(results[0]);
  });
});

// Get booked seats for a specific movie
app.get('/api/movies/:id/seats', (req, res) => {
  const movieId = req.params.id;
  const query = 'SELECT selected_seats FROM bookings WHERE movie_id = ?';

  db.query(query, [movieId], (err, results) => {
    if (err) {
      console.error('❌ Error fetching booked seats:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const allSeats = results
      .map(row => JSON.parse(row.selected_seats))
      .flat();

    res.json(allSeats);
  });
});

// Book tickets
app.post('/api/bookings', (req, res) => {
  const { movie_id, title, selected_seats, user_name, payment_method } = req.body;

  const query = `
    INSERT INTO bookings (movie_id, title, selected_seats, user_name, payment_method, created_at)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;

  db.query(query, [movie_id, title, JSON.stringify(selected_seats), user_name, payment_method], (err, result) => {
    if (err) {
      console.error('❌ Booking insert failed:', err);
      return res.status(500).json({ error: 'Booking failed', details: err.sqlMessage });
    }
    res.status(200).json({ message: 'Booking confirmed successfully' });
  });
});

// ✅ Get all bookings (for FinalBookingComponent)
app.get('/api/bookings', (req, res) => {
  const query = 'SELECT * FROM bookings ORDER BY created_at DESC';

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error fetching bookings:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.json(results);
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});



