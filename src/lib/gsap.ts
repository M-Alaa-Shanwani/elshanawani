import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugins a single time for the whole app. Importing this module
// anywhere (instead of importing 'gsap' + 'gsap/ScrollTrigger' directly)
// guarantees registration happens exactly once, even with HMR.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
