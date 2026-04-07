import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { label: "Studio", href: "#top", active: true },
  { label: "Services", href: "#services" },
  { label: "Approach", href: "#approach" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

const HERO_PILLS = [
  { label: "UI SYSTEM" },
  { label: "MOTION" },
  { label: "CONVERSION", accent: true },
];

const HERO_METRICS = [
  { label: "03 CORE LAYERS", body: "Type, system, motion." },
  { label: "1440PX CANVAS", body: "Desktop-first, mobile-aware pacing." },
];

const HERO_POINTS = [
  "Green is reserved for action and state.",
  "The stage reads like a product, not a poster.",
  "Metrics now have visible hierarchy.",
];

const CAPABILITIES = [
  { label: "Strategy" },
  { label: "Identity" },
  { label: "Product", active: true },
  { label: "Motion" },
  { label: "Launch" },
  { label: "Systems" },
];

const SERVICES = [
  {
    title: "Brand Systems",
    description:
      "Identity direction, visual language, and reusable modules that make every launch surface feel authored, not assembled.",
    glyph: "square",
  },
  {
    title: "Experience Design",
    description:
      "Homepage structure, CTA choreography, and interface pacing tuned for dark-mode clarity and faster scanning.",
    glyph: "line",
  },
  {
    title: "Motion Direction",
    description:
      "Animation-ready layout logic and visual tension designed to support reveal sequences without breaking the system.",
    glyph: "bars",
  },
];

const APPROACH_POINTS = [
  "Larger hero typography anchored by quieter supporting surfaces.",
  "Card modules feel more like an interface system than decorative panels.",
  "Buttons and tags now use a consistent pill vocabulary across the page.",
];

const INSIGHTS = [
  {
    code: "A1",
    title: "Dark palette discipline",
    description:
      "The interface relies on near-black layers and only a single functional accent, which immediately increases perceived quality.",
    tall: true,
  },
  {
    code: "A2",
    title: "Portfolio energy",
    description:
      "The page still feels like DesignBloom because the typography stays assertive and the copy remains opinionated.",
  },
  {
    code: "A3",
    title: "Agency readability",
    description:
      "Every section now has a cleaner scan path, stronger CTA grouping, and more predictable module behavior.",
  },
  {
    code: "A4",
    title: "Motion-ready surfaces",
    description:
      "Spacing and corner systems are consistent enough that future animation layers can be added without friction.",
  },
];

const CASES = [
  {
    code: "CASE / 01",
    title: "DesignBloom Studio Site",
    description:
      "A sharper homepage system with tighter navigation behavior, denser rhythm, and a more tactile CTA language.",
    tags: ["DARK UI", "AGENCY", "MOTION"],
    variant: "studio",
  },
  {
    code: "CASE / 02",
    title: "Launch Campaign System",
    description:
      "A campaign-led variation of the same language that increases product spotlight moments without losing the core interface discipline.",
    tags: ["LAUNCH", "SYSTEM", "STORY"],
    variant: "launch",
    highlight: true,
  },
];

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

function NavPill({ label, href, active = false, onClick }) {
  return (
    <a className={`nav-pill ${active ? "is-active" : ""}`} href={href} onClick={onClick}>
      {label}
    </a>
  );
}

function SignalPill({ label, accent = false }) {
  return <span className={`ui-pill ${accent ? "is-accent" : ""}`}>{label}</span>;
}

function SectionLead({ eyebrow, title, description, className = "" }) {
  return (
    <div className={`section-lead ${className}`.trim()}>
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
      {description ? <p className="section-body">{description}</p> : null}
    </div>
  );
}

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

function InsightCard({ code, title, description, tall = false }) {
  return (
    <article className={`insight-card reveal ${tall ? "is-tall" : ""}`.trim()}>
      <p className="insight-code">{code}</p>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}

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

function App() {
  const rootRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    const desktopMedia = window.matchMedia("(min-width: 981px)");
    const handleDesktopEnter = (event) => {
      if (event.matches) {
        setMenuOpen(false);
      }
    };

    if (desktopMedia.addEventListener) {
      desktopMedia.addEventListener("change", handleDesktopEnter);
    } else {
      desktopMedia.addListener(handleDesktopEnter);
    }

    return () => {
      if (desktopMedia.removeEventListener) {
        desktopMedia.removeEventListener("change", handleDesktopEnter);
      } else {
        desktopMedia.removeListener(handleDesktopEnter);
      }
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    const root = rootRef.current;
    const responsiveMotion = gsap.matchMedia();

    if (!root) {
      return undefined;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const context = gsap.context(() => {
      gsap.from(".site-header", {
        y: -16,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      });

      gsap.from(".hero-copy > *", {
        y: 26,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        delay: 0.1,
        ease: "power3.out",
      });

      gsap.from(".hero-stage", {
        y: 28,
        opacity: 0,
        duration: 0.92,
        delay: 0.18,
        ease: "power3.out",
      });

      gsap.to(".stage-orbit.outer", {
        rotate: 360,
        duration: 18,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });

      gsap.to(".stage-orbit.middle", {
        rotate: -360,
        duration: 15,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });

      gsap.to(".stage-orbit.inner", {
        rotate: 360,
        duration: 11,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });

      gsap.to(".stage-core-disc", {
        scale: 1.08,
        duration: 1.9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".wave-bar.is-accent, .stage-eq-bar.is-accent", {
        scaleY: 1.18,
        duration: 1.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        transformOrigin: "50% 100%",
      });

      gsap.utils.toArray(".reveal").forEach((element) => {
        gsap.from(element, {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 86%",
          },
        });
      });

      responsiveMotion.add("(min-width: 980px)", () => {
        gsap.to(".hero-copy", {
          y: -26,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1.15,
          },
        });

        gsap.to(".hero-stage", {
          y: -14,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      });

      ScrollTrigger.refresh();
    }, root);

    return () => {
      responsiveMotion.revert();
      context.revert();
    };
  }, []);

  return (
    <div className="app-shell" ref={rootRef}>
      <header className="site-header section-shell">
        <a className="brand" href="#top" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-wordmark">DesignBloom</span>
        </a>

        <nav className={`site-nav ${menuOpen ? "open" : ""}`} aria-label="Primary navigation">
          {NAV_LINKS.map((item) => (
            <NavPill
              active={item.active}
              href={item.href}
              key={item.label}
              label={item.label}
              onClick={closeMenu}
            />
          ))}
        </nav>

        <div className="header-actions">
          <ActionButton className="header-cta" href="#contact">
            Start a Project
          </ActionButton>
          <button
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
            className={`menu-toggle ${menuOpen ? "open" : ""}`.trim()}
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <main className="site-main">
        <section className="hero section-shell" id="top">
          <div className="hero-badge reveal">
            <span className="hero-badge-dot" aria-hidden="true" />
            <span>ROUND 02 / HERO MIX TUNED FOR PLAYER-LIKE CLARITY</span>
          </div>

          <div className="hero-layout">
            <div className="hero-copy">
              <p className="hero-kicker">01 / DESIGNBLOOM x SPOTIFY SYSTEM</p>
              <h1 className="hero-title">
                <span>Design that</span>
                <span>hits harder</span>
                <span>in the dark.</span>
              </h1>
              <p className="hero-description">
                A tighter hero for a premium dark-agency launch: clearer promise,
                cleaner proof, and a more product-like surface from the first screen.
              </p>

              <div className="signal-row" aria-label="Hero signals">
                {HERO_PILLS.map((pill) => (
                  <SignalPill key={pill.label} {...pill} />
                ))}
              </div>

              <div className="hero-actions">
                <ActionButton href="#services">Explore Services</ActionButton>
                <ActionButton href="#work" variant="secondary">
                  See Case Studies
                </ActionButton>
              </div>

              <div className="signal-board">
                <article className="primary-signal reveal">
                  <p className="micro-label">LIVE SCORE</p>
                  <div className="score-row">
                    <strong>94%</strong>
                    <div className="wave" aria-hidden="true">
                      <span className="wave-bar" />
                      <span className="wave-bar" />
                      <span className="wave-bar is-accent" />
                      <span className="wave-bar" />
                    </div>
                  </div>
                  <p>
                    Sharper CTA contrast, tighter proof, and a hero that reads like a
                    high-intent product entry point.
                  </p>
                </article>

                <div className="metric-stack reveal">
                  {HERO_METRICS.map((item) => (
                    <article className="metric-card" key={item.label}>
                      <p className="micro-label">{item.label}</p>
                      <p className="metric-body">{item.body}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="rationale-surface reveal">
                <div className="rationale-copy">
                  <h2>Why this mix lands better</h2>
                  <p>
                    The left side now reads faster: promise first, proof second,
                    action third. That gives the hero more intent without adding noise.
                  </p>
                </div>

                <div className="rationale-points">
                  {HERO_POINTS.map((point) => (
                    <div className="rationale-point" key={point}>
                      <span className="rationale-dot" aria-hidden="true" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="hero-stage reveal" aria-hidden="true">
              <div className="stage-chip">
                <span className="stage-chip-dot" />
                <span>NOW PLAYING / HERO MIX</span>
              </div>

              <div className="stage-label">
                <p>LIVE MIX</p>
                <strong>98%</strong>
                <span>hero clarity</span>
              </div>

              <div className="stage-orbit outer" />
              <div className="stage-orbit middle" />
              <div className="stage-orbit inner" />
              <div className="stage-glow" />
              <div className="stage-core-disc">
                <span>♫</span>
              </div>
              <span className="orbit-dot orbit-dot-accent" />
              <span className="orbit-dot orbit-dot-ghost" />

              <div className="stage-sub-pill">QUEUE READY</div>

              <div className="stage-eq">
                <span className="stage-eq-bar" />
                <span className="stage-eq-bar" />
                <span className="stage-eq-bar is-accent" />
                <span className="stage-eq-bar" />
              </div>

              <div className="player-card">
                <div className="player-top">
                  <div className="player-album">
                    <span className="player-album-core" />
                  </div>
                  <div className="player-meta">
                    <p className="player-track">Type / Motion</p>
                    <p className="player-track">Product Signal</p>
                    <p className="player-caption">Premium dark-agency homepage remix</p>
                  </div>
                </div>

                <div className="player-progress">
                  <div className="progress-rail">
                    <div className="progress-fill" />
                    <span className="progress-handle" />
                  </div>
                  <div className="player-time">
                    <span>02:18</span>
                    <span>03:42</span>
                  </div>
                </div>

                <div className="player-controls">
                  <span className="control-button prev">
                    <span className="control-icon" />
                  </span>
                  <span className="control-button play">
                    <span className="control-icon" />
                  </span>
                  <span className="control-button next">
                    <span className="control-icon" />
                  </span>
                  <span className="intent-pill">HIGH INTENT</span>
                  <span className="speaker-icon" />
                  <span className="volume-rail">
                    <span className="volume-fill" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="signal-strip section-shell reveal" aria-label="Capabilities">
          <div className="capability-strip">
            {CAPABILITIES.map((item) => (
              <div className={`capability-pill ${item.active ? "is-active" : ""}`.trim()} key={item.label}>
                {item.label}
              </div>
            ))}
          </div>
        </section>

        <section className="content-section section-shell" id="services">
          <SectionLead
            eyebrow="SERVICES / 02"
            title="Agency structure with a denser, more premium dark system."
            description="The information architecture stays familiar, but the visual rhythm now feels more deliberate: darker surfaces, stronger CTA states, and card modules that read faster."
          />

          <div className="service-grid">
            {SERVICES.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </section>

        <section className="approach-section section-shell" id="approach">
          <div className="approach-surface reveal">
            <div className="approach-copy">
              <p className="section-eyebrow">WHY THIS DIRECTION / 03</p>
              <h2 className="approach-title">Keep the attitude. Add the system.</h2>
              <p className="section-body approach-body">
                Compared with the original concept, this redesign increases
                structural clarity and makes the homepage feel more product-grade.
                Compared with a generic agency template, it keeps the personal
                energy intact.
              </p>

              <div className="approach-points">
                {APPROACH_POINTS.map((item) => (
                  <div className="bullet-row" key={item}>
                    <span className="bullet-dot" aria-hidden="true" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="insight-grid">
              {INSIGHTS.map((insight) => (
                <InsightCard key={insight.code} {...insight} />
              ))}
            </div>
          </div>
        </section>

        <section className="work-section section-shell" id="work">
          <SectionLead
            className="work-lead"
            eyebrow="SELECTED SIGNALS / 04"
            title="Two routes for a darker digital brand."
          />

          <div className="case-grid">
            {CASES.map((item) => (
              <CaseCard key={item.code} {...item} />
            ))}
          </div>
        </section>

        <section className="contact-section section-shell" id="contact">
          <div className="contact-surface reveal">
            <div className="contact-copy">
              <p className="section-eyebrow">CONTACT / 05</p>
              <h2 className="contact-title">Need a darker, sharper homepage?</h2>
              <p className="section-body contact-body">
                This refreshed concept is now sitting in a new Figma file, ready to
                evolve into a full landing page system or a component library.
              </p>
              <ActionButton href="mailto:hello@designbloom.studio">Book a Design Sprint</ActionButton>
            </div>

            <form className="contact-form">
              <div className="field-row">
                <Field label="YOUR NAME" placeholder="Enter your name" />
                <Field label="EMAIL" placeholder="Enter your email" />
              </div>
              <Field
                defaultValue="Brand identity, homepage UI, motion direction"
                label="PROJECT SCOPE"
              />
              <Field
                large
                label="MESSAGE"
                placeholder="Tell us what kind of digital presence you want to build"
              />
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer section-shell">
        <div className="footer-divider" />
        <div className="footer-row">
          <p>DesignBloom / Spotify Refresh Concept</p>
          <p>Built from original structure + Spotify dark system principles</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
