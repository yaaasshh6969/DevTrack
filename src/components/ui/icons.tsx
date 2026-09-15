interface IconProps {
  size?: number;
  className?: string;
}

const svg = (children: React.ReactNode, size: number, className: string) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

export function DashboardIcon({ size = 18, className = '' }: IconProps) {
  return svg(
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>,
    size,
    className,
  );
}

export function RoadmapIcon({ size = 18, className = '' }: IconProps) {
  return svg(
    <>
      <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </>,
    size,
    className,
  );
}

export function LogIcon({ size = 18, className = '' }: IconProps) {
  return svg(
    <>
      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </>,
    size,
    className,
  );
}

export function SquadIcon({ size = 18, className = '' }: IconProps) {
  return svg(
    <>
      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </>,
    size,
    className,
  );
}

export function AnalyticsIcon({ size = 18, className = '' }: IconProps) {
  return svg(
    <>
      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </>,
    size,
    className,
  );
}

export function AICoachIcon({ size = 18, className = '' }: IconProps) {
  return svg(
    <>
      <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </>,
    size,
    className,
  );
}

export function SettingsIcon({ size = 18, className = '' }: IconProps) {
  return svg(
    <>
      <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </>,
    size,
    className,
  );
}

export function MenuIcon({ size = 20, className = '' }: IconProps) {
  return svg(
    <>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </>,
    size,
    className,
  );
}

export function CloseIcon({ size = 20, className = '' }: IconProps) {
  return svg(
    <>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </>,
    size,
    className,
  );
}

export function FlameIcon({ size = 18, className = '' }: IconProps) {
  return svg(
    <>
      <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      <path d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
    </>,
    size,
    className,
  );
}

export function ClockIcon({ size = 18, className = '' }: IconProps) {
  return svg(
    <>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 15" />
    </>,
    size,
    className,
  );
}

export function CheckCircleIcon({ size = 18, className = '' }: IconProps) {
  return svg(
    <>
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </>,
    size,
    className,
  );
}

export function TrendUpIcon({ size = 18, className = '' }: IconProps) {
  return svg(
    <>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </>,
    size,
    className,
  );
}

export function PlusIcon({ size = 18, className = '' }: IconProps) {
  return svg(
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </>,
    size,
    className,
  );
}

export function ChevronRightIcon({ size = 16, className = '' }: IconProps) {
  return svg(
    <polyline points="9 18 15 12 9 6" />,
    size,
    className,
  );
}

export function ChevronDownIcon({ size = 16, className = '' }: IconProps) {
  return svg(
    <polyline points="6 9 12 15 18 9" />,
    size,
    className,
  );
}

export function StarIcon({ size = 16, className = '' }: IconProps) {
  return svg(
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
    size,
    className,
  );
}

export function LockIcon({ size = 16, className = '' }: IconProps) {
  return svg(
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" ry="2" />
      <path d="M8 11V7a4 4 0 018 0v4" />
    </>,
    size,
    className,
  );
}

export function BookmarkIcon({ size = 16, className = '' }: IconProps) {
  return svg(
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />,
    size,
    className,
  );
}

export function SmileIcon({ size = 16, className = '' }: IconProps) {
  return svg(
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 13s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </>,
    size,
    className,
  );
}

export function TagIcon({ size = 16, className = '' }: IconProps) {
  return svg(
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />,
    size,
    className,
  );
}

export function ExternalLinkIcon({ size = 14, className = '' }: IconProps) {
  return svg(
    <>
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </>,
    size,
    className,
  );
}
