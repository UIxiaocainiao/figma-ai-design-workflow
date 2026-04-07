function ActionButton({ children, href, variant = "primary", className = "" }) {
  const classes = ["action-button", variant, className].filter(Boolean).join(" ");

  return (
    <a className={classes} href={href}>
      <span>{children}</span>
      <span className="button-arrow" aria-hidden="true">
        ↗
      </span>
    </a>
  );
}

export default ActionButton;

