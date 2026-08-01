import { useState } from 'react';
import { Save, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { crearTicket } from '../../services/ticketService';
import './ReportarTicket.css';

const formularioInicial = {
  titulo: '',
  descripcion: '',
  categoria: '',
  prioridad: '',
  estado: 'Abierto'
};

function ReportarTicket() {
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState(formularioInicial);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [guardando, setGuardando] = useState(false);

  const manejarCambio = (event) => {
    const { name, value } = event.target;

    setFormulario((datosActuales) => ({
      ...datosActuales,
      [name]: value
    }));

    setMensaje('');
    setTipoMensaje('');
  };

  const validarFormulario = () => {
    if (!formulario.titulo.trim()) {
      return 'Ingrese el título del incidente.';
    }

    if (!formulario.descripcion.trim()) {
      return 'Ingrese la descripción del incidente.';
    }

    if (!formulario.categoria) {
      return 'Seleccione una categoría.';
    }

    if (!formulario.prioridad) {
      return 'Seleccione una prioridad.';
    }

    return null;
  };

  const manejarEnvio = async (event) => {
    event.preventDefault();

    const errorValidacion = validarFormulario();

    if (errorValidacion) {
      setMensaje(errorValidacion);
      setTipoMensaje('error');
      return;
    }

    try {
      setGuardando(true);
      setMensaje('');
      setTipoMensaje('');

      const nuevoTicket = {
        titulo: formulario.titulo.trim(),
        descripcion: formulario.descripcion.trim(),
        categoria: formulario.categoria,
        prioridad: formulario.prioridad,
        estado: formulario.estado
      };

      const respuesta = await crearTicket(nuevoTicket);

      setFormulario(formularioInicial);
      setMensaje(
        respuesta.mensaje || 'Ticket registrado correctamente.'
      );
      setTipoMensaje('exito');

      setTimeout(() => {
        navigate('/tickets');
      }, 1200);
    } catch (error) {
      setMensaje(error.message);
      setTipoMensaje('error');
    } finally {
      setGuardando(false);
    }
  };

  const limpiarFormulario = () => {
    setFormulario(formularioInicial);
    setMensaje('');
    setTipoMensaje('');
  };

  return (
    <section className="page-container">
      <header className="page-header">
        <span className="page-eyebrow">Nuevo registro</span>

        <h1>Registrar incidente</h1>

        <p>
          Complete la información necesaria para generar un nuevo ticket de
          soporte técnico.
        </p>
      </header>

      <div className="ticket-form-layout">
        <form
          className="card ticket-form"
          onSubmit={manejarEnvio}
        >
          <div className="form-section-title">
            <div className="form-section-icon">
              <Save size={22} />
            </div>

            <div>
              <h2>Información del incidente</h2>
              <p>Los campos marcados son obligatorios.</p>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="titulo">
              Título del incidente *
            </label>

            <input
              id="titulo"
              name="titulo"
              type="text"
              maxLength="100"
              value={formulario.titulo}
              onChange={manejarCambio}
              placeholder="Ej. Equipo sin conexión a Internet"
              disabled={guardando}
            />
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">
              Descripción *
            </label>

            <textarea
              id="descripcion"
              name="descripcion"
              rows="6"
              value={formulario.descripcion}
              onChange={manejarCambio}
              placeholder="Describa detalladamente el problema presentado"
              disabled={guardando}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="categoria">
                Categoría *
              </label>

              <select
                id="categoria"
                name="categoria"
                value={formulario.categoria}
                onChange={manejarCambio}
                disabled={guardando}
              >
                <option value="">
                  Seleccione una categoría
                </option>

                <option value="Red">Red</option>
                <option value="Hardware">Hardware</option>
                <option value="Software">Software</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="prioridad">
                Prioridad *
              </label>

              <select
                id="prioridad"
                name="prioridad"
                value={formulario.prioridad}
                onChange={manejarCambio}
                disabled={guardando}
              >
                <option value="">
                  Seleccione una prioridad
                </option>

                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
          </div>

          {mensaje && (
            <p
              className={`form-message ${
                tipoMensaje === 'exito'
                  ? 'form-message-success'
                  : 'form-message-error'
              }`}
            >
              {mensaje}
            </p>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="button button-secondary"
              onClick={limpiarFormulario}
              disabled={guardando}
            >
              Limpiar
            </button>

            <button
              type="submit"
              className="button button-primary"
              disabled={guardando}
            >
              <Send size={18} />

              {guardando
                ? 'Registrando...'
                : 'Registrar ticket'}
            </button>
          </div>
        </form>

        <aside className="card form-help">
          <h2>Recomendaciones</h2>

          <p>
            Proporcione información clara para facilitar la atención del
            incidente.
          </p>

          <ul>
            <li>Utilice un título corto y específico.</li>
            <li>Describa cuándo comenzó el problema.</li>
            <li>Seleccione correctamente la categoría.</li>
            <li>Asigne la prioridad según el impacto.</li>
          </ul>
        </aside>
      </div>
    </section>
  );
}

export default ReportarTicket;