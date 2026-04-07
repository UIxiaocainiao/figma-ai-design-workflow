function NavPill({ label, href, active = false, onClick }) {
  return (
    <a className={`nav-pill ${active ? "is-active" : ""}`} href={href} onClick={onClick}>
      {label}
    </a>
  );
}

export default NavPill;

