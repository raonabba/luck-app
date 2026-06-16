interface StarRatingProps {
  score: number; // 1–5
  size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({ score, size = 'md' }: StarRatingProps) {
  const sizeClass = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg';

  return (
    <span className={`inline-flex gap-0.5 ${sizeClass}`} aria-label={`${score}점`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < score ? 'star-filled' : 'star-empty'}>
          ★
        </span>
      ))}
    </span>
  );
}
