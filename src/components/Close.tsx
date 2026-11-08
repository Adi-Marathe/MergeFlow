import { ACTION_URLS } from "../constants/urls";
import { closeCopy, heroCopy } from "../data/content";
import { MascotWordmark, NavigationLinks } from "./shared";

export function Close() {
  return (
    <>
      <section className="close-band band-dark" aria-labelledby="close-title">
        <div className="close-glow" data-close-glow="true" aria-hidden="true" />
        <div className="close-inner band-inner">
          <h2 className="close-title" id="close-title">{closeCopy.title}</h2>
          <div className="close-actions">
            <a className="button button-primary" href={ACTION_URLS.install}>{heroCopy.installLabel}</a>
            <a className="button button-secondary" href={ACTION_URLS.demo}>{heroCopy.demoLabel}</a>
          </div>
        </div>
      </section>
      <footer className="site-footer band-dark">
        <div className="footer-inner band-inner">
          <div className="footer-top">
            <MascotWordmark />
            <NavigationLinks footer />
          </div>
          <p>{closeCopy.footerStatement}</p>
        </div>
      </footer>
    </>
  );
}
