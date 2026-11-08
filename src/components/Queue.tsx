import { useEffect, useRef, useState } from "react";
import { pullRequests, queueCopy } from "../data/content";
import { queueSignalDetails } from "../data/content";

function QueueRow({ item, active }: { item: (typeof pullRequests)[number]; active: boolean }) {
  return (
    <article
      className={`queue-row${item.priority ? " is-priority" : ""}${active ? " is-active" : ""}`}
      data-queue-row="true"
      data-queue-number={item.number}
      tabIndex={0}
      aria-current={active ? "true" : undefined}
      onFocus={() => window.dispatchEvent(new CustomEvent("mergeflow:queue-active", { detail: item.number }))}
    >
      <div className="queue-row-content">
        <div className="queue-row-header">
          <span className="rank mono">{item.rank}</span>
          <h3>{item.title}</h3>
          <span className="mono pr-number">{item.number}</span>
          <span className="author-badge">{item.author}</span>
          <span className={item.priority ? "status-chip status-chip-coral" : "status-chip status-chip-neutral"}>{item.status}</span>
        </div>
        <p className="queue-reason">{item.reason}</p>
      </div>
      <p className="queue-meta mono">{`${item.files}, ${item.age}`}</p>
    </article>
  );
}

export function Queue() {
  const bandRef = useRef<HTMLElement | null>(null);
  const [activeNumber, setActiveNumber] = useState(pullRequests[0].number);
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    const band = bandRef.current;
    if (!band) return;
    const activate = (event: Event) => {
      const number = (event as CustomEvent<string>).detail;
      if (pullRequests.some((item) => item.number === number)) setActiveNumber(number);
    };
    band.classList.add("queue-enhanced");
    window.addEventListener("mergeflow:queue-active", activate);
    setEnhanced(true);
    return () => {
      window.removeEventListener("mergeflow:queue-active", activate);
      band.classList.remove("queue-enhanced");
    };
  }, []);

  return (
    <section className="queue-band band-cream" id="queue" aria-labelledby="queue-title" ref={bandRef}>
      <div className="queue-layout band-inner">
        <div className="queue-list-column">
          <h2 className="section-title" id="queue-title">{queueCopy.title}</h2>
          <ul className="filter-list" aria-label="Queue filters">
            {queueCopy.filters.map((filter, index) => (
              <li className={index === 0 ? "filter-pill is-selected" : "filter-pill"} key={filter}>{filter}</li>
            ))}
          </ul>
          <div className="queue-list">
            {pullRequests.map((item) => <QueueRow item={item} active={activeNumber === item.number} key={item.number} />)}
          </div>
        </div>
        <aside className="queue-inspector" aria-label="Pull request signals">
          <div className="queue-signal-stack">
            {pullRequests.map((item) => {
              const details = queueSignalDetails[item.number];
              const active = activeNumber === item.number;
              const needsAttention = details.status === "Review first" || details.status === "Needs info";
              return (
                <div
                  className={`queue-signal-panel${active ? " is-active" : ""}`}
                  data-queue-panel={item.number}
                  aria-hidden={enhanced && !active}
                  key={item.number}
                >
                  <div className="inspector-header">
                    <h3 id={`inspector-title-${item.number}`}><span className="inspector-title-prefix">{queueCopy.inspectorTitlePrefix}</span><span className="mono inspector-title-number">{item.number}</span><span>{queueCopy.inspectorTitleSuffix}</span></h3>
                    <span className={needsAttention ? "status-chip status-chip-coral" : "status-chip status-chip-neutral"}>{details.status}</span>
                  </div>
                  <ul className="signal-list">
                    {queueCopy.signals.map((signal, signalIndex) => (
                      <li className="signal-item" key={signal.name}>
                        <div className="signal-topline">
                          <div className="signal-name-wrap">
                            <span className="signal-result">{signal.result}</span>
                            <span className="signal-name mono">{signal.name}</span>
                          </div>
                          <span className="signal-weight mono">{signal.weight}</span>
                        </div>
                        <p>{details.descriptions[signalIndex]}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <div className="inspector-actions">
            {queueCopy.actions.map((action) => <button type="button" key={action}>{action}</button>)}
          </div>
        </aside>
      </div>
    </section>
  );
}
