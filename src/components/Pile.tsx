import { pileCopy } from "../data/content";

export function Pile() {
  const items = (duplicate = false) => pileCopy.items.map((item, index) => (
    <li className="pile-pill" key={`${duplicate ? "copy-" : ""}${item.number}-${index}`}>
      <span>{item.title}</span><span className="mono">{item.number}</span>
    </li>
  ));

  return (
    <section className="pile-band band-cream" aria-labelledby="pile-title">
      <div className="pile-inner band-inner">
        <h2 className="pile-statement" id="pile-title">
          <span className="pile-lead">{pileCopy.lead}</span><span className="pile-conclusion">{pileCopy.conclusion}</span>
        </h2>
        <div className="pile-rail">
          <div className="pile-track" data-pile-track="true">
            <ul className="pile-items">{items()}</ul>
            <ul className="pile-items pile-items-clone" aria-hidden="true">{items(true)}</ul>
          </div>
        </div>
      </div>
    </section>
  );
}
