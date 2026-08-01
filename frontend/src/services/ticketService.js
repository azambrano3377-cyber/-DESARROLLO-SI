const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '');

if (!BASE_URL) {
  throw new Error(
    'No se configuró VITE_API_URL en el archivo .env'
  );
}

const API_URL = `${BASE_URL}/tickets`;

async function procesarRespuesta(respuesta) {
  let datos;

  try {
    datos = await respuesta.json();
  } catch {
    datos = null;
  }

  if (!respuesta.ok) {
    const mensaje =
      datos?.mensaje ||
      datos?.message ||
      'Ocurrió un error al comunicarse con el servidor';

    throw new Error(mensaje);
  }

  return datos;
}

/**
 * Obtiene todos los tickets.
 */
export async function obtenerTickets() {
  const respuesta = await fetch(API_URL, {
    method: 'GET'
  });

  return procesarRespuesta(respuesta);
}

/**
 * Obtiene un ticket por su identificador.
 */
export async function obtenerTicketPorId(id) {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: 'GET'
  });

  return procesarRespuesta(respuesta);
}

/**
 * Registra un nuevo ticket.
 */
export async function crearTicket(ticket) {
  const respuesta = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(ticket)
  });

  return procesarRespuesta(respuesta);
}

/**
 * Actualiza los datos de un ticket.
 */
export async function actualizarTicket(id, ticket) {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(ticket)
  });

  return procesarRespuesta(respuesta);
}

/**
 * Elimina un ticket.
 */
export async function eliminarTicket(id) {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });

  return procesarRespuesta(respuesta);
}