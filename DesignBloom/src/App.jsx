import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Approach", href: "#approach" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

const STATS = [
  { value: "12+", label: "launches shaped with motion-first storytelling" },
  { value: "03", label: "signature layers: type / system / animation" },
  { value: "1440", label: "desktop-first art direction with mobile-ready logic" },
];

const CAPABILITIES = ["Strategy", "Identity", "Product", "Motion", "Launch", "Systems"];

const SERVICES = [
  {
    title: "Brand Systems",
    description:
      "Identity direction, visual language, and scalable UI foundations that make the entire site feel authored, not assembled.",
    glyph: "square",
  },
  {
    title: "Experience Design",
    description:
      "Homepage structure, section flow, CTA choreography, and content hierarchy shaped for dark-theme editorial layouts.",
    glyph: "line",
  },
  {
    title: "Motion Direction",
    description:
      "Loader moments, hover states, reveal timing, and scroll scenes designed to support the message rather than distract from it.",
    glyph: "bars",
  },
];

const BULLETS = [
  "Larger hero typography with a portfolio-like signature",
  "A cleaner card rhythm drawn from the reference template",
];

const INSIGHTS = [
  {
    code: "A1",
    title: "Dark palette discipline",
    description:
      "Uses the reference node's exact grey and lime family instead of arbitrary neon tones.",
  },
  {
    code: "A2",
    title: "Portfolio energy",
    description:
      "Keeps the website's bold title contrast and mono labels so the page still feels personal.",
  },
  {
    code: "A3",
    title: "Agency readability",
    description:
      "Sections are easier to scan, with more predictable card patterns and clearer action zones.",
  },
  {
    code: "A4",
    title: "Motion-ready surfaces",
    description:
      "Containers and paddings are designed so future GSAP animation layers can be added cleanly.",
  },
];

const CASES = [
  {
    code: "CASE / 01",
    title: "DesignBloom Studio Site",
    description:
      "A signature homepage direction with an aggressive headline stack, modular services, and a clear dark-agency conversion structure.",
    tags: ["Dark UI", "Agency", "Motion"],
    variant: "studio",
  },
  {
    code: "CASE / 02",
    title: "Launch Campaign System",
    description:
      "A campaign-led variation that keeps the palette and frame logic, but increases product storytelling and spotlight moments.",
    tags: ["Launch", "System", "Story"],
    variant: "launch",
  },
];

function ActionButton({ children, href, variant = "primary" }) {
  return (
    <a className={`action-button ${variant}`} href={href}>
      <span>{children}</span>
      <span className="button-arrow" aria-hidden="true">
        ↗
      </span>
    </a>
  );
}

function SectionIntro({ eyebrow, title, description, narrow = false }) {
  return (
    <div className={`section-intro ${narrow ? "narrow" : ""} reveal`}>
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
      {description ? <p className="section-description">{description}</p> : null}
    </div>
  );
}

function ServiceGlyph({ type }) {
  return (
    <div className={`service-icon ${type}`} aria-hidden="true">
      <span />
      {type === "bars" ? <span /> : null}
    </div>
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
        <span className="service-arrow" aria-hidden="true">
          ↗
        </span>
      </div>
    </article>
  );
}

function InsightCard({ code, title, description }) {
  return (
    <article className="insight-card reveal">
      <p className="insight-code">{code}</p>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}

function CaseCard({ code, title, description, tags, variant }) {
  return (
    <article className="case-card reveal">
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
    <label className={`field-card ${large ? "large" : ""}`}>
      <span className="field-label">{label}</span>
      <Control
        defaultValue={defaultValue}
        placeholder={placeholder}
        rows={large ? 4 : undefined}
      />
    </label>
  );
}

function App() {
  const rootRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return undefined;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
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
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        delay: 0.12,
        ease: "power3.out",
      });

      gsap.from(".hero-stage", {
        y: 32,
        opacity: 0,
        duration: 0.95,
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
        duration: 14,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });

      gsap.to(".stage-orbit.inner", {
        rotate: 360,
        duration: 10,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });

      gsap.to(".stage-core", {
        scale: 1.18,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".hero-stage .signal-bars .active", {
        height: 108,
        duration: 1.7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.utils.toArray(".reveal").forEach((element) => {
        gsap.from(element, {
          y: 28,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
          },
        });
      });

      gsap.to(".hero-copy", {
        y: -36,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.to(".hero-stage", {
        y: -18,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.35,
        },
      });

      ScrollTrigger.refresh();
    }, root);

    return () => context.revert();
  }, []);

  return (
    <div className="app-shell" ref={rootRef}>
      <header className="site-header section-shell">
        <a className="brand" href="#top" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark" aria-hidden="true" />
          <span>DesignBloom</span>
        </a>

        <nav className={`site-nav ${menuOpen ? "open" : ""}`} aria-label="Primary navigation">
          {NAV_LINKS.map((item) => (
            <a
              href={item.href}
              key={item.href}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <ActionButton href="#contact">Start a Project</ActionButton>
          <button
            className={`menu-toggle ${menuOpen ? "open" : ""}`}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <main>
        <section className="hero section-shell" id="top">
          <div className="hero-badge reveal">
            <span className="hero-badge-dot" aria-hidden="true" />
            <span>MOTION-FIRST DIGITAL AGENCY / DARK THEME SYSTEM</span>
          </div>

          <div className="hero-layout">
            <div className="hero-copy">
              <p className="hero-kicker">01 / DESIGNBLOOM STUDIO</p>
              <h1 className="hero-title">
                <span>Design</span>
                <span className="accent">BLOOM.</span>
              </h1>
              <p className="hero-description">
                A UI direction that fuses the website&apos;s large typographic energy with
                the reference template&apos;s systemized dark layout.
              </p>

              <div className="hero-actions">
                <ActionButton href="#services">See Services</ActionButton>
                <ActionButton href="#work" variant="secondary">
                  View Work
                </ActionButton>
              </div>

              <div className="stat-grid">
                {STATS.map((item) => (
                  <article className="stat-card" key={item.label}>
                    <strong>{item.value}</strong>
                    <p>{item.label}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="hero-stage reveal" aria-hidden="true">
              <div className="stage-glow" />
              <div className="stage-orbit outer" />
              <div className="stage-orbit middle" />
              <div className="stage-orbit inner" />
              <div className="stage-core" />

              <div className="stage-panel signal-card">
                <p className="panel-label">LIVE SIGNAL</p>
                <strong>98%</strong>
                <p>system clarity</p>
              </div>

              <div className="stage-panel stage-notes">
                <p className="panel-label">CREATIVE STACK</p>
                <h3>Type / Motion / Dark Grid</h3>
                <p>Built from the website&apos;s experimental portfolio feel.</p>
                <div className="tag-row">
                  <span className="tag-pill">GSAP</span>
                  <span className="tag-pill">DARK UI</span>
                  <span className="tag-pill">SYSTEMS</span>
                </div>
              </div>

              <div className="signal-bars">
                <span />
                <span />
                <span className="active" />
                <span />
              </div>
            </div>
          </div>
        </section>

        <section className="signal-strip section-shell reveal" aria-label="Capabilities">
          <div className="capability-strip">
            {CAPABILITIES.map((item) => (
              <div className={`capability-pill ${item === "Product" ? "active" : ""}`} key={item}>
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="content-section section-shell" id="services">
          <SectionIntro
            eyebrow="SERVICES / 02"
            title="Agency structure with a sharper experimental edge."
            description="The reference template contributes the disciplined section rhythm and service architecture. The website contributes attitude: oversized typography, mono utility labels, acid-lime highlights, and a stronger sense of motion-led identity."
          />

          <div className="service-grid">
            {SERVICES.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </section>

        <section className="content-section section-shell approach-section" id="approach">
          <div className="approach-grid">
            <div className="approach-copy reveal">
              <p className="section-eyebrow">WHY THIS DIRECTION / 03</p>
              <h2 className="approach-title">
                <span>Keep the attitude.</span>
                <span>Add the system.</span>
              </h2>
              <p className="section-description">
                Compared with the original website, this redesign increases
                structural clarity, section hierarchy, and service-market fit.
                Compared with the reference template, it feels less generic and more
                authored.
              </p>
              <ul className="bullet-list">
                {BULLETS.map((item) => (
                  <li className="bullet-item" key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="insight-grid">
              {INSIGHTS.map((insight) => (
                <InsightCard key={insight.code} {...insight} />
              ))}
            </div>
          </div>
        </section>

        <section className="content-section section-shell" id="work">
          <SectionIntro
            eyebrow="SELECTED SIGNALS / 04"
            title="Two visual routes for a dark digital brand."
            narrow
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
              <h2 className="contact-title">
                <span>Need a darker,</span>
                <span>sharper homepage?</span>
              </h2>
              <p className="section-description">
                This concept is now stored in the target Figma file and ready to
                evolve into a full landing page or component system.
              </p>
              <ActionButton href="mailto:hello@designbloom.studio">
                Book a Design Sprint
              </ActionButton>
            </div>

            <form className="contact-form">
              <div className="field-row">
                <Field label="Your Name" placeholder="Enter your name" />
                <Field label="Email" placeholder="Enter your email" />
              </div>
              <Field
                label="Project Scope"
                defaultValue="Brand identity, homepage UI, motion direction"
              />
              <Field
                label="Message"
                placeholder="Tell us what kind of digital presence you want to build"
                large
              />
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer section-shell">
        <p>DesignBloom / Dark Agency Concept</p>
        <p>Built from website style + dark agency reference palette</p>
      </footer>
    </div>
  );
}

export default App;
