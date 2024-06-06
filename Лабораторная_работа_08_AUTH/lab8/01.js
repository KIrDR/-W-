const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();
const PORT = 3000;

const users = {
    kirill: { username: 'kirill', password: '1' }
};

passport.use(new LocalStrategy(
    (username, password, done) => {
        const user = users[username];
        if (!user || user.password !== password) {
            return done(null, false);
        }
        return done(null, user);
    }
));

passport.serializeUser((user, done) => {
    done(null, user.username);
});

passport.deserializeUser((username, done) => {
    const user = users[username];
    if (!user) {
        return done(new Error('User not found'));
    }
    done(null, user);
});


app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


app.get('/login', (req, res) => {
    res.send(`
    <head>
    <style>
    form {
      width: 300px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
      background-color: #f9f9f9;
    }
    input[type="text"],
    input[type="password"] {
      width: 100%;
      margin-bottom: 10px;
      padding: 10px;
      box-sizing: border-box; /* Учитываем padding внутри размеров элемента */
      border: 1px solid #ccc;
      border-radius: 3px;
    }
    button {
      width: 100%;
      padding: 10px;
      border: none;
      border-radius: 3px;
      background-color: #007bff; /* Цвет фона */
      color: #fff; /* Цвет текста */
      cursor: pointer;
    }
    button:hover {
      background-color: #0056b3; /* Измененный цвет фона */
    }
    input::placeholder {
      color: #999; /* Цвет текста подсказки */
    }
    </style> 
    </head>
    <form action="/login" method="post">
      <input type="text" name="username" placeholder="Username" required>
      <input type="password" name="password" placeholder="Password" required>
      <button type="submit">Login</button>
    </form>
  `);
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login'
}));

app.get('/logout', (req, res) => {
    req.logout(function(err) {
       console.log(err)
    });
    res.redirect('/login');
});

app.get('/profile', isAuthenticated, (req, res) => {
    res.send(`Authenticated User: ${req.user.username}`);
});

app.use((req, res) => {
    res.status(404).send('Not Found');
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
