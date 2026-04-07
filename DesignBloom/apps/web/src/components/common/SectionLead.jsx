function SectionLead({ eyebrow, title, description, className = "" }) {
  return (
    <div className={`section-lead ${className}`.trim()}>
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
      {description ? <p className="section-body">{description}</p> : null}
    </div>
  );
}

export default SectionLead;

