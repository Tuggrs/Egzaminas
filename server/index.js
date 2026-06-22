const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "cumdrop",
  database: "addproduct",
});

app.post("/register", (req, res) => {
  const name = req.body.name;
  const price = req.body.price;
  const description = req.body.description;
  const category = req.body.category;
  const image = req.body.image;

  db.query(
    "INSERT INTO products (name, price, description, category, image) VALUES (?, ?, ?, ?, ?)",
    [name, price, description, category, image],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    },
  );
});

app.get("/users", (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/update", (req, res) => {
  const ID = req.body.ID;
  const name = req.body.name;
  const price = req.body.price;
  const description = req.body.description;
  const category = req.body.category;
  const image = req.body.image;

  db.query(
    "UPDATE products SET name = ?, price = ?, description = ?, category = ?, image = ? WHERE ID = ?",
    [name, price, description, category, image, ID],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    },
  );
});

app.delete("/delete/:ID", (req, res) => {
  const ID = req.params.ID;
  db.query("DELETE FROM products WHERE ID = ?", ID, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
