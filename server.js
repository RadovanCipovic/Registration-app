const bodyParser = require("body-parser");
const express = require("express");
const mysql = require("mysql");
const server = express();

// **** Express Middleware ****
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
//

// **** LOGIN BAZA I PODACI BAZE ZA LOGIN ****

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "thuglife22",
  database: "registracija",
});
//

// ******* BAZA PODATAKA POVEZIVANJE *********

db.connect(function (error) {
  if (error) {
    console.log("DOSLO JE DO GRESKE 🔴");
  } else {
    console.log("DB BAZA PODATAKA POVEZANA 🟢");
  }
});
//

// SLUSANJE PORTA
server.listen(8080, function check(error) {
  if (error) {
    console.log("Error... !!! ⛔️");
  } else {
    console.log("Slusam na port 8080 ✅.... !!!");
  }
});
//

// ****** Dodavanje studenta (usera) ******
server.post("/api/student/add", (req, res) => {
  let details = {
    stname: req.body.stname,
    course: req.body.course,
    fee: req.body.fee,
  };

  let sql = "INSERT INTO student SET ?";

  db.query(sql, details, (error) => {
    if (error) {
      res.send({ status: false, message: "Dodavanje korisnika neuspjesno" });
    } else {
      res.send({ status: true, message: "Dodavanje korisnika je USPJESNO ✅" });
    }
  });
});
//

//
// ******* Pregled registrovanih korisnika ********
server.get("/api/student", (req, res) => {
  const sql = "SELECT * FROM student";
  db.query(sql, function (error, result) {
    if (error) {
      console.log("Error Connecting to DB 🚫");
    } else {
      res.send({
        status: true,
        message: "Registrovani korisnici...",
        data: result,
      });
    }
  });
});
//

//
// ****** Pretraga korisnika *******
server.get("/api/student/:id", (req, res) => {
  const studentid = req.params.id;
  const sql = "SELECT * FROM student WHERE id=" + studentid;
  db.query(sql, function (error, result) {
    if (error) {
      res.send("Error Connecting to DB 🚫");
    } else {
      res.send({
        status: true,
        message: "Korisnik kojeg trazite... 🔎",
        data: result,
      });
    }
  });
});
//

//
// ******** Nadogradnja korisnika ********

server.put("/api/student/:id", (req, res) => {
  let sql =
    "UPDATE student  SET stname=' " +
    req.body.stname +
    "', course='" +
    req.body.course +
    "',fee=' " +
    req.body.fee +
    "' WHERE id=" +
    req.params.id;

  let query = db.query(sql, (error, result) => {
    if (error) {
      res.send({
        status: false,
        message: "Neuspjesno azuriranje korisnika ⛔️",
      });
    } else {
      res.send({ status: true, message: "Uspjesno azuriran korisnik ✅" });
    }
  });
});
