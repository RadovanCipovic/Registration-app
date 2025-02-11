const bodyParser = require("body-parser");
const express = require("express");
const mysql = require("mysql");
const server = express();
const cors = require("cors");

// **** Express Middleware ****
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(cors());
//

// **** LOGIN BAZA I PODACI BAZE ZA LOGIN ****

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "pass123",
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

// ******* Pregled registrovanih korisnika ********
server.get("/api/student", (req, res) => {
  const sql = "SELECT * FROM student";
  db.query(sql, function (error, result) {
    if (error) {
      console.log("Greška u povezivanju sa Bazom podataka 🚫");
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
      res.send("Greška u povezivanju sa Bazom podataka 🚫");
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
// ******** Azuriranje korisnika ********

server.put("/api/student/update/:id", (req, res) => {
  let sql =
    "UPDATE student  SET stname=' " +
    req.body.stname +
    "', course='" +
    req.body.course +
    "',fee=' " +
    req.body.fee +
    "' WHERE id=" +
    req.params.id;

  let a = db.query(sql, (error, result) => {
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
//

//
// ************* BRISANJE KORISNIKA 🚫 ********* // stari <--------
// server.delete("/api/student/delete/:id", (req, res) => {
//   let sql = "DELETE FROM student WHERE id=" + req.params.id + "";
//   let query = db.query(sql, (error) => {
//     if (error) {
//       res.send({
//         status: false,
//         message: "Brisanje korisnika nije uspjelo ⛔️",
//       });
//     } else {
//       res.send({ status: true, message: "Brisanje korisnika uspjesno... ✅" });
//     }
//   });
// });

// ************* BRISANJE KORISNIKA + resetovanje id-a 🚫 *********
server.delete("/api/student/delete/:id", (req, res) => {
  let studentId = req.params.id;

  // Brisanje korisnika
  let sql = "DELETE FROM student WHERE id = ?";
  db.query(sql, studentId, (error) => {
    if (error) {
      res.send({
        status: false,
        message: "Brisanje korisnika nije uspjelo ⛔️",
      });
    } else {
      // Resetovanje id-a korisnika
      db.query(
        "SELECT MAX(id) AS max_id FROM registracija.student",
        (error, results) => {
          if (error) {
            res.send({
              status: false,
              message: "Greška pri dobijanju maksimalnog ID-a",
            });
          } else {
            const sledeciId = results[0].max_id + 1;
            db.query(
              `ALTER TABLE registracija.student AUTO_INCREMENT = ${sledeciId}`,
              (error) => {
                if (error) {
                  res.send({
                    status: false,
                    message: "Greška pri resetovanju AUTO_INCREMENT brojača",
                  });
                } else {
                  res.send({
                    status: true,
                    message: "Brisanje korisnika uspjesno... ✅",
                  });
                }
              }
            );
          }
        }
      );
    }
  });
});
