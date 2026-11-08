import { ledgerCopy } from "../data/content";

export function Ledger() {
  return (
    <section className="ledger-band band-dark" aria-labelledby="ledger-title">
      <div className="ledger-inner band-inner">
        <h2 className="section-title" id="ledger-title">{ledgerCopy.title}</h2>
        <ul className="ledger-list">
          {ledgerCopy.principles.map((principle) => (
            <li key={principle} data-ledger-item="true">
              <span className="ledger-copy">{principle}</span>
              <svg className="ledger-rule" viewBox="0 0 1000 2" preserveAspectRatio="none" aria-hidden="true">
                <line data-ledger-rule="true" x1="0" y1="1" x2="1000" y2="1" />
              </svg>
            </li>
          ))}
        </ul>
        <p className="ledger-disclaimer">{ledgerCopy.disclaimer}</p>
      </div>
    </section>
  );
}
