interface PartnerRatingDisplayProps {
  rating?: { score: number; count: number } | null;
}

export function PartnerRatingDisplay({ rating }: PartnerRatingDisplayProps) {
  if (!rating || rating.count === 0) {
    return (
      <p className="text-sm text-slate-400 italic">Sin calificaciones aún</p>
    );
  }

  const rounded = Math.round(rating.score);

  return (
    <div className="flex items-center gap-2">
      {/* Estrellas */}
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rounded
                ? "text-amber-400 fill-amber-400"
                : "text-slate-300 fill-slate-300"
            }`}
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      {/* Puntaje y conteo */}
      <span className="font-semibold text-amber-600 text-sm">
        {rating.score.toFixed(1)}
      </span>
      <span className="text-xs text-slate-500">({rating.count} reseñas)</span>
    </div>
  );
}
