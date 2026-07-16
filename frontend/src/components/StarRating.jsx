import { useState } from "react";
import { FaStar } from "react-icons/fa";

/**
 * Componente de calificación por estrellas (RR-009).
 *
 * Modo lectura: readOnly=true -> solo muestra el promedio (no clickeable).
 * Modo interactivo: readOnly=false -> el usuario puede calificar de 1 a 5,
 * dispara onRate(estrellas) al hacer click.
 */
export default function StarRating({
  value = 0,
  onRate,
  readOnly = false,
  size = 18,
  disabled = false,
}) {
  const [hover, setHover] = useState(0);
  const estrellas = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-1" role="img" aria-label={`Calificación: ${value} de 5 estrellas`}>
      {estrellas.map((estrella) => {
        const activa = hover ? estrella <= hover : estrella <= Math.round(value);

        return (
          <button
            key={estrella}
            type="button"
            disabled={readOnly || disabled}
            onClick={() => !readOnly && !disabled && onRate?.(estrella)}
            onMouseEnter={() => !readOnly && !disabled && setHover(estrella)}
            onMouseLeave={() => !readOnly && !disabled && setHover(0)}
            className={`transition ${
              readOnly || disabled
                ? "cursor-default"
                : "cursor-pointer hover:scale-110 active:scale-90"
            }`}
            aria-label={`Calificar con ${estrella} estrella${estrella > 1 ? "s" : ""}`}
          >
            <FaStar
              size={size}
              className={activa ? "text-[#e67e22]" : "text-gray-200"}
            />
          </button>
        );
      })}
    </div>
  );
}
