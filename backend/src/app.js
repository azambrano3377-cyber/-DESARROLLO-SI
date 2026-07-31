const express = require('express');
const cors = require('cors');

const ticketRoutes = require('./routes/ticket.routes');

const app = express();

/*
 * Permite recibir peticiones desde otras aplicaciones,
 * como el frontend desarrollado con React.
 */
app.use(cors());

/*
 * Permite interpretar datos enviados en formato JSON.
 */
app.use(express.json());

/*
 * Permite interpretar datos enviados desde formularios.
 */
app.use(
  express.urlencoded({
    extended: true
  })
);

/*
 * Ruta principal para comprobar que la API funciona.
 */
app.get('/', (req, res) => {
  res.status(200).json({
    mensaje: 'API del Sistema de Gestión de Incidentes funcionando'
  });
});

/*
 * Rutas correspondientes a los tickets.
 */
app.use('/tickets', ticketRoutes);

/*
 * Manejo de rutas que no existen.
 */
app.use((req, res) => {
  res.status(404).json({
    mensaje: 'La ruta solicitada no existe'
  });
});

/*
 * Manejo general de errores.
 */
app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    mensaje: 'Ocurrió un error interno en el servidor'
  });
});

module.exports = app;