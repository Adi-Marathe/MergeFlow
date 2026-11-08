import { heroQueueItems, howItWorksCopy, pullRequests } from "../data/content";

function ImpactGraph() {
  const center = { x: 240, y: 145 };

  return (
    <svg className="impact-graph" viewBox="0 0 480 290" role="img" aria-label={howItWorksCopy.graphAlt}>
      {howItWorksCopy.graphFiles.map((file) => (
        <line
          key={`edge-${file.label}`}
          x1={center.x}
          y1={center.y}
          x2={file.x}
          y2={file.y}
          className={`graph-edge graph-edge-${file.style}`}
          data-graph-edge="true"
        />
      ))}
      {howItWorksCopy.graphFiles.map((file) => (
        <g
          className="graph-dependent"
          key={file.label}
          data-node-x={file.x}
          data-node-y={file.y}
          transform={`translate(${file.x}, ${file.y})`}
        >
          <rect
            x={file.label.length > 20 ? -75 : -68}
            y={file.style === "filled" ? -18 : -16}
            width={file.label.length > 20 ? 150 : 136}
            height={file.style === "filled" ? 36 : 32}
            rx={file.style === "filled" ? 18 : 16}
            className={`graph-node graph-node-${file.style}`}
          />
          <text x="0" y="4" textAnchor="middle" className="graph-label">{file.label}</text>
        </g>
      ))}
      <g className="graph-changed" transform={`translate(${center.x}, ${center.y})`}>
        <circle r="64" className="graph-halo" />
        <circle r="54" className="graph-node-active" />
        <text x="0" y="4" textAnchor="middle" className="graph-label graph-label-active">{howItWorksCopy.changedFile}</text>
      </g>
    </svg>
  );
}

function ImpactHeader({ eyebrow }: { eyebrow: string }) {
  return (
    <header className="impact-header">
      <div>
        <p className="pipeline-eyebrow mono">{eyebrow}</p>
        <h3>{howItWorksCopy.graphTitle}</h3>
      </div>
      <span className="mono">{howItWorksCopy.graphNumber}</span>
    </header>
  );
}

function WeightedValue({ value }: { value: string }) {
  const digits = value.split(".")[1] ?? "00";

  return (
    <span className="pipeline-weight-value mono" aria-label={value}>
      <span className="pipeline-weight-static">{value}</span>
      <span className="pipeline-weight-odometer" aria-hidden="true">
        <span>0.</span>
        {digits.split("").map((digit, index) => (
          <span className="pipeline-digit-window" key={`${index}-${digit}`}>
            <span className="pipeline-digit-strip" data-target-digit={digit}>
              {Array.from({ length: 10 }, (_, number) => <span key={number}>{number}</span>)}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}

function PipelineState({ stageIndex, mobile = false }: { stageIndex: number; mobile?: boolean }) {
  if (stageIndex === 0) {
    return (
      <div className="pipeline-read-state">
        <ImpactHeader eyebrow="Reads the pull request" />
        <div className="pipeline-read-lines">
          {howItWorksCopy.readLines.map((line) => (
            <div className="pipeline-line-mask" key={line}>
              <span className="pipeline-read-line">{line}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (stageIndex === 1) {
    return (
      <div className="pipeline-check-state">
        <ImpactHeader eyebrow="Checks your rules" />
        <ul className="pipeline-check-list">
          {howItWorksCopy.checks.map((check) => (
            <li className="pipeline-check-row" data-check-row="true" key={check.label}>
              <span className={`pipeline-check-status is-${check.status}`}>{check.status}</span>
              <span className="pipeline-check-label">{check.label}</span>
              <span className="pipeline-check-value">{check.value}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (stageIndex === 2) {
    return (
      <div className="pipeline-graph-state">
        <ImpactHeader eyebrow="Traces the graph" />
        <div className="graph-wrap"><ImpactGraph /></div>
        <footer className="impact-footer">
          <span>{howItWorksCopy.overlapLabel}</span>{" "}
          <span className="mono">{howItWorksCopy.overlapNumber}</span>
        </footer>
      </div>
    );
  }

  return (
    <div className="pipeline-rank-state">
      <ImpactHeader eyebrow="Ranks it and says why" />
      <ul className="pipeline-weight-list">
        {howItWorksCopy.weights.map((weight) => (
          <li className="pipeline-weight-row" key={weight.label}>
            <span>{weight.label}</span>
            <WeightedValue value={weight.value} />
          </li>
        ))}
      </ul>
      <span className="status-chip status-chip-coral pipeline-result-chip">{howItWorksCopy.resultStatus}</span>
      {mobile && (
        <ol className="pipeline-mobile-queue">
          {heroQueueItems.map((item) => (
            <li key={item.number}>
              <span className="mono">{item.rank}</span>
              <span>{item.title}</span>
              <span className="mono">{item.number}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function DockQueue() {
  return (
    <div className="pipeline-queue-dock" aria-hidden="true">
      <div className="pipeline-coral-glow" data-pipeline-glow="true" />
      <ol className="pipeline-dock-rows">
        {heroQueueItems.map((item, index) => (
          <li className={`pipeline-dock-row${index === 0 ? " is-dock-target" : ""}`} data-dock-row="true" key={item.number}>
            <span className="mono pipeline-dock-rank">{item.rank}</span>
            <span className="pipeline-dock-title">{item.title}</span>
            <span className="mono pipeline-dock-number">{item.number}</span>
            {item.priority && <span className="status-chip status-chip-coral">{item.status}</span>}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section className="how-band band-dark" id="how-it-works" aria-labelledby="how-title" data-how-band="true">
      <div className="how-layout band-inner">
        <div className="how-copy">
          <h2 className="section-title" id="how-title">{howItWorksCopy.title}</h2>
          <ol className="process-stages">
            {howItWorksCopy.stages.map((stage, index) => (
              <li className="stage" data-stage-indicator={index} key={stage.title}>
                <button
                  className="stage-select"
                  type="button"
                  data-stage-select={index}
                  aria-pressed={index === 0}
                >
                  {stage.title}
                </button>
                <p>{stage.detail}</p>
                <div className="mobile-pipeline-state" data-mobile-pipeline-state={index} aria-hidden="true">
                  <div className="impact-card pipeline-mobile-card">
                    <PipelineState stageIndex={index} mobile />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="pipeline-visual" data-pipeline-visual="true">
          <div className="pipeline-card-flight" data-pipeline-flight="true">
            <article className="impact-card pipeline-card" data-pipeline-card="true" aria-hidden="true">
              <div className="pipeline-panels">
                {howItWorksCopy.stages.map((stage, index) => (
                  <section className="pipeline-panel" data-pipeline-panel={index} key={stage.title}>
                    <PipelineState stageIndex={index} />
                  </section>
                ))}
              </div>
              <div className="pipeline-compact-row" data-pipeline-compact="true">
                <span className="mono pipeline-dock-rank">{heroQueueItems[0].rank}</span>
                <span className="pipeline-dock-title">{heroQueueItems[0].title}</span>
                <span className="mono pipeline-dock-number">{heroQueueItems[0].number}</span>
                <span className="status-chip status-chip-coral">{heroQueueItems[0].status}</span>
              </div>
            </article>
          </div>
          <DockQueue />
        </div>
      </div>
    </section>
  );
}
