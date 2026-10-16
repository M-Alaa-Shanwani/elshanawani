import type { FC, SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export const ICONS: Record<string, FC<IconProps>> = {
  // .NET
  '.NET': (props) => (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" {...props}>
      <circle cx="12" cy="12" r="10" fill="#512BD4" />
      <text x="12" y="15" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="monospace">.NET</text>
    </svg>
  ),
  // C#
  'C#': (props) => (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" {...props}>
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" fill="#239120" />
      <text x="12" y="16" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="sans-serif">C#</text>
    </svg>
  ),
  // ABP.io
  'ABP.io': (props) => (
    <svg viewBox="0 0 41 41" fill="none" className="h-5 w-5 shrink-0" {...props}>
      <path d="M20.3885 23.6113C22.2675 23.6113 23.7906 22.088 23.7906 20.2088C23.7906 18.3297 22.2675 16.8063 20.3885 16.8063C18.5096 16.8063 16.9863 18.3297 16.9863 20.2088C16.9863 22.088 18.5096 23.6113 20.3885 23.6113Z" fill="#E83090" />
      <path d="M20.3916 0C17.3 0 14.25 0.7 11.47 2.05V6.43C13.95 4.85 16.8 3.96 19.73 3.84C22.67 3.72 25.58 4.39 28.18 5.77C30.77 7.15 32.95 9.19 34.5 11.69C36.04 14.18 36.9 17.05 36.98 19.98V32.31C39.16 29.26 40.47 25.67 40.75 21.92C41.02 18.18 40.26 14.43 38.55 11.09C36.84 7.75 34.23 4.95 31.03 2.99C27.83 1.03 24.15 0 20.39 0Z" fill="#5EEBFF" />
      <path d="M20.3899 37C16.13 37 12.03 35.35 8.95 32.41C5.87 29.47 4.03 25.46 3.83 21.2H3.81V8.51C0.83 12.68 -0.48 17.82 0.16 22.9C0.79 27.99 3.31 32.65 7.21 35.96C11.12 39.27 16.14 41 21.26 40.78C26.37 40.57 31.23 38.44 34.85 34.81V28.53C33.41 31.1 31.31 33.24 28.77 34.72C26.22 36.21 23.33 37 20.39 37Z" fill="#38BDF8" />
      <path d="M20.3888 25.64C19.16 25.64 17.96 25.22 16.99 24.46V28.37C18.76 29.09 20.71 29.23 22.57 28.76C24.42 28.3 26.08 27.24 27.29 25.76C28.5 24.28 29.2 22.45 29.29 20.54C29.38 18.63 28.86 16.74 27.79 15.15C26.73 13.56 25.18 12.36 23.38 11.71C21.58 11.07 19.62 11.02 17.79 11.58C15.96 12.13 14.36 13.26 13.22 14.8C12.08 16.33 11.46 18.2 11.46 20.11V31.58C12.5 32.4 13.64 33.07 14.86 33.57V20.1C14.86 19.01 15.19 17.94 15.79 17.03C16.4 16.12 17.26 15.41 18.27 15C19.28 14.58 20.39 14.47 21.47 14.68C22.54 14.89 23.52 15.42 24.3 16.19C25.07 16.97 25.6 17.95 25.81 19.02C26.02 20.1 25.91 21.21 25.5 22.22C25.08 23.23 24.37 24.09 23.46 24.7C22.55 25.31 21.48 25.63 20.39 25.63V25.64Z" fill="#60A5FA" />
      <path d="M9.3372 29.52V20.21C9.34 17.88 10.08 15.6 11.45 13.72C12.82 11.83 14.75 10.43 16.97 9.7C19.19 8.98 21.58 8.98 23.8 9.7C26.02 10.42 27.95 11.83 29.32 13.71C30.69 15.6 31.43 17.87 31.44 20.2C31.44 22.54 30.7 24.81 29.33 26.7C27.96 28.59 26.03 30 23.82 30.72C21.6 31.44 19.21 31.45 16.99 30.73V34.26C19.49 34.87 22.11 34.8 24.58 34.05C27.04 33.31 29.26 31.91 31.01 30.02C32.76 28.13 33.97 25.81 34.52 23.29C35.07 20.78 34.93 18.16 34.13 15.71C33.33 13.26 31.89 11.07 29.96 9.37C28.03 7.67 25.68 6.51 23.15 6.02C20.62 5.53 18.01 5.72 15.58 6.58C13.15 7.43 11 8.92 9.34 10.89V3.25C8.11 4.04 6.96 4.97 5.93 6V20.64C6.03 23.9 7.23 27.04 9.34 29.52Z" fill="#93C5FD" />
    </svg>
  ),
  // EF Core
  'EF Core': (props) => (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" {...props}>
      <rect x="2" y="3" width="20" height="6" rx="2" fill="#68217A" />
      <rect x="2" y="10" width="20" height="6" rx="2" fill="#512BD4" />
      <rect x="2" y="17" width="20" height="4" rx="2" fill="#0078D7" />
    </svg>
  ),
  // PostgreSQL
  'PostgreSQL': (props) => (
    <svg viewBox="0 0 24 24" fill="#336791" className="h-5 w-5 shrink-0" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </svg>
  ),
  // SQL Server
  'SQL Server': (props) => (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="4" fill="#CC292B" />
      <path d="M7 8h10M7 12h10M7 16h10" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  // Redis
  'Redis': (props) => (
    <svg viewBox="0 0 24 24" fill="#DC382D" className="h-5 w-5 shrink-0" {...props}>
      <path d="M21.29 8.24l-8.5-4.9a1.5 1.5 0 00-1.58 0l-8.5 4.9a1.5 1.5 0 00-.71 1.3v9.8a1.5 1.5 0 00.71 1.3l8.5 4.9a1.5 1.5 0 001.58 0l8.5-4.9a1.5 1.5 0 00.71-1.3v-9.8a1.5 1.5 0 00-.71-1.3zm-9.29-2.9l6.5 3.75-2.5 1.44-6.5-3.75 2.5-1.44zM5 9.09l6.5 3.75-2.5 1.44L2.5 10.53 5 9.09zm7 11.82l-6.5-3.75V11.4l6.5 3.75v5.76zm1-5.76l6.5-3.75v5.76l-6.5 3.75V15.15z"/>
    </svg>
  ),
  // RabbitMQ
  'RabbitMQ': (props) => (
    <svg viewBox="0 0 24 24" fill="#FF6600" className="h-5 w-5 shrink-0" {...props}>
      <path d="M7.7 2C6.2 2 5 3.2 5 4.7c0 1.2.8 2.2 1.9 2.5v3.6C4.8 11.2 3.5 13 3.5 15.2c0 3.2 2.6 5.8 5.8 5.8h6.4c3.2 0 5.8-2.6 5.8-5.8 0-2.3-1.4-4.2-3.4-5v-5.5C18.1 4.7 16.9 3.5 15.4 3.5c-.8 0-1.6.4-2.1 1-.5-.6-1.3-1-2.1-1-.5 0-1 .1-1.4.3-.6-1.1-1.3-1.8-2.1-1.8zm0 1.5c.7 0 1.2.5 1.2 1.2s-.5 1.2-1.2 1.2-1.2-.5-1.2-1.2.5-1.2 1.2-1.2zm7.7 1.5c.7 0 1.2.5 1.2 1.2s-.5 1.2-1.2 1.2-1.2-.5-1.2-1.2.5-1.2 1.2-1.2zm-2.9 6.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"/>
    </svg>
  ),
  // Docker
  'Docker': (props) => (
    <svg viewBox="0 0 24 24" fill="#2496ED" className="h-5 w-5 shrink-0" {...props}>
      <path d="M13.98 11.08h-2.12V8.96h2.12v2.12zm-2.73 0H9.13V8.96h2.12v2.12zm5.45 0h-2.12V8.96h2.12v2.12zm-8.18 0H6.4V8.96h2.12v2.12zm8.18-2.73h-2.12V6.23h2.12v2.12zm-2.73 0h-2.12V6.23h2.12v2.12zm-2.72 0H9.13V6.23h2.12v2.12zm11.53 4.29c-.38-.28-1.55-.38-2.38.19-.24.16-.45.37-.62.61-.48-.28-1.22-.38-1.92-.12-.08-.55-.38-1.01-.84-1.28L21.4 12c.38.45.62 1.03.62 1.66 0 .39-.09.76-.24 1.1-.38 1.48-1.57 2.68-3.04 3.09-1.97.55-4.14.34-6.14.34-2.83 0-5.59-.44-8.1-1.39-.75-.28-1.42-.71-1.95-1.27-.4-.42-.66-.96-.75-1.54-.12-.77.16-1.54.72-2.09.43-.43 1-.72 1.62-.84.28-.06.58-.08.87-.08h11.71c.78 0 1.53.31 2.08.86z"/>
    </svg>
  ),
  // Git
  'Git': (props) => (
    <svg viewBox="0 0 24 24" fill="#F05032" className="h-5 w-5 shrink-0" {...props}>
      <path d="M21.7 10.7L13.3 2.3c-.4-.4-1-.4-1.4 0L9.5 4.7 12 7.2c.4-.1.9 0 1.2.3.4.4.5 1 .3 1.5l2.4 2.4c.5-.2 1.1-.1 1.5.3.6.6.6 1.5 0 2.1-.6.6-1.5.6-2.1 0-.4-.4-.5-1-.3-1.5l-2.3-2.3v5.2c.2.2.3.5.3.8 0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5c0-.4.2-.7.4-1V9.7c-.2-.2-.4-.5-.4-.8 0-.5.3-1 .7-1.3L8.2 5.1 2.3 11c-.4.4-.4 1 0 1.4l8.4 8.4c.4.4 1 .4 1.4 0l9.6-9.6c.4-.5.4-1.1 0-1.5z"/>
    </svg>
  ),
  // Angular
  'Angular': (props) => (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" {...props}>
      <path d="M12 2.5L2.5 5.9l1.4 12.3L12 22.5l8.1-4.3 1.4-12.3L12 2.5z" fill="#DD0031" />
      <path d="M12 2.5v20l8.1-4.3 1.4-12.3L12 2.5z" fill="#C3002F" />
      <path d="M12 5.8L6.8 17.5h2.2l1-2.6h4l1 2.6h2.2L12 5.8zm1.3 7.4h-2.6L12 9.7l1.3 3.5z" fill="#FFFFFF" />
    </svg>
  ),
  // React
  'React': (props) => (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" {...props}>
      <ellipse cx="12" cy="12" rx="10" ry="4.5" stroke="#61DAFB" strokeWidth="1.5" />
      <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)" stroke="#61DAFB" strokeWidth="1.5" />
      <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)" stroke="#61DAFB" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2" fill="#61DAFB" />
    </svg>
  ),
  // TypeScript
  'TypeScript': (props) => (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" {...props}>
      <rect width="24" height="24" rx="4" fill="#3178C6" />
      <path d="M4 9h6m-3 0v10M13 14c.5-1 1.7-1.6 3-1.6 1.8 0 3 1 3 2.5s-1.2 2.3-2.6 2.7c-1.3.4-1.8.8-1.8 1.4 0 .7.6 1.2 1.6 1.2 1.2 0 2.2-.6 2.7-1.4m.1-4.8v.1" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  // JavaScript
  'JavaScript': (props) => (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" {...props}>
      <rect width="24" height="24" rx="4" fill="#F7DF1E" />
      <path d="M7 13v5c0 1.1.9 2 2 2h1M15 13v7m0-3.5h4V20" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  ),
  // Tailwind CSS
  'Tailwind CSS': (props) => (
    <svg viewBox="0 0 24 24" fill="#06B6D4" className="h-5 w-5 shrink-0" {...props}>
      <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.335 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.335 13.382 8.975 12 6.001 12z"/>
    </svg>
  ),
  // HTML5
  'HTML5': (props) => (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" {...props}>
      <path d="M3 2l1.8 17.5L12 22l7.2-2.5L21 2H3z" fill="#E34F26" />
      <path d="M12 3.8v16.5l5.6-1.9L19 3.8H12z" fill="#EF652A" />
      <path d="M12 7.5H7.5l.3 3h4.2m0 3H8l.4 3.7 3.6 1m0-10.7h4.5l-.4 3.7H12m0 3.3h3.9l-.4 3.7-3.5 1" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  // CSS3
  'CSS3': (props) => (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" {...props}>
      <path d="M3 2l1.8 17.5L12 22l7.2-2.5L21 2H3z" fill="#1572B6" />
      <path d="M12 3.8v16.5l5.6-1.9L19 3.8H12z" fill="#33A9DC" />
      <path d="M12 7.5H7.5l.3 3h4.2m0 3H8l.4 3.7 3.6 1m0-10.7h4.5l-.4 3.7H12m0 3.3h3.9l-.4 3.7-3.5 1" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  // Redux
  'Redux': (props) => (
    <svg viewBox="0 0 24 24" fill="#764ABC" className="h-5 w-5 shrink-0" {...props}>
      <path d="M15.7 13.3a4.7 4.7 0 00-6.4 1.7 4.7 4.7 0 001.7 6.4 4.7 4.7 0 006.4-1.7 4.7 4.7 0 00-1.7-6.4zm-4.7 6.4a2.7 2.7 0 01-1-3.7 2.7 2.7 0 013.7-1 2.7 2.7 0 011 3.7 2.7 2.7 0 01-3.7 1zM7.5 9.7a4.7 4.7 0 100-9.4 4.7 4.7 0 000 9.4zm0-6.7a2 2 0 110 4 2 2 0 010-4zm9 0a4.7 4.7 0 100 9.4 4.7 4.7 0 000-9.4zm0 6.7a2 2 0 110-4 2 2 0 010 4z"/>
    </svg>
  ),
  // RxJS
  'RxJS': (props) => (
    <svg viewBox="0 0 24 24" fill="#B7178C" className="h-5 w-5 shrink-0" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16.5c-3.04 0-5.5-2.46-5.5-5.5s2.46-5.5 5.5-5.5 5.5 2.46 5.5 5.5-2.46 5.5-5.5 5.5zm0-8.5c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
    </svg>
  ),
  // Sass
  'Sass': (props) => (
    <svg viewBox="0 0 24 24" fill="#CC6699" className="h-5 w-5 shrink-0" {...props}>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm3.6 13.9c-2.2 2.2-6.5 2.5-8.5.5-1.9-1.9-1.5-5.2.8-7.3 2.1-1.9 5.3-2.3 7.2-.6 1.7 1.5 1.5 3.9-.2 5.3-1.5 1.2-3.6 1-4.7-.2-.8-.9-.6-2.1.3-2.8.7-.5 1.7-.4 2.2.2.3.4.7.4.9.1.2-.3.1-.7-.2-.9-.9-.8-2.5-.7-3.4.3-1.2 1.3-.9 3.2.4 4.3 1.5 1.3 3.9 1.2 5.4-.3 1.9-1.8 1.9-4.7-.1-6.5-2.2-2-5.9-1.6-8.2.7-2.6 2.5-3 6.4-.7 8.7 2.4 2.4 7.2 2.1 9.7-.4 1.1-1.1 1.7-2.5 1.7-3.9 0-.4-.3-.7-.7-.7s-.7.3-.7.7c0 1.1-.4 2.2-1.3 3.1z"/>
    </svg>
  ),
  // Figma
  'Figma': (props) => (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" {...props}>
      <path d="M8 3h4v6H8a3 3 0 110-6z" fill="#F24E1E" />
      <path d="M12 3h4a3 3 0 110 6h-4V3z" fill="#FF7262" />
      <path d="M12 9h4a3 3 0 110 6h-4V9z" fill="#1ABCFE" />
      <path d="M8 9h4v6H8a3 3 0 110-6z" fill="#A259FF" />
      <path d="M8 15h4v3a3 3 0 11-4-3z" fill="#0ACF83" />
    </svg>
  ),
  // Adobe XD
  'Adobe XD': (props) => (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" {...props}>
      <rect width="24" height="24" rx="5" fill="#470137" />
      <text x="12" y="16.5" textAnchor="middle" fill="#FF61F6" fontSize="12" fontWeight="bold" fontFamily="sans-serif">Xd</text>
    </svg>
  ),
  // Design Systems
  'Design Systems': (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#FF4785" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0" {...props}>
      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
      <polyline points="2 17 12 22 22 17"/>
      <polyline points="2 12 12 17 22 12"/>
    </svg>
  ),
  // Prototyping
  'Prototyping': (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#0055FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0" {...props}>
      <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>
      <polygon points="10 8 16 12 10 16 10 8"/>
    </svg>
  ),
  // Wireframing
  'Wireframing': (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#5EEBFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <line x1="3" y1="9" x2="21" y2="9"/>
      <line x1="9" y1="21" x2="9" y2="9"/>
    </svg>
  ),
  // User Research
  'User Research': (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#E37400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0" {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <circle cx="19" cy="11" r="3"/>
      <path d="M22 14l2 2"/>
    </svg>
  ),
  // Playwright
  'Playwright': (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#2EAD33" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9l6 3-6 3V9z" fill="#2EAD33" />
    </svg>
  ),
  // Cypress
  'Cypress': (props) => (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" {...props}>
      <circle cx="12" cy="12" r="10" fill="#1B1E2E" />
      <path d="M16 8.5a5.5 5.5 0 100 7M16 12h-3" stroke="#69D3A7" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  // xUnit
  'xUnit': (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#512BD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M9 12l2 2 4-4" stroke="#00D26A" strokeWidth="2.5" />
    </svg>
  ),
  // GitHub Actions
  'GitHub Actions': (props) => (
    <svg viewBox="0 0 24 24" fill="#2088FF" className="h-5 w-5 shrink-0" {...props}>
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm3.5 13.5L11 13V7h2v4.8l3.7 2.2-.8 1.5z"/>
    </svg>
  ),
  // CI/CD Pipelines
  'CI/CD Pipelines': (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#2088FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0" {...props}>
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="12" r="3" />
      <path d="M9 12h6" />
      <path d="M12 9l3 3-3 3" />
    </svg>
  ),
  // Load Testing k6
  'Load Testing k6': (props) => (
    <svg viewBox="0 0 24 24" fill="#7D64FF" className="h-5 w-5 shrink-0" {...props}>
      <path d="M14.2 2.5L7 14.8h4.5L9.8 21.5l8.7-12.8h-4.3l3-6.2h-3z"/>
    </svg>
  ),
  // Selenium
  'Selenium': (props) => (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" {...props}>
      <rect width="24" height="24" rx="4" fill="#43B02A" />
      <text x="12" y="16.5" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold" fontFamily="sans-serif">Se</text>
    </svg>
  ),
  // Postman
  'Postman': (props) => (
    <svg viewBox="0 0 24 24" fill="#FF6C37" className="h-5 w-5 shrink-0" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5l-3.5-2 3.5-2v4zm2-2.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
    </svg>
  ),

  // --- Integrations & Cloud ---
  'REST APIs': (props) => (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" {...props}>
      <circle cx="12" cy="12" r="10" stroke="#0EA5E9" strokeWidth="1.8" fill="#0EA5E9" fillOpacity="0.15" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="#38BDF8" strokeWidth="1.5" />
    </svg>
  ),
  'GraphQL': (props) => (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" {...props}>
      <path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z" stroke="#E10098" strokeWidth="1.5" fill="#E10098" fillOpacity="0.1" />
      <circle cx="12" cy="2" r="2" fill="#E10098" />
      <circle cx="20.66" cy="7" r="2" fill="#E10098" />
      <circle cx="20.66" cy="17" r="2" fill="#E10098" />
      <circle cx="12" cy="22" r="2" fill="#E10098" />
      <circle cx="3.34" cy="17" r="2" fill="#E10098" />
      <circle cx="3.34" cy="7" r="2" fill="#E10098" />
      <path d="M12 2v20M3.34 7l17.32 10M20.66 7L3.34 17" stroke="#E10098" strokeWidth="1" opacity="0.5" />
    </svg>
  ),
  'Webhooks': (props) => (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" {...props}>
      <path d="M18 17h-6a2 2 0 0 1-2 2 4 4 0 0 1-8-2c0-2.2 1.8-4 4-4h4" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
      <circle cx="18" cy="17" r="3" fill="#F59E0B" />
      <path d="M6 13V7a4 4 0 0 1 7.4-2.1c.5 1 1.4 2.1 2.6 2.1H18" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
      <circle cx="18" cy="7" r="3" fill="#F59E0B" />
    </svg>
  ),
  'Payment Gateways': (props) => (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" {...props}>
      <rect x="2" y="5" width="20" height="14" rx="3" stroke="#6366F1" strokeWidth="2" fill="#6366F1" fillOpacity="0.15" />
      <line x1="2" y1="10" x2="22" y2="10" stroke="#6366F1" strokeWidth="2" />
      <rect x="5" y="14" width="5" height="2" rx="1" fill="#818CF8" />
      <circle cx="17" cy="15" r="1.5" fill="#818CF8" />
    </svg>
  ),
  'Stripe': (props) => (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" {...props}>
      <rect width="24" height="24" rx="5" fill="#635BFF" />
      <path d="M13.9 10.4c0-.7-.6-1-1.6-1-1.4 0-3.1.5-4.2 1.1v-2.7c1.3-.5 2.8-.8 4.3-.8 3.5 0 5.6 1.7 5.6 4.6 0 4.5-6.2 3.8-6.2 5.7 0 .8.7 1.1 1.8 1.1 1.6 0 3.6-.7 4.7-1.4v2.7c-1.4.6-3.1.9-4.8.9-3.7 0-5.9-1.8-5.9-4.7 0-4.8 6.3-4 6.3-5.5z" fill="#FFFFFF" />
    </svg>
  ),
  'Azure Cloud': (props) => (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" {...props}>
      <path d="M5.5 19h13.2a4.3 4.3 0 0 0 .8-8.5 6 6 0 0 0-11.7-1.8A4.8 4.8 0 0 0 5.5 19z" fill="#0078D4" fillOpacity="0.2" stroke="#0078D4" strokeWidth="2" strokeLinejoin="round" />
      <path d="M8 16l3.5-6.5L14 13l2-3.5" stroke="#50E6FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  'Microservices': (props) => (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="6" height="6" rx="1.5" stroke="#10B981" strokeWidth="1.8" fill="#10B981" fillOpacity="0.2" />
      <rect x="15" y="3" width="6" height="6" rx="1.5" stroke="#10B981" strokeWidth="1.8" fill="#10B981" fillOpacity="0.2" />
      <rect x="9" y="15" width="6" height="6" rx="1.5" stroke="#10B981" strokeWidth="1.8" fill="#10B981" fillOpacity="0.2" />
      <path d="M6 9v3a3 3 0 0 0 3 3h3m0 0h3a3 3 0 0 0 3-3V9" stroke="#34D399" strokeWidth="1.8" />
    </svg>
  ),
  'OAuth & JWT': (props) => (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#EC4899" strokeWidth="1.8" fill="#EC4899" fillOpacity="0.15" />
      <circle cx="12" cy="10" r="2.5" stroke="#F472B6" strokeWidth="1.8" />
      <path d="M12 12.5v3.5" stroke="#F472B6" strokeWidth="1.8" />
    </svg>
  ),
};

export function TechIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = ICONS[name];
  if (!IconComponent) {
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan/20 text-[10px] font-bold text-cyan">
        {name.slice(0, 2).toUpperCase()}
      </span>
    );
  }
  return <IconComponent className={className} />;
}
