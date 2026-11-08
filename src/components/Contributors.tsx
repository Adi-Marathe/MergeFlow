import { contributorsCopy } from "../data/content";

export function Contributors() {
  return (
    <section className="contributors-band band-cream" id="contributors" aria-labelledby="contributors-title">
      <div className="contributors-layout band-inner">
        <div className="contributors-copy">
          <h2 className="section-title" id="contributors-title">{contributorsCopy.title}</h2>
          <p>{contributorsCopy.summary}</p>
        </div>
        <article className="contributor-preview">
          <header className="preview-pr-header">
            <div><h3>{contributorsCopy.pullRequestTitle}</h3><span className="mono">{contributorsCopy.pullRequestNumber}</span></div>
            <span className="mono preview-state">{contributorsCopy.pullRequestState}</span>
          </header>
          <section className="comment-card" aria-label={contributorsCopy.botName} data-contributor-comment="true">
            <header className="comment-header">
              <div className="bot-identity">
                <span className="bot-avatar mono">{contributorsCopy.botInitial}</span>
                <span className="bot-name-group"><span className="bot-name">{contributorsCopy.botName}</span><span className="mono bot-label">{contributorsCopy.botLabel}</span></span>
              </div>
              <span className="mono timestamp">{contributorsCopy.postedAt}</span>
            </header>
            <p><span>{contributorsCopy.comment}</span><code>{contributorsCopy.recheckCommand}</code><span>{contributorsCopy.commentEnd}</span></p>
          </section>
          <section className="checks-card" aria-labelledby="checks-title">
            <h4 id="checks-title">{contributorsCopy.checksLabel}</h4>
            <div className="check-line" data-contributor-check="true">
              <div><span className="mono check-name">{contributorsCopy.checkName}</span><span className="check-status" data-check-status="true">{contributorsCopy.checkStatus}</span></div>
              <span>{contributorsCopy.missingCount}</span>
            </div>
          </section>
        </article>
      </div>
    </section>
  );
}
