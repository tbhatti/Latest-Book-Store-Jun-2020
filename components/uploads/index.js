var connectionsPool = require('./db');

const express = require('express');// file upload 1
const fileUpload = require('express-fileupload'); // file upload 2
const app = express(); // file upload 3
const cors = require('cors');


app.use(express.json()) // middle ware to use request body parameters
app.use(cors())
app.use(fileUpload()); // // file upload 4


// Start file upload 5
app.post('/upload', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
  // The name of the input field (i.e. "uploadedFile") is used to retrieve the uploaded file
  let uploadedFile = req.files.myCV;
 
  // Use the mv() method to place the file somewhere on your server
  uploadedFile.mv('C:/Users/Tanzeem_Bhatti/uploaded-files/'+ uploadedFile.name, function(err) {
    if (err)
      return res.status(500).send(err);

      var extracted = extractor.extract('C:/Users/Tanzeem_Bhatti/uploaded-files/'+ uploadedFile.name);
      var regx = /(\d{3}-?\d{3}-?\d{7})/g;
      extracted.then(function(doc) {
        console.log('Phones==>',doc.getBody().match(regx), 'Email: ', findEmailAddresses(doc.getBody()) );
      });
 
    res.send('File uploaded!');
  });
});

// End file upload 6
