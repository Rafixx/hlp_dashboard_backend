import { Router } from "express";
// import express from 'express';
import axios from 'axios';

// const router = express.Router();
const router = Router();

router.get('/garbi/:file', async (req, res) => {
  const { file } = req.params;
  const baseUrl = process.env.GARBI_URL;
  const auth = {
    username: process.env.GARBI_USER!,
    password: process.env.GARBI_PASSWORD!
  };
  // console.log(`Accediendo a Garbi: ${baseUrl}${file}`);
  try {
    const response = await axios.get(
      `${baseUrl}${file}`,
      {
        auth,
        responseType: 'text'
      }
    );

    res.set('Content-Type', 'text/plain');
    res.send(response.data);

  } catch (error: any) {
    console.error('Error al acceder a Garbi', error);
    res.status(500).send('Error al acceder a Garbi');
  }
});

export  { router as perRoutes };
