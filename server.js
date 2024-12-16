import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import bodyParser from "body-parser";
import mysql from "mysql";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const readConfig = () => {
  const configPath = path.join(__dirname, "config", "bmz.conf");
  if (fs.existsSync(configPath)) {
    const content = fs.readFileSync(configPath, "utf8");
    const config = {};
    content.split("\n").forEach((line) => {
      const match = line.match(/(.*) = (.*)/);
      if (match) {
        config[match[1].trim()] = match[2].trim();
      }
    });
    return config;
  }
  return {};
};

const app = express();
const config = readConfig();
const PORT = config.port || 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

app.post("/create-database", async (req, res) => {
  const { databaseName, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ??`;
  const useDatabaseQuery = `USE ??`;
  const createUserTableQuery = `
      CREATE TABLE IF NOT EXISTS res_users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL
      )
  `;
  const insertUserQuery = `INSERT INTO res_users (email, password) VALUES (?, ?)`;

  db.query(createDatabaseQuery, [databaseName], (err) => {
    if (err) {
      console.error("Error creating database:", err);
      return res.status(500).send("Error creating database");
    }

    db.query(useDatabaseQuery, [databaseName], (err) => {
      if (err) return res.status(500).send("Error selecting database");

      db.query(createUserTableQuery, (err) => {
        if (err) return res.status(500).send("Error creating user table");

        db.query(insertUserQuery, [email, hashedPassword], (err) => {
          if (err) return res.status(500).send("Error inserting user");
          res.send({ message: "Database and user created successfully!" });
        });
      });
    });
  });
});

app.post("/api/set-master-password", async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const configPath = path.join(__dirname, "config", "bmz.conf");
  const configContent = `admin_passwd = ${hashedPassword}\nport = ${PORT}\n`;
  fs.writeFileSync(configPath, configContent, "utf8");

  return res.json({ message: "Master password set successfully" });
});

app.get("/api/get-master-password", (req, res) => {
  const config = readConfig();
  if (config.admin_passwd && config.admin_passwd !== "") {
    return res.json({ hashedPassword: config.admin_passwd });
  }
  return res.json({ hashedPassword: "" });
});

app.get("/api/get-port", (req, res) => {
  return res.json({ port: PORT });
});

app.post("/api/change-master-password", async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  const newHashedPassword = await bcrypt.hash(password, 10);
  const configPath = path.join(__dirname, "config", "bmz.conf");
  const configContent = `admin_passwd = ${newHashedPassword}\nport = ${PORT}\n`;
  fs.writeFileSync(configPath, configContent, "utf8");

  return res.json({ message: "Master password changed successfully" });
});

app.post("/login", async (req, res) => {
  const { databaseName, email, password } = req.body;

  db.query(`USE ??`, [databaseName], (err) => {
    if (err)
      return res.status(500).send({ message: "Error selecting database" });

    db.query(
      `SELECT * FROM res_users WHERE email = ?`,
      [email],
      async (err, results) => {
        if (err || results.length === 0)
          return res.status(401).send({ message: "User not found" });

        const user = results[0];
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {
          res.send({ message: "Login successful!" });
        } else {
          res.status(401).send({ message: "Incorrect password" });
        }
      }
    );
  });
});

// Endpoint untuk mendapatkan daftar database
app.get("/api/databases", (req, res) => {
  db.query("SHOW DATABASES", (err, results) => {
    if (err) {
      console.error("Error retrieving databases:", err);
      return res.status(500).send("Error retrieving databases");
    }

    const databases = results.map((row) => row.Database);
    res.json(databases); // Mengirimkan daftar database dalam format JSON
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
