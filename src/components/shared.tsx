import { ACTION_URLS } from "../constants/urls";
import { heroCopy, siteCopy } from "../data/content";

export function Brand() {
  return (
    <a className="brand" href="#top" aria-label={siteCopy.brand}>
      <img src="/mascot.png" width="28" height="28" alt="" />
      <span>{siteCopy.brand}</span>
    </a>
  );
}

export function NavigationLinks({ footer = false }: { footer?: boolean }) {
  return (
    <nav aria-label={footer ? siteCopy.footerNavLabel : siteCopy.primaryNavLabel}>
      <ul className="nav-links">
        {siteCopy.navLinks.map((link) => (
          <li key={link.href}><a href={link.href}>{link.label}</a></li>
        ))}
      </ul>
    </nav>
  );
}

export function ActionLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`action-links ${className}`.trim()}>
      <a className="button button-primary" href={ACTION_URLS.install}>{heroCopy.installLabel}</a>
      <a className="button button-secondary" href={ACTION_URLS.demo}>{heroCopy.demoLabel}</a>
    </div>
  );
}

export function MascotWordmark() {
  return (
    <div className="footer-brand">
      <img src="/mascot.png" width="28" height="28" alt="" />
      <span>{siteCopy.brand}</span>
    </div>
  );
}
