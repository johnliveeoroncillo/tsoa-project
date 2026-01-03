// src/server.ts
// Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
dotenv.config();

import { app } from './app';
import './lib/prisma'; // Initialize global prisma instance

const port = process.env.PORT || 3000;

app.listen(port, () =>
    console.log(`Example app listening at http://localhost:${port}`),
);
