import { useEffect, useRef, useState } from "react";
import ActionButton from "../components/common/ActionButton";
import NavPill from "../components/common/NavPill";
import SectionLead from "../components/common/SectionLead";
import SignalPill from "../components/common/SignalPill";
import AuthSection from "../components/home/AuthSection";
import CaseCard from "../components/home/CaseCard";
import Field from "../components/home/Field";
import InsightCard from "../components/home/InsightCard";
import ServiceCard from "../components/home/ServiceCard";
import {
  APPROACH_POINTS,
  CAPABILITIES,
  CASES,
  HERO_METRICS,
  HERO_PILLS,
  HERO_POINTS,
  INSIGHTS,
  NAV_LINKS,
  SERVICES,
} from "../content/home-content";
import { useHomepageMotion } from "../hooks/useHomepageMotion";

function HomePage() {
  const rootRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const closeMenu = () => setMenuOpen(false);
  const openAuth = (nextMode) => {
    setAuthMode(nextMode);
    closeMenu();
  };

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

  useHomepageMotion(rootRef);

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

          <div className="site-nav-auth">
            <a className="nav-pill" href="#auth" onClick={() => openAuth("login")}>
              Log in
            </a>
            <a className="nav-pill" href="#auth" onClick={() => openAuth("register")}>
              Register
            </a>
          </div>
        </nav>

        <div className="header-actions">
          <div className="header-auth" aria-label="Account actions">
            <a className="header-auth-link" href="#auth" onClick={() => openAuth("login")}>
              Log in
            </a>
            <a
              className="header-auth-link is-strong"
              href="#auth"
              onClick={() => openAuth("register")}
            >
              Register
            </a>
          </div>
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

        <section className="auth-section section-shell" id="auth">
          <AuthSection mode={authMode} onModeChange={setAuthMode} />
        </section>

        <section className="contact-section section-shell" id="contact">
          <div className="contact-surface reveal">
            <div className="contact-copy">
              <p className="section-eyebrow">CONTACT / 06</p>
              <h2 className="contact-title">Need a darker, sharper homepage?</h2>
              <p className="section-body contact-body">
                This refreshed concept is now sitting in a new Figma file, ready to
                evolve into a full landing page system or a component library.
              </p>
              <ActionButton href="mailto:hello@designbloom.studio">
                Book a Design Sprint
              </ActionButton>
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

export default HomePage;
