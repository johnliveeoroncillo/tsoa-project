// src/server.ts
import dotenv from 'dotenv';
import { app } from './app';
import './lib/prisma'; // Initialize global prisma instance
dotenv.config();

const port = process.env.PORT || 3000;

app.listen(port, () =>
    console.log(`Example app listening at http://localhost:${port}`),
);
