import { pileCopy } from "../data/content";

export function Pile() {
  const items = (duplicate = false) => pileCopy.items.map((path, index) => (
    <li className="pile-pill" key={`${duplicate ? "copy-" : ""}${path}-${index}`}>
      <span className="mono">{path}</span>
    </li>
  ));

  return (
    <section className="pile-band band-cream" aria-labelledby="pile-title">
      <div className="pile-inner band-inner">
        <h2 className="pile-statement" id="pile-title">
          {pileCopy.statement}
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
