import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { Flip } from "gsap/Flip";
import { gsap } from "gsap";
import { rulesCopy, rulesQueueItems, rulesQueueOrder } from "../data/content";

export function Rules() {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [weights, setWeights] = useState(() => rulesCopy.weights.map((weight) => Math.round(weight.value * 100)));
  const queueRef = useRef<HTMLElement | null>(null);
  const currentOrder = useRef<string[]>(rulesQueueOrder.default);
  const desktopMotion = useRef(false);
  const reducedMotion = useRef(false);

  const { contextSafe } = useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference) and (min-width: 1024px)", () => {
      desktopMotion.current = true;
      return () => { desktopMotion.current = false; };
    });
    media.add("(prefers-reduced-motion: reduce)", () => {
      reducedMotion.current = true;
      return () => { reducedMotion.current = false; };
    });
    return () => media.revert();
  }, { scope: queueRef });

  const reorderQueue = contextSafe((order: string[], animate = true) => {
    const queue = queueRef.current;
    if (!queue) return;

    const rows = [...queue.querySelectorAll<HTMLElement>("[data-order-number]")];
    const state = desktopMotion.current && animate ? Flip.getState(rows) : undefined;
    const rowsByNumber = new Map(rows.map((row) => [row.dataset.orderNumber ?? "", row]));

    order.forEach((number, index) => {
      const row = rowsByNumber.get(number);
      if (!row) return;
      const rank = row.querySelector<HTMLElement>(".compact-rank");
      if (rank) rank.textContent = String(index + 1);
      row.setAttribute("aria-posinset", String(index + 1));
      queue.append(row);
    });

    currentOrder.current = order;
    if (state) Flip.from(state, { duration: 0.5, ease: "expo.out", scale: false });
    else if (reducedMotion.current) gsap.fromTo(queue, { opacity: 0.72 }, { opacity: 1, duration: 0.2, ease: "none", overwrite: true });
  });

  return (
    <section className="rules-band band-dark" id="rules" aria-labelledby="rules-title">
      <div className="rules-layout band-inner">
        <div className="rules-controls">
          <h2 className="section-title" id="rules-title">{rulesCopy.title}</h2>
          <p className="rules-summary">{rulesCopy.summary}</p>
          <div className="preset-list" role="group" aria-label="Rule presets">
            {rulesCopy.presets.map((preset, index) => (
              <button
                type="button"
                className={selectedPreset === index ? "preset-pill is-selected" : "preset-pill"}
                aria-pressed={selectedPreset === index}
                onClick={() => {
                  setSelectedPreset(index);
                  const preset = rulesQueueOrder.presets[index];
                  setWeights(preset.weights);
                  reorderQueue(preset.order);
                }}
                key={preset}
              >{preset}</button>
            ))}
          </div>
          <div className="weight-list">
            {rulesCopy.weights.map((weight, index) => (
              <label className="weight-control" key={weight.label}>
                <span className="weight-label-row">
                  <span className="mono">{weight.label}</span>
                  <output className="mono" htmlFor={`weight-${weight.label}`}>{(weights[index] / 100).toFixed(2)}</output>
                </span>
                <input
                  id={`weight-${weight.label}`}
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={weights[index]}
                  aria-valuetext={(weights[index] / 100).toFixed(2)}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    setSelectedPreset(-1);
                    setWeights((current) => current.map((currentValue, valueIndex) => valueIndex === index ? value : currentValue));
                    const position = value < Math.round(weight.value * 100) ? "low" : value > Math.round(weight.value * 100) ? "high" : "default";
                    const orders = rulesQueueOrder.byWeight[weight.label as keyof typeof rulesQueueOrder.byWeight];
                    reorderQueue(orders[position]);
                  }}
                />
              </label>
            ))}
          </div>
          <button
            type="button"
            className="replay-button"
            onClick={() => {
              const destination = [...currentOrder.current];
              reorderQueue(rulesQueueOrder.default, false);
              requestAnimationFrame(() => reorderQueue(destination, true));
            }}
          >{rulesCopy.replayLabel}</button>
        </div>
        <aside className="compact-queue" aria-label="Queue preview" ref={queueRef}>
          {rulesQueueItems.map((item) => (
            <article className={`compact-row${item.priority ? " is-priority" : ""}`} data-order-number={item.number} aria-posinset={item.rank} aria-setsize={rulesQueueItems.length} key={item.number}>
              <div className="compact-row-main">
                <span className="mono compact-rank">{item.rank}</span>
                <h3>{item.title}</h3>
                <span className="mono compact-number">{item.number}</span>
              </div>
              <span className={item.priority ? "status-chip status-chip-coral" : "status-chip status-chip-outline"}>{item.status}</span>
            </article>
          ))}
        </aside>
      </div>
    </section>
  );
}
