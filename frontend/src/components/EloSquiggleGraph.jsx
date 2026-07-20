import { buildEloSquigglePath } from '../utils/eloSquiggle';

/**
 * Full-bleed decorative curve for the home hero.
 * Always spans toward the right edge with a tip dot + readable elo — no axes/chrome.
 */
export default function EloSquiggleGraph({ elo, className = '' }) {
  const { path, endX, endY, elo: rating, width, height } = buildEloSquigglePath(elo);
  const tipLeft = (endX / width) * 100;
  const tipTop = (endY / height) * 100;

  return (
    <div className={className} role="img" aria-label={`Rating curve at ${rating} elo`}>
      <div className="relative h-full w-full">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full text-inherit"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d={path}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            className="elo-squiggle-path origin-center"
          />
        </svg>
        <span
          className="elo-squiggle-tip pointer-events-none absolute flex items-center gap-1.5 text-inherit"
          style={{
            left: `${tipLeft}%`,
            top: `${tipTop}%`,
            transform: 'translate(0.15rem, -50%)',
          }}
        >
          <span className="elo-squiggle-dot inline-block h-2 w-2 shrink-0 rounded-full bg-current" aria-hidden="true" />
          <span className="elo-squiggle-label font-sans text-xl font-semibold tabular-nums tracking-tight sm:text-2xl">
            {rating}
          </span>
        </span>
      </div>
    </div>
  );
}
