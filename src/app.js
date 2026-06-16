import express from 'express';
const app = express();

import session from 'express-session';

import dormRouter from '../routes/dorm.routes.js';
import adminRouter from '../routes/admin.routes.js';
import morgan from 'morgan';
import flashMiddleware from '../src/middlewares/flash.middleware.js';


// middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'my-secret-key',
    resave: false,
    saveUninitialized: false
}));
app.use(flashMiddleware);

// routes
app.use('/', dormRouter);
app.use('/admin', adminRouter);

// view engine
app.set('view engine', 'ejs');

// static
app.use(express.static('public'));

export default app;