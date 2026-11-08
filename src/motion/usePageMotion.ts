import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import Lenis from "lenis";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Flip } from "gsap/Flip";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { contributorsCopy } from "../data/content";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, Flip, DrawSVGPlugin);

function present(elements: Array<Element | null | undefined>) {
  return elements.filter((element): element is Element => Boolean(element));
}

function clearStartingStyles(elements: Element[], properties = "opacity,transform") {
  gsap.set(elements, { clearProps: properties });
}

function queueScrollTriggers(page: HTMLElement) {
  const rows = [...page.querySelectorAll<HTMLElement>("[data-queue-row]")]
    .filter((row) => getComputedStyle(row).display !== "none");
  const triggers = rows.map((row) => {
    const activate = () => window.dispatchEvent(new CustomEvent("mergeflow:queue-active", { detail: row.dataset.queueNumber }));
    return ScrollTrigger.create({ trigger: row, start: "center center", onEnter: activate, onEnterBack: activate });
  });
  return () => triggers.forEach((trigger) => trigger.kill());
}

function animateHeadings(page: HTMLElement, onReveal?: (heading: HTMLElement) => void) {
  const headingNodes = [...page.querySelectorAll<HTMLElement>("section h2")];
  const splits: SplitText[] = [];
  const triggers: ScrollTrigger[] = [];
  const tweens: gsap.core.Tween[] = [];

  headingNodes.forEach((heading) => {
    let split: SplitText | undefined;
    let revealTrigger: ScrollTrigger | undefined;
    let revealTween: gsap.core.Tween | undefined;
    let wordTween: gsap.core.Tween | undefined;

    try {
      split = SplitText.create(heading, {
        type: "lines,words",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          revealTrigger?.kill();
          revealTween?.kill();
          wordTween?.scrollTrigger?.kill();
          wordTween?.kill();

          gsap.set(self.lines, { yPercent: 110, opacity: 0 });
          revealTrigger = ScrollTrigger.create({
            trigger: heading,
            start: "top 80%",
            once: true,
            onEnter: () => {
              revealTween = gsap.to(self.lines, {
                yPercent: 0,
                opacity: 1,
                duration: 0.9,
                ease: "expo.out",
                stagger: 0.04,
                onComplete: () => clearStartingStyles(self.lines),
              });
              tweens.push(revealTween);
            },
          });
          triggers.push(revealTrigger);

          if (heading.classList.contains("pile-statement")) {
            wordTween = gsap.fromTo(self.words, { opacity: 0.25 }, {
              opacity: 1,
              duration: 0.2,
              stagger: { each: 0.08 },
              ease: "none",
              scrollTrigger: {
                trigger: heading,
                start: "top 75%",
                end: "bottom 55%",
                scrub: true,
              },
            });
            tweens.push(wordTween);
          }
        },
      });
      splits.push(split);
      onReveal?.(heading);
    } catch {
      split?.revert();
      clearStartingStyles([heading]);
    }
  });

  return { splits, triggers, tweens };
}

export function usePageMotion() {
  const pageRef = useRef<HTMLElement | null>(null);

  useGSAP(() => {
    const page = pageRef.current;
    if (!page) return;

    const heroShell = page.querySelector<HTMLElement>(".hero-shell");
    const hero = page.querySelector<HTMLElement>(".hero-band");
    const heroHeading = page.querySelector<HTMLElement>(".hero-title");
    const heroHeadingAccessibleName = heroHeading?.getAttribute("aria-label");
    const navigation = page.querySelector<HTMLElement>(".hero-nav");
    const summary = page.querySelector<HTMLElement>(".hero-summary");
    const actions = [...page.querySelectorAll<HTMLElement>(".hero-actions .button")];
    const graphCard = page.querySelector<HTMLElement>(".hero-graph");
    const queue = page.querySelector<HTMLElement>(".hero-queue") ?? graphCard;
    const flipCard = page.querySelector<HTMLElement>(".hero-flip-card") ?? graphCard;
    const heroQueueRows = [...page.querySelectorAll<HTMLElement>(".hero-queue-row")];
    const glass = page.querySelector<HTMLElement>(".hero-glass-stage");
    const facts = page.querySelector<HTMLElement>(".facts-band");
    const pile = page.querySelector<HTMLElement>(".pile-band");
    const pileTrack = page.querySelector<HTMLElement>("[data-pile-track]");
    const howBand = page.querySelector<HTMLElement>("[data-how-band]");
    const cardFlight = page.querySelector<HTMLElement>("[data-pipeline-flight]");
    const pipelineCard = page.querySelector<HTMLElement>("[data-pipeline-card]");
    const pipelineVisual = page.querySelector<HTMLElement>("[data-pipeline-visual]");
    const contributorBand = page.querySelector<HTMLElement>(".contributors-band");
    const contributorCheck = page.querySelector<HTMLElement>("[data-contributor-check]");
    const contributorStatus = page.querySelector<HTMLElement>("[data-check-status]");
    const contributorComment = page.querySelector<HTMLElement>("[data-contributor-comment]");
    const ledgerBand = page.querySelector<HTMLElement>(".ledger-band");
    const ledgerItems = [...page.querySelectorAll<HTMLElement>("[data-ledger-item]")];
    const ledgerCopies = [...page.querySelectorAll<HTMLElement>(".ledger-copy")];
    const ledgerRules = [...page.querySelectorAll<SVGLineElement>("[data-ledger-rule]")];
    const closeBand = page.querySelector<HTMLElement>(".close-band");
    const closeGlow = page.querySelector<HTMLElement>("[data-close-glow]");

    if (!heroShell || !hero || !heroHeading || !navigation || !summary || !queue || !flipCard || !glass || !facts || !pile || !pileTrack || !howBand || !cardFlight || !pipelineCard || !pipelineVisual || !contributorBand || !contributorCheck || !contributorStatus || !contributorComment || !ledgerBand || ledgerItems.length !== 4 || ledgerCopies.length !== 4 || ledgerRules.length !== 4 || !closeBand || !closeGlow) return;

    const media = gsap.matchMedia();
    let selectHowStage: ((index: number) => void) | undefined;
    const onStageSelect = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest<HTMLButtonElement>("[data-stage-select]");
      if (!button || !howBand.contains(button)) return;

      const index = Number(button.dataset.stageSelect);
      if (!Number.isInteger(index) || index < 0 || index > 3) return;

      if (selectHowStage) {
        selectHowStage(index);
        return;
      }

      page.querySelectorAll<HTMLButtonElement>("[data-stage-select]").forEach((stageButton) => {
        stageButton.setAttribute("aria-pressed", String(stageButton === button));
      });
      const mobileState = howBand.querySelector<HTMLElement>(`[data-mobile-pipeline-state="${index}"]`);
      mobileState?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "center",
      });
    };
    howBand.addEventListener("click", onStageSelect);

    media.add("(prefers-reduced-motion: no-preference)", () => queueScrollTriggers(page));

    media.add("(prefers-reduced-motion: no-preference) and (min-width: 1024px)", () => {
      const entranceTargets = present([navigation, summary, flipCard, glass, facts]);
      const heroRiseTargets = present([summary, ...actions]);
      const heroQueueTargets = present([flipCard]);
      const trackItems = [...pileTrack.querySelectorAll<HTMLElement>(".pile-items")];
      const firstTrackSet = trackItems[0];
      const headingMotion = animateHeadings(page);
      let lenis: Lenis | undefined;
      let lenisTick: ((time: number) => void) | undefined;
      let pileTicker: gsap.core.Tween | undefined;
      let glassDrift: gsap.core.Tween | undefined;
      let heroSplit: SplitText | undefined;
      let heroEntrance: gsap.core.Timeline | undefined;
      let heroPointerMove: ((event: PointerEvent) => void) | undefined;
      let heroPointerLeave: (() => void) | undefined;
      let master: gsap.core.Timeline | undefined;
      let dockTween: gsap.core.Tween | undefined;
      let activeStageUpdate: (() => void) | undefined;
      let onLenisScroll: ((event: { velocity: number }) => void) | undefined;
      let contributorTrigger: ScrollTrigger | undefined;
      let contributorTimeline: gsap.core.Timeline | undefined;
      let ledgerTrigger: ScrollTrigger | undefined;
      let ledgerTimeline: gsap.core.Timeline | undefined;
      let closeGlowTween: gsap.core.Tween | undefined;
      let heroLoop: gsap.core.Timeline | undefined;
      let activeHeroFlip: gsap.core.Animation | undefined;
      let heroQueuePointerEnter: (() => void) | undefined;
      let heroQueuePointerLeave: (() => void) | undefined;
      let heroQueueFocusIn: (() => void) | undefined;
      let heroQueueFocusOut: ((event: FocusEvent) => void) | undefined;
      let resetHeroQueue: (() => void) | undefined;
      let dockApplied = false;

      try {
        const panelNodes = [...pipelineCard.querySelectorAll<HTMLElement>("[data-pipeline-panel]")];
        const stageNodes = [...howBand.querySelectorAll<HTMLElement>("[data-stage-indicator]")];
        const readLines = [...pipelineCard.querySelectorAll<HTMLElement>(".pipeline-read-line")];
        const checkRows = [...pipelineCard.querySelectorAll<HTMLElement>("[data-check-row]")];
        const graphEdges = [...pipelineCard.querySelectorAll<SVGLineElement>("[data-graph-edge]")];
        const graphDependents = [...pipelineCard.querySelectorAll<SVGGElement>(".graph-dependent")];
        const weightStatics = [...pipelineCard.querySelectorAll<HTMLElement>(".pipeline-weight-static")];
        const weightOdometers = [...pipelineCard.querySelectorAll<HTMLElement>(".pipeline-weight-odometer")];
        const digitStrips = [...pipelineCard.querySelectorAll<HTMLElement>(".pipeline-digit-strip")];
        const resultChip = pipelineCard.querySelector<HTMLElement>(".pipeline-result-chip");
        const compactRow = pipelineCard.querySelector<HTMLElement>("[data-pipeline-compact]");
        const dockRows = [...pipelineVisual.querySelectorAll<HTMLElement>("[data-dock-row]")];
        const dockGlow = pipelineVisual.querySelector<HTMLElement>("[data-pipeline-glow]");
        const heroTargets = present([heroShell, hero, heroHeading, navigation, summary, queue, flipCard, glass, facts]);

        if (panelNodes.length !== 4 || stageNodes.length !== 4 || !firstTrackSet || !compactRow || !dockGlow) {
          throw new Error("The pipeline scene is missing required stage elements.");
        }

        gsap.set(entranceTargets, { opacity: 0 });
        gsap.set(heroRiseTargets, { y: 16 });
        gsap.set(heroQueueTargets, { y: 22 });
        gsap.set(heroQueueRows, { opacity: 0, y: 12 });
        gsap.set(flipCard, { transformPerspective: 900, transformOrigin: "50% 50%", rotationX: 0, rotationY: 0 });

        gsap.set(panelNodes, { opacity: 0 });
        gsap.set(stageNodes, { opacity: 0.7 });
        gsap.set(stageNodes[0], { opacity: 1 });
        gsap.set(readLines, { yPercent: 110, opacity: 0 });
        gsap.set(checkRows, { x: -10, opacity: 0.35 });
        gsap.set(graphEdges, { svgOrigin: "240 145", scaleX: 0 });
        gsap.set(graphDependents, {
          attr: {
            transform: (_index, element) => `translate(${element.dataset.nodeX}, ${Number(element.dataset.nodeY) + 8})`,
          },
          opacity: 0.25,
        });
        gsap.set(weightStatics, { opacity: 0 });
        gsap.set(weightOdometers, { display: "flex", opacity: 1 });
        gsap.set(digitStrips, { yPercent: 0 });
        gsap.set(present([resultChip]), { opacity: 0, scale: 0.94 });
        gsap.set(compactRow, { opacity: 0 });
        gsap.set(dockRows.filter((_, index) => index === 0), { opacity: 0 });
        gsap.set(dockRows.slice(1), { y: 10, opacity: 0 });
        gsap.set(dockGlow, { scale: 0.82, opacity: 0 });
        contributorStatus.textContent = contributorsCopy.pendingStatus;
        gsap.set(contributorComment, { y: 24, opacity: 0 });
        gsap.set(ledgerCopies, { y: 24, opacity: 0 });
        gsap.set(ledgerRules, { svgOrigin: "0 1", scaleX: 0 });
        gsap.set(closeGlow, { y: 180, opacity: 0 });

        howBand.classList.add("is-animated-scene");

        const cardStart = pipelineCard.getBoundingClientRect();
        pipelineCard.classList.add("is-docked");
        const cardDocked = pipelineCard.getBoundingClientRect();
        pipelineCard.classList.remove("is-docked");
        const dockStart = {
          x: cardStart.left - cardDocked.left,
          y: cardStart.top - cardDocked.top,
          scaleX: cardStart.width / cardDocked.width,
          scaleY: cardStart.height / cardDocked.height,
        };
        gsap.set(pipelineCard, { transformOrigin: "0% 0%" });
        dockTween = gsap.fromTo(pipelineCard, dockStart, {
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          duration: 1,
          ease: "none",
          paused: true,
          immediateRender: false,
        });

        lenis = new Lenis({ anchors: true });
        onLenisScroll = (event) => {
          ScrollTrigger.update();
          pileTicker?.timeScale(1 + Math.min(Math.abs(event.velocity) * 0.15, 3));
        };
        lenis.on("scroll", onLenisScroll);
        lenisTick = (time: number) => lenis?.raf(time * 1000);
        gsap.ticker.add(lenisTick);
        gsap.ticker.lagSmoothing(0);

        pileTrack.classList.add("is-running");
        const trackGap = Number.parseFloat(getComputedStyle(pileTrack).columnGap || getComputedStyle(pileTrack).gap || "0");
        const tickerDistance = firstTrackSet.getBoundingClientRect().width + trackGap;
        if (tickerDistance > 0) {
          pileTicker = gsap.to(pileTrack, {
            x: -tickerDistance,
            duration: tickerDistance / 40,
            ease: "none",
            repeat: -1,
          });
        }

        glassDrift = gsap.to(glass, {
          y: -5,
          duration: 9,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });

        const tiltX = gsap.quickTo(flipCard, "rotationX", { duration: 0.55, ease: "power2.out" });
        const tiltY = gsap.quickTo(flipCard, "rotationY", { duration: 0.55, ease: "power2.out" });
        const pointerMove = (event: PointerEvent) => {
          const bounds = flipCard.getBoundingClientRect();
          if (bounds.width === 0 || bounds.height === 0) return;
          const x = (event.clientX - bounds.left) / bounds.width - 0.5;
          const y = (event.clientY - bounds.top) / bounds.height - 0.5;
          tiltX(gsap.utils.clamp(-2.5, 2.5, -y * 5));
          tiltY(gsap.utils.clamp(-2.5, 2.5, x * 5));
        };
        const pointerLeave = () => {
          tiltX(0);
          tiltY(0);
        };
        heroPointerMove = pointerMove;
        heroPointerLeave = pointerLeave;
        flipCard.addEventListener("pointermove", pointerMove);
        flipCard.addEventListener("pointerleave", pointerLeave);

        const exit = gsap.timeline({
          scrollTrigger: {
            trigger: pile,
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });
        exit.to(heroShell, { scale: 0.94, opacity: 0.44, ease: "none" });

        heroSplit = SplitText.create(heroHeading, {
          type: "lines",
          autoSplit: true,
          onSplit(self) {
            gsap.set(self.lines, { yPercent: 110, opacity: 0 });
            heroEntrance = gsap.timeline({
              onComplete: () => clearStartingStyles(present([
                ...self.lines,
                navigation,
                summary,
                ...actions,
                queue,
                flipCard,
                ...heroQueueRows,
                facts,
              ])),
            });
            heroEntrance.to(self.lines, {
              yPercent: 0,
              opacity: 1,
              duration: 1,
              ease: "expo.out",
              stagger: 0.09,
            });
            heroEntrance.to(heroRiseTargets, {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: "power2.out",
              stagger: 0.12,
            }, ">");
            heroEntrance.to(heroQueueTargets, {
              y: 0,
              opacity: 1,
              duration: 0.72,
              ease: "expo.out",
            }, ">");
            heroEntrance.to(heroQueueRows, {
              y: 0,
              opacity: 1,
              duration: 0.48,
              ease: "expo.out",
              stagger: 0.06,
            }, ">");
            heroEntrance.to(facts, { opacity: 1, duration: 0.42, ease: "power2.out" }, ">");
            heroEntrance.to(navigation, { opacity: 1, duration: 0.42, ease: "power2.out" }, ">");
            ScrollTrigger.refresh();
            return heroEntrance;
          },
        });
        if (heroHeadingAccessibleName) heroHeading.setAttribute("aria-label", heroHeadingAccessibleName);

        const progressClock = { progress: 0 };
        master = gsap.timeline({
          scrollTrigger: {
            trigger: howBand,
            start: "top top",
            end: "+=900vh",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });
        master.to(progressClock, { progress: 1, duration: 10, ease: "none" }, 0);
        master.fromTo(cardFlight, { x: 160, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "none" }, 0);

        const stageStarts = [1, 3, 5, 7];
        selectHowStage = (index) => {
          const timeline = master;
          const trigger = timeline?.scrollTrigger;
          if (!timeline || !trigger || !lenis) return;

          const targetTime = stageStarts[index] + 0.12;
          const targetScroll = trigger.start + (targetTime / timeline.duration()) * (trigger.end - trigger.start);
          lenis.scrollTo(targetScroll, {
            duration: 0.85,
            easing: (progress) => 1 - Math.pow(1 - progress, 3),
            lock: true,
          });
        };
        master.to(panelNodes[0], { opacity: 1, duration: 0.06, ease: "none" }, stageStarts[0]);
        for (let stageIndex = 1; stageIndex < panelNodes.length; stageIndex += 1) {
          const time = stageStarts[stageIndex];
          master.to(panelNodes[stageIndex - 1], { opacity: 0, duration: 0.05, ease: "none" }, time);
          master.to(panelNodes[stageIndex], { opacity: 1, duration: 0.05, ease: "none" }, time);
          master.to(stageNodes[stageIndex - 1], { opacity: 0.7, duration: 0.06, ease: "none" }, time);
          master.to(stageNodes[stageIndex], { opacity: 1, duration: 0.06, ease: "none" }, time);
        }
        master.to(readLines, {
          yPercent: 0,
          opacity: 1,
          duration: 0.2,
          ease: "expo.out",
          stagger: 0.04,
        }, 1.08);
        master.to(checkRows, {
          x: 0,
          opacity: 1,
          duration: 0.1,
          ease: "none",
          stagger: 0.025,
        }, 3.04);
        master.to(graphEdges, {
          scaleX: 1,
          duration: 0.17,
          ease: "none",
          stagger: 0.015,
        }, 5.04);
        master.to(graphDependents, {
          attr: {
            transform: (_index, element) => `translate(${element.dataset.nodeX}, ${element.dataset.nodeY})`,
          },
          opacity: 1,
          duration: 0.15,
          ease: "power2.out",
          stagger: 0.018,
        }, 5.08);

        master.to(digitStrips, {
          yPercent: (_index, element) => -Number(element.dataset.targetDigit) * 10,
          duration: 0.45,
          ease: "expo.out",
          stagger: 0.035,
        }, 7.08);
        master.to(present([resultChip]), { opacity: 1, scale: 1, duration: 0.12, ease: "none" }, 7.52);

        master.to(panelNodes[3], { opacity: 0, duration: 0.1, ease: "none" }, 8.08);
        master.to(compactRow, { opacity: 1, duration: 0.12, ease: "none" }, 8.22);
        master.to(dockRows.slice(1), { y: 0, opacity: 1, duration: 0.24, ease: "none", stagger: 0.04 }, 8.12);
        master.to(dockGlow, { scale: 1, opacity: 1, duration: 0.3, ease: "none" }, 8.12);

        activeStageUpdate = () => {
          const currentTime = master?.time() ?? 0;
          const dockProgress = gsap.utils.clamp(0, 1, (currentTime - 8.12) / 0.8);
          if (dockProgress > 0 && !dockApplied) {
            pipelineCard.classList.add("is-docked");
            dockApplied = true;
          }
          if (dockApplied) {
            dockTween?.progress(dockProgress);
            if (dockProgress === 0) {
              pipelineCard.classList.remove("is-docked");
              gsap.set(pipelineCard, { clearProps: "transform" });
              dockApplied = false;
            }
          }

          const activeIndex = currentTime < 3 ? 0 : currentTime < 5 ? 1 : currentTime < 7 ? 2 : 3;
          stageNodes.forEach((stageNode, index) => {
            const stageButton = stageNode.querySelector<HTMLButtonElement>("[data-stage-select]");
            stageButton?.setAttribute("aria-pressed", String(index === activeIndex));
            if (index === activeIndex) {
              stageNode.classList.add("is-active");
              stageNode.removeAttribute("aria-current");
            } else {
              stageNode.classList.remove("is-active");
              stageNode.removeAttribute("aria-current");
            }
          });
          stageNodes[activeIndex]?.setAttribute("aria-current", "step");
        };
        master.eventCallback("onUpdate", activeStageUpdate);

        contributorTrigger = ScrollTrigger.create({
          trigger: contributorBand,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.set(contributorCheck, { transformPerspective: 800, transformOrigin: "50% 50%" });
            contributorTimeline = gsap.timeline();
            contributorTimeline.to(contributorCheck, { rotationY: 90, opacity: 0, duration: 0.18, ease: "power1.in" });
            contributorTimeline.call(() => {
              contributorStatus.textContent = contributorsCopy.checkStatus;
              contributorCheck.classList.add("is-resolved");
            });
            contributorTimeline.set(contributorCheck, { rotationY: -90 });
            contributorTimeline.to(contributorCheck, { rotationY: 0, opacity: 1, duration: 0.18, ease: "power1.out" });
            contributorTimeline.fromTo(contributorComment, { y: 24, opacity: 0 }, {
              y: 0,
              opacity: 1,
              duration: 0.65,
              ease: "expo.out",
            }, ">0.06");
          },
        });

        ledgerTimeline = gsap.timeline({ paused: true });
        ledgerItems.forEach((_, index) => {
          const start = index * 0.12;
          ledgerTimeline?.to(ledgerCopies[index], { y: 0, opacity: 1, duration: 0.62, ease: "expo.out" }, start);
          ledgerTimeline?.to(ledgerRules[index], { scaleX: 1, duration: 0.9, ease: "expo.out" }, start);
        });
        ledgerTrigger = ScrollTrigger.create({
          trigger: ledgerBand,
          start: "top 80%",
          once: true,
          onEnter: () => ledgerTimeline?.play(0),
        });

        closeGlowTween = gsap.fromTo(closeGlow, { y: 180, opacity: 0 }, {
          y: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: closeBand, start: "top bottom", end: "center center", scrub: true },
        });

        const heroLoopPreview = new URLSearchParams(window.location.search).get("hero-loop-preview") === "1";
        const heroQueueList = queue.querySelector<HTMLElement>(".hero-queue-list");
        if (heroLoopPreview && heroQueueList && heroQueueRows.length === 5) {
          const sortedRows = [...heroQueueRows];
          resetHeroQueue = () => sortedRows.forEach((row, index) => {
            const rank = row.querySelector<HTMLElement>(".rank");
            if (rank) rank.textContent = String(index + 1);
            heroQueueList.append(row);
          });
          let shuffleIndex = 0;
          let hovered = false;
          let focused = false;
          const animateHeroOrder = (orderedRows: HTMLElement[]) => {
            activeHeroFlip?.kill();
            const flipState = Flip.getState(heroQueueRows);
            orderedRows.forEach((row, index) => {
              const rank = row.querySelector<HTMLElement>(".rank");
              if (rank) rank.textContent = String(index + 1);
              heroQueueList.append(row);
            });
            activeHeroFlip = Flip.from(flipState, { duration: 0.5, ease: "expo.out", scale: false });
          };
          const shuffleHeroRows = () => {
            shuffleIndex += 1;
            const offset = (shuffleIndex % (sortedRows.length - 1)) + 1;
            const rotated = [...sortedRows.slice(offset), ...sortedRows.slice(0, offset)];
            animateHeroOrder(shuffleIndex % 2 === 0 ? rotated.reverse() : rotated);
          };
          const pauseHeroLoop = () => {
            heroLoop?.pause();
            activeHeroFlip?.pause();
          };
          const resumeHeroLoop = () => {
            if (hovered || focused) return;
            activeHeroFlip?.resume();
            heroLoop?.resume();
          };
          const onPointerEnter = () => { hovered = true; pauseHeroLoop(); };
          const onPointerLeave = () => { hovered = false; resumeHeroLoop(); };
          const onFocusIn = () => { focused = true; pauseHeroLoop(); };
          const onFocusOut = (event: FocusEvent) => {
            if (event.relatedTarget instanceof Node && queue.contains(event.relatedTarget)) return;
            focused = false;
            resumeHeroLoop();
          };
          heroQueuePointerEnter = onPointerEnter;
          heroQueuePointerLeave = onPointerLeave;
          heroQueueFocusIn = onFocusIn;
          heroQueueFocusOut = onFocusOut;
          queue.addEventListener("pointerenter", onPointerEnter);
          queue.addEventListener("pointerleave", onPointerLeave);
          queue.addEventListener("focusin", onFocusIn);
          queue.addEventListener("focusout", onFocusOut);

          heroLoop = gsap.timeline({ repeat: -1 });
          heroLoop.to({}, { duration: 8.4 }, 0);
          heroLoop.call(shuffleHeroRows, undefined, 8.4);
          heroLoop.to({}, { duration: 0.5 }, 8.4);
          heroLoop.call(() => animateHeroOrder(sortedRows), undefined, 8.9);
          heroLoop.to({}, { duration: 0.1 }, 8.9);
        }

        const onHeroSplitComplete = () => ScrollTrigger.refresh();
        if (heroSplit && document.fonts?.ready) {
          void document.fonts.ready.then(onHeroSplitComplete).catch(() => undefined);
        }
        ScrollTrigger.refresh();

        return () => {
          selectHowStage = undefined;
          if (heroPointerMove) flipCard.removeEventListener("pointermove", heroPointerMove);
          if (heroPointerLeave) flipCard.removeEventListener("pointerleave", heroPointerLeave);
          if (heroQueuePointerEnter) queue.removeEventListener("pointerenter", heroQueuePointerEnter);
          if (heroQueuePointerLeave) queue.removeEventListener("pointerleave", heroQueuePointerLeave);
          if (heroQueueFocusIn) queue.removeEventListener("focusin", heroQueueFocusIn);
          if (heroQueueFocusOut) queue.removeEventListener("focusout", heroQueueFocusOut);
          heroSplit?.revert();
          headingMotion.triggers.forEach((trigger) => trigger.kill());
          headingMotion.tweens.forEach((tween) => tween.kill());
          headingMotion.splits.forEach((split) => split.revert());
          glassDrift?.kill();
          pileTicker?.kill();
          contributorTrigger?.kill();
          contributorTimeline?.kill();
          ledgerTrigger?.kill();
          ledgerTimeline?.kill();
          closeGlowTween?.scrollTrigger?.kill();
          closeGlowTween?.kill();
          heroLoop?.kill();
          activeHeroFlip?.revert();
          resetHeroQueue?.();
          dockTween?.kill();
          gsap.set(pipelineCard, { clearProps: "transform" });
          pipelineCard.classList.remove("is-docked");
          contributorCheck.classList.remove("is-resolved");
          contributorStatus.textContent = contributorsCopy.checkStatus;
          master?.kill();
          if (lenisTick) gsap.ticker.remove(lenisTick);
          lenis?.destroy();
          howBand.classList.remove("is-animated-scene");
          pipelineCard.classList.remove("is-docked");
          pileTrack.classList.remove("is-running");
          clearStartingStyles(present([
            ...heroTargets,
            cardFlight,
            pipelineCard,
            contributorCheck,
            compactRow,
            ...panelNodes,
            ...stageNodes,
            ...readLines,
            ...checkRows,
            ...graphEdges,
            ...graphDependents,
            ...weightStatics,
            ...weightOdometers,
            ...digitStrips,
            resultChip,
            ...dockRows,
            dockGlow,
            ...heroQueueRows,
            contributorComment,
            ...ledgerCopies,
            ...ledgerRules,
            closeGlow,
          ]), "opacity,transform,width,height");
          clearStartingStyles(present([...weightOdometers]), "display,opacity,transform");
          clearStartingStyles(present([...graphEdges]), "transform");
          clearStartingStyles(ledgerRules, "transform");
        };
      } catch {
        selectHowStage = undefined;
        if (heroPointerMove) flipCard.removeEventListener("pointermove", heroPointerMove);
        if (heroPointerLeave) flipCard.removeEventListener("pointerleave", heroPointerLeave);
        if (heroQueuePointerEnter) queue.removeEventListener("pointerenter", heroQueuePointerEnter);
        if (heroQueuePointerLeave) queue.removeEventListener("pointerleave", heroQueuePointerLeave);
        if (heroQueueFocusIn) queue.removeEventListener("focusin", heroQueueFocusIn);
        if (heroQueueFocusOut) queue.removeEventListener("focusout", heroQueueFocusOut);
        heroSplit?.revert();
        headingMotion.triggers.forEach((trigger) => trigger.kill());
        headingMotion.tweens.forEach((tween) => tween.kill());
        headingMotion.splits.forEach((split) => split.revert());
        glassDrift?.kill();
        pileTicker?.kill();
        contributorTrigger?.kill();
        contributorTimeline?.kill();
        ledgerTrigger?.kill();
        ledgerTimeline?.kill();
        closeGlowTween?.scrollTrigger?.kill();
        closeGlowTween?.kill();
        heroLoop?.kill();
        activeHeroFlip?.revert();
        resetHeroQueue?.();
          dockTween?.kill();
          gsap.set(pipelineCard, { clearProps: "transform" });
        master?.kill();
        if (lenisTick) gsap.ticker.remove(lenisTick);
        lenis?.destroy();
        howBand.classList.remove("is-animated-scene");
        pipelineCard.classList.remove("is-docked");
        contributorCheck.classList.remove("is-resolved");
        contributorStatus.textContent = contributorsCopy.checkStatus;
        pileTrack.classList.remove("is-running");
        clearStartingStyles(present([
          heroShell,
          hero,
          heroHeading,
          navigation,
          summary,
          ...actions,
          queue,
          flipCard,
          ...heroQueueRows,
          glass,
          facts,
          cardFlight,
          pipelineCard,
          ...page.querySelectorAll<HTMLElement>(".pipeline-panel, [data-stage-indicator], .pipeline-read-line, [data-check-row], .graph-dependent, .pipeline-weight-static, .pipeline-weight-odometer, .pipeline-digit-strip, .pipeline-result-chip, [data-pipeline-compact], [data-dock-row], [data-pipeline-glow]"),
          contributorCheck,
          contributorComment,
          ...ledgerCopies,
          closeGlow,
        ]), "opacity,transform,width,height");
        clearStartingStyles([...page.querySelectorAll<HTMLElement>(".pipeline-weight-odometer")], "display,opacity,transform");
        clearStartingStyles([...page.querySelectorAll<SVGLineElement>("[data-graph-edge]")], "transform");
        clearStartingStyles(ledgerRules, "transform");
      }
    });

    media.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(page, { opacity: 0 });
      const fade = gsap.to(page, {
        opacity: 1,
        duration: 0.2,
        ease: "none",
        onComplete: () => clearStartingStyles([page]),
      });

      return () => {
        fade.kill();
        clearStartingStyles([page]);
      };
    });

    return () => {
      howBand.removeEventListener("click", onStageSelect);
      media.revert();
    };
  }, { scope: pageRef });

  return pageRef;
}
