import { ACTION_URLS } from "../constants/urls";
import { heroCopy, heroQueueItems, siteCopy } from "../data/content";
import { Brand, NavigationLinks } from "./shared";

function HeroQueueCard() {
  return (
    <div className="hero-visual">
      <section className="hero-queue glass-card" aria-label={heroCopy.queueLabel} tabIndex={0}>
        <div className="hero-queue-heading">
          <h2>{heroCopy.queueLabel}</h2>
          <span className="queue-count">{heroCopy.queueCount}</span>
        </div>
        <div className="hero-queue-list">
          {heroQueueItems.map((item) => (
            <article className={`hero-queue-row${item.priority ? " is-priority" : ""}`} data-hero-queue-row="true" key={item.number}>
              <div className="hero-row-top">
                <div className="hero-row-title">
                  <span className="rank mono">{item.rank}</span>
                  <h3>{item.title}</h3>
                  <span className="mono pr-number">{item.number}</span>
                </div>
                <span className={item.priority ? "status-chip status-chip-coral" : "status-chip status-chip-outline"}>
                  {item.status}
                </span>
              </div>
              <p>{item.reason}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export function Hero() {
  return (
    <div className="hero-shell">
      <section className="hero-band band-dark" id="top" aria-labelledby="hero-title">
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
          <HeroQueueCard />
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
