const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const mysql = require("mysql");
const { readConfig } = require("../utils/configReader");

const config = readConfig();

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

const createDatabase = async (req, res) => {
  const { databaseName, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ??`;
  const useDatabaseQuery = `USE ??`;
  const createUserQuery = `
        CREATE TABLE IF NOT EXISTS res_users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL
        )
    `;

  db.query(createDatabaseQuery, [databaseName], (err) => {
    if (err) {
      console.error("Error creating database:", err);
      return res.status(500).send("Error creating database");
    }

    db.query(useDatabaseQuery, [databaseName], (err) => {
      if (err) {
        console.error("Error selecting database:", err);
        return res.status(500).send("Error selecting database");
      }

      db.query(createUserQuery, (err) => {
        if (err) {
          console.error("Error creating user table:", err);
          return res.status(500).send("Error creating user table");
        }

        const insertUserQuery =
          "INSERT INTO res_users (email, password) VALUES (?, ?)";
        db.query(insertUserQuery, [email, hashedPassword], (err) => {
          if (err) {
            console.error("Error inserting user:", err);
            return res.status(500).send("Error inserting user");
          }
          res.status(200).send("Database created and user added successfully");
        });
      });
    });
  });
};

const setMasterPassword = async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const configPath = path.join(__dirname, "../config/bmz.conf");
  const configContent = `admin_passwd = ${hashedPassword}\nport = ${config.port}\nmasterPassword = ${password}\n`;
  fs.writeFileSync(configPath, configContent, "utf8");

  return res.json({ message: "Master password set successfully" });
};

const changeMasterPassword = async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  const newHashedPassword = await bcrypt.hash(password, 10);
  const configPath = path.join(__dirname, "../config/bmz.conf");
  const configContent = `admin_passwd = ${newHashedPassword}\nport = ${config.port}\nmasterPassword = ${password}\n`;
  fs.writeFileSync(configPath, configContent, "utf8");

  return res.json({ message: "Master password changed successfully" });
};

const getMasterPassword = (req, res) => {
  const config = readConfig();
  if (config.admin_passwd && config.admin_passwd !== "") {
    return res.json({ hashedPassword: config.admin_passwd });
  }
  return res.json({ hashedPassword: "" });
};

const getPort = (req, res) => {
  res.json({ port: config.port });
};

module.exports = {
  createDatabase,
  setMasterPassword,
  changeMasterPassword,
  getMasterPassword,
  getPort,
};
