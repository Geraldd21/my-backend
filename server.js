const express = require('express');
const app = express();
const mysql = require('mysql2');

app.use(express.json());

const db = mysql.createConnection({
 host: 'localhost',
 user: 'root',
 password: 'A1b2C3d4', // replace with your MySQL password
 database: 'my_database'
});
// Connect to database
db.connect((err) => {
 if(err) throw err;
 console.log("Connected to MySQL Database!");
});

app.get('/', (req, res) => {
    res.send('Backend server is running!');
});

// CONTACT API
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    console.log("Received:", req.body);

    if (!email.includes('@')) {
        return res.status(400).json({
            error: "Invalid email address"
        });
    }

    const sql = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";

    db.query(sql, [name, email, message], (err, result) => {

        if (err) {
            console.error("Database error:", err);

            return res.status(500).json({
                error: "Failed to save contact message",
                details: err.message
            });
        }

        console.log("Saved successfully!");
        console.log("Inserted ID:", result.insertId);

        res.json({
            message: `Thank you ${name}, your message has been saved!`,
            data: {
                id: result.insertId,
                name: name,
                email: email,
                message: message
            }
        });
    });
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});


