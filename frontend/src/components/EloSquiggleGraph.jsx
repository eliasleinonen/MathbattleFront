import { buildEloSquigglePath } from '../utils/eloSquiggle';

/**
 * Decorative rating curve for the home hero.
 * Renders only the squiggle + the readable elo on the tip — no axes/chrome.
 */
export default function EloSquiggleGraph({ elo, className = '' }) {
  const { path, endX, endY, elo: rating, width, height } = buildEloSquigglePath(elo);
  const tipLeft = (endX / width) * 100;
  const tipTop = (endY / height) * 100;
  const tipOnRight = endX > width * 0.72;

  return (
    <div className={className} role="img" aria-label={`Rating curve at ${rating} elo`}>
      <div className="relative h-full w-full">
        <svg
          className="absolute inset-0 h-full w-full text-inherit"
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
            className="elo-squiggle-path"
          />
        </svg>
        <span
          className="elo-squiggle-tip absolute flex items-center gap-1.5 text-inherit"
          style={{
            left: `${tipLeft}%`,
            top: `${tipTop}%`,
            // Park the readable rating just above the tip so the stroke never crosses the digits.
            transform: tipOnRight
              ? 'translate(-100%, calc(-100% - 0.35rem))'
              : 'translate(0.2rem, calc(-100% - 0.35rem))',
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
