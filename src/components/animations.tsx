import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * ScrollReveal — wraps children and reveals them with animation when scrolled into view.
 * Uses IntersectionObserver, no external deps. Triggers once.
 */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  threshold = 0.12,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const dirMap = {
    up: "translate-y-6",
    down: "-translate-y-6",
    left: "translate-x-6",
    right: "-translate-x-6",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-600 ease-out",
        visible ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${dirMap[direction]}`,
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/**
 * PageTransition — wraps page content and plays a fade-slide-in on mount.
 * Used inside dashboard layout to animate route changes.
 */
export function PageTransition({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShow(false), 0);
    const t2 = setTimeout(() => setShow(true), 20);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div
      className={cn(
        "transition-all duration-400 ease-out will-change-transform",
        show
          ? "opacity-100 translate-y-0 translate-x-0 blur-none"
          : "opacity-0 translate-y-2 translate-x-2 blur-[2px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
