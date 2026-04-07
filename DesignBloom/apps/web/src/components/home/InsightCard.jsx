function InsightCard({ code, title, description, tall = false }) {
  return (
    <article className={`insight-card reveal ${tall ? "is-tall" : ""}`.trim()}>
      <p className="insight-code">{code}</p>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}

export default InsightCard;

