const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

// if (typeof localStorage === "undefined" || localStorage === null) {
//   var LocalStorage = require('node-localstorage').LocalStorage;
//   localStorage = new LocalStorage('./scratch');
// }

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

function appendToFile(filename, data) {
  fs.appendFileSync(filename, data + ' ');
}
function readFromFile(filename) {
  try {
    return fs.readFileSync(filename, 'utf8');
  } catch (err) {
    console.error("Error reading file:", err);
    return '';
  }
}

app.get('/login',(req,res,next)=>{
  res.send('<form action="/login" method="POST" ><input type="text" name="username" placeholder="username"/><button type="submit">Login</button></form>');
})

app.post('/login',(req,res,next)=>{
  console.log(req.body);
  // localStorage.setItem('username',req.body.username);
  res.send(`<script>localStorage.setItem('username', '${req.body.username}'); window.location.href = '/';</script>`);
  res.redirect('/');
})

app.get('/',(req,res,next)=>{
  const msg = readFromFile('chatmsg.txt');
  res.send(`<h1>${msg}</h1><form action="/" onsubmit="document.getElementById('username').value=localStorage.getItem('username')" method="POST" >
  <input type="text" name="message" placeholder="message"/>
  <input type="hidden" name="username" id="username"/>
  <button type="submit">Send Msg</button></form>`);
})

app.post('/',(req,res,next)=>{
  console.log(req.body);
  appendToFile('chatmsg.txt', `${req.body.username}: ${req.body.message}`);
  res.redirect('/')
})

app.use((req,res,next)=>{
  res.status(404).send('<h1>page not found !</h1>')
})

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});