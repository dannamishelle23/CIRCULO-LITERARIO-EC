import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StarRating from "./StarRating";

describe("StarRating", () => {
  it("renderiza 5 estrellas", () => {
    render(<StarRating value={3} readOnly />);

    const estrellas = screen.getAllByRole("button");
    expect(estrellas).toHaveLength(5);
  });

  it("en modo solo lectura, las estrellas están deshabilitadas y no disparan onRate", async () => {
    const onRate = vi.fn();
    const user = userEvent.setup();

    render(<StarRating value={3} readOnly onRate={onRate} />);

    const estrellas = screen.getAllByRole("button");
    await user.click(estrellas[4]); // intenta calificar con 5 estrellas

    expect(onRate).not.toHaveBeenCalled();
  });

  it("en modo interactivo, hacer click en la estrella N llama a onRate(N)", async () => {
    const onRate = vi.fn();
    const user = userEvent.setup();

    render(<StarRating value={0} onRate={onRate} />);

    const estrellas = screen.getAllByRole("button");
    await user.click(estrellas[2]); // tercera estrella

    expect(onRate).toHaveBeenCalledWith(3);
    expect(onRate).toHaveBeenCalledTimes(1);
  });

  it("no dispara onRate si está deshabilitado (ej. mientras se envía la calificación)", async () => {
    const onRate = vi.fn();
    const user = userEvent.setup();

    render(<StarRating value={2} onRate={onRate} disabled />);

    const estrellas = screen.getAllByRole("button");
    await user.click(estrellas[4]);

    expect(onRate).not.toHaveBeenCalled();
  });

  it("expone el valor actual en el aria-label del contenedor", () => {
    render(<StarRating value={4} readOnly />);

    expect(
      screen.getByRole("img", { name: /calificación: 4 de 5 estrellas/i })
    ).toBeInTheDocument();
  });
});
