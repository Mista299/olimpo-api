// app.js
import express from 'express';
import { connectToDatabase } from './database.js';

const app = express();

connectToDatabase();


app.get('/', (req, res) => {
  res.send('Servidor Express con MongoDB funcionando');
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

export default app;
