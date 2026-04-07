import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useHomepageMotion(rootRef) {
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
        if (element.closest(".hero")) {
          return;
        }

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
  }, [rootRef]);
}
