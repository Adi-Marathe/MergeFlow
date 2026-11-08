import { Close } from "./components/Close";
import { Contributors } from "./components/Contributors";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { Ledger } from "./components/Ledger";
import { Pile } from "./components/Pile";
import { Questions } from "./components/Questions";
import { Queue } from "./components/Queue";
import { Rules } from "./components/Rules";
import { siteCopy } from "./data/content";
import { usePageMotion } from "./motion/usePageMotion";

export function App() {
  const pageRef = usePageMotion();

  return (
    <>
      <div className="reading-progress" aria-hidden="true" />
      <a className="skip-link" href="#main-content">{siteCopy.skipLink}</a>
      <main id="main-content" ref={pageRef}>
        <Hero />
        <Pile />
        <HowItWorks />
        <Queue />
        <Rules />
        <Contributors />
        <Ledger />
        <Questions />
        <Close />
      </main>
    </>
  );
}
