const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: 'sql3.freesqldatabase.com',
  user: 'sql3796624',
  password: '7vrcsgH4T2',
  database: 'sql3796624',
  port: 3306
});

connection.connect((err) => {
  if (err) console.error('Database connection error:', err);
  else console.log('Connected to MySQL');
});

app.get('/create-table', (req, res) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS marriage_details (
      Id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      location VARCHAR(255) NOT NULL,
      message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      like_count INT DEFAULT 0
    )
  `;
  connection.query(sql, (err, result) => {
    if (err) return res.status(500).json({error: err.message});
    res.json({message: 'Table created successfully', result});
  });
});

app.post('/marriage', (req, res) => {
  const { name, location, message } = req.body;
  const sql = `
    INSERT INTO marriage_details (name, location, message)
    VALUES (?, ?, ?)
  `;
  connection.query(sql, [name, location, message], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Data inserted successfully', id: result.insertId });
  });
});


app.get('/marriages', (req, res) => {
  const sql = 'SELECT * FROM marriage_details ORDER BY created_at DESC';
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


app.put('/marriage/like/:id', (req, res) => {
  const id = req.params.id;
  const sql = `
    UPDATE marriage_details 
    SET like_count = like_count + 1 
    WHERE Id = ?
  `;

  connection.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: `Record with Id ${id} not found` });
    }
    res.json({ message: `Like count updated for Id ${id}`, affectedRows: result.affectedRows });
  });
});


const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
