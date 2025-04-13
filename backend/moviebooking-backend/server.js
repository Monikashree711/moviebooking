const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'moni@0711',
  database: 'movie_booking'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database');
});

// Get all movies
app.get('/api/movies/:id', (req, res) => {
    const movieId = req.params.id;
    const query = 'SELECT * FROM movies WHERE id = ?';
  
    db.query(query, [movieId], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Movie not found' });
      }
  
      res.json(results[0]); // return single movie
    });
  });
  
  

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
