import { useState } from 'react';
import { buildEloSquigglePath } from '../utils/eloSquiggle';

/**
 * Full-bleed decorative curve for the home hero.
 * Line always runs left edge → right edge; current elo appears only on hover.
 */
export default function EloSquiggleGraph({ elo, className = '' }) {
  const { path, elo: rating, width, height } = buildEloSquigglePath(elo);
  const [hover, setHover] = useState(null);

  const updateHover = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    if (bounds.width <= 0 || bounds.height <= 0) return;
    setHover({
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
    });
  };

  const clearHover = () => setHover(null);

  return (
    <div
      className={className}
      role="img"
      aria-label={`Rating curve at ${rating} elo`}
      onPointerEnter={updateHover}
      onPointerMove={updateHover}
      onPointerLeave={clearHover}
    >
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
        {hover && (
          <span
            className="elo-squiggle-hover pointer-events-none absolute z-10 font-sans text-sm font-semibold tabular-nums tracking-tight text-inherit sm:text-base"
            style={{
              left: `${hover.x}%`,
              top: `${hover.y}%`,
              transform: 'translate(-50%, calc(-100% - 0.55rem))',
            }}
          >
            {rating}
          </span>
        )}
      </div>
    </div>
  );
}
