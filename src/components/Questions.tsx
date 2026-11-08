import { useEffect, useState } from "react";
import { questionsCopy } from "../data/content";

export function Questions() {
  const [hydrated, setHydrated] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => setHydrated(true), []);

  return (
    <section className="questions-band band-cream" id="questions" aria-labelledby="questions-title">
      <div className="questions-inner band-inner">
        <h2 className="section-title" id="questions-title">{questionsCopy.title}</h2>
        <div className="faq-list">
          {questionsCopy.items.map((item, index) => {
            const isOpen = !hydrated || openIndex === index;
            const answerId = `faq-answer-${index + 1}`;
            return (
              <article className="faq-item" key={item.question}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span>{item.question}</span>
                    <span className="faq-mark" aria-hidden="true">{isOpen ? "−" : "+"}</span>
                  </button>
                </h3>
                <div className={`faq-answer${isOpen ? " is-open" : ""}`} id={answerId} aria-hidden={!isOpen}>
                  <div className="faq-answer-inner"><p>{item.answer}</p></div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
