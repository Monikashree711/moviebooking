// const express = require('express');
// const cors = require('cors');
// const mysql = require('mysql2');
// const path = require('path');

// const app = express();
// const port = 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use('/images', express.static(path.join(__dirname, 'public/images')));

// // MySQL connection
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'moni@0711',
//   database: 'movie_booking'
// });

// db.connect(err => {
//   if (err) {
//     console.error('❌ Database connection failed:', err.stack);
//     return;
//   }
//   console.log('✅ Connected to database');
// });

// // Root API check
// app.get('/', (req, res) => {
//   res.send('✅ API is working!');
// });

// // Get all movies
// app.get('/api/movies', (req, res) => {
//   const query = 'SELECT * FROM movies';

//   db.query(query, (err, results) => {
//     if (err) {
//       console.error('❌ Error fetching movies:', err);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.json(results);
//   });
// });

// // Get single movie by ID
// app.get('/api/movies/:id', (req, res) => {
//   const movieId = req.params.id;
//   const query = 'SELECT * FROM movies WHERE id = ?';

//   db.query(query, [movieId], (err, results) => {
//     if (err) {
//       console.error('❌ Error fetching movie by ID:', err);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     if (results.length === 0) {
//       return res.status(404).json({ error: 'Movie not found' });
//     }
//     res.json(results[0]);
//   });
// });

// // Get booked seats for a specific movie
// app.get('/api/movies/:id/seats', (req, res) => {
//   const movieId = req.params.id;
//   const query = 'SELECT selected_seats FROM bookings WHERE movie_id = ?';

//   db.query(query, [movieId], (err, results) => {
//     if (err) {
//       console.error('❌ Error fetching booked seats:', err);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     const allSeats = results
//       .map(row => JSON.parse(row.selected_seats))
//       .flat();

//     res.json(allSeats);
//   });
// });

// // Book tickets
// app.post('/api/bookings', (req, res) => {
//   const { movie_id, title, selected_seats, user_name, payment_method } = req.body;

//   const query = `
//     INSERT INTO bookings (movie_id, title, selected_seats, user_name, payment_method, created_at)
//     VALUES (?, ?, ?, ?, ?, NOW())
//   `;

//   db.query(query, [movie_id, title, JSON.stringify(selected_seats), user_name, payment_method], (err, result) => {
//     if (err) {
//       console.error('❌ Booking insert failed:', err);
//       return res.status(500).json({ error: 'Booking failed', details: err.sqlMessage });
//     }
//     res.status(200).json({ message: 'Booking confirmed successfully' });
//   });
// });

// // ✅ Get all bookings (for FinalBookingComponent)
// app.get('/api/bookings', (req, res) => {
//   const query = 'SELECT * FROM bookings ORDER BY created_at DESC';

//   db.query(query, (err, results) => {
//     if (err) {
//       console.error('❌ Error fetching bookings:', err);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

//     res.json(results);
//   });
// });

// // Start server
// app.listen(port, () => {
//   console.log(`🚀 Server running on http://localhost:${port}`);
// });





import express, { Request, Response } from 'express';
import cors from 'cors';
import mysql, { RowDataPacket, OkPacket, QueryError } from 'mysql2';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


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

// Interfaces
interface Movie extends RowDataPacket {
  id: number;
  title: string;
  genre: string;
  duration: string;
  rating: number;
  showtime: string;
  language: string;
  image: string;
}

interface Booking extends RowDataPacket {
  movie_id: number;
  title: string;
  selected_seats: string;
  user_name: string;
  payment_method: string;
  created_at: string;
}

// Root API check
app.get('/', (_req: Request, res: Response) => {
  res.send('✅ API is working!');
});

// Get all movies
app.get('/api/movies', (_req: Request, res: Response) => {
  const query = 'SELECT * FROM movies';
  db.query<Movie[]>(query, (err, results) => {
    if (err) {
      console.error('❌ Error fetching movies:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    return res.json(results);
  });
});

// Get single movie by ID
app.get('/api/movies/:id', (req: Request, res: Response) => {
//   const movieId = req.params.id;
const movieId = req.params['id'];

  const query = 'SELECT * FROM movies WHERE id = ?';

  db.query<Movie[]>(query, [movieId], (err, results) => {
    if (err) {
      console.error('❌ Error fetching movie by ID:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    return res.json(results[0]);
  });
});

// Get booked seats for a specific movie
app.get('/api/movies/:id/seats', (req: Request, res: Response) => {
//   const movieId = req.params.id;
const movieId = req.params['id'];

  const query = 'SELECT selected_seats FROM bookings WHERE movie_id = ?';

  db.query<RowDataPacket[]>(query, [movieId], (err, results) => {
    if (err) {
      console.error('❌ Error fetching booked seats:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const allSeats: string[] = results
      .map(row => JSON.parse(row['selected_seats'])) // ✅ fixed
      .flat();

    return res.json(allSeats);
  });
});

// Book tickets
app.post('/api/bookings', (req: Request, res: Response) => {
  const { movie_id, title, selected_seats, user_name, payment_method } = req.body;

  const query = `
    INSERT INTO bookings (movie_id, title, selected_seats, user_name, payment_method, created_at)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;

  db.query<OkPacket>(
    query,
    [movie_id, title, JSON.stringify(selected_seats), user_name, payment_method],
    (err, _result) => {
      if (err) {
        const queryErr = err as QueryError;
        console.error('❌ Booking insert failed:', queryErr.message);
        return res.status(500).json({ error: 'Booking failed', details: queryErr.message });
      }
      return res.status(200).json({ message: 'Booking confirmed successfully' });
    }
  );
});

// Get all bookings
app.get('/api/bookings', (_req: Request, res: Response) => {
  const query = 'SELECT * FROM bookings ORDER BY created_at DESC';

  db.query<Booking[]>(query, (err, results) => {
    if (err) {
      console.error('❌ Error fetching bookings:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // ✅ example fix if accessing properties like id or selected_seats:
    const bookings = results.map(row => ({
      movie_id: row['movie_id'],
      title: row['title'],
      selected_seats: row['selected_seats'],
      user_name: row['user_name'],
      payment_method: row['payment_method'],
      created_at: row['created_at']
    }));

    return res.json(bookings);
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
