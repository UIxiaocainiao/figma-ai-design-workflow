function SignalPill({ label, accent = false }) {
  return <span className={`ui-pill ${accent ? "is-accent" : ""}`}>{label}</span>;
}

export default SignalPill;

