import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';


const app = express();


const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://nxt-build-h7bg.vercel.app'
];
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const isAllowed = allowedOrigins.includes(origin) || 
      (origin.endsWith('.vercel.app') && origin.includes('nxt-build'));
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));


app.get('/', (req, res) => {
  res.json({ success: true, message: 'AI Web App Builder API is running smoothly!' });
});

app.use('/api', routes);


app.use(notFoundHandler);
app.use(errorHandler);


export default app;

