import './StatCard.css';

function StatCard({ titulo, valor, descripcion, icono: Icono }) {
  return (
    <article className="card stat-card">
      <div className="stat-card-icon">
        <Icono size={24} />
      </div>

      <div>
        <span className="stat-title">{titulo}</span>
        <strong className="stat-value">{valor}</strong>
        <p>{descripcion}</p>
      </div>
    </article>
  );
}

export default StatCard;