const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== POSTGRESQL CONNECTION =====
const pool = new Pool({
  user: process.env.DB_USER || 'yourusername',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'yourdatabase',
  password: process.env.DB_PASSWORD || 'yourpassword',
  port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err);
  } else {
    console.log('✅ Database connected successfully at', res.rows[0].now);
  }
});

// ===== EXERCISE 1: BASIC TEST ENDPOINT =====
// Equivalent to: <?php echo "Hello"; ?>
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

// ===== EXERCISE 2 & 3: SEND DATA AND GET RESULT =====
// Equivalent to: <?php echo $_POST['num1'] + 20; ?>
app.post('/api/add', (req, res) => {
  console.log('Received data:', req.body);
  
  const { num1 } = req.body;
  
  if (!num1 && num1 !== 0) {
    return res.status(400).json({ error: 'num1 is required' });
  }
  
  const result = parseInt(num1) + 20;
  
  res.json({ 
    original: num1, 
    result: result,
    message: `${num1} + 20 = ${result}`
  });
});

// ===== EXERCISE 4: ASYNCHRONOUS vs SYNCHRONOUS =====

// Slow endpoint (get1.php with sleep(5))
app.get('/api/slow', (req, res) => {
  console.log('Slow endpoint called - will respond after 5 seconds');
  
  setTimeout(() => {
    res.json({ 
      message: 'Response from SLOW endpoint',
      delay: '5 seconds',
      endpoint: 'get1.php equivalent'
    });
    console.log('Slow endpoint responded');
  }, 5000);
});

// Fast endpoint (get2.php)
app.get('/api/fast', (req, res) => {
  console.log('Fast endpoint called - responding immediately');
  
  res.json({ 
    message: 'Response from FAST endpoint',
    delay: 'immediate',
    endpoint: 'get2.php equivalent'
  });
  console.log('Fast endpoint responded');
});

// ===== POSTGRESQL DATABASE OPERATIONS =====

// Setup database table
app.get('/api/setup-database', async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS calculations (
        id SERIAL PRIMARY KEY,
        input_value INTEGER NOT NULL,
        result INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Database table created/verified');
    res.json({ 
      success: true,
      message: 'Database table "calculations" created successfully!' 
    });
  } catch (err) {
    console.error('❌ Database setup error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Database setup failed',
      details: err.message 
    });
  }
});

// Save calculation to database
app.post('/api/save-calculation', async (req, res) => {
  const { num1, result } = req.body;
  
  try {
    const query = 'INSERT INTO calculations (input_value, result) VALUES ($1, $2) RETURNING *';
    const values = [num1, result];
    const dbResult = await pool.query(query, values);
    
    console.log('✅ Calculation saved to database:', dbResult.rows[0]);
    
    res.json({ 
      success: true,
      message: 'Calculation saved to database',
      data: dbResult.rows[0]
    });
  } catch (err) {
    console.error('❌ Database save error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to save calculation',
      details: err.message 
    });
  }
});

// Get all calculations from database
app.get('/api/calculations', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM calculations ORDER BY created_at DESC LIMIT 20'
    );
    
    console.log(`✅ Retrieved ${result.rows.length} calculations from database`);
    
    res.json({ 
      success: true,
      count: result.rows.length,
      calculations: result.rows
    });
  } catch (err) {
    console.error('❌ Database query error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to retrieve calculations',
      details: err.message 
    });
  }
});

// Delete all calculations (for testing)
app.delete('/api/calculations', async (req, res) => {
  try {
    await pool.query('DELETE FROM calculations');
    console.log('✅ All calculations deleted');
    
    res.json({ 
      success: true,
      message: 'All calculations deleted' 
    });
  } catch (err) {
    console.error('❌ Database delete error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete calculations',
      details: err.message 
    });
  }
});

// ===== REAL-WORLD EXAMPLE: OTP VERIFICATION =====
// Simulates OTP verification without page reload
app.post('/api/verify-otp', (req, res) => {
  const { otp } = req.body;
  const correctOtp = '123456'; // In real app, this would be stored in database/session
  
  console.log('OTP verification attempt:', otp);
  
  // Simulate processing delay
  setTimeout(() => {
    if (otp === correctOtp) {
      console.log('✅ OTP verified successfully');
      res.json({ 
        success: true, 
        message: 'OTP verified successfully! ✓' 
      });
    } else {
      console.log('❌ Invalid OTP');
      res.json({ 
        success: false, 
        message: 'Invalid OTP. Please try again.' 
      });
    }
  }, 500);
});

// ===== REAL-WORLD EXAMPLE: LIKES & COMMENTS (Facebook-style) =====
// In-memory storage (in real app, use database)
let likes = 0;
const comments = [];

// Get current likes
app.get('/api/likes', (req, res) => {
  res.json({ likes: likes });
});

// Add a like
app.post('/api/like', (req, res) => {
  likes++;
  console.log(`👍 Like added. Total likes: ${likes}`);
  res.json({ likes: likes });
});

// Get all comments
app.get('/api/comments', (req, res) => {
  res.json({ comments: comments });
});

// Add a comment
app.post('/api/comment', (req, res) => {
  const { comment } = req.body;
  
  if (!comment || comment.trim() === '') {
    return res.status(400).json({ error: 'Comment cannot be empty' });
  }
  
  const newComment = {
    id: comments.length + 1,
    text: comment,
    timestamp: new Date()
  };
  
  comments.push(newComment);
  console.log(`💬 Comment added: "${comment}"`);
  
  res.json({ 
    success: true,
    message: 'Comment added',
    comments: comments
  });
});

// ===== ECHO ENDPOINT (for debugging) =====
// Prints whatever data you send
app.post('/api/echo', (req, res) => {
  console.log('Echo received:', req.body);
  res.json({ 
    message: 'Echo response',
    receivedData: req.body 
  });
});

// ===== 404 HANDLER =====
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.path 
  });
});

// ===== START SERVER =====
app.listen(port, () => {
  console.log('=================================');
  console.log('🚀 AJAX Lab Backend Server');
  console.log('=================================');
  console.log(`Server running on: http://localhost:${port}`);
  console.log(`Test endpoint: http://localhost:${port}/api/hello`);
  console.log('=================================');
});