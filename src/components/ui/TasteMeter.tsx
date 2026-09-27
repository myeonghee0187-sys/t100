import "./taste-meter.css";

export type TasteMeterProps = {
  label: string;
  score: number | null;
};

export function TasteMeter({ label, score }: TasteMeterProps) {
  if (score === null) return null;

  const value = Math.max(0, Math.min(5, Math.round(score)));

  return (
    <span
      className="taste-meter"
      role="img"
      aria-label={`${label} ${value} / 5`}
    >
      <span className="taste-meter-label" aria-hidden="true">
        {label}
      </span>
      <span className="taste-meter-circles" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((index) => (
          <img
            className="taste-meter-circle"
            key={index}
            src={`/assets/icons/taste-${index < value ? "46" : "49"}.svg`}
            width={10}
            height={10}
            alt=""
            draggable={false}
          />
        ))}
      </span>
    </span>
  );
}
