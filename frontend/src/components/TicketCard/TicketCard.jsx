import {
  CalendarDays,
  Flag,
  MonitorSmartphone,
  Save,
  Trash2
} from 'lucide-react';

import './TicketCard.css';

function TicketCard({
  ticket,
  estadoSeleccionado,
  procesando,
  onCambiarEstado,
  onActualizar,
  onEliminar
}) {
  const obtenerClaseEstado = (estado) => {
    switch (estado) {
      case 'Abierto':
        return 'ticket-status ticket-status-open';

      case 'En Progreso':
        return 'ticket-status ticket-status-progress';

      case 'Cerrado':
        return 'ticket-status ticket-status-closed';

      default:
        return 'ticket-status';
    }
  };

  const obtenerClasePrioridad = (prioridad) => {
    switch (prioridad) {
      case 'Alta':
        return 'ticket-priority ticket-priority-high';

      case 'Media':
        return 'ticket-priority ticket-priority-medium';

      case 'Baja':
        return 'ticket-priority ticket-priority-low';

      default:
        return 'ticket-priority';
    }
  };

  return (
    <article className="ticket-card">
      <div className="ticket-card-header">
        <div className="ticket-card-title">
          <span className="ticket-id">
            Ticket #{ticket.id}
          </span>

          <h3>{ticket.titulo}</h3>
        </div>

        <span className={obtenerClaseEstado(ticket.estado)}>
          {ticket.estado}
        </span>
      </div>

      <p className="ticket-description">
        {ticket.descripcion}
      </p>

      <div className="ticket-information">
        <div>
          <MonitorSmartphone size={17} />
          <span>{ticket.categoria}</span>
        </div>

        <div>
          <Flag size={17} />

          <span className={obtenerClasePrioridad(ticket.prioridad)}>
            {ticket.prioridad}
          </span>
        </div>

        <div>
          <CalendarDays size={17} />
          <span>Incidente registrado</span>
        </div>
      </div>

      <div className="ticket-card-actions">
        <div className="ticket-status-control">
          <label htmlFor={`estado-${ticket.id}`}>
            Cambiar estado
          </label>

          <select
            id={`estado-${ticket.id}`}
            value={estadoSeleccionado}
            onChange={(event) =>
              onCambiarEstado(ticket.id, event.target.value)
            }
            disabled={procesando}
          >
            <option value="Abierto">Abierto</option>
            <option value="En Progreso">En Progreso</option>
            <option value="Cerrado">Cerrado</option>
          </select>
        </div>

        <div className="ticket-buttons">
          <button
            type="button"
            className="ticket-button ticket-button-update"
            onClick={() => onActualizar(ticket)}
            disabled={
              procesando ||
              estadoSeleccionado === ticket.estado
            }
          >
            <Save size={17} />
            Actualizar
          </button>

          <button
            type="button"
            className="ticket-button ticket-button-delete"
            onClick={() => onEliminar(ticket)}
            disabled={procesando}
          >
            <Trash2 size={17} />
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
}

export default TicketCard;