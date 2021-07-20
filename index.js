
const express = require('express'); 
const data = require('./data');
const crypto = require('crypto');

const app = express();

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', express.static('./'));

app.set('view engine', 'ejs');

const users = data.users;

const schedules = data.schedules;

// GET REQUESTS

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/users', (req, res) => {
  res.render('users', {users: users});
});

app.get('/users/new', (req, res) => {
  res.render('newUserForm');
});

app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  const singleUser = users[userId];
  if (singleUser === undefined) {
    res.status(404).send(`Incorrect user id: ${userId}`);
  } 
  res.render('singleUser', {users: users, userId: userId});
});

app.get('/schedules', (req, res) => {
  res.render('schedules', {schedules: schedules});
});

app.get('/schedules/new', (req, res) => {
  res.render('newScheduleForm', {users: users});
});

app.get('/users/:id/schedules', (req, res) => {
  const userId = req.params.id;
  const userSchedule = [];
  for (let i = 0; i < schedules.length; i++) {
    if (schedules[i].user_id === Number(userId)) {
      userSchedule.push(schedules[i]);
    }
  }
  res.render('singleUserSchedule', {userSchedule: userSchedule, userId: userId});
});

// POST REQUESTS

app.post('/users', (req, res) => {
  if (req.body.password !== req.body.password2) {
    res.send("Passwords don't match. Please enter the same password in both password fields");
  } else {
    const newUser = req.body;
    req.body.password = crypto.createHash('sha256').update(req.body.password).digest('hex');
    users.push(newUser);
    res.redirect('users');
  }
});

app.post('/schedules', (req, res) => {
  const newSchedule = req.body;
  newSchedule.user_id = Number(newSchedule.user_id)
  newSchedule.day = Number(newSchedule.day)
  schedules.push(newSchedule);
  res.redirect('schedules');
});
