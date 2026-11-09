import { useEffect, useRef, useState, type ComponentType, type PointerEvent as ReactPointerEvent } from "react";
import { ACTION_URLS } from "../constants/urls";
import { heroCopy, howItWorksCopy, siteCopy } from "../data/content";
import { Brand, NavigationLinks } from "./shared";
import { HeroGlass } from "./HeroGlass";

type HeroDependencyGraphProps = {
  active: boolean;
  onFocusChange: (label: string, connections: number) => void;
};

function HeroGraphCard() {
  const graphCardRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [DependencyGraph, setDependencyGraph] = useState<ComponentType<HeroDependencyGraphProps> | null>(null);
  const [graphLoadFailed, setGraphLoadFailed] = useState(false);
  const [graphFocus, setGraphFocus] = useState({ label: howItWorksCopy.changedFile, connections: 6 });

  useEffect(() => {
    let cancelled = false;
    let idleHandle: number | undefined;
    let timeoutHandle: number | undefined;

    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    const loadGraph = () => {
      import("./HeroDependencyGraph").then(({ HeroDependencyGraph }) => {
        if (!cancelled) setDependencyGraph(() => HeroDependencyGraph);
      }).catch(() => {
        if (!cancelled) setGraphLoadFailed(true);
      });
    };

    if (idleWindow.requestIdleCallback) {
      idleHandle = idleWindow.requestIdleCallback(loadGraph, { timeout: 1400 });
    } else {
      timeoutHandle = window.setTimeout(loadGraph, 550);
    }

    return () => {
      cancelled = true;
      if (idleHandle !== undefined) idleWindow.cancelIdleCallback?.(idleHandle);
      if (timeoutHandle !== undefined) window.clearTimeout(timeoutHandle);
    };
  }, []);

  useEffect(() => {
    const graphCard = graphCardRef.current;
    if (!graphCard) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { threshold: 0.05 });
    observer.observe(graphCard);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="hero-visual">
      <HeroGlass />
      <section className="hero-graph glass-card" ref={graphCardRef} aria-label="Pull request dependency graph">
        <div className="hero-graph-heading">
          <p className="pipeline-eyebrow mono">Code knowledge graph</p>
          <h2>{howItWorksCopy.graphTitle}</h2>
          <span className="mono">{howItWorksCopy.graphNumber}</span>
        </div>
        <div className="hero-graph-wrap graph-wrap">
          {DependencyGraph ? (
            <DependencyGraph
              active={isVisible}
              onFocusChange={(label, connections) => setGraphFocus({ label, connections })}
            />
          ) : (
            <div className="hero-graph-loading" role="status">
              {graphLoadFailed ? "Dependency graph unavailable" : "Preparing dependency graph"}
            </div>
          )}
        </div>
        <p className="hero-graph-caption">
          <span className="mono">{graphFocus.label}</span> connects to {graphFocus.connections} related {graphFocus.connections === 1 ? "file" : "files"}.
        </p>
      </section>
    </div>
  );
}

function moveHeroStarfield(event: ReactPointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return;

  const bounds = event.currentTarget.getBoundingClientRect();
  const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
  const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
  const style = event.currentTarget.style;

  style.setProperty("--star-far-x", `${(-x * 7).toFixed(1)}px`);
  style.setProperty("--star-far-y", `${(-y * 5).toFixed(1)}px`);
  style.setProperty("--star-near-x", `${(-x * 13).toFixed(1)}px`);
  style.setProperty("--star-near-y", `${(-y * 9).toFixed(1)}px`);
}

function resetHeroStarfield(event: ReactPointerEvent<HTMLElement>) {
  const style = event.currentTarget.style;
  style.setProperty("--star-far-x", "0px");
  style.setProperty("--star-far-y", "0px");
  style.setProperty("--star-near-x", "0px");
  style.setProperty("--star-near-y", "0px");
}

export function Hero() {
  return (
    <div className="hero-shell">
      <section
        className="hero-band band-dark"
        id="top"
        aria-labelledby="hero-title"
        onPointerMove={moveHeroStarfield}
        onPointerLeave={resetHeroStarfield}
      >
        <header className="hero-header">
          <div className="hero-nav">
            <Brand />
            <NavigationLinks />
            <a className="nav-cta" href={ACTION_URLS.install}>{heroCopy.installLabel}</a>
          </div>
        </header>
        <div className="hero-layout band-inner">
          <div className="hero-copy">
            <h1 className="hero-title" id="hero-title" aria-label={heroCopy.titleLines.join(" ")}>
              {heroCopy.titleLines.map((line) => <span key={line}>{line}</span>)}
            </h1>
            <p className="hero-summary">{heroCopy.summary}</p>
            <div className="hero-actions">
              <a className="button button-primary" href={ACTION_URLS.install}>{heroCopy.installLabel}</a>
              <a className="button button-secondary" href={ACTION_URLS.demo}>{heroCopy.demoLabel}</a>
            </div>
          </div>
          <HeroGraphCard />
        </div>
      </section>
      <aside className="facts-band band-dark" aria-label={siteCopy.brand}>
        <div className="facts-grid band-inner">
          {heroCopy.facts.map((fact) => (
            <article className="fact" key={fact.title}>
              <h2>{fact.title}</h2>
              <p>{fact.description}</p>
            </article>
          ))}
        </div>
      </aside>
    </div>
  );
}
