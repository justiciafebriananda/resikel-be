import express from "express";
import mysql from "mysql";
import cors from "cors";
import session from "express-session";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// const cors = require("cors");
// const session = require("express-session");

// Konfigurasi koneksi database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_resikel",
});

// Test koneksi database
db.connect((err) => {
  if (err) {
    console.error("Koneksi database gagal:", err.message);
    return;
  }
  console.log("Terhubung ke database MySQL");
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Untuk login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(query, [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.json({ message: "Login successful", user: results[0] });
  });
});

// Session
app.use(
  session({
    secret: "your-secret-key", // Ganti dengan kunci rahasia Anda
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Untuk pengembangan lokal, set ke false
  })
);

app.get("/tb_area_transaksi_wilayah", (req, res) => {
  const query = "SELECT * FROM tb_area_transaksi_wilayah";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.get("/tb_uom", (req, res) => {
  const query = "SELECT * FROM tb_uom";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Route untuk menambah data (POST)
app.post("/tb_uom", (req, res) => {
  const { nama_uom, satuan, faktor_konversi } = req.body;
  const query =
    "INSERT INTO tb_uom (nama_uom, satuan, faktor_konversi) VALUES (?, ?, ?)";
  db.query(query, [nama_uom, satuan, faktor_konversi], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res
      .status(201)
      .json({ message: "Data berhasil ditambahkan", id: results.insertId });
  });
});

// Route untuk mengupdate data (PUT)
app.put("/tb_uom/:id", (req, res) => {
  const { id } = req.params;
  const { nama_uom, satuan, faktor_konversi } = req.body;
  const query =
    "UPDATE tb_uom SET nama_uom = ?, satuan = ?, faktor_konversi = ? WHERE id = ?";
  db.query(query, [nama_uom, satuan, faktor_konversi, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Data tidak ditemukan" });
    }
    res.json({ message: "Data berhasil diupdate" });
  });
});

// Route untuk menghapus data (DELETE)
app.delete("/tb_uom/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM tb_uom WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Data tidak ditemukan" });
    }
    res.json({ message: "Data berhasil dihapus" });
  });
});

// Route untuk mengambil semua data tb_jenis_sampah
app.get("/tb_jenis_sampah", (req, res) => {
  const query = "SELECT * FROM tb_jenis_sampah";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Route untuk menambah data (POST)
app.post("/tb_jenis_sampah", (req, res) => {
  const { nama, kode, keterangan } = req.body;
  const query =
    "INSERT INTO tb_jenis_sampah (nama, kode, keterangan) VALUES (?, ?, ?)";
  db.query(query, [nama, kode, keterangan], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      message: "Data berhasil ditambahkan",
      id: results.insertId,
    });
  });
});

// Route untuk mengupdate data (PUT)
app.put("/tb_jenis_sampah/:id", (req, res) => {
  const { id } = req.params;
  const { nama, kode, keterangan } = req.body;
  const query =
    "UPDATE tb_jenis_sampah SET nama = ?, kode = ?, keterangan = ? WHERE id = ?";
  db.query(query, [nama, kode, keterangan, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Data tidak ditemukan" });
    }
    res.json({ message: "Data berhasil diupdate" });
  });
});

// Route untuk menghapus data (DELETE)
app.delete("/tb_jenis_sampah/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM tb_jenis_sampah WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Data tidak ditemukan" });
    }
    res.json({ message: "Data berhasil dihapus" });
  });
});

// Menghitung total count tabel jenis sampah
app.get("/tb_jenis_sampah/count", (req, res) => {
  const query = "SELECT COUNT(*) AS total FROM tb_jenis_sampah";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ total: results[0].total });
  });
});

// Tabel Users
// Get Count Users
app.get("/users/count", (req, res) => {
  const query = "SELECT COUNT(*) AS total FROM users";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ total: results[0].total });
  });
});

// Get Users
app.get("/users", (req, res) => {
  const query = "SELECT * FROM users";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Route untuk menambah data (POST)
app.post("/users", (req, res) => {
  const { nama, email, role, point, password } = req.body;
  const query =
    "INSERT INTO users (nama, email, role, point, password) VALUES (?, ?, ?, ?, ?)";
  db.query(query, [nama, email, role, point, password], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res
      .status(201)
      .json({ message: "Data berhasil ditambahkan", id: results.insertId });
  });
});

// Route untuk mengupdate data (PUT)
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { nama, email, role, point, password } = req.body;
  const query =
    "UPDATE users SET nama = ?, email = ?, role = ?, point = ?, password = ? WHERE id = ?";
  db.query(query, [nama, email, role, point, password, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Data tidak ditemukan" });
    }
    res.json({ message: "Data berhasil diupdate" });
  });
});

// Route untuk menghapus data (DELETE)
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM users WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Data tidak ditemukan" });
    }
    res.json({ message: "Data berhasil dihapus" });
  });
});

// Jalankan server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
