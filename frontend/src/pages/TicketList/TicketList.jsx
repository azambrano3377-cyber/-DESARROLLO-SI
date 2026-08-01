import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  LoaderCircle,
  RefreshCw,
  Search,
  TicketCheck
} from 'lucide-react';

import TicketCard from '../../components/TicketCard/TicketCard';

import {
  actualizarTicket,
  eliminarTicket,
  obtenerTickets
} from '../../services/ticketService';

import './TicketList.css';

function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [estadosEditados, setEstadosEditados] = useState({});

  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');

  const [cargando, setCargando] = useState(true);
  const [procesandoId, setProcesandoId] = useState(null);

  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');

  const cargarTickets = async () => {
    try {
      setCargando(true);
      setMensaje('');
      setTipoMensaje('');

      const respuesta = await obtenerTickets();

      const listaTickets = Array.isArray(respuesta)
        ? respuesta
        : respuesta.tickets || [];

      setTickets(listaTickets);

      const estadosIniciales = {};

      listaTickets.forEach((ticket) => {
        estadosIniciales[ticket.id] = ticket.estado;
      });

      setEstadosEditados(estadosIniciales);
    } catch (error) {
      setMensaje(error.message);
      setTipoMensaje('error');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarTickets();
  }, []);

  const ticketsFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const coincideBusqueda =
        !texto ||
        ticket.titulo.toLowerCase().includes(texto) ||
        ticket.descripcion.toLowerCase().includes(texto);

      const coincideEstado =
        !filtroEstado ||
        ticket.estado === filtroEstado;

      const coincideCategoria =
        !filtroCategoria ||
        ticket.categoria === filtroCategoria;

      return (
        coincideBusqueda &&
        coincideEstado &&
        coincideCategoria
      );
    });
  }, [
    tickets,
    busqueda,
    filtroEstado,
    filtroCategoria
  ]);

  const cambiarEstadoLocal = (id, nuevoEstado) => {
    setEstadosEditados((estadosActuales) => ({
      ...estadosActuales,
      [id]: nuevoEstado
    }));
  };

  const manejarActualizacion = async (ticket) => {
    const nuevoEstado =
      estadosEditados[ticket.id] || ticket.estado;

    if (nuevoEstado === ticket.estado) {
      return;
    }

    try {
      setProcesandoId(ticket.id);
      setMensaje('');
      setTipoMensaje('');

      const ticketActualizado = {
        titulo: ticket.titulo,
        descripcion: ticket.descripcion,
        categoria: ticket.categoria,
        prioridad: ticket.prioridad,
        estado: nuevoEstado
      };

      const respuesta = await actualizarTicket(
        ticket.id,
        ticketActualizado
      );

      const registroActualizado =
        respuesta.ticket || {
          ...ticket,
          estado: nuevoEstado
        };

      setTickets((ticketsActuales) =>
        ticketsActuales.map((ticketActual) =>
          ticketActual.id === ticket.id
            ? registroActualizado
            : ticketActual
        )
      );

      setEstadosEditados((estadosActuales) => ({
        ...estadosActuales,
        [ticket.id]: registroActualizado.estado
      }));

      setMensaje(
        respuesta.mensaje ||
        'El estado fue actualizado correctamente.'
      );
      setTipoMensaje('exito');
    } catch (error) {
      setMensaje(error.message);
      setTipoMensaje('error');
    } finally {
      setProcesandoId(null);
    }
  };

  const manejarEliminacion = async (ticket) => {
    const confirmado = window.confirm(
      `¿Está seguro de eliminar el ticket "${ticket.titulo}"?`
    );

    if (!confirmado) {
      return;
    }

    try {
      setProcesandoId(ticket.id);
      setMensaje('');
      setTipoMensaje('');

      const respuesta = await eliminarTicket(ticket.id);

      setTickets((ticketsActuales) =>
        ticketsActuales.filter(
          (ticketActual) => ticketActual.id !== ticket.id
        )
      );

      setEstadosEditados((estadosActuales) => {
        const nuevosEstados = { ...estadosActuales };
        delete nuevosEstados[ticket.id];
        return nuevosEstados;
      });

      setMensaje(
        respuesta.mensaje ||
        'Ticket eliminado correctamente.'
      );
      setTipoMensaje('exito');
    } catch (error) {
      setMensaje(error.message);
      setTipoMensaje('error');
    } finally {
      setProcesandoId(null);
    }
  };

  return (
    <section className="page-container">
      <header className="page-header ticket-list-header">
        <div>
          <span className="page-eyebrow">
            Gestión de registros
          </span>

          <h1>Listado de tickets</h1>

          <p>
            Consulta, filtra y administra los incidentes registrados en el
            sistema.
          </p>
        </div>

        <button
          type="button"
          className="refresh-button"
          onClick={cargarTickets}
          disabled={cargando}
        >
          <RefreshCw
            size={18}
            className={cargando ? 'icon-spinning' : ''}
          />

          Actualizar lista
        </button>
      </header>

      <div className="card ticket-toolbar">
        <div className="search-box">
          <Search size={19} />

          <input
            type="search"
            value={busqueda}
            onChange={(event) =>
              setBusqueda(event.target.value)
            }
            placeholder="Buscar por título o descripción"
          />
        </div>

        <select
          value={filtroEstado}
          onChange={(event) =>
            setFiltroEstado(event.target.value)
          }
        >
          <option value="">Todos los estados</option>
          <option value="Abierto">Abiertos</option>
          <option value="En Progreso">En progreso</option>
          <option value="Cerrado">Cerrados</option>
        </select>

        <select
          value={filtroCategoria}
          onChange={(event) =>
            setFiltroCategoria(event.target.value)
          }
        >
          <option value="">Todas las categorías</option>
          <option value="Red">Red</option>
          <option value="Hardware">Hardware</option>
          <option value="Software">Software</option>
        </select>
      </div>

      {mensaje && (
        <div
          className={`ticket-alert ${
            tipoMensaje === 'exito'
              ? 'ticket-alert-success'
              : 'ticket-alert-error'
          }`}
        >
          <AlertCircle size={19} />
          <span>{mensaje}</span>
        </div>
      )}

      {cargando ? (
        <div className="card tickets-loading">
          <LoaderCircle
            size={42}
            className="icon-spinning"
          />

          <h2>Cargando tickets</h2>

          <p>
            Espere mientras se consulta la información del servidor.
          </p>
        </div>
      ) : ticketsFiltrados.length === 0 ? (
        <div className="card tickets-empty">
          <TicketCheck size={48} />

          <h2>No existen tickets para mostrar</h2>

          <p>
            No se encontraron registros que coincidan con los filtros
            seleccionados.
          </p>
        </div>
      ) : (
        <>
          <div className="tickets-results">
            <span>
              {ticketsFiltrados.length}{' '}
              {ticketsFiltrados.length === 1
                ? 'ticket encontrado'
                : 'tickets encontrados'}
            </span>
          </div>

          <div className="tickets-grid">
            {ticketsFiltrados.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                estadoSeleccionado={
                  estadosEditados[ticket.id] || ticket.estado
                }
                procesando={procesandoId === ticket.id}
                onCambiarEstado={cambiarEstadoLocal}
                onActualizar={manejarActualizacion}
                onEliminar={manejarEliminacion}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default TicketList;