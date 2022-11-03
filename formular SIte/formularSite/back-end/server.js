const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
const port = 8081;
app.listen(port, () => {
  console.log("Server online on: " + port);
});
app.use("/", express.static("../front-end"));
const connection = mysql.createConnection({
  host: "party-for-life.netlify.app",
  user: "root",
  password: "",
  database: "Participant",
});
connection.connect(function (err) {
  console.log("Connected to database!");
  const sql =
    "CREATE TABLE IF NOT EXISTS participant(nume VARCHAR(255), prenume  VARCHAR(255), telefon  VARCHAR(255) , email  VARCHAR(255),varsta VARCHAR (3), acord_parental VARCHAR(1))"; //intre paranteze campurile cu datele
  connection.query(sql, function (err, result) {
    if (err) throw err;
  });
});
app.post("/participant", (req, res) => {
  let participant = {
    nume: req.body.nume,
    prenume: req.body.prenume,
    telefon: req.body.telefon,
    email: req.body.email,
    varsta: req.body.varsta,
    acord_parental: req.body.acord_parental,
  };

  let error = [];
  //aici rezolvati cerintele (づ｡◕‿‿◕｡)づ
  //var acord_parental;
  if (participant.varsta < 18) participant.acord_parental = 1;
  else participant.acord_parental = 0;

  if (participant.nume.match("[A-Z]{1}[a-z]{1,}")) console.log("nume e bun");
  else error.push("numele cu litera mare");

  if (participant.prenume.match("\\b([A-Z][-,a-z ]+[ ]*)+"))
    console.log("prenume e bun");
  else error.push("prenume cu litera mare");

  if (participant.telefon.match("^(07)([0-9]{8})$"))
    console.log("telefon e bun");
  else error.push("numarul de telefon nu e bun, va rugam reincercati");

  if (participant.email.match("^\\w+([-+.]\\w+)*@(yahoo\\.com|gmail\\.com)"))
    console.log("Email bun");
  else
    error.push(
      "Mailul trebuie sa contina terminatiile gmail.com sau yahoo.com"
    );

  if (participant.varsta.match("^(?:[1-9][0-9]?|1[01][0-9]|120)$"))
    console.log("varsta e buna");
  else error.push("varsta trebuie introdusa cu numere (1-120)");

  if (error.length === 0) {
    const sql = `INSERT INTO participant (
      nume,
      prenume,
      telefon,
      email,
      varsta,
      acord_parental) VALUES (?,?,?,?,?,?)`;
    connection.query(
      sql,
      [
        participant.nume,
        participant.prenume,
        participant.telefon,
        participant.email,
        participant.varsta,
        participant.acord_parental,
      ],
      function (err, result) {
        if (err) {
          console.log(err);
          res.status(500).send({
            data: [
              "Adresa de email este deja folosit, va rugam folositi altul valid.",
            ],
          });
        } else {
          console.log("participant creat cu succes!");
          res.status(200).send({
            message: "participant creat cu succes",
          });
          console.log(sql);
        }
      }
    );
  } else {
    res.status(500).send(error);
    console.log("participantul nu a putut fi creat!");
  }
  app.use("/", express.static("../front-end"));
});
//modifica si din front la index.html
