// netlify/functions/server.js
import serverless from 'serverless-http';
import app from '../../server/app.js';

export const handler = serverless(app);
