const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 5000; // make sure Angular calls http://localhost:5000

// Middleware
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// MySQL setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'moni@0711',
  database: 'movie_booking'
});

// Connect to database
db.connect(err => {
  if (err) {
    console.error('❌ Database connection failed:', err.stack);
    return;
  }
  console.log('✅ Connected to database');
});

// Root test
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

// ✅ Get booked seats for a movie
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
  const { movie_id, selected_seats, user_name } = req.body;

  if (!movie_id || !selected_seats || !Array.isArray(selected_seats)) {
    return res.status(400).json({ error: 'Invalid booking data' });
  }

  const query = 'INSERT INTO bookings (movie_id, selected_seats, user_name) VALUES (?, ?, ?)';
  const values = [movie_id, JSON.stringify(selected_seats), user_name || null];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('❌ Booking failed:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(201).json({ message: 'Booking successful', bookingId: result.insertId });
  });
});




// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
