function ServiceGlyph({ type }) {
  return (
    <span className={`service-glyph ${type}`} aria-hidden="true">
      <span />
      {type === "bars" ? <span /> : null}
    </span>
  );
}

function ServiceCard({ title, description, glyph }) {
  return (
    <article className="service-card reveal">
      <ServiceGlyph type={glyph} />
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="service-footer">
        <span>View capability</span>
        <span className="footer-arrow" aria-hidden="true">
          ↗
        </span>
      </div>
    </article>
  );
}

export default ServiceCard;

