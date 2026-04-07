function Field({ label, placeholder, defaultValue, large = false }) {
  const Control = large ? "textarea" : "input";

  return (
    <label className={`field-card ${large ? "is-large" : ""}`.trim()}>
      <span className="field-label">{label}</span>
      <Control
        defaultValue={defaultValue}
        placeholder={placeholder}
        rows={large ? 2 : undefined}
      />
    </label>
  );
}

export default Field;

