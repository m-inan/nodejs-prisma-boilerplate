import express from 'express';
// import morgan from 'morgan'
import bodyParser from 'body-parser';
import compress from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import session from 'express-session';

import { refreshToken } from 'utils/auth';

import { SESSION_SECRET } from './constants';

/**
 * Express instance
 * @public
 */
const app = express();

// request logging. dev: console | production: file
// app.use(morgan())

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

// gzip compression
app.use(compress());

// secure apps by setting various HTTP headers
app.use(helmet());

// cookie parser
app.use(cookieParser());

// enable CORS - Cross Origin Resource Sharing
app.use(
	cors({
		credentials: true
	})
);

// saveUninitialized: true allows us to attach the socket id to the session

app.use(
	session({
		secret: SESSION_SECRET || '',
		resave: true,
		saveUninitialized: true
	})
);

// static files
app.use(express.static('static'));

// rest api routes
app.post('/refresh_token', refreshToken);

export default app;
