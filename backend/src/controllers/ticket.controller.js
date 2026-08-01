const pool = require('../config/database');

const xss = require('xss');

const categoriasPermitidas = ['Red', 'Hardware', 'Software'];
const prioridadesPermitidas = ['Alta', 'Media', 'Baja'];
const estadosPermitidos = ['Abierto', 'En Progreso', 'Cerrado'];

function sanitizarTexto(texto) {
  return xss(texto.trim());
}

/**
 * GET /tickets
 * Obtiene todos los tickets registrados.
 */
const obtenerTickets = async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT * FROM tickets ORDER BY id DESC'
    );

    return res.status(200).json({
      mensaje: 'Tickets obtenidos correctamente',
      cantidad: resultado.rowCount,
      tickets: resultado.rows
    });
  } catch (error) {
    console.error('Error al obtener tickets:', error);

    return res.status(500).json({
      mensaje: 'Error interno al obtener los tickets'
    });
  }
};

/**
 * GET /tickets/:id
 * Obtiene un ticket específico por su ID.
 */
const obtenerTicketPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        mensaje: 'El ID del ticket debe ser un número entero válido'
      });
    }

    const resultado = await pool.query(
      'SELECT * FROM tickets WHERE id = $1',
      [id]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({
        mensaje: `No se encontró un ticket con el ID ${id}`
      });
    }

    return res.status(200).json({
      mensaje: 'Ticket obtenido correctamente',
      ticket: resultado.rows[0]
    });
  } catch (error) {
    console.error('Error al obtener el ticket:', error);

    return res.status(500).json({
      mensaje: 'Error interno al obtener el ticket'
    });
  }
};

/**
 * POST /tickets
 * Registra un nuevo ticket.
 */
const crearTicket = async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      categoria,
      prioridad,
      estado = 'Abierto'
    } = req.body;

    if (!titulo || !descripcion || !categoria || !prioridad) {
      return res.status(400).json({
        mensaje:
          'Los campos titulo, descripcion, categoria y prioridad son obligatorios'
      });
    }

    if (!categoriasPermitidas.includes(categoria)) {
      return res.status(400).json({
        mensaje: 'La categoría debe ser Red, Hardware o Software'
      });
    }

    if (!prioridadesPermitidas.includes(prioridad)) {
      return res.status(400).json({
        mensaje: 'La prioridad debe ser Alta, Media o Baja'
      });
    }

    if (!estadosPermitidos.includes(estado)) {
      return res.status(400).json({
        mensaje: 'El estado debe ser Abierto, En Progreso o Cerrado'
      });
    }

    const resultado = await pool.query(
      `INSERT INTO tickets
        (titulo, descripcion, categoria, prioridad, estado)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        sanitizarTexto(titulo),
        sanitizarTexto(descripcion),
        categoria,
        prioridad,
        estado
      ]
    );

    return res.status(201).json({
      mensaje: 'Ticket registrado correctamente',
      ticket: resultado.rows[0]
    });
  } catch (error) {
    console.error('Error al crear el ticket:', error);

    return res.status(500).json({
      mensaje: 'Error interno al registrar el ticket'
    });
  }
};

/**
 * PUT /tickets/:id
 * Actualiza todos o algunos datos de un ticket.
 */
const actualizarTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      titulo,
      descripcion,
      categoria,
      prioridad,
      estado
    } = req.body;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        mensaje: 'El ID del ticket debe ser un número entero válido'
      });
    }

    if (
      !titulo ||
      !descripcion ||
      !categoria ||
      !prioridad ||
      !estado
    ) {
      return res.status(400).json({
        mensaje:
          'Todos los campos son obligatorios para actualizar el ticket'
      });
    }

    if (!categoriasPermitidas.includes(categoria)) {
      return res.status(400).json({
        mensaje: 'La categoría debe ser Red, Hardware o Software'
      });
    }

    if (!prioridadesPermitidas.includes(prioridad)) {
      return res.status(400).json({
        mensaje: 'La prioridad debe ser Alta, Media o Baja'
      });
    }

    if (!estadosPermitidos.includes(estado)) {
      return res.status(400).json({
        mensaje: 'El estado debe ser Abierto, En Progreso o Cerrado'
      });
    }

    const resultado = await pool.query(
      `UPDATE tickets
       SET titulo = $1,
           descripcion = $2,
           categoria = $3,
           prioridad = $4,
           estado = $5
       WHERE id = $6
       RETURNING *`,
      [
        sanitizarTexto(titulo),
        sanitizarTexto(descripcion),
        categoria,
        prioridad,
        estado,
        id
      ]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({
        mensaje: `No se encontró un ticket con el ID ${id}`
      });
    }

    return res.status(200).json({
      mensaje: 'Ticket actualizado correctamente',
      ticket: resultado.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar el ticket:', error);

    return res.status(500).json({
      mensaje: 'Error interno al actualizar el ticket'
    });
  }
};

/**
 * DELETE /tickets/:id
 * Elimina un ticket por su ID.
 */
const eliminarTicket = async (req, res) => {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        mensaje: 'El ID del ticket debe ser un número entero válido'
      });
    }

    const resultado = await pool.query(
      'DELETE FROM tickets WHERE id = $1 RETURNING *',
      [id]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({
        mensaje: `No se encontró un ticket con el ID ${id}`
      });
    }

    return res.status(200).json({
      mensaje: 'Ticket eliminado correctamente',
      ticketEliminado: resultado.rows[0]
    });
  } catch (error) {
    console.error('Error al eliminar el ticket:', error);

    return res.status(500).json({
      mensaje: 'Error interno al eliminar el ticket'
    });
  }
};

module.exports = {
  obtenerTickets,
  obtenerTicketPorId,
  crearTicket,
  actualizarTicket,
  eliminarTicket
};