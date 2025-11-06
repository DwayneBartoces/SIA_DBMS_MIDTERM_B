// Package Import

const express = require('express');
const mysql = require('mysql2');

// Server Setup
const app = express();
const port = 1234;

app.use(express.json());

// Database Setup
const database = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'user123',
  database: 'store_db_b',
});

database.connect((error) => {
  if (error) {
    console.error('DB connection failed:', error.message || error);
    // Exit process if DB is required for the app to run
    process.exit(1);
  }
  console.log('DB Connected!');
});

// GET all users
app.get('/users', (req, res) => {
  database.query('SELECT * FROM USERS', (error, results) => {
    if (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ error: 'Database error' });
    }
    return res.json(results);
  });
});

// GET user by id (path param)
app.get('/user/:user_id', (req, res) => {
  const userId = req.params.user_id;
  // Use parameterized query to avoid SQL injection
  database.query('SELECT * FROM USERS WHERE id = ?', [userId], (error, results) => {
    if (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!results || results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(results[0]);
  });
});

// --- Products endpoints ---
// GET all products
app.get('/products', (req, res) => {
  database.query('SELECT * FROM products', (error, results) => {
    if (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({ error: 'Database error' });
    }
    return res.json(results);
  });
});

// GET product by id
app.get('/products/:product_id', (req, res) => {
  const id = req.params.product_id;
  database.query('SELECT * FROM products WHERE product_id = ?', [id], (error, results) => {
    if (error) {
      console.error('Error fetching product:', error);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!results || results.length === 0) return res.status(404).json({ error: 'Product not found' });
    return res.json(results[0]);
  });
});

// --- Categories endpoints ---
app.get('/categories', (req, res) => {
  database.query('SELECT * FROM categories', (error, results) => {
    if (error) {
      console.error('Error fetching categories:', error);
      return res.status(500).json({ error: 'Database error' });
    }
    return res.json(results);
  });
});

// --- Suppliers endpoints ---
app.get('/suppliers', (req, res) => {
  database.query('SELECT * FROM suppliers', (error, results) => {
    if (error) {
      console.error('Error fetching suppliers:', error);
      return res.status(500).json({ error: 'Database error' });
    }
    return res.json(results);
  });
});

// --- New API endpoints requested ---

// Endpoint 1: Get All Products
// GET /api/products
app.get('/api/products', (req, res) => {
  database.query('SELECT * FROM products', (error, results) => {
    if (error) {
      console.error('Error fetching products (api):', error);
      return res.status(500).json({ error: 'Database error' });
    }
    return res.status(200).json(results);
  });
});

// Endpoint 2: Get Products by Price Range
// GET /api/products/search?minPrice=50&maxPrice=100
app.get('/api/products/search', (req, res) => {
  const min = parseFloat(req.query.minPrice);
  const max = parseFloat(req.query.maxPrice);
  if (Number.isNaN(min) || Number.isNaN(max)) {
    return res.status(400).json({ error: 'minPrice and maxPrice must be valid numbers' });
  }
  const sql = 'SELECT * FROM products WHERE price BETWEEN ? AND ?';
  database.query(sql, [min, max], (error, results) => {
    if (error) {
      console.error('Error fetching products by price range:', error);
      return res.status(500).json({ error: 'Database error' });
    }
    return res.status(200).json(results);
  });
});

// Endpoint 3: Search Products by Name (case-insensitive)
// GET /api/products/find?name=Laptop
app.get('/api/products/find', (req, res) => {
  const name = req.query.name;
  if (!name) return res.status(400).json({ error: 'name query parameter is required' });
  // Use LOWER on both sides for case-insensitive search
  const sql = 'SELECT * FROM products WHERE LOWER(product_name) LIKE ?';
  const like = `%${name.toLowerCase()}%`;
  database.query(sql, [like], (error, results) => {
    if (error) {
      console.error('Error searching products by name:', error);
      return res.status(500).json({ error: 'Database error' });
    }
    return res.status(200).json(results);
  });
});

// Endpoint 4: Get Products with Category Information (INNER JOIN)
// GET /api/products/details
app.get('/api/products/details', (req, res) => {
  const sql = `
    SELECT p.product_id, p.product_name, p.price, c.category_name
    FROM products p
    INNER JOIN categories c ON p.category_id = c.category_id
  `;
  database.query(sql, (error, results) => {
    if (error) {
      console.error('Error fetching product details:', error);
      return res.status(500).json({ error: 'Database error' });
    }
    return res.status(200).json(results);
  });
});

// Endpoint 5: Get All Suppliers and Their Products (LEFT JOIN)
// GET /api/suppliers/products
app.get('/api/suppliers/products', (req, res) => {
  const sql = `
    SELECT s.supplier_id, s.supplier_name, p.product_name
    FROM suppliers s
    LEFT JOIN products p ON s.supplier_id = p.supplier_id
    ORDER BY s.supplier_id
  `;
  database.query(sql, (error, results) => {
    if (error) {
      console.error('Error fetching suppliers with products:', error);
      return res.status(500).json({ error: 'Database error' });
    }
    return res.status(200).json(results);
  });
});

//Path param
app.get ('/user/:user_id',(req,res) => {
    console.log(req);
});
