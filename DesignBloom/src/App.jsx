import { useEffect, useMemo, useRef, useState } from "react";
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

const CAPABILITIES = [
  "Strategy",
  "Identity",
  "Product",
  "Motion",
  "Launch",
  "Systems",
];

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
      "Homepage structure, section flow, CTA choreography, and content hierarchy shaped for dark editorial layouts.",
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
  "Token-driven dark palette built from the provided green and grey shades",
];

const INSIGHTS = [
  {
    code: "A1",
    title: "Dark palette discipline",
    description:
      "Uses the exact grey and lime family from the reference palette instead of arbitrary neon tones.",
  },
  {
    code: "A2",
    title: "Portfolio energy",
    description:
      "Keeps the original website's mono labels and oversized type so the page still feels authored.",
  },
  {
    code: "A3",
    title: "Agency readability",
    description:
      "Sections are easier to scan, with predictable card rhythm and cleaner action zones.",
  },
  {
    code: "A4",
    title: "Motion-ready surfaces",
    description:
      "Containers and paddings are ready for richer GSAP scenes without breaking the layout.",
  },
];

const CASES = [
  {
    code: "CASE / 01",
    title: "DesignBloom Studio Site",
    description:
      "A signature homepage direction with an aggressive headline stack, modular services, and a clear dark-agency conversion structure.",
    tags: ["Dark UI", "Agency", "Motion"],
    variant: "primary",
  },
  {
    code: "CASE / 02",
    title: "Launch Campaign System",
    description:
      "A campaign-led route that keeps the palette and frame logic, but increases product storytelling and spotlight moments.",
    tags: ["Launch", "System", "Story"],
    variant: "secondary",
  },
];

function ActionButton({ children, href, variant = "primary" }) {
  return (
    <a className={`action-button magnetic ${variant}`} href={href}>
      <span>{children}</span>
      <span className="button-arrow" aria-hidden="true">
        ↗
      </span>
    </a>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="section-heading reveal">
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
      {description ? <p className="section-description">{description}</p> : null}
    </div>
  );
}

function ServiceCard({ title, description, glyph }) {
  return (
    <article className="service-card reveal tilt-panel">
      <div className={`service-icon ${glyph}`} aria-hidden="true">
        <span />
        {glyph === "bars" ? (
          <>
            <span />
            <span />
          </>
        ) : null}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="card-foot">
        <span>View capability</span>
        <span className="card-arrow">↗</span>
      </div>
    </article>
  );
}

function InsightCard({ code, title, description }) {
  return (
    <article className="insight-card reveal">
      <span className="insight-code">{code}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}

function CaseCard({ code, title, description, tags, variant }) {
  return (
    <article className="case-card reveal tilt-panel">
      <span className="case-code">{code}</span>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="tag-row">
        {tags.map((tag) => (
          <span key={tag} className="mono-pill">
            {tag}
          </span>
        ))}
      </div>
      <div className={`case-visual ${variant}`} aria-hidden="true">
        <span className="visual-line" />
        <span className="visual-block a" />
        <span className="visual-block b" />
        <span className="visual-block c" />
        <span className="visual-block d" />
      </div>
    </article>
  );
}

function Field({ label, placeholder, large = false }) {
  const Component = large ? "textarea" : "input";

  return (
    <label className={`contact-field reveal ${large ? "large" : ""}`}>
      <span className="field-label">{label}</span>
      <Component placeholder={placeholder} rows={large ? 4 : undefined} />
    </label>
  );
}

function App() {
  const rootRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const progressFill = root.querySelector(".progress-fill");
    const updateProgress = () => {
      if (!progressFill) return;
      const range =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = range > 0 ? (window.scrollY / range) * 100 : 0;
      progressFill.style.width = `${progress}%`;
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const cursor = rootRef.current?.querySelector("[data-cursor]");
    const dot = rootRef.current?.querySelector("[data-cursor-dot]");
    const ring = rootRef.current?.querySelector("[data-cursor-ring]");

    if (!finePointer || reducedMotion || !cursor || !dot || !ring) {
      document.body.classList.add("cursor-disabled");
      return undefined;
    }

    document.body.classList.remove("cursor-disabled");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let frameId = 0;

    const handleMove = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      gsap.to(dot, {
        x: mouseX,
        y: mouseY,
        duration: 0.08,
        ease: "none",
      });
    };

    const handleDown = () => document.body.classList.add("cursor-clicking");
    const handleUp = () => document.body.classList.remove("cursor-clicking");

    const loop = () => {
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;
      gsap.set(ring, { x: ringX, y: ringY });
      frameId = window.requestAnimationFrame(loop);
    };

    const hoverTargets = rootRef.current.querySelectorAll(
      "a, button, input, textarea, .tilt-panel, .capability-pill, .stat-card, .hero-stage, .insight-card",
    );
    const addHover = () => document.body.classList.add("cursor-hovering");
    const removeHover = () => document.body.classList.remove("cursor-hovering");

    hoverTargets.forEach((element) => {
      element.addEventListener("mouseenter", addHover);
      element.addEventListener("mouseleave", removeHover);
    });

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);
    frameId = window.requestAnimationFrame(loop);

    return () => {
      hoverTargets.forEach((element) => {
        element.removeEventListener("mouseenter", addHover);
        element.removeEventListener("mouseleave", removeHover);
      });
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      window.cancelAnimationFrame(frameId);
      document.body.classList.remove(
        "cursor-hovering",
        "cursor-clicking",
        "cursor-disabled",
      );
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return undefined;

    const cleanup = [];
    const context = gsap.context(() => {
      gsap.from(".site-header", {
        y: -20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".hero-copy > *", {
        y: 28,
        opacity: 0,
        duration: 0.82,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.12,
      });

      gsap.from(".hero-stage", {
        y: 36,
        opacity: 0,
        scale: 0.98,
        duration: 1,
        ease: "power3.out",
        delay: 0.25,
      });

      gsap.from(".stat-card", {
        y: 18,
        opacity: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.5,
      });

      gsap.to(".orbit.orbit-outer", {
        rotate: 360,
        duration: 18,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });
      gsap.to(".orbit.orbit-mid", {
        rotate: -360,
        duration: 14,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });
      gsap.to(".hero-core", {
        scale: 1.16,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".signal-bars span:nth-child(3)", {
        height: 110,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.utils.toArray(".reveal").forEach((element, index) => {
        gsap.from(element, {
          y: 34,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          delay: index % 3 === 0 ? 0 : 0.04 * (index % 3),
          scrollTrigger: {
            trigger: element,
            start: "top 86%",
          },
        });
      });

      gsap.to(".hero-copy", {
        y: -48,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.to(".hero-stage", {
        y: -36,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.35,
        },
      });

      const magneticButtons = gsap.utils.toArray(".magnetic");
      magneticButtons.forEach((button) => {
        const handleMove = (event) => {
          const rect = button.getBoundingClientRect();
          const dx = (event.clientX - (rect.left + rect.width / 2)) * 0.16;
          const dy = (event.clientY - (rect.top + rect.height / 2)) * 0.16;
          gsap.to(button, {
            x: dx,
            y: dy,
            duration: 0.3,
            ease: "power3.out",
          });
        };

        const handleLeave = () => {
          gsap.to(button, {
            x: 0,
            y: 0,
            duration: 0.65,
            ease: "elastic.out(1, 0.5)",
          });
        };

        button.addEventListener("mousemove", handleMove);
        button.addEventListener("mouseleave", handleLeave);
        cleanup.push(() => {
          button.removeEventListener("mousemove", handleMove);
          button.removeEventListener("mouseleave", handleLeave);
        });
      });

      gsap.utils.toArray(".tilt-panel").forEach((panel) => {
        const handleMove = (event) => {
          const rect = panel.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;

          gsap.to(panel, {
            rotateY: x * 6,
            rotateX: -y * 5,
            transformPerspective: 1200,
            transformOrigin: "center",
            duration: 0.45,
            ease: "power3.out",
          });
        };

        const handleLeave = () => {
          gsap.to(panel, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.6,
            ease: "power3.out",
          });
        };

        panel.addEventListener("mousemove", handleMove);
        panel.addEventListener("mouseleave", handleLeave);
        cleanup.push(() => {
          panel.removeEventListener("mousemove", handleMove);
          panel.removeEventListener("mouseleave", handleLeave);
        });
      });

      ScrollTrigger.refresh();
    }, rootRef);

    return () => {
      cleanup.forEach((dispose) => dispose());
      context.revert();
    };
  }, [reducedMotion]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  return (
    <div className="app" ref={rootRef}>
      <div className="page-noise" aria-hidden="true" />
      <div className="progress-bar" aria-hidden="true">
        <span className="progress-fill" />
      </div>
      <div className="cursor-shell" data-cursor aria-hidden="true">
        <span className="cursor-ring" data-cursor-ring />
        <span className="cursor-dot" data-cursor-dot />
      </div>

      <header className="site-header">
        <a className="brand" href="#top">
          <span className="brand-mark" />
          <span>DesignBloom</span>
        </a>

        <nav className={`site-nav ${menuOpen ? "open" : ""}`} aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
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
        <section className="hero section" id="top">
          <div className="hero-copy">
            <p className="badge">MOTION-FIRST DIGITAL AGENCY / DARK THEME SYSTEM</p>
            <p className="hero-kicker">01 / DESIGNBLOOM STUDIO</p>

            <div className="hero-title" aria-label="Build Digital Bloom">
              <span>BUILD</span>
              <span>DIGITAL</span>
              <span className="accent">BLOOM.</span>
            </div>

            <p className="hero-description">
              A UI direction that fuses the website&apos;s large typographic energy
              with the reference template&apos;s systemized dark layout. Sharp grids,
              acid green accents, and conversion-ready structure all live in one
              homepage.
            </p>

            <div className="hero-actions">
              <ActionButton href="#services">See Services</ActionButton>
              <ActionButton href="#work" variant="secondary">
                View Work
              </ActionButton>
            </div>

            <div className="stat-row">
              {STATS.map((item) => (
                <article className="stat-card" key={item.value}>
                  <strong>{item.value}</strong>
                  <p>{item.label}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="hero-stage tilt-panel">
            <div className="orbit orbit-outer" aria-hidden="true" />
            <div className="orbit orbit-mid" aria-hidden="true" />
            <div className="orbit orbit-inner" aria-hidden="true" />
            <div className="hero-core" aria-hidden="true" />

            <article className="signal-card floating-card">
              <span>LIVE SIGNAL</span>
              <strong>98%</strong>
              <p>system clarity</p>
            </article>

            <article className="stage-notes floating-card">
              <span>CREATIVE STACK</span>
              <h3>Type / Motion / Dark Grid</h3>
              <p>
                Built from the website&apos;s experimental portfolio feel, then
                disciplined by the reference template&apos;s structured agency rhythm.
              </p>
              <div className="tag-row">
                <span className="mono-pill">GSAP</span>
                <span className="mono-pill">DARK UI</span>
                <span className="mono-pill">SYSTEMS</span>
              </div>
            </article>

            <div className="signal-bars" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </section>

        <section className="capability-strip section" aria-label="Capabilities">
          {CAPABILITIES.map((item) => (
            <div
              key={item}
              className={`capability-pill ${item === "Motion" ? "active" : ""}`}
            >
              {item}
            </div>
          ))}
        </section>

        <section className="section" id="services">
          <SectionHeading
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

        <section className="section approach-layout" id="approach">
          <div className="approach-copy reveal">
            <p className="section-eyebrow">APPROACH / 03</p>
            <h2 className="section-title compact">
              <span>Keep the attitude.</span>
              <span>Add the system.</span>
            </h2>
            <p className="section-description">
              Compared with the original website, this redesign increases
              structural clarity, section hierarchy, and service-market fit.
              Compared with the reference template, it feels less generic and
              more authored.
            </p>

            <ul className="bullet-list">
              {BULLETS.map((bullet) => (
                <li key={bullet}>
                  <span className="bullet-dot" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="insight-grid">
            {INSIGHTS.map((insight) => (
              <InsightCard key={insight.code} {...insight} />
            ))}
          </div>
        </section>

        <section className="section" id="work">
          <SectionHeading
            eyebrow="SELECTED SIGNALS / 04"
            title="Two visual routes for a dark digital brand."
          />

          <div className="case-grid">
            {CASES.map((item) => (
              <CaseCard key={item.code} {...item} />
            ))}
          </div>
        </section>

        <section className="section contact-section" id="contact">
          <div className="contact-surface">
            <div className="contact-copy reveal">
              <p className="section-eyebrow">CONTACT / 05</p>
              <h2 className="section-title compact">
                <span>Need a darker,</span>
                <span>sharper homepage?</span>
              </h2>
              <p className="section-description">
                This concept is now ready to evolve into a full landing page or
                a reusable component system inside the DesignBloom project.
              </p>
              <ActionButton href="mailto:hello@designbloom.studio">
                Book a Design Sprint
              </ActionButton>
            </div>

            <form className="contact-form" onSubmit={(event) => event.preventDefault()}>
              <div className="field-row">
                <Field label="Your Name" placeholder="Enter your name" />
                <Field label="Email" placeholder="Enter your email" />
              </div>
              <Field
                label="Project Scope"
                placeholder="Brand identity, homepage UI, motion direction"
              />
              <Field
                label="Message"
                placeholder="Tell us what kind of digital presence you want to build, and what should make it memorable."
                large
              />
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span>DesignBloom / Dark Agency Concept</span>
        <span>Built from website style + dark agency reference palette</span>
      </footer>
    </div>
  );
}

export default App;
