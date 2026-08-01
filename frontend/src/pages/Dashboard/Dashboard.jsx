import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  Tickets
} from 'lucide-react';

import StatCard from '../../components/StatCard/StatCard';
import { obtenerTickets } from '../../services/ticketService';
import './Dashboard.css';

function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarTickets = async () => {
      try {
        setCargando(true);
        setError('');

        const respuesta = await obtenerTickets();

        const listaTickets = Array.isArray(respuesta)
          ? respuesta
          : respuesta.tickets || [];

        setTickets(listaTickets);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    };

    cargarTickets();
  }, []);

  const estadisticasCalculadas = useMemo(() => {
    return {
      total: tickets.length,

      abiertos: tickets.filter(
        (ticket) => ticket.estado === 'Abierto'
      ).length,

      enProgreso: tickets.filter(
        (ticket) => ticket.estado === 'En Progreso'
      ).length,

      cerrados: tickets.filter(
        (ticket) => ticket.estado === 'Cerrado'
      ).length,

      red: tickets.filter(
        (ticket) => ticket.categoria === 'Red'
      ).length,

      hardware: tickets.filter(
        (ticket) => ticket.categoria === 'Hardware'
      ).length,

      software: tickets.filter(
        (ticket) => ticket.categoria === 'Software'
      ).length
    };
  }, [tickets]);

  const estadisticas = [
    {
      titulo: 'Total de tickets',
      valor: estadisticasCalculadas.total,
      descripcion: 'Incidentes registrados',
      icono: Tickets
    },
    {
      titulo: 'Abiertos',
      valor: estadisticasCalculadas.abiertos,
      descripcion: 'Pendientes de atención',
      icono: AlertTriangle
    },
    {
      titulo: 'En progreso',
      valor: estadisticasCalculadas.enProgreso,
      descripcion: 'Actualmente atendidos',
      icono: Clock3
    },
    {
      titulo: 'Cerrados',
      valor: estadisticasCalculadas.cerrados,
      descripcion: 'Incidentes solucionados',
      icono: CheckCircle2
    }
  ];

  const ticketsRecientes = tickets.slice(0, 3);

  if (cargando) {
    return (
      <section className="page-container">
        <div className="card dashboard-loading">
          <LoaderCircle
            size={42}
            className="dashboard-spinner"
          />

          <h2>Cargando dashboard</h2>

          <p>
            Espere mientras se consultan los tickets registrados.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="page-container">
      <header className="page-header dashboard-header">
        <div>
          <span className="page-eyebrow">Panel general</span>

          <h1>Dashboard de incidentes</h1>

          <p>
            Consulta el estado general de los tickets reportados dentro del
            sistema de soporte técnico.
          </p>
        </div>
      </header>

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      <div className="stats-grid">
        {estadisticas.map((estadistica) => (
          <StatCard
            key={estadistica.titulo}
            {...estadistica}
          />
        ))}
      </div>

      <div className="dashboard-grid">
        <article className="card dashboard-panel">
          <div className="panel-header">
            <div>
              <h2>Actividad reciente</h2>
              <p>Últimos incidentes registrados en el sistema.</p>
            </div>
          </div>

          {ticketsRecientes.length === 0 ? (
            <div className="empty-state">
              <Tickets size={42} />

              <h3>No existen tickets registrados</h3>

              <p>
                Los incidentes más recientes aparecerán en esta sección.
              </p>
            </div>
          ) : (
            <div className="recent-tickets">
              {ticketsRecientes.map((ticket) => (
                <div
                  className="recent-ticket-item"
                  key={ticket.id}
                >
                  <div>
                    <span>Ticket #{ticket.id}</span>
                    <h3>{ticket.titulo}</h3>
                    <p>{ticket.categoria}</p>
                  </div>

                  <strong
                    className={`recent-status ${
                      ticket.estado === 'Abierto'
                        ? 'recent-status-open'
                        : ticket.estado === 'En Progreso'
                          ? 'recent-status-progress'
                          : 'recent-status-closed'
                    }`}
                  >
                    {ticket.estado}
                  </strong>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="card dashboard-panel">
          <div className="panel-header">
            <div>
              <h2>Resumen operativo</h2>
              <p>Distribución actual de los incidentes.</p>
            </div>
          </div>

          <div className="summary-list">
            <div>
              <span>Incidentes de red</span>
              <strong>{estadisticasCalculadas.red}</strong>
            </div>

            <div>
              <span>Problemas de hardware</span>
              <strong>{estadisticasCalculadas.hardware}</strong>
            </div>

            <div>
              <span>Problemas de software</span>
              <strong>{estadisticasCalculadas.software}</strong>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

export default Dashboard;