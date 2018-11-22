var express = require("express");
var DataStore = require("nedb");
var port = 3000;
var BASE_URL = "/api/v1";
var json = [{ name: "julio", phone: 21324 }];
var filename = __dirname + "/contactos.json";
var cors = require("cors");
var path = require('path');
const CONTACTS_APP_DIR = "/dist/contacts-app"; 

var db = new DataStore({
  filename: filename,
  autoload: true
});

console.log("Starting API server...");

var app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, CONTACTS_APP_DIR))); 
app.get('/', function(req, res) { 
res.sendFile(path.join(__dirname, CONTACTS_APP_DIR, '/index.html')); 
});

app.get(BASE_URL + "/", (req, res) => {
  res.sendFile(__dirname + "/" + "index.html");
});

app.get(BASE_URL + "/contacts", (req, res) => {
  db.find({}, (err, contacts) => {
    if (err) {
      console.error("Error accesing database");
      res.sendStatus(500);
    } else {
      res.send(
        contacts.map(contact => {
          delete contact._id;
          return contact;
        })
      );
    }
  });
  // res.send(json);
});

app.post(BASE_URL + "/contacts", (req, res) => {
  db.insert(req.body);
  /* json.push(req.body); */
  res.sendStatus(201);
});

app.delete(BASE_URL + "/contacts", (req, res) => {
  json = [];
  res.sendStatus(200);
});

app.get(BASE_URL + "/contacts/:name", (req, res) => {
  res.send(json[req.params.name]);
});

/* app.put(BASE_URL + "/contacts/:id", (req, res) => {
  res.sendStatus(200);
}); */

app.put(BASE_URL + "/contacts/:name", (req, res) => {
  // Update contact
  var name = req.params.name;
  var updatedContact = req.body;
  console.log(Date() + " - PUT /contacts/" + name);

  if (name != updatedContact.name) {
    res.sendStatus(409);
    return;
  }

  db.update({ name: name }, updatedContact, (err, numUpdated) => {
    if (err) {
      console.error("Error accesing DB");
      res.sendStatus(500);
    } else {
      if (numUpdated > 1) {
        console.warn("Incosistent DB: duplicated name");
      } else if (numUpdated == 0) {
        res.sendStatus(404);
      } else {
        res.sendStatus(200);
      }
    }
  });
});

app.listen(port);

console.log("Server ready!");
