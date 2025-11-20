// Premium icon components with gradients and effects
// Each icon is a custom SVG with premium styling

export function TargetIcon({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="targetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00d4ff" />
          <stop offset="100%" stopColor="#ff006e" />
        </linearGradient>
        <filter id="targetGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#targetGlow)">
        <circle cx="24" cy="24" r="20" stroke="url(#targetGrad)" strokeWidth="2.5" fill="none" />
        <circle cx="24" cy="24" r="14" stroke="url(#targetGrad)" strokeWidth="2" fill="none" opacity="0.7" />
        <circle cx="24" cy="24" r="8" stroke="url(#targetGrad)" strokeWidth="2" fill="none" opacity="0.5" />
        <circle cx="24" cy="24" r="3" fill="url(#targetGrad)" />
        <line x1="24" y1="4" x2="24" y2="12" stroke="url(#targetGrad)" strokeWidth="2" strokeLinecap="round" />
        <line x1="24" y1="36" x2="24" y2="44" stroke="url(#targetGrad)" strokeWidth="2" strokeLinecap="round" />
        <line x1="4" y1="24" x2="12" y2="24" stroke="url(#targetGrad)" strokeWidth="2" strokeLinecap="round" />
        <line x1="36" y1="24" x2="44" y2="24" stroke="url(#targetGrad)" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function ShieldIcon({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00d4ff" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <filter id="shieldGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#shieldGlow)">
        <path
          d="M24 4L6 12V22C6 33.5 13.5 44 24 46C34.5 44 42 33.5 42 22V12L24 4Z"
          stroke="url(#shieldGrad)"
          strokeWidth="2.5"
          fill="rgba(0, 212, 255, 0.1)"
        />
        <path
          d="M17 24L22 29L31 20"
          stroke="url(#shieldGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
    </svg>
  );
}

export function BoltIcon({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffd700" />
          <stop offset="50%" stopColor="#ff9500" />
          <stop offset="100%" stopColor="#ff006e" />
        </linearGradient>
        <filter id="boltGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#boltGlow)">
        <path
          d="M26 4L10 28H22L20 44L38 18H26L26 4Z"
          fill="url(#boltGrad)"
          stroke="url(#boltGrad)"
          strokeWidth="1"
        />
      </g>
    </svg>
  );
}

export function ChartIcon({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="chartGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#00d4ff" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <filter id="chartGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#chartGlow)">
        <rect x="6" y="28" width="8" height="14" rx="2" fill="url(#chartGrad)" opacity="0.6" />
        <rect x="20" y="18" width="8" height="24" rx="2" fill="url(#chartGrad)" opacity="0.8" />
        <rect x="34" y="8" width="8" height="34" rx="2" fill="url(#chartGrad)" />
        <path
          d="M10 24L24 14L38 6"
          stroke="#00d4ff"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="10" cy="24" r="3" fill="#00d4ff" />
        <circle cx="24" cy="14" r="3" fill="#00d4ff" />
        <circle cx="38" cy="6" r="3" fill="#00d4ff" />
      </g>
    </svg>
  );
}

export function SparklesIcon({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="sparklesGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff006e" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#00d4ff" />
        </linearGradient>
        <filter id="sparklesGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#sparklesGlow)">
        {/* Main star */}
        <path
          d="M24 4L27 18L42 20L27 22L24 36L21 22L6 20L21 18L24 4Z"
          fill="url(#sparklesGrad)"
        />
        {/* Small stars */}
        <path
          d="M38 32L39.5 36L44 37L39.5 38L38 42L36.5 38L32 37L36.5 36L38 32Z"
          fill="#00d4ff"
        />
        <path
          d="M10 30L11.5 34L16 35L11.5 36L10 40L8.5 36L4 35L8.5 34L10 30Z"
          fill="#ff006e"
        />
        <path
          d="M36 8L37 11L40 12L37 13L36 16L35 13L32 12L35 11L36 8Z"
          fill="#8b5cf6"
        />
      </g>
    </svg>
  );
}
