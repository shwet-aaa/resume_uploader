const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();
const saltRounds = 10;
const fs = require('fs');


app.use(cors());
app.use(bodyParser.json());
app.use(express.static('uploads'));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage });



const db = mysql.createConnection({
  host: 'localhost',
  user: process.env.REACT_APP_SQL_USERNAME, 
  password: process.env.REACT_APP_SQL_PASSWORD,  
  database: 'resume_uploader', 
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});


app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;

  
  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: 'Error hashing the password' });
    }

  
    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ message: 'User registered successfully!', userId: result.insertId });
      const userId = res.data.id;
      localStorage.setItem('userId', userId);
    });
  });
});



app.post('/api/upload-resume', upload.single('resume'), (req, res) => {
  const userId = localStorage.getItem('userId'); 


  if (!req.file) {
    console.error('No file uploaded');
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = req.file.path; 

  
  if (!userId) {
    console.error('User ID is missing');
    return res.status(400).json({ error: 'User ID is missing' });
  }
  const sql = 'INSERT INTO resumes (user_id, file_path) VALUES (?, ?)';
  db.query(sql, [userId, filePath], (err, result) => {
    if (err) {
      console.error('Database error:', err); 
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    res.status(201).json({ message: 'Resume uploaded successfully!' });
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});