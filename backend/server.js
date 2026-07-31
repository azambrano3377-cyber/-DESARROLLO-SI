require('dotenv').config();

const app = require('./src/app');
const pool = require('./src/config/database');

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
  try {
    await pool.query('SELECT NOW()');

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(
      'No se pudo establecer conexión con PostgreSQL:',
      error.message
    );

    process.exit(1);
  }
}

iniciarServidor();