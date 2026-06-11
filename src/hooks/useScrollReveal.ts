import { useEffect, useRef } from "react";

export function useScrollReveal() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    const targets = el.querySelectorAll(".scroll-reveal, .scroll-reveal-left, .scroll-reveal-scale");
    targets.forEach((t) => obs.observe(t));
    return () => obs.disconnect();
  }, []);

  return ref;
}

export function initScrollReveal() {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );
  document
    .querySelectorAll(".scroll-reveal, .scroll-reveal-left, .scroll-reveal-scale")
    .forEach((el) => obs.observe(el));
  return () => obs.disconnect();
}
