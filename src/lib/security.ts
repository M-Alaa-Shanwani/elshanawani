/**
 * Site Security & Intellectual Property Protection Module
 * Prevents unauthorized scraping, asset downloading, and source extraction.
 */

export function initSecurity(): void {
  if (typeof window === 'undefined') return;

  // 1. Disable Right-Click Context Menu on images, media, and general content
  document.addEventListener(
    'contextmenu',
    (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      // Allow context menu only inside editable inputs / textareas if any
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      return false;
    },
    { capture: true }
  );

  // 2. Prevent dragging images, videos, and links out of the browser
  document.addEventListener(
    'dragstart',
    (e: DragEvent) => {
      e.preventDefault();
      return false;
    },
    { capture: true }
  );

  // 3. Block Developer Tools & Source Inspection Shortcuts
  document.addEventListener(
    'keydown',
    (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // F12 -> DevTools
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }

      // Ctrl/Cmd + Shift + I/J/C -> DevTools / Console / Inspector
      if (cmdOrCtrl && e.shiftKey) {
        const key = e.key.toUpperCase();
        if (key === 'I' || key === 'J' || key === 'C') {
          e.preventDefault();
          return false;
        }
      }

      // Ctrl/Cmd + U -> View Source
      if (cmdOrCtrl && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        return false;
      }

      // Ctrl/Cmd + S -> Save HTML file to disk
      if (cmdOrCtrl && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        return false;
      }

      // Ctrl/Cmd + P -> Print / Save to PDF
      if (cmdOrCtrl && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        return false;
      }
    },
    { capture: true }
  );

  // 4. Console copyright & anti-tamper notice
  try {
    const titleStyle =
      'color: #5eebff; font-family: monospace; font-size: 16px; font-weight: bold; text-shadow: 0 0 10px rgba(94,235,255,0.6);';
    const subStyle =
      'color: #8a93b3; font-family: sans-serif; font-size: 12px; line-height: 1.5;';
    const warnStyle =
      'color: #ffb703; font-family: sans-serif; font-size: 12px; font-weight: bold;';

    console.log('%c⚡ Mohamed Alaa — Engineering & Portfolio', titleStyle);
    console.log(
      '%cجميع الحقوق الفكرية والتصميمية والبرمجية محفوظة © ' +
        new Date().getFullYear() +
        '.',
      subStyle
    );
    console.log(
      '%c⚠️ تنبيه أمني: يُحظر نسخ، استنساخ، أو إعادة استخدام الكود المصدري أو التصاميم أو الوسائط دون إذن كتابي مسبق.',
      warnStyle
    );
  } catch {
    // Ignore console errors if any
  }
}
