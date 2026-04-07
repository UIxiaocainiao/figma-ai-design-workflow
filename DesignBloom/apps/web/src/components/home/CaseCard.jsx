function CaseCard({ code, title, description, tags, variant, highlight = false }) {
  return (
    <article className={`case-card reveal ${highlight ? "is-highlight" : ""}`.trim()}>
      <p className="case-code">{code}</p>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="tag-row" aria-label={`${title} tags`}>
        {tags.map((tag) => (
          <span className="tag-pill" key={tag}>
            {tag}
          </span>
        ))}
      </div>
      <div className={`case-visual ${variant}`} aria-hidden="true">
        <span className="case-line" />
        <span className="case-block a" />
        <span className="case-block b" />
        <span className="case-block c" />
        <span className="case-block d" />
      </div>
    </article>
  );
}

export default CaseCard;

