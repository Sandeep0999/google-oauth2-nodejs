import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';

dotenv.config(); // ✅ Load environment variables

const app = express();

// ✅ Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// ✅ Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// ✅ Serialize and Deserialize user
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

// ✅ Passport Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
})); 

// ✅ Routes
app.get('/', (req, res) => {
    res.send(`
    <h1>Home</h1>
    <a href="/auth/google">Login With Google</a>
`);

});

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/',
        successRedirect: '/profile'
    })
);

app.get('/profile', (req, res) => {
    if (!req.user) {
        return res.redirect('/');
    }
    res.send(`
    <h1>Hello ${req.user.displayName}</h1>
`);

});

// ✅ Start server
app.listen(3000, () => {
    console.log('http://localhost:3000');
});