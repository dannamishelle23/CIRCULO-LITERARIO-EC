import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

import api from "./api";
import { getClubs, buscarClubs } from "./clubService";

describe("clubService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getClubs", () => {
    it("hace GET a /clubes/listar-clubes y devuelve solo el arreglo de clubes", async () => {
      const clubes = [{ _id: "club-1", nombre: "Club de Fantasía" }];
      api.get.mockResolvedValueOnce({ data: { clubes } });

      const resultado = await getClubs();

      expect(api.get).toHaveBeenCalledWith("/clubes/listar-clubes");
      expect(resultado).toEqual(clubes);
    });
  });

  describe("buscarClubs (RR-010)", () => {
    it("hace GET a /clubes/buscar-clubes con nombre y género como params", async () => {
      const clubes = [{ _id: "club-1", nombre: "Terror Nocturno" }];
      api.get.mockResolvedValueOnce({ data: { clubes } });

      const resultado = await buscarClubs({ nombre: "terror", genero: "Terror" });

      expect(api.get).toHaveBeenCalledWith("/clubes/buscar-clubes", {
        params: { nombre: "terror", genero: "Terror" },
      });
      expect(resultado).toEqual(clubes);
    });

    it("cae de vuelta a getClubs() si el backend responde 404 (endpoint no implementado aún)", async () => {
      const error = { response: { status: 404 } };
      const todosLosClubes = [{ _id: "club-1" }, { _id: "club-2" }];

      api.get
        .mockRejectedValueOnce(error) // primer intento: /buscar-clubes falla
        .mockResolvedValueOnce({ data: { clubes: todosLosClubes } }); // fallback: /listar-clubes

      const resultado = await buscarClubs({ nombre: "algo" });

      expect(api.get).toHaveBeenNthCalledWith(1, "/clubes/buscar-clubes", {
        params: { nombre: "algo", genero: undefined },
      });
      expect(api.get).toHaveBeenNthCalledWith(2, "/clubes/listar-clubes");
      expect(resultado).toEqual(todosLosClubes);
    });

    it("cae de vuelta a getClubs() si el backend responde 501", async () => {
      const error = { response: { status: 501 } };
      api.get
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce({ data: { clubes: [] } });

      const resultado = await buscarClubs();

      expect(resultado).toEqual([]);
    });

    it("propaga cualquier otro error (ej. 500) sin caer al fallback", async () => {
      const error = { response: { status: 500 } };
      api.get.mockRejectedValueOnce(error);

      await expect(buscarClubs({ nombre: "x" })).rejects.toEqual(error);
      expect(api.get).toHaveBeenCalledTimes(1);
    });
  });
});
