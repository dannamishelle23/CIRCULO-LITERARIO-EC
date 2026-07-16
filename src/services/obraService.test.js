import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

import api from "./api";
import {
  obtenerObra,
  votarObra,
  likeObra,
  calificarObra,
  buscarObras,
} from "./obraService";

describe("obraService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("obtenerObra", () => {
    it("hace GET a /obras/:id y devuelve response.data", async () => {
      const data = { obra: { _id: "obra-1", titulo: "Dragón Rojo" } };
      api.get.mockResolvedValueOnce({ data });

      const resultado = await obtenerObra("obra-1");

      expect(api.get).toHaveBeenCalledWith("/obras/obra-1");
      expect(resultado).toEqual(data);
    });

    it("propaga el error si la petición falla", async () => {
      api.get.mockRejectedValueOnce(new Error("network error"));

      await expect(obtenerObra("obra-1")).rejects.toThrow("network error");
    });
  });

  describe("votarObra", () => {
    it("hace POST a /obras/:id/votar", async () => {
      const data = { ok: true, msg: "Voto registrado" };
      api.post.mockResolvedValueOnce({ data });

      const resultado = await votarObra("obra-1");

      expect(api.post).toHaveBeenCalledWith("/obras/obra-1/votar");
      expect(resultado).toEqual(data);
    });
  });

  describe("likeObra (RR-009)", () => {
    it("hace POST a /obras/:id/like y devuelve el conteo actualizado", async () => {
      const data = { ok: true, likes: 4, yaDioLike: true };
      api.post.mockResolvedValueOnce({ data });

      const resultado = await likeObra("obra-1");

      expect(api.post).toHaveBeenCalledWith("/obras/obra-1/like");
      expect(resultado).toEqual(data);
    });

    it("propaga el error (ej. 403 por no ser miembro del club)", async () => {
      const error = {
        response: { status: 403, data: { msg: "No eres miembro aprobado del club de esta obra." } },
      };
      api.post.mockRejectedValueOnce(error);

      await expect(likeObra("obra-1")).rejects.toEqual(error);
    });
  });

  describe("calificarObra (RR-009)", () => {
    it("hace POST a /obras/:id/calificar con las estrellas en el body", async () => {
      const data = { ok: true, promedio: 4.5, totalCalificaciones: 2, miCalificacion: 5 };
      api.post.mockResolvedValueOnce({ data });

      const resultado = await calificarObra("obra-1", 5);

      expect(api.post).toHaveBeenCalledWith("/obras/obra-1/calificar", { estrellas: 5 });
      expect(resultado).toEqual(data);
    });
  });

  describe("buscarObras (RR-010)", () => {
    it("hace GET a /obras/buscar con los parámetros como query", async () => {
      const data = { ok: true, obras: [] };
      api.get.mockResolvedValueOnce({ data });

      const resultado = await buscarObras({ titulo: "dragón", clubId: "club-1" });

      expect(api.get).toHaveBeenCalledWith("/obras/buscar", {
        params: { titulo: "dragón", clubId: "club-1" },
      });
      expect(resultado).toEqual(data);
    });

    it("funciona sin parámetros (búsqueda vacía)", async () => {
      const data = { ok: true, obras: [] };
      api.get.mockResolvedValueOnce({ data });

      await buscarObras();

      expect(api.get).toHaveBeenCalledWith("/obras/buscar", { params: {} });
    });
  });
});
