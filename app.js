const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const catalyst = require('zcatalyst-sdk-node');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

const db = mysql.createConnection({
  host:  "braqu5zkl9babltex8a4-mysql.services.clever-cloud.com",
  user:"ullwgxrole2feawu",
  password: "VjqMqm1PJQb3oJzrAkQ8",
  database:  "braqu5zkl9babltex8a4",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

app.get("/products", (req, res) => {
  const query = "SELECT * FROM product";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.get("/products/:id", (req, res) => {
  const query = "SELECT * FROM product WHERE id = ?";
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json(results[0]);
  });
});

app.post("/products", (req, res) => {
  const { name, category, subcategory, price, imageURL, description, stock } = req.body;
  const query = "INSERT INTO product (name, category, subcategory, price, imageURL, description, stock) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(query, [name, category, subcategory, price, imageURL, description, stock], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: results.insertId });
  });
});

app.put("/products/:id", (req, res) => {
  const { name, category, subcategory, price, imageURL, description, stock } = req.body;
  const query = "UPDATE product SET name = ?, category = ?, subcategory = ?, price = ?, imageURL = ?, description = ?, stock = ? WHERE id = ?";
  db.query(query, [name, category, subcategory, price, imageURL, description, stock, req.params.id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json({ message: "Product updated" });
  });
});

app.delete("/products/:id", (req, res) => {
  const query = "DELETE FROM product WHERE id = ?";
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json({ message: "Product deleted" });
  });
});

// Subcategories endpoints
app.get("/subcategories", (req, res) => {
  const query = "SELECT * FROM subcategory";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.get("/subcategories/:id", (req, res) => {
  const query = "SELECT * FROM subcategory WHERE id = ?";
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ message: "Subcategory not found" });
      return;
    }
    res.json(results[0]);
  });
});

app.get("/offers", (req, res) => {
  const query = "SELECT * FROM offers";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.get("/offers/:id", (req, res) => {
  const query = "SELECT * FROM offers WHERE id = ?";
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ message: "Offer not found" });
      return;
    }
    res.json(results[0]);
  });
});

app.post("/offers", (req, res) => {
  const { offerCategory, imageName, productname, category, subcategory, price, imageURL, description, stock } = req.body;
  const query = `
    INSERT INTO offers (offerCategory, imageName, productname, category, subcategory, price, imageURL, description, stock) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [offerCategory, imageName, productname, category, subcategory, price, imageURL, description, stock], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: results.insertId });
  });
});

// Listen on Catalyst environment port or local port
const listenPort = process.env.X_ZOHO_CATALYST_LISTEN_PORT || port;

app.listen(listenPort, () => {
  console.log(`Server running on port ${listenPort}`);
});
