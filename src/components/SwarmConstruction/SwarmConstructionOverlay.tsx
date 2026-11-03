import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

const AGENT_COUNT = 4;

// 4 distinct vibrant neon shades: cyan, purple, orange, emerald
const AGENT_COLORS: string[] = [
  '#00F0FF',
  '#A855F7',
  '#FF6B00',
  '#10B981',
];

const AGENT_NAMES: string[] = ['ARCH', 'UI', 'GRID', 'SYNC'];

const GUIDE_COLORS = ['#FF3B5C', '#FF7A00', '#00F0FF'];

interface SavedElementStyle {
  el: HTMLElement;
  opacity: string;
  transform: string;
  transition: string;
  pointerEvents: string;
  willChange: string;
  borderColor?: string;
  backgroundColor?: string;
  backdropFilter?: string;
}

interface AuxiliaryHiddenItem {
  el: HTMLElement;
  sectionKey: string;
  revealOn: 'section-start' | 'section-done';
  mode: 'opacity' | 'shell';
  saved: SavedElementStyle;
  revealed: boolean;
}

interface DiscoveredTask {
  id: number;
  el: HTMLElement;
  sectionKey: string;
  tagLabel: string;
  dimLabel: string;
  pillWidth: number;
  isFixed: boolean;
  isFullBleedBg: boolean;
  isMarqueeTrack: boolean;
  isMajorBlock: boolean;
  docTop: number;
  docLeft: number;
  width: number;
  height: number;
  status: 'queued' | 'flying' | 'building' | 'done';
  dispatchTime: number;
  arrivalTime: number;
  doneTime: number;
  fadeEndTime: number;
  flightDuration: number;
  buildDuration: number;
  primaryColor: string;
  secondaryColor: string;
  guideColor: string;
  guideMode: number; // 0: H+V top-left, 1: H+V bottom-right, 2: center cross
  assignedAgents: number[];
}

interface TrailPoint {
  x: number;
  y: number;
}

interface AgentState {
  id: number;
  name: string;
  namePillWidth: number;
  color: string;
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  idleAnchorX: number;
  idleAnchorY: number;
  angle: number; // degrees
  scale: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitPhase: number;
  state: 'summon' | 'flying' | 'building' | 'idle' | 'converging';
  taskId: number | null;
  role: number; // 0: Top-Edge Sweeper, 1: Bottom-Edge Sweeper, 2: Origin Anchor, 3: Core Inspector
  startX: number;
  startY: number;
  cp1X: number;
  cp1Y: number;
  cp2X: number;
  cp2Y: number;
  flightStartTime: number;
  flightArrivalTime: number;
  curveSign: number;
  trail: TrailPoint[];
}

interface ViewportBox {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function cubicBezier(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const u = 1 - t;
  return (
    u * u * u * p0 +
    3 * u * u * t * p1 +
    3 * u * t * t * p2 +
    t * t * t * p3
  );
}

function lerpAngleDeg(current: number, target: number, factor: number): number {
  const diff = ((target - current + 540) % 360) - 180;
  return current + diff * factor;
}

function isMarqueeElement(el: HTMLElement): boolean {
  return (
    el.classList.contains('animate-marquee') ||
    el.classList.contains('animate-marquee-reverse') ||
    el.classList.contains('animate-marquee-slow') ||
    el.classList.contains('animate-marquee-reverse-slow')
  );
}

function getElementTagLabel(el: HTMLElement): string {
  const tag = el.tagName.toUpperCase();
  if (tag === 'H1') return 'H1 · HERO';
  if (tag === 'H2') return 'H2 · HEADING';
  if (tag === 'H3' || tag === 'H4') return `${tag} · TITLE`;
  if (isMarqueeElement(el)) return 'MARQUEE · TRACK';
  if (tag === 'A' || tag === 'BUTTON') {
    if (el.classList.contains('btn-primary')) return 'CTA · PRIMARY';
    if (el.classList.contains('btn-ghost')) return 'CTA · GHOST';
    return 'ACTION';
  }
  if (tag === 'ARTICLE') return 'PROJECT · CARD';
  if (tag === 'IMG' || el.querySelector('img') || el.querySelector('video')) return 'MEDIA · FRAME';
  if (el.classList.contains('eyebrow')) return 'EYEBROW';
  if (el.getAttribute('role') === 'note') return 'CALLOUT';
  if (tag === 'P' || tag === 'SPAN') return 'TEXT · BLOCK';
  return 'COMPONENT';
}

function getLiveViewportBox(task: DiscoveredTask, currentScrollY: number): ViewportBox {
  const left = task.docLeft;
  const top = task.isFixed ? task.docTop : task.docTop - currentScrollY;
  return {
    left,
    top,
    right: left + task.width,
    bottom: top + task.height,
    width: task.width,
    height: task.height,
  };
}

function saveElementStyle(el: HTMLElement): SavedElementStyle {
  return {
    el,
    opacity: el.style.opacity,
    transform: el.style.transform,
    transition: el.style.transition,
    pointerEvents: el.style.pointerEvents,
    willChange: el.style.willChange,
    borderColor: el.style.borderColor,
    backgroundColor: el.style.backgroundColor,
    backdropFilter: el.style.backdropFilter,
  };
}

/**
 * Dynamically scans the portfolio DOM from top to bottom and collects:
 * 1) All visible visual blocks (`tasks`) to be constructed element-by-element.
 * 2) All auxiliary containers/borders/off-screen carousel clones (`auxItems`)
 *    so ZERO stray borders, backgrounds, cards, or badges are visible prematurely.
 */
function discoverPortfolioElements(): {
  tasks: DiscoveredTask[];
  auxItems: AuxiliaryHiddenItem[];
} {
  const vw = window.innerWidth;
  const scrollY = window.scrollY;
  const isRtl =
    document.documentElement.dir === 'rtl' ||
    Boolean(document.querySelector('[dir="rtl"]'));

  const isRenderedElement = (el: HTMLElement): boolean => {
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') {
      return false;
    }
    const rect = el.getBoundingClientRect();
    return rect.width >= 4 && rect.height >= 4;
  };

  interface RawCandidate {
    el: HTMLElement;
    sectionKey: string;
  }

  const rawCandidates: RawCandidate[] = [];
  const auxItems: AuxiliaryHiddenItem[] = [];
  const seen = new Set<HTMLElement>();
  const seenAux = new Set<HTMLElement>();

  const addAux = (
    el: Element | null,
    sectionKey: string,
    revealOn: 'section-start' | 'section-done',
    mode: 'opacity' | 'shell' = 'opacity'
  ) => {
    if (!el || !(el instanceof HTMLElement) || seenAux.has(el)) return;
    seenAux.add(el);
    auxItems.push({
      el,
      sectionKey,
      revealOn,
      mode,
      saved: saveElementStyle(el),
      revealed: false,
    });
  };

  const canRegisterTask = (el: HTMLElement): boolean => {
    if (seen.has(el)) return false;
    if (!isRenderedElement(el)) return false;
    for (let i = 0; i < rawCandidates.length; i++) {
      const existing = rawCandidates[i].el;
      if (existing.contains(el) || el.contains(existing)) {
        return false;
      }
    }
    return true;
  };

  const addCandidate = (el: Element | null, sectionKey: string) => {
    if (!el || !(el instanceof HTMLElement)) return;
    if (!canRegisterTask(el)) return;
    seen.add(el);
    rawCandidates.push({ el, sectionKey });
  };

  const addSelectorAll = (
    root: ParentNode,
    selector: string,
    sectionKey: string,
    isHorizontalSliderCards = false
  ) => {
    const nodes = root.querySelectorAll(selector);
    nodes.forEach((node) => {
      if (!(node instanceof HTMLElement)) return;
      if (!isRenderedElement(node)) return;

      if (isHorizontalSliderCards) {
        const rect = node.getBoundingClientRect();
        if (rect.right > 0 && rect.left < vw) {
          if (canRegisterTask(node)) {
            seen.add(node);
            rawCandidates.push({ el: node, sectionKey });
          }
        } else {
          addAux(node, sectionKey, 'section-done', 'opacity');
        }
      } else {
        if (canRegisterTask(node)) {
          seen.add(node);
          rawCandidates.push({ el: node, sectionKey });
        }
      }
    });
  };

  // =========================================================================
  // 1. Navbar (sec-0-hero) + Hero (sec-0-hero) + WhatsApp Float
  // =========================================================================
  const header = document.querySelector('header');
  if (header) {
    addAux(header, 'sec-0-hero', 'section-start', 'shell');
    addCandidate(header.querySelector('nav > *:first-child'), 'sec-0-hero');
    addSelectorAll(header, 'nav ul > li', 'sec-0-hero');
    addSelectorAll(header, 'nav > div:last-child > *', 'sec-0-hero');
  }

  const hero = document.getElementById('hero');
  if (hero) {
    addCandidate(hero.querySelector(':scope > div:first-child'), 'sec-0-hero');
    const heroChildren = hero.querySelectorAll(':scope > div');
    if (heroChildren[1]) addAux(heroChildren[1], 'sec-0-hero', 'section-start', 'opacity');
    if (heroChildren[2]) addAux(heroChildren[2], 'sec-0-hero', 'section-start', 'opacity');
    addSelectorAll(
      hero,
      'p[data-reveal], h1[data-reveal], div[data-reveal] > a, div[data-reveal] > button',
      'sec-0-hero'
    );
  }

  const whatsappLink = document.querySelector('a[aria-label="WhatsApp Contact"]');
  const whatsappWrapper = whatsappLink?.parentElement || whatsappLink;
  if (whatsappWrapper) {
    addCandidate(whatsappWrapper, 'sec-0-hero');
  }

  // =========================================================================
  // 2. About Section (sec-1-about)
  // =========================================================================
  const about = document.getElementById('about');
  if (about) {
    addAux(about.querySelector(':scope > div:first-child'), 'sec-1-about', 'section-start', 'opacity');
    addSelectorAll(about, '.sm\\:col-span-5 .overflow-hidden', 'sec-1-about');
    addSelectorAll(about, '.sm\\:col-span-5 .floating-3d', 'sec-1-about');
    addSelectorAll(about, '.sm\\:hidden .overflow-hidden', 'sec-1-about');
    addSelectorAll(about, '.sm\\:hidden .floating-3d', 'sec-1-about');
    addSelectorAll(about, '.sm\\:hidden .eyebrow, .sm\\:hidden h2', 'sec-1-about');
    addSelectorAll(about, '.hidden.sm\\:block .eyebrow, .hidden.sm\\:block h2', 'sec-1-about');
    addSelectorAll(about, '.sm\\:col-span-7 > p', 'sec-1-about');
    addSelectorAll(about, '.grid.grid-cols-3 > div', 'sec-1-about');
    addSelectorAll(about, '.sm\\:col-span-7 a.btn-primary, .sm\\:col-span-7 a.btn-ghost', 'sec-1-about');
  }

  // =========================================================================
  // 3. Demo Section - MADAR OS (sec-2-demo)
  // =========================================================================
  const demo = document.getElementById('demo');
  if (demo) {
    addAux(demo.querySelector(':scope > div:first-child'), 'sec-2-demo', 'section-start', 'opacity');
    addSelectorAll(demo, '.floating-3d', 'sec-2-demo');
    addSelectorAll(demo, '.section-shell > .max-w-3xl > *', 'sec-2-demo');
    addCandidate(demo.querySelector('[role="note"]'), 'sec-2-demo');
    addCandidate(
      demo.querySelector('.section-shell > div[data-demo-reveal]:not(.max-w-3xl):not([role="note"])'),
      'sec-2-demo'
    );
    addSelectorAll(demo, '.grid > div[data-demo-reveal]', 'sec-2-demo');
  }

  // =========================================================================
  // 4. Services / Tech Stack Section (sec-3-services)
  // =========================================================================
  const services = document.getElementById('services');
  if (services) {
    addSelectorAll(
      services,
      '.floating-3d, .section-shell .eyebrow, .section-shell h2, .section-shell p:not(.eyebrow)',
      'sec-3-services'
    );
    addSelectorAll(services, '.pause-on-hover > div', 'sec-3-services');
  }

  // =========================================================================
  // 5. Partners Marquee Section (sec-4-partners)
  // =========================================================================
  const partners = document.getElementById('partners');
  if (partners) {
    addAux(partners.querySelector(':scope > div:first-child'), 'sec-4-partners', 'section-start', 'opacity');
    addSelectorAll(partners, '.floating-3d', 'sec-4-partners');
    addSelectorAll(partners, '[data-marquee-reveal] > *', 'sec-4-partners');
    addSelectorAll(partners, '.pause-on-hover > div', 'sec-4-partners');
    addCandidate(partners.querySelector('.section-shell.mt-6 > div'), 'sec-4-partners');
  }

  // =========================================================================
  // 6. Selected Work Section (sec-5-work)
  // =========================================================================
  const work = document.getElementById('work');
  if (work) {
    addAux(work.querySelector('.border-b'), 'sec-5-work', 'section-start', 'shell');
    const edgeFades = work.querySelectorAll('.relative.mt-8 > div.pointer-events-none');
    edgeFades.forEach((f) => addAux(f, 'sec-5-work', 'section-done', 'opacity'));

    addSelectorAll(
      work,
      '.border-b .eyebrow, .border-b h2, .border-b p:not(.eyebrow)',
      'sec-5-work'
    );
    addSelectorAll(work, '.border-b button', 'sec-5-work');
    addSelectorAll(work, 'article.work-project-card', 'sec-5-work', true);
    addCandidate(work.querySelector('.mt-6.border-t'), 'sec-5-work');
  }

  // =========================================================================
  // 7. Process Section (sec-6-process)
  // =========================================================================
  const processSec = document.getElementById('process');
  if (processSec) {
    addAux(processSec.querySelector(':scope > div:first-child'), 'sec-6-process', 'section-start', 'opacity');
    addSelectorAll(processSec, '.floating-3d', 'sec-6-process');
    addSelectorAll(processSec, '.max-w-3xl > *', 'sec-6-process');
    addSelectorAll(processSec, '[data-process-card]', 'sec-6-process');
    addCandidate(processSec.querySelector('.md\\:hidden > div:first-child'), 'sec-6-process');
    addSelectorAll(processSec, '.md\\:hidden .snap-center', 'sec-6-process', true);
    addCandidate(processSec.querySelector('.md\\:hidden > div:last-child'), 'sec-6-process');
  }

  // =========================================================================
  // 8. Contact CTA + Footer (sec-7-contact)
  // =========================================================================
  const contact = document.getElementById('contact');
  if (contact) {
    const cardSurface = contact.querySelector('.card-surface');
    if (cardSurface) {
      addAux(cardSurface, 'sec-7-contact', 'section-start', 'shell');
      const bgChildren = cardSurface.querySelectorAll(':scope > div.absolute');
      bgChildren.forEach((bg) => addAux(bg, 'sec-7-contact', 'section-start', 'opacity'));
    }
    addSelectorAll(contact, '.floating-3d', 'sec-7-contact');
    addSelectorAll(contact, '.eyebrow, h2, p.text-text-muted, a.btn-primary', 'sec-7-contact');
  }

  const footer = document.querySelector('footer');
  if (footer) {
    addAux(footer, 'sec-7-contact', 'section-start', 'shell');
    addSelectorAll(footer, '.section-shell > *', 'sec-7-contact');
  }

  // Offscreen canvas for one-time text width measurement
  const measureCanvas = document.createElement('canvas');
  const measureCtx = measureCanvas.getContext('2d');
  if (measureCtx) {
    measureCtx.font = '600 9.5px ui-monospace, SFMono-Regular, Menlo, monospace';
  }

  const measured = rawCandidates.map(({ el, sectionKey }) => {
    const r = el.getBoundingClientRect();
    const isWhatsapp = Boolean(
      el.querySelector('a[aria-label="WhatsApp Contact"]') ||
        el.getAttribute('aria-label') === 'WhatsApp Contact'
    );
    const isFixed = Boolean(el.closest('header') || isWhatsapp);
    const isFullBleedBg = Boolean(
      el.parentElement?.id === 'hero' && el === el.parentElement.firstElementChild
    );
    const isMarqueeTrack = isMarqueeElement(el);

    const clampedLeft = clamp(r.left, 14, vw - 40);
    const clampedRight = clamp(r.right, clampedLeft + 24, vw - 14);
    const clampedWidth = clampedRight - clampedLeft;

    const sortTop = isFixed ? r.top : r.top + scrollY;

    return {
      el,
      sectionKey,
      isFixed,
      isFullBleedBg,
      isMarqueeTrack,
      docTop: isFixed ? r.top : r.top + scrollY,
      sortTop,
      docLeft: isFullBleedBg ? 16 : clampedLeft,
      width: isFullBleedBg ? vw - 32 : clampedWidth,
      height: isFullBleedBg ? Math.min(r.height - 84, window.innerHeight - 96) : r.height,
    };
  });

  // Sort strictly top-to-bottom, and within the same horizontal row (24px tolerance)
  // sort in natural reading order (right-to-left for Arabic RTL, left-to-right for LTR)
  measured.sort((a, b) => {
    if (Math.abs(a.sortTop - b.sortTop) > 24) {
      return a.sortTop - b.sortTop;
    }
    return isRtl ? b.docLeft - a.docLeft : a.docLeft - b.docLeft;
  });

  const tasks = measured.map((m, id) => {
    const color = AGENT_COLORS[id % AGENT_COLORS.length];
    const secondaryColor = AGENT_COLORS[(id + 1) % AGENT_COLORS.length];
    const guideColor = GUIDE_COLORS[id % GUIDE_COLORS.length];
    const tagLabel = getElementTagLabel(m.el);
    const dimLabel = `${tagLabel} · ${Math.round(m.width)}×${Math.round(m.height)}`;
    const textW = measureCtx ? measureCtx.measureText(dimLabel).width : dimLabel.length * 5.8;

    const isMajorBlock =
      m.isFullBleedBg ||
      tagLabel === 'H1 · HERO' ||
      tagLabel === 'H2 · HEADING' ||
      tagLabel === 'MARQUEE · TRACK' ||
      m.width > vw * 0.52 ||
      m.width * m.height > 85000;

    return {
      id,
      el: m.el,
      sectionKey: m.sectionKey,
      tagLabel,
      dimLabel,
      pillWidth: Math.ceil(textW + 10),
      isFixed: m.isFixed,
      isFullBleedBg: m.isFullBleedBg,
      isMarqueeTrack: m.isMarqueeTrack,
      isMajorBlock,
      docTop: m.docTop + (m.isFullBleedBg ? 68 : 0),
      docLeft: m.docLeft,
      width: m.width,
      height: m.height,
      status: 'queued' as const,
      dispatchTime: 0,
      arrivalTime: 0,
      doneTime: 0,
      fadeEndTime: 0,
      flightDuration: 320 + (id % 3) * 30,
      buildDuration: isMajorBlock ? 480 : 390 + (id % 2) * 35,
      primaryColor: color,
      secondaryColor,
      guideColor,
      guideMode: id % 3,
      assignedAgents: [],
    };
  });

  return { tasks, auxItems };
}

export default function SwarmConstructionOverlay() {
  const [mounted, setMounted] = useState(true);
  const [phaseLabel, setPhaseLabel] = useState<'summoning' | 'building' | 'converging'>('summoning');
  const [waitingForScroll, setWaitingForScroll] = useState(false);
  const [totalOps, setTotalOps] = useState(0);
  const [speed, setSpeed] = useState<1 | 2>(1);
  const [pillExiting, setPillExiting] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const opsCounterRef = useRef<HTMLSpanElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  const speedRef = useRef<1 | 2>(1);
  const skipTriggerRef = useRef<(() => void) | null>(null);

  const handleSpeedChange = useCallback((newSpeed: 1 | 2) => {
    speedRef.current = newSpeed;
    setSpeed(newSpeed);
  }, []);

  const handleSkip = useCallback(() => {
    if (skipTriggerRef.current) {
      skipTriggerRef.current();
    }
  }, []);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.location.search.includes('reducedMotion=1') &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setMounted(false);
      return;
    }

    setMounted(true);
    setPillExiting(false);
    setWaitingForScroll(false);
    setPhaseLabel('summoning');
    window.scrollTo(0, 0);

    // 1. Keep OrbScene WebGL2 160-step raymarching shader completely paused (1x1 px, display: none)
    // for the ENTIRE duration of the Swarm Construction Overlay so fast scrolling never stutters on GPU!
    const orbSection = document.querySelector<HTMLElement>('.orb-section');
    const origOrbWidth = orbSection ? orbSection.style.width : '';
    const origOrbHeight = orbSection ? orbSection.style.height : '';
    const origOrbDisplay = orbSection ? orbSection.style.display : '';
    if (orbSection) {
      orbSection.style.width = '1px';
      orbSection.style.height = '1px';
      orbSection.style.display = 'none';
    }

    // 2. Temporarily suspend heavy `backdrop-filter: blur(...)` on the 164 marquee badges/cards
    // while the overlay is active to prevent GPU render-surface thrashing during fast scroll!
    const heavyBackdropNodes = document.querySelectorAll<HTMLElement>(
      '#services .backdrop-blur-md, #partners .backdrop-blur-md'
    );
    heavyBackdropNodes.forEach((node) => {
      node.style.backdropFilter = 'none';
    });

    // 3. Neutralize conflicting entrance ScrollTriggers so our Scroll-Driven Swarm Engine
    // orchestrates every element's progressive reveal cleanly.
    ScrollTrigger.getAll().forEach((st) => st.kill());
    const gsapRevealNodes = document.querySelectorAll<HTMLElement>(
      '[data-reveal], [data-demo-reveal], [data-marquee-reveal], [data-process-card], #contact .card-surface'
    );
    gsap.killTweensOf(gsapRevealNodes);
    gsapRevealNodes.forEach((node) => {
      node.style.opacity = '';
      node.style.transform = '';
    });

    // 4. Pause continuous marquee tracks temporarily until their section is built
    const servicesMarqueeTracks = document.querySelectorAll<HTMLElement>(
      '#services .animate-marquee-slow, #services .animate-marquee-reverse-slow'
    );
    const partnersMarqueeTracks = document.querySelectorAll<HTMLElement>(
      '#partners .animate-marquee, #partners .animate-marquee-reverse'
    );
    servicesMarqueeTracks.forEach((track) => {
      track.style.animationPlayState = 'paused';
      track.style.willChange = 'auto';
    });
    partnersMarqueeTracks.forEach((track) => {
      track.style.animationPlayState = 'paused';
      track.style.willChange = 'auto';
    });

    // Discover all visible portfolio elements and auxiliary shells/clones from top to bottom
    const { tasks, auxItems } = discoverPortfolioElements();
    if (tasks.length === 0) {
      if (orbSection) {
        orbSection.style.width = origOrbWidth;
        orbSection.style.height = origOrbHeight;
        orbSection.style.display = origOrbDisplay;
      }
      heavyBackdropNodes.forEach((node) => {
        node.style.backdropFilter = '';
      });
      servicesMarqueeTracks.forEach((track) => {
        track.style.animationPlayState = '';
        track.style.willChange = '';
      });
      partnersMarqueeTracks.forEach((track) => {
        track.style.animationPlayState = '';
        track.style.willChange = '';
      });
      setMounted(false);
      return;
    }

    setTotalOps(tasks.length);

    // Hide all auxiliary shells, borders, glows, and off-screen marquee/slider clones at t = 0
    auxItems.forEach((aux) => {
      aux.el.style.transition = 'none';
      if (aux.mode === 'shell') {
        aux.el.style.borderColor = 'transparent';
        aux.el.style.backgroundColor = 'transparent';
        aux.el.style.backdropFilter = 'none';
      } else {
        aux.el.style.opacity = '0';
      }
    });

    // Save original inline styles and hide discovered task elements at t = 0 without layout shift
    const savedStyles: SavedElementStyle[] = tasks.map((t) => {
      const el = t.el;
      const saved = saveElementStyle(el);
      el.style.transition = 'none';
      el.style.opacity = '0';
      el.style.transform =
        t.isFullBleedBg || t.isMarqueeTrack
          ? saved.transform
          : saved.transform
            ? `${saved.transform} translateY(8px) scale(0.98)`
            : 'translateY(8px) scale(0.98)';
      el.style.pointerEvents = 'none';
      return saved;
    });

    const savedById = new Map<number, SavedElementStyle>();
    tasks.forEach((t, idx) => savedById.set(t.id, savedStyles[idx]));

    const revealAuxItems = (
      sectionKey: string,
      triggerType: 'section-start' | 'section-done',
      instant = false
    ) => {
      auxItems.forEach((aux) => {
        if (!aux.revealed && aux.sectionKey === sectionKey && aux.revealOn === triggerType) {
          aux.revealed = true;
          if (aux.mode === 'shell') {
            aux.el.style.transition = instant
              ? 'none'
              : 'border-color 350ms ease, background-color 350ms ease';
            aux.el.style.borderColor = aux.saved.borderColor || '';
            aux.el.style.backgroundColor = aux.saved.backgroundColor || '';
            aux.el.style.backdropFilter = aux.saved.backdropFilter || '';
          } else {
            aux.el.style.transition = instant ? 'none' : 'opacity 350ms ease';
            aux.el.style.opacity = aux.saved.opacity || '1';
          }
        }
      });
    };

    // Initialize 4 Collaborative Agent Cursors in the center of the viewport
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const agents: AgentState[] = Array.from({ length: AGENT_COUNT }, (_, i) => {
      const orbitRadius = 32 + (i % 2) * 14;
      const orbitPhase = (i / AGENT_COUNT) * Math.PI * 2;
      const orbitSpeed = 1.45;
      const initX = centerX + Math.cos(orbitPhase) * orbitRadius * 0.3;
      const initY = centerY + Math.sin(orbitPhase) * orbitRadius * 0.3;
      const name = AGENT_NAMES[i % AGENT_NAMES.length];
      return {
        id: i,
        name,
        namePillWidth: name.length * 5.6 + 8,
        color: AGENT_COLORS[i % AGENT_COLORS.length],
        x: initX,
        y: initY,
        prevX: initX,
        prevY: initY,
        idleAnchorX: centerX + (i - 1.5) * 68,
        idleAnchorY: centerY + (i % 2 === 0 ? -18 : 18),
        angle: (orbitPhase * 180) / Math.PI + 90,
        scale: 0,
        orbitRadius,
        orbitSpeed,
        orbitPhase,
        state: 'summon',
        taskId: null,
        role: i % 4,
        startX: initX,
        startY: initY,
        cp1X: initX,
        cp1Y: initY,
        cp2X: initX,
        cp2Y: initY,
        flightStartTime: 0,
        flightArrivalTime: 0,
        curveSign: i % 2 === 0 ? 1 : -1,
        trail: Array.from({ length: 6 }, () => ({ x: initX, y: initY })),
      };
    });

    // High-DPI Canvas setup (capped at 1.35 DPR for ultra-fast full-screen clear & fill during scroll)
    const canvas = canvasRef.current;
    const ctx = canvas ? canvas.getContext('2d', { alpha: true }) : null;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.35);

    const cursorPath = new Path2D('M 0 0 L -21 -8.5 L -16 0 L -21 8.5 Z');

    const refreshTaskCoordinates = () => {
      const sy = window.scrollY;
      const vwNow = window.innerWidth;
      tasks.forEach((task) => {
        const r = task.el.getBoundingClientRect();
        const isUnrevealedOffset =
          !task.isFullBleedBg &&
          !task.isMarqueeTrack &&
          (task.status === 'queued' || task.status === 'flying')
            ? 8
            : 0;
        const clampedLeft = clamp(r.left, 14, vwNow - 40);
        const clampedRight = clamp(r.right, clampedLeft + 24, vwNow - 14);
        task.docLeft = task.isFullBleedBg ? 16 : clampedLeft;
        task.docTop =
          (task.isFixed ? r.top - isUnrevealedOffset : r.top + sy - isUnrevealedOffset) +
          (task.isFullBleedBg ? 68 : 0);
        task.width = task.isFullBleedBg ? vwNow - 32 : clampedRight - clampedLeft;
        task.height = task.isFullBleedBg
          ? Math.min(r.height - 84, window.innerHeight - 96)
          : r.height;
      });
    };

    const resizeCanvas = () => {
      if (!canvas || !ctx) return;
      dpr = Math.min(window.devicePixelRatio || 1, 1.35);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      refreshTaskCoordinates();
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Master timeline state (in virtual milliseconds, scaled by 1x / 2x speed + scroll velocity)
    const SUMMON_DURATION = 900;
    let virtualTime = 0;
    let orbitVisualTime = 0;
    let hasBrowserAttention =
      typeof document !== 'undefined' ? document.hasFocus() : true;
    let lastRafNow = performance.now();
    let lastScrollY = window.scrollY;
    let scrollBoost = 1;
    let rafId = 0;
    let isDisposed = false;
    let unmountTimeoutId: number | null = null;

    const markAttention = () => {
      hasBrowserAttention = true;
    };
    window.addEventListener('focus', markAttention, { passive: true });
    window.addEventListener('pointermove', markAttention, { passive: true });
    window.addEventListener('pointerdown', markAttention, { passive: true });
    window.addEventListener('keydown', markAttention, { passive: true });
    window.addEventListener('touchstart', markAttention, { passive: true });
    window.addEventListener('scroll', markAttention, { passive: true });

    let phaseStarted = false;
    let lastDispatchVTime = -999;
    let completedOpsCount = 0;
    let lastRenderedOpsCount = 0;
    let convergenceStarted = false;
    let convergenceStartTime = 0;
    const CONVERGENCE_DURATION = 780;
    let pillExitTriggered = false;
    let cachedPillCenter = { x: window.innerWidth / 2, y: window.innerHeight - 44 };
    let lastWaitingState = false;
    let lastBuiltViewportY = window.innerHeight * 0.55;

    /**
     * Computes the exact collaborative construction coordinates for a task at `buildProgress` (0..1):
     * - Sub-phase 1 (0.0 -> 0.28): Vertical Frame Open along the left edge:
     *   Role 0 anchors top-left `(left, top)` while Role 1 pulls bottom-left `(left, curBottom)` downward.
     * - Sub-phase 2 (0.28 -> 1.0): Synchronized Parallel Extrusion & Dual-Cursor Laser Sweep:
     *   Role 0 glides along the top edge `(curRight, top)` and Role 1 glides in 100% vertical lockstep
     *   along the bottom edge `(curRight, bottom)`, pulling the active box & laser beam across the element!
     *   Role 2 anchors the left origin, and Role 3 sweeps the interior diagonal truss.
     */
    const getCollaborativeGeometry = (box: ViewportBox, buildProgress: number) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const pad = 3;
      const left = clamp(box.left - pad, 8, vw - 24);
      const top = clamp(box.top - pad, 8, vh - 24);
      const right = clamp(box.right + pad, left + 16, vw - 8);
      const bottom = clamp(box.bottom + pad, top + 12, vh - 8);
      const w = right - left;
      const h = bottom - top;
      const p = clamp(buildProgress, 0, 1);

      const minStartW = Math.min(24, w * 0.14);
      const minStartH = Math.min(18, h * 0.25);

      let curRight = left + minStartW;
      let curBottom = top + minStartH;
      let scanX = left + minStartW;

      if (p < 0.28) {
        const u = easeOutCubic(p / 0.28);
        curRight = left + minStartW;
        curBottom = top + minStartH + (h - minStartH) * u;
        scanX = curRight;
      } else {
        const s = easeInOutCubic((p - 0.28) / 0.72);
        curBottom = bottom;
        curRight = left + minStartW + (w - minStartW) * s;
        scanX = curRight;
      }

      return {
        left,
        top,
        right,
        bottom,
        w,
        h,
        curRight,
        curBottom,
        curW: curRight - left,
        curH: curBottom - top,
        scanX,
      };
    };

    const getTaskTargetPoint = (
      box: ViewportBox,
      role: number,
      buildProgress: number
    ): { x: number; y: number } => {
      const g = getCollaborativeGeometry(box, buildProgress);
      const p = clamp(buildProgress, 0, 1);

      if (role === 0) {
        return { x: g.curRight, y: g.top };
      } else if (role === 1) {
        return { x: g.curRight, y: g.curBottom };
      } else if (role === 2) {
        const u = easeInOutCubic(p);
        return { x: g.left, y: g.top + g.curH * (0.2 + 0.65 * u) };
      } else {
        const s = easeInOutCubic(p);
        const midX = g.left + (g.curRight - g.left) * 0.58;
        const waveY =
          g.top + g.curH * 0.5 + Math.sin(s * Math.PI * 2) * Math.min(14, g.curH * 0.24);
        return { x: midX, y: waveY };
      }
    };

    const launchAgentFlight = (
      agent: AgentState,
      task: DiscoveredTask,
      role: number,
      vTime: number,
      arrivalTime: number,
      currentScrollY: number
    ) => {
      agent.state = 'flying';
      agent.taskId = task.id;
      agent.role = role;
      agent.startX = agent.x;
      agent.startY = agent.y;
      agent.flightStartTime = vTime;
      agent.flightArrivalTime = arrivalTime;

      const box = getLiveViewportBox(task, currentScrollY);
      const target = getTaskTargetPoint(box, role, 0);
      const dx = target.x - agent.startX;
      const dy = target.y - agent.startY;
      const dist = Math.hypot(dx, dy);
      const roleArcSign = role % 2 === 0 ? 1 : -1;
      const arc = clamp(dist * 0.22, 18, 95) * roleArcSign;
      const nx = dist > 1 ? -dy / dist : 0;
      const ny = dist > 1 ? dx / dist : 1;

      agent.cp1X = agent.startX + dx * 0.32 + nx * arc;
      agent.cp1Y = agent.startY + dy * 0.32 + ny * arc;
      agent.cp2X = agent.startX + dx * 0.68 + nx * arc * 0.55;
      agent.cp2Y = agent.startY + dy * 0.68 + ny * arc * 0.55;
    };

    const dispatchTask = (
      task: DiscoveredTask,
      assignedAgentList: AgentState[],
      vTime: number,
      currentScrollY: number
    ) => {
      task.status = 'flying';
      task.dispatchTime = vTime;
      task.arrivalTime = vTime + task.flightDuration;
      task.doneTime = task.arrivalTime + task.buildDuration;
      task.fadeEndTime = task.doneTime + 220;
      task.assignedAgents = assignedAgentList.map((a) => a.id);
      if (assignedAgentList.length > 0) {
        task.primaryColor = assignedAgentList[0].color;
        task.secondaryColor =
          assignedAgentList.length > 1 ? assignedAgentList[1].color : assignedAgentList[0].color;
      }

      assignedAgentList.forEach((agent, idx) => {
        launchAgentFlight(agent, task, idx, vTime, task.arrivalTime, currentScrollY);
      });
    };

    const revealElement = (task: DiscoveredTask) => {
      revealAuxItems(task.sectionKey, 'section-start', false);
      const saved = savedById.get(task.id);
      const durMs = Math.max(
        140,
        Math.round(task.buildDuration / (speedRef.current * Math.min(scrollBoost, 2)))
      );
      if (!task.isMarqueeTrack) {
        task.el.style.willChange = 'opacity, transform';
      }
      task.el.style.transition = `opacity ${durMs}ms cubic-bezier(0.22, 1, 0.36, 1), transform ${durMs}ms cubic-bezier(0.22, 1, 0.36, 1)`;
      task.el.style.opacity = saved?.opacity || '1';
      task.el.style.transform = saved?.transform || 'translateY(0px) scale(1)';
      task.el.style.pointerEvents = saved?.pointerEvents || '';
    };

    /**
     * Zero-cost instant reveal for elements that the user scrolled past rapidly.
     * Uses `transition: none` and `willChange: ''` so fast scrolling never triggers
     * off-screen CSS transitions or GPU layer allocations!
     */
    const instantRevealElement = (task: DiscoveredTask) => {
      revealAuxItems(task.sectionKey, 'section-start', true);
      const saved = savedById.get(task.id);
      task.el.style.transition = 'none';
      task.el.style.willChange = saved?.willChange || '';
      task.el.style.opacity = saved?.opacity || '1';
      task.el.style.transform = saved?.transform || '';
      task.el.style.pointerEvents = saved?.pointerEvents || '';
    };

    const completeSectionIfDone = (sectionKey: string, instant = false) => {
      const sectionDone = tasks
        .filter((t) => t.sectionKey === sectionKey)
        .every((t) => t.status === 'done');

      if (sectionDone) {
        revealAuxItems(sectionKey, 'section-done', instant);
        if (sectionKey === 'sec-3-services') {
          servicesMarqueeTracks.forEach((track) => {
            track.style.animationPlayState = '';
          });
        } else if (sectionKey === 'sec-4-partners') {
          partnersMarqueeTracks.forEach((track) => {
            track.style.animationPlayState = '';
          });
        }
      }
    };

    const cleanupResources = () => {
      if (isDisposed) return;
      isDisposed = true;
      cancelAnimationFrame(rafId);
      if (unmountTimeoutId !== null) {
        window.clearTimeout(unmountTimeoutId);
      }
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('focus', markAttention);
      window.removeEventListener('pointermove', markAttention);
      window.removeEventListener('pointerdown', markAttention);
      window.removeEventListener('keydown', markAttention);
      window.removeEventListener('touchstart', markAttention);
      window.removeEventListener('scroll', markAttention);

      if (orbSection) {
        orbSection.style.width = origOrbWidth;
        orbSection.style.height = origOrbHeight;
        orbSection.style.display = origOrbDisplay;
      }

      heavyBackdropNodes.forEach((node) => {
        node.style.backdropFilter = '';
      });

      servicesMarqueeTracks.forEach((track) => {
        track.style.animationPlayState = '';
        track.style.willChange = '';
      });
      partnersMarqueeTracks.forEach((track) => {
        track.style.animationPlayState = '';
        track.style.willChange = '';
      });

      auxItems.forEach((aux) => {
        aux.el.style.transition = aux.saved.transition;
        aux.el.style.opacity = aux.saved.opacity;
        aux.el.style.borderColor = aux.saved.borderColor || '';
        aux.el.style.backgroundColor = aux.saved.backgroundColor || '';
        aux.el.style.backdropFilter = aux.saved.backdropFilter || '';
      });

      savedStyles.forEach((s) => {
        s.el.style.transition = s.transition;
        s.el.style.opacity = s.opacity;
        s.el.style.transform = s.transform;
        s.el.style.pointerEvents = s.pointerEvents;
        s.el.style.willChange = s.willChange;
      });
    };

    const finishAndUnmount = () => {
      cleanupResources();
      setMounted(false);
    };

    skipTriggerRef.current = finishAndUnmount;

    const tick = (now: number) => {
      if (isDisposed) return;

      const rawDt = Math.min(now - lastRafNow, 48);
      lastRafNow = now;

      if (document.visibilityState === 'hidden') {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const currentScrollY = window.scrollY;

      // Dynamic Scroll-Velocity Synchronization:
      // Smoothly boost swarm speed when the user scrolls so cursors never lag behind fast manual scrolling
      const scrollDelta = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;
      const targetBoost = clamp(1 + scrollDelta * 0.055, 1, 3.2);
      scrollBoost =
        targetBoost > scrollBoost
          ? scrollBoost + (targetBoost - scrollBoost) * 0.45
          : scrollBoost + (targetBoost - scrollBoost) * 0.14;

      const dt = rawDt * speedRef.current * scrollBoost;
      orbitVisualTime += rawDt * speedRef.current;
      if (hasBrowserAttention || virtualTime > 650) {
        virtualTime += dt;
      } else {
        virtualTime = Math.min(650, virtualTime + dt);
      }

      if (ctx && canvas) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, vw, vh);
      }

      // ====================================================================
      // PHASE 1: AGENT SWARM SUMMONING & HARMONIC NETWORK (0.0s - 0.90s)
      // ====================================================================
      if (virtualTime < SUMMON_DURATION) {
        const p = clamp(virtualTime / SUMMON_DURATION, 0, 1);
        const scaleEase = clamp(easeOutBack(Math.min(1, p * 1.4)), 0, 1.08);
        const cx = vw / 2;
        const cy = vh / 2;

        agents.forEach((agent) => {
          const tSec = orbitVisualTime * 0.001;
          const currentAngle = agent.orbitPhase + tSec * agent.orbitSpeed;
          const r = agent.orbitRadius * (0.35 + 0.65 * easeOutCubic(p));
          const nextX = cx + Math.cos(currentAngle) * r;
          const nextY = cy + Math.sin(currentAngle) * r;

          const dx = nextX - agent.x;
          const dy = nextY - agent.y;
          if (Math.hypot(dx, dy) > 0.04) {
            const targetDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
            agent.angle = lerpAngleDeg(agent.angle, targetDeg, 0.3);
          }

          agent.prevX = agent.x;
          agent.prevY = agent.y;
          agent.x = nextX;
          agent.y = nextY;
          agent.scale = scaleEase;
          agent.trail.pop();
          agent.trail.unshift({ x: nextX, y: nextY });
        });

        if (ctx) {
          ctx.save();
          const pulseR = 26 + p * 76;
          ctx.beginPath();
          ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(94, 235, 255, ${(1 - p) * 0.55})`;
          ctx.lineWidth = 1.2;
          ctx.setLineDash([4, 4]);
          ctx.stroke();

          ctx.setLineDash([]);
          ctx.lineWidth = 1;
          for (let i = 0; i < agents.length; i++) {
            for (let j = i + 1; j < agents.length; j++) {
              ctx.beginPath();
              ctx.moveTo(agents[i].x, agents[i].y);
              ctx.lineTo(agents[j].x, agents[j].y);
              ctx.strokeStyle = `rgba(0, 240, 255, ${0.32 * (1 - p * 0.3)})`;
              ctx.stroke();
            }
          }
          ctx.restore();
        }
      }
      // ====================================================================
      // PHASE 2 & 3: COLLABORATIVE MULTI-AGENT SCROLL-SYNCHRONIZED BUILD
      // ====================================================================
      else if (!convergenceStarted) {
        if (!phaseStarted) {
          phaseStarted = true;
          setPhaseLabel('building');
        }

        // 1. Scan tasks in the current viewport:
        //    - Any task (`queued`, `flying`, OR `building`) that scrolled above the active viewport (`box.bottom < 36`)
        //      is INSTANTLY completed with `transition: none` and its assigned cursors are immediately freed!
        //      This prevents cursors from getting stuck at the top edge when the user scrolls fast!
        const isAtPageBottom =
          currentScrollY + vh >= document.documentElement.scrollHeight - 48;
        const triggerThresholdY = isAtPageBottom ? vh + 120 : vh * 0.94;
        const eligibleQueued: DiscoveredTask[] = [];
        let activeTaskCount = 0;

        for (let i = 0; i < tasks.length; i++) {
          const t = tasks[i];
          if (t.status === 'done') continue;

          const box = getLiveViewportBox(t, currentScrollY);

          if (!t.isFixed && box.bottom < 36) {
            // Scrolled past above viewport -> Complete instantly & release any assigned cursors immediately!
            instantRevealElement(t);
            t.status = 'done';
            t.doneTime = virtualTime - 300;
            t.fadeEndTime = virtualTime - 10;
            completedOpsCount++;
            for (let aIdx = 0; aIdx < agents.length; aIdx++) {
              if (agents[aIdx].taskId === t.id) {
                agents[aIdx].taskId = null;
                agents[aIdx].state = 'idle';
              }
            }
            completeSectionIfDone(t.sectionKey, true);
            continue;
          }

          if (t.status === 'flying' || t.status === 'building') {
            activeTaskCount++;
            lastBuiltViewportY = clamp(box.bottom, 90, vh - 110);
          } else if (t.status === 'queued' && box.top <= triggerThresholdY) {
            eligibleQueued.push(t);
          }
        }

        // Fast-Scroll Queue Trim:
        // If the user scrolled down quickly and flooded the queue with > 6 visible items,
        // auto-complete items near the very top edge (`box.top < 48`) so cursors build the center of the screen immediately!
        if (eligibleQueued.length > 6) {
          while (
            eligibleQueued.length > 5 &&
            !eligibleQueued[0].isFixed &&
            getLiveViewportBox(eligibleQueued[0], currentScrollY).top < 48
          ) {
            const topTask = eligibleQueued.shift()!;
            instantRevealElement(topTask);
            topTask.status = 'done';
            topTask.doneTime = virtualTime - 300;
            topTask.fadeEndTime = virtualTime - 10;
            completedOpsCount++;
            completeSectionIfDone(topTask.sectionKey, true);
          }
        }

        // 2. Collaborative Squad Dispatching:
        // - Every task is built by a COLLABORATIVE TEAM of cursors (never a single isolated cursor).
        // - Major blocks (or when only 1 task is in queue and all 4 agents are free) unite ALL 4 agents (`ARCH`, `UI`, `GRID`, `SYNC`)!
        // - Standard blocks & card grids split the 4 agents into 2 synchronized 2-agent squads (2 cursors per task).
        const baseStagger =
          eligibleQueued.length > 8 ? 75 : eligibleQueued.length > 4 ? 110 : 145;
        const staggerInterval = baseStagger / scrollBoost;

        const idleAgents = agents.filter((a) => a.state === 'idle' || a.state === 'summon');

        if (
          eligibleQueued.length > 0 &&
          idleAgents.length >= 2 &&
          activeTaskCount < 2 &&
          virtualTime - lastDispatchVTime >= staggerInterval
        ) {
          const nextTask = eligibleQueued[0];
          const nextBox = getLiveViewportBox(nextTask, currentScrollY);
          const targetOriginX = nextBox.left;
          const targetOriginY = clamp(nextBox.top, 20, vh - 20);

          idleAgents.sort((a, b) => {
            const da = Math.hypot(a.x - targetOriginX, a.y - targetOriginY);
            const db = Math.hypot(b.x - targetOriginX, b.y - targetOriginY);
            return da - db;
          });

          const teamSize =
            (nextTask.isMajorBlock || eligibleQueued.length === 1) && idleAgents.length === 4
              ? 4
              : Math.min(2, idleAgents.length);

          const chosenTeam = idleAgents.slice(0, teamSize);

          dispatchTask(nextTask, chosenTeam, virtualTime, currentScrollY);
          lastDispatchVTime = virtualTime;
        }

        // 3. Update status of all flying & building tasks
        for (let i = 0; i < tasks.length; i++) {
          const task = tasks[i];
          if (task.status === 'flying' && virtualTime >= task.arrivalTime) {
            task.status = 'building';
            revealElement(task);
          }

          if (task.status === 'building' && virtualTime >= task.doneTime) {
            task.status = 'done';
            completedOpsCount++;
            const saved = savedById.get(task.id);
            if (saved) {
              task.el.style.transform = saved.transform;
              task.el.style.willChange = saved.willChange;
            }
            completeSectionIfDone(task.sectionKey, false);
          }
        }

        // Batch DOM counter text update to at most once per animation frame
        if (completedOpsCount !== lastRenderedOpsCount) {
          lastRenderedOpsCount = completedOpsCount;
          if (opsCounterRef.current) {
            opsCounterRef.current.textContent = `${completedOpsCount} / ${tasks.length} ops`;
          }
        }

        // Update "Scroll ↓" indicator when current viewport is built and more elements remain below
        const isWaitingOnUserScroll =
          eligibleQueued.length === 0 &&
          activeTaskCount === 0 &&
          completedOpsCount < tasks.length;
        if (isWaitingOnUserScroll !== lastWaitingState) {
          lastWaitingState = isWaitingOnUserScroll;
          setWaitingForScroll(isWaitingOnUserScroll);
        }

        // 4. Update Agent Positions (Coordinated Flight, Synchronized Edge Extrusion & Cohesive Squad Formation)
        const frontierCenterX = vw * 0.5;
        const frontierCenterY = clamp(lastBuiltViewportY + 28, 120, vh - 105);

        agents.forEach((agent) => {
          const task = agent.taskId !== null ? tasks[agent.taskId] : null;

          let nextX = agent.x;
          let nextY = agent.y;

          if (task && task.status !== 'done') {
            const box = getLiveViewportBox(task, currentScrollY);

            if (virtualTime < agent.flightArrivalTime) {
              const flightProgress = clamp(
                (virtualTime - agent.flightStartTime) /
                  Math.max(1, agent.flightArrivalTime - agent.flightStartTime),
                0,
                1
              );
              const tEase = easeInOutCubic(flightProgress);
              const liveTarget = getTaskTargetPoint(box, agent.role, 0);

              nextX = cubicBezier(agent.startX, agent.cp1X, agent.cp2X, liveTarget.x, tEase);
              nextY = cubicBezier(agent.startY, agent.cp1Y, agent.cp2Y, liveTarget.y, tEase);
            } else if (virtualTime <= task.doneTime) {
              agent.state = 'building';
              const buildP = clamp(
                (virtualTime - task.arrivalTime) / Math.max(1, task.buildDuration),
                0,
                1
              );
              const scrubPt = getTaskTargetPoint(box, agent.role, buildP);
              nextX = scrubPt.x;
              nextY = scrubPt.y;
            } else {
              agent.taskId = null;
              agent.state = 'idle';
            }
          } else {
            agent.taskId = null;
            agent.state = 'idle';
          }

          if (agent.taskId === null) {
            agent.state = 'idle';
            const tSec = orbitVisualTime * 0.001;
            const slotOffset = (agent.id - (AGENT_COUNT - 1) / 2) * 64;
            const arcDip = Math.abs(agent.id - (AGENT_COUNT - 1) / 2) * 14;
            const scrollBob = isWaitingOnUserScroll
              ? Math.sin(tSec * 3.2 + agent.id * 0.5) * 9
              : Math.sin(tSec * 1.6 + agent.id * 1.1) * 7;

            const targetIdleX = clamp(
              frontierCenterX + slotOffset + Math.cos(tSec * 1.3 + agent.id) * 8,
              48,
              vw - 48
            );
            const targetIdleY = clamp(
              frontierCenterY + arcDip + scrollBob,
              72,
              vh - 96
            );

            nextX = agent.x + (targetIdleX - agent.x) * 0.1;
            nextY = agent.y + (targetIdleY - agent.y) * 0.1;
          }

          const dx = nextX - agent.x;
          const dy = nextY - agent.y;
          const speedDist = Math.hypot(dx, dy);
          if (speedDist > 0.06) {
            const targetDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
            agent.angle = lerpAngleDeg(agent.angle, targetDeg, 0.24);
          } else if (isWaitingOnUserScroll && agent.state === 'idle') {
            agent.angle = lerpAngleDeg(agent.angle, 90, 0.08);
          }

          agent.prevX = agent.x;
          agent.prevY = agent.y;
          agent.x = nextX;
          agent.y = nextY;
          agent.scale = 1;

          agent.trail.pop();
          agent.trail.unshift({ x: nextX, y: nextY });
        });

        // 5. Draw Collaborative CAD Overlays, Synchronized Laser Scan Beams & Inter-Agent Tethers (Zero Heap Allocations!)
        if (ctx) {
          ctx.font = '600 9.5px ui-monospace, SFMono-Regular, Menlo, monospace';

          // 5A. Subtle Swarm Cohesion Network between nearby agents
          ctx.save();
          for (let i = 0; i < agents.length; i++) {
            for (let j = i + 1; j < agents.length; j++) {
              const a = agents[i];
              const b = agents[j];
              const sameTask = a.taskId !== null && a.taskId === b.taskId;
              const dist = Math.hypot(a.x - b.x, a.y - b.y);

              if (sameTask) {
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = a.color;
                ctx.globalAlpha = a.state === 'building' ? 0.55 : 0.38;
                ctx.lineWidth = a.state === 'building' ? 1.25 : 1;
                ctx.setLineDash([3, 3]);
                ctx.stroke();

                const pulseT = (orbitVisualTime * 0.0028 + i * 0.35) % 1;
                const px = a.x + (b.x - a.x) * pulseT;
                const py = a.y + (b.y - a.y) * pulseT;
                ctx.setLineDash([]);
                ctx.globalAlpha = 0.9;
                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.arc(px, py, 2, 0, Math.PI * 2);
                ctx.fill();
              } else if (dist < 250) {
                const alpha = (1 - dist / 250) * 0.2;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = '#00F0FF';
                ctx.globalAlpha = alpha;
                ctx.lineWidth = 0.85;
                ctx.setLineDash([2, 4]);
                ctx.stroke();
              }
            }
          }
          ctx.restore();

          // 5B. Draw Active & Fading Task Bounding Boxes, Progressive Extrusion & Dual-Cursor Laser Scan
          for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            if (
              task.status === 'queued' ||
              virtualTime < task.arrivalTime - 40 ||
              virtualTime > task.fadeEndTime
            ) {
              continue;
            }

            const box = getLiveViewportBox(task, currentScrollY);
            if (box.bottom < 0 || box.top > vh + 20) continue;

            let boxAlpha = 1;
            if (virtualTime < task.arrivalTime) {
              boxAlpha = clamp((virtualTime - (task.arrivalTime - 40)) / 40, 0, 1);
            } else if (virtualTime > task.doneTime) {
              boxAlpha = 1 - clamp((virtualTime - task.doneTime) / 220, 0, 1);
            }

            const buildProgress = clamp(
              (virtualTime - task.arrivalTime) / task.buildDuration,
              0,
              1
            );

            const g = getCollaborativeGeometry(box, buildProgress);
            const fullX = Math.round(g.left) + 0.5;
            const fullY = Math.round(g.top) + 0.5;
            const fullW = Math.round(g.w);
            const fullH = Math.round(g.h);

            const curW = Math.round(g.curW);
            const curH = Math.round(g.curH);
            const scanX = Math.round(g.scanX) + 0.5;

            ctx.save();

            // 1. Target Blueprint Ghost Frame
            if (buildProgress < 0.98) {
              ctx.globalAlpha = boxAlpha * 0.24;
              ctx.strokeStyle = task.primaryColor;
              ctx.lineWidth = 1;
              ctx.setLineDash([4, 4]);
              ctx.strokeRect(fullX, fullY, fullW, fullH);
              ctx.setLineDash([]);
            }

            // 2. Smart Alignment Guides
            if (buildProgress > 0 && buildProgress < 0.8) {
              const guideAlpha =
                Math.sin((buildProgress / 0.8) * Math.PI) * 0.6 * boxAlpha;
              ctx.strokeStyle = task.guideColor;
              ctx.globalAlpha = guideAlpha;
              ctx.lineWidth = 1;
              ctx.setLineDash([4, 4]);

              ctx.beginPath();
              if (task.guideMode === 0) {
                ctx.moveTo(0, fullY);
                ctx.lineTo(vw, fullY);
                ctx.moveTo(scanX, 0);
                ctx.lineTo(scanX, vh);
              } else if (task.guideMode === 1) {
                ctx.moveTo(0, fullY + curH);
                ctx.lineTo(vw, fullY + curH);
                ctx.moveTo(scanX, 0);
                ctx.lineTo(scanX, vh);
              } else {
                const cyGuide = Math.round(fullY + curH / 2) + 0.5;
                ctx.moveTo(0, cyGuide);
                ctx.lineTo(vw, cyGuide);
                ctx.moveTo(scanX, 0);
                ctx.lineTo(scanX, vh);
              }
              ctx.stroke();
              ctx.setLineDash([]);
            }

            // 3. Progressive Figma Bounding Box (physically pulled open by the collaborating cursors)
            ctx.globalAlpha = boxAlpha * (0.13 * (1 - buildProgress * 0.6));
            ctx.fillStyle = task.primaryColor;
            ctx.fillRect(fullX, fullY, curW, curH);

            ctx.globalAlpha = boxAlpha * 0.95;
            ctx.strokeStyle = task.primaryColor;
            ctx.lineWidth = 1.25;
            ctx.strokeRect(fullX, fullY, curW, curH);

            // 4. Zero-Allocation Dual-Cursor Laser Scan Beam (connecting Role 0 on top edge & Role 1 on bottom edge)
            if (buildProgress > 0.02 && buildProgress < 0.99) {
              ctx.fillStyle = task.primaryColor;
              const trailW = Math.min(28, curW);
              ctx.globalAlpha = boxAlpha * 0.14;
              ctx.fillRect(scanX - trailW, fullY, trailW, curH);

              const coreW = Math.min(7, curW);
              ctx.globalAlpha = boxAlpha * 0.32;
              ctx.fillRect(scanX - coreW, fullY, coreW, curH);

              ctx.globalAlpha = boxAlpha;
              ctx.strokeStyle = '#FFFFFF';
              ctx.lineWidth = 1.6;
              ctx.beginPath();
              ctx.moveTo(scanX, fullY);
              ctx.lineTo(scanX, fullY + curH);
              ctx.stroke();
            }

            // 5. 4 Square Corner Handles (4.5x4.5px) riding on the live expanding corners
            const hs = 4.5;
            const corners = [
              [fullX - hs / 2, fullY - hs / 2],
              [fullX + curW - hs / 2, fullY - hs / 2],
              [fullX + curW - hs / 2, fullY + curH - hs / 2],
              [fullX - hs / 2, fullY + curH - hs / 2],
            ];
            ctx.globalAlpha = boxAlpha;
            ctx.fillStyle = '#FFFFFF';
            corners.forEach(([cxH, cyH]) => {
              ctx.fillRect(cxH, cyH, hs, hs);
              ctx.strokeRect(cxH, cyH, hs, hs);
            });

            // 6. Tactile Grab / Snap Pulse Ring at keyframe moments
            if (buildProgress < 0.22) {
              const grabP = buildProgress / 0.22;
              ctx.beginPath();
              ctx.arc(fullX, fullY, 4 + grabP * 14, 0, Math.PI * 2);
              ctx.strokeStyle = task.primaryColor;
              ctx.globalAlpha = (1 - grabP) * 0.85 * boxAlpha;
              ctx.lineWidth = 1.4;
              ctx.stroke();
            } else if (buildProgress > 0.82) {
              const lockP = (buildProgress - 0.82) / 0.18;
              ctx.beginPath();
              ctx.arc(fullX + curW, fullY + curH, 4 + lockP * 16, 0, Math.PI * 2);
              ctx.strokeStyle = '#FFFFFF';
              ctx.globalAlpha = (1 - lockP) * 0.9 * boxAlpha;
              ctx.lineWidth = 1.5;
              ctx.stroke();
            }

            // 7. Pre-measured Dimensions & Collaboration Tag Pill
            if (fullW > 48 && fullH > 20) {
              const pillW = task.pillWidth;
              const pillH = 15;
              const pillX = clamp(fullX, 6, vw - pillW - 6);
              const pillY = fullY > 22 ? fullY - pillH - 3 : fullY + curH + 3;

              ctx.globalAlpha = boxAlpha * 0.96;
              ctx.fillStyle = task.primaryColor;
              ctx.beginPath();
              ctx.roundRect(pillX, pillY, pillW, pillH, 3);
              ctx.fill();

              ctx.fillStyle = '#05070C';
              ctx.fillText(task.dimLabel, pillX + 5, pillY + 10.5);
            }

            ctx.restore();
          }
        }

        // 6. Check if ALL portfolio elements have been constructed -> Trigger Phase 4 Convergence
        const allTasksDone =
          completedOpsCount >= tasks.length &&
          tasks.every((t) => t.status === 'done' && virtualTime >= t.doneTime + 100);

        if (allTasksDone) {
          convergenceStarted = true;
          convergenceStartTime = virtualTime;
          setPhaseLabel('converging');
          setWaitingForScroll(false);

          const pillEl = pillRef.current;
          const pillRect = pillEl ? pillEl.getBoundingClientRect() : null;
          cachedPillCenter = {
            x: pillRect ? pillRect.left + pillRect.width / 2 : vw / 2,
            y: pillRect ? pillRect.top + pillRect.height / 2 : vh - 44,
          };

          agents.forEach((agent) => {
            agent.state = 'converging';
            agent.startX = agent.x;
            agent.startY = agent.y;
            const dx = cachedPillCenter.x - agent.startX;
            const dy = cachedPillCenter.y - agent.startY;
            const dist = Math.hypot(dx, dy);
            const arc = clamp(dist * 0.25, 24, 120) * agent.curveSign;
            const nx = dist > 1 ? -dy / dist : 0;
            const ny = dist > 1 ? dx / dist : 1;

            agent.cp1X = agent.startX + dx * 0.3 + nx * arc;
            agent.cp1Y = agent.startY + dy * 0.3 + ny * arc;
            agent.cp2X = agent.startX + dx * 0.72 + nx * arc * 0.4;
            agent.cp2Y = agent.startY + dy * 0.72 + ny * arc * 0.4;
          });
        }
      }
      // ====================================================================
      // PHASE 4: CONVERGENCE FINALE & CLEAN UNMOUNT
      // ====================================================================
      else {
        const convElapsed = virtualTime - convergenceStartTime;
        const p = clamp(convElapsed / CONVERGENCE_DURATION, 0, 1);

        agents.forEach((agent, idx) => {
          const staggerP = clamp((convElapsed - idx * 25) / CONVERGENCE_DURATION, 0, 1);
          const easedP = easeInOutCubic(staggerP);

          const nextX = cubicBezier(
            agent.startX,
            agent.cp1X,
            agent.cp2X,
            cachedPillCenter.x,
            easedP
          );
          const nextY = cubicBezier(
            agent.startY,
            agent.cp1Y,
            agent.cp2Y,
            cachedPillCenter.y,
            easedP
          );

          const dx = nextX - agent.x;
          const dy = nextY - agent.y;
          if (Math.hypot(dx, dy) > 0.05) {
            const targetDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
            agent.angle = lerpAngleDeg(agent.angle, targetDeg, 0.32);
          }

          agent.x = nextX;
          agent.y = nextY;
          agent.scale = Math.max(0, 1 - Math.pow(staggerP, 2.2));
          agent.trail.pop();
          agent.trail.unshift({ x: nextX, y: nextY });
        });

        if (p >= 1 && !pillExitTriggered) {
          pillExitTriggered = true;
          setPillExiting(true);
          unmountTimeoutId = window.setTimeout(() => {
            finishAndUnmount();
          }, 310);
        }
      }

      // Draw Agent Motion Trails, Cursor Arrows & Multiplayer Role Pills onto Canvas
      if (ctx) {
        ctx.font = '700 8.5px ui-monospace, SFMono-Regular, Menlo, monospace';
        agents.forEach((agent) => {
          if (agent.scale <= 0.01) return;

          // 1. Smooth Neon Motion Trail behind the cursor tip
          if (agent.trail.length > 2) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(agent.trail[0].x, agent.trail[0].y);
            for (let t = 1; t < agent.trail.length; t++) {
              ctx.lineTo(agent.trail[t].x, agent.trail[t].y);
            }
            ctx.strokeStyle = agent.color;
            ctx.globalAlpha = 0.26 * agent.scale;
            ctx.lineWidth = 2 * agent.scale;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
            ctx.restore();
          }

          // 2. Rotated Figma Cursor Arrow
          ctx.save();
          ctx.translate(agent.x, agent.y);
          ctx.scale(agent.scale, agent.scale);

          ctx.save();
          ctx.rotate((agent.angle * Math.PI) / 180);

          // Crisp offset shadow
          ctx.save();
          ctx.translate(1.5, 2.5);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
          ctx.fill(cursorPath);
          ctx.restore();

          // Vibrant neon cursor body
          ctx.fillStyle = agent.color;
          ctx.fill(cursorPath);

          // Crisp white Figma border
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.35;
          ctx.lineJoin = 'round';
          ctx.stroke(cursorPath);
          ctx.restore();

          // 3. Figma Multiplayer Agent Role Pill ('ARCH', 'UI', 'GRID', 'SYNC')
          const pillW = agent.namePillWidth;
          const pillH = 13;
          const pillX = 10;
          const pillY = 10;

          ctx.fillStyle = 'rgba(5, 7, 12, 0.88)';
          ctx.strokeStyle = agent.color;
          ctx.lineWidth = 1;
          ctx.fillRect(pillX, pillY, pillW, pillH);
          ctx.strokeRect(pillX, pillY, pillW, pillH);

          ctx.fillStyle = agent.color;
          ctx.fillText(agent.name, pillX + 4, pillY + 9.2);

          ctx.restore();
        });
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cleanupResources();
    };
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Isolated Non-Destructive Overlay (Single Hardware-Accelerated Canvas) */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 9999,
          overflow: 'hidden',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            display: 'block',
          }}
        />
      </div>

      {/* Sleek Floating Control Pill at Bottom-Center */}
      <div
        ref={pillRef}
        dir="ltr"
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: pillExiting
            ? 'translateX(-50%) scale(0.85)'
            : 'translateX(-50%) scale(1)',
          opacity: pillExiting ? 0 : 1,
          transition: 'transform 300ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms ease',
          zIndex: 10000,
          pointerEvents: 'auto',
        }}
        className="flex items-center gap-2.5 sm:gap-3.5 rounded-full border border-cyan/30 bg-[#070B14]/92 px-3.5 py-2 sm:px-4 sm:py-2.5 font-mono text-[11px] sm:text-xs text-white shadow-[0_16px_48px_rgba(0,0,0,0.75),0_0_25px_rgba(94,235,255,0.18)] select-none whitespace-nowrap"
      >
        {phaseLabel === 'summoning' ? (
          <div className="flex items-center gap-2.5 px-1">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan" />
            </span>
            <span className="text-cyan font-medium tracking-wide">Summoning agents...</span>
            <span className="h-3.5 w-[1px] bg-white/15 mx-0.5" />
            <button
              type="button"
              onClick={handleSkip}
              className="rounded-full px-2 py-0.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              Skip ▸
            </button>
          </div>
        ) : (
          <>
            {/* Animated Multi-Colored Status Dots */}
            <div className="flex items-center -space-x-1">
              <span className="h-2 w-2 rounded-full bg-[#00F0FF] animate-pulse ring-2 ring-[#070B14]" />
              <span
                className="h-2 w-2 rounded-full bg-[#A855F7] animate-pulse ring-2 ring-[#070B14]"
                style={{ animationDelay: '150ms' }}
              />
              <span
                className="h-2 w-2 rounded-full bg-[#FF6B00] animate-pulse ring-2 ring-[#070B14]"
                style={{ animationDelay: '300ms' }}
              />
              <span
                className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse ring-2 ring-[#070B14]"
                style={{ animationDelay: '450ms' }}
              />
            </div>

            {/* Agent Count or Scroll Prompt */}
            {waitingForScroll ? (
              <span className="font-semibold text-amber-400 animate-pulse">
                Scroll ↓ to build
              </span>
            ) : (
              <span className="font-semibold text-white/95">{`${AGENT_COUNT} agents`}</span>
            )}

            <span className="h-3.5 w-[1px] bg-white/15" />

            {/* Live Incrementing Operations Counter */}
            <span
              ref={opsCounterRef}
              className="tabular-nums text-cyan font-semibold min-w-[78px] text-center"
            >
              {`0 / ${totalOps} ops`}
            </span>

            <span className="h-3.5 w-[1px] bg-white/15" />

            {/* Interactive Speed Toggle Buttons: 1x and 2x */}
            <div className="flex items-center gap-1 rounded-full bg-white/5 p-0.5 border border-white/10">
              <button
                type="button"
                onClick={() => handleSpeedChange(1)}
                className={`rounded-full px-2 py-0.5 text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${
                  speed === 1
                    ? 'bg-cyan text-[#05070C] shadow-[0_0_10px_rgba(94,235,255,0.5)]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                1x
              </button>
              <button
                type="button"
                onClick={() => handleSpeedChange(2)}
                className={`rounded-full px-2 py-0.5 text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer ${
                  speed === 2
                    ? 'bg-cyan text-[#05070C] shadow-[0_0_10px_rgba(94,235,255,0.5)]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                2x
              </button>
            </div>

            {/* Interactive Skip Button */}
            <button
              type="button"
              onClick={handleSkip}
              className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold text-white/85 transition-all hover:border-cyan/60 hover:bg-cyan/15 hover:text-cyan cursor-pointer"
            >
              Skip ▸
            </button>
          </>
        )}
      </div>
    </>
  );
}
