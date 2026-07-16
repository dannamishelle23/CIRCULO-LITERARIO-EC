import api from "./api";

/*==========================================================================
| CREAR OBRA
==========================================================================*/
export const crearObra = async (datosObra) => {
  try {
    const formData = new FormData();
    formData.append("titulo", datosObra.titulo);
    formData.append("sinopsis", datosObra.sinopsis);
    formData.append("prologo", datosObra.prologo);
    formData.append("club", datosObra.club);
    if (datosObra.subgenero) {
      formData.append("subgenero", datosObra.subgenero);
    }

    if (datosObra.portada) {
      formData.append("portada", datosObra.portada);
    }

    const response = await api.post("/obras", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("Error al crear obra:", error);
    throw error;
  }
};

/*==========================================================================
| OBTENER OBRA
==========================================================================*/
export const obtenerObra = async (id) => {
  try {
    const response = await api.get(`/obras/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener obra:", error);
    throw error;
  }
};

/*==========================================================================
| PERFIL AUTOR (SOLO APROBADAS)
==========================================================================*/
export const listarObrasPublicasAutor = async (autorId) => {
  try {
    const response = await api.get(`/obras/autor/${autorId}`);
    return response.data;
  } catch (error) {
    console.error("Error al listar obras del autor:", error);
    throw error;
  }
};

/*==========================================================================
| OBRAS DEL CLUB
==========================================================================*/
export const listarObrasClub = async (clubId) => {
  try {
    const response = await api.get(`/obras/club/${clubId}`);
    return response.data;
  } catch (error) {
    console.error("Error al listar obras del club:", error);
    throw error;
  }
};

/*==========================================================================
| MIS OBRAS EN CLUB
==========================================================================*/
export const listarMisObrasClub = async (clubId) => {
  try {
    const response = await api.get(`/obras/club/${clubId}/mis-obras`);
    return response.data;
  } catch (error) {
    console.error("Error al listar mis obras:", error);
    throw error;
  }
};

/*==========================================================================
| EN REVISIÓN (MODERADOR)
==========================================================================*/
export const listarObrasEnRevision = async (clubId) => {
  try {
    const response = await api.get(`/obras/moderador/${clubId}/en-revision`);
    return response.data;
  } catch (error) {
    console.error("Error en revisión:", error);
    throw error;
  }
};

/*==========================================================================
| APROBADAS (MODERADOR)
==========================================================================*/
export const listarObrasAprobadas = async (clubId) => {
  try {
    const response = await api.get(`/obras/moderador/${clubId}/aprobadas`);
    return response.data;
  } catch (error) {
    console.error("Error aprobadas:", error);
    throw error;
  }
};

/*==========================================================================
| ACTUALIZAR OBRA
==========================================================================*/
export const actualizarObra = async (id, datosObra) => {
  try {
    let payload = datosObra;
    const config = {};

    if (datosObra?.portada instanceof File || datosObra?.portada?.name) {
      payload = new FormData();
      payload.append("titulo", datosObra.titulo);
      payload.append("sinopsis", datosObra.sinopsis);
      payload.append("prologo", datosObra.prologo);
      if (datosObra.subgenero) {
        payload.append("subgenero", datosObra.subgenero);
      }
      if (datosObra.portada) {
        payload.append("portada", datosObra.portada);
      }
      config.headers = { "Content-Type": "multipart/form-data" };
    }

    const response = await api.put(`/obras/${id}`, payload, config);
    return response.data;
  } catch (error) {
    console.error("Error actualizar obra:", error);
    throw error;
  }
};

/*==========================================================================
| POSTULAR OBRA
==========================================================================*/
export const postularObra = async (id) => {
  try {
    const response = await api.post(`/obras/${id}/postular`);
    return response.data;
  } catch (error) {
    console.error("Error postular obra:", error);
    throw error;
  }
};

/*==========================================================================
| APROBAR OBRA (MODERADOR)
==========================================================================*/
export const aprobarObra = async (id) => {
  try {
    const response = await api.post(`/obras/${id}/aprobar`);
    return response.data;
  } catch (error) {
    console.error("Error aprobar obra:", error);
    throw error;
  }
};

/*==========================================================================
| RECHAZAR OBRA (MODERADOR)
==========================================================================*/
export const rechazarObra = async (id, motivo) => {
  try {
    const response = await api.post(`/obras/${id}/rechazar`, {
      motivo,
    });

    return response.data;
  } catch (error) {
    console.error("Error rechazar obra:", error);
    throw error;
  }
};

/*==========================================================================
| INICIAR VOTACIÓN (MODERADOR)
==========================================================================*/
export const iniciarVotacion = async (clubId, obrasIds) => {
  const url = `/obras/club/${clubId}/iniciar-votacion`;

  console.log("URL FINAL:", url);
  console.log("BODY:", obrasIds);

  try {
    const response = await api.post(url, { obrasIds });
    return response.data;
  } catch (error) {
    console.error("ERROR AXIOS:", error);

    if (error.response) {
      console.error("STATUS:", error.response.status);
      console.error("DATA:", error.response.data);
    }

    throw error;
  }
};

/*==========================================================================
| CERRAR VOTACIÓN (MODERADOR)
==========================================================================*/
export const cerrarVotacion = async (clubId) => {
  try {
    const response = await api.post(`/obras/club/${clubId}/cerrar-votacion`);
    return response.data;
  } catch (error) {
    console.error("Error cerrar votación:", error);
    throw error;
  }
};

/*==========================================================================
| VOTAR OBRA (USUARIOS DEL CLUB)
==========================================================================*/
export const votarObra = async (id) => {
  try {
    const response = await api.post(`/obras/${id}/votar`);
    return response.data;
  } catch (error) {
    console.error("Error al votar obra:", error);
    throw error;
  }
};

/*==========================================================================
| OBTENER OBRAS EN VOTACIÓN (USUARIOS DEL CLUB)
==========================================================================*/
export const obtenerObrasVotacionClub = async (clubId) => {
  try {
    const response = await api.get(`/obras/obras-votacion/${clubId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener obras en votación:", error);
    throw error;
  }
};

/*==========================================================================
| OBTENER OBRAS PUBLICADAS (USUARIOS DEL CLUB)
==========================================================================*/
export const obtenerObrasPublicadasClub = async (clubId) => {
  try {
    const response = await api.get(`/obras/obras-publicadas/${clubId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener obras publicadas:", error);
    throw error;
  }
};

/*==========================================================================
| DAR / QUITAR LIKE A UNA OBRA (RR-009)
| Requiere endpoint backend: POST /api/obras/:id/like
| Se espera que responda { likes: Number, msg: String }
==========================================================================*/
export const likeObra = async (id) => {
  try {
    const response = await api.post(`/obras/${id}/like`);
    return response.data;
  } catch (error) {
    console.error("Error al dar like a la obra:", error);
    throw error;
  }
};

/*==========================================================================
| CALIFICAR OBRA CON SISTEMA DE ESTRELLAS (RR-009)
| Requiere endpoint backend: POST /api/obras/:id/calificar  body: { estrellas: 1-5 }
| Se espera que responda { promedio: Number, totalCalificaciones: Number, miCalificacion: Number, msg: String }
==========================================================================*/
export const calificarObra = async (id, estrellas) => {
  try {
    const response = await api.post(`/obras/${id}/calificar`, { estrellas });
    return response.data;
  } catch (error) {
    console.error("Error al calificar la obra:", error);
    throw error;
  }
};

/*==========================================================================
| BUSCAR / FILTRAR OBRAS PUBLICADAS (RR-010)
| Requiere endpoint backend: GET /api/obras/buscar?titulo=&genero=&autor=
| Si el backend aún no soporta filtros por query, esta función igual sirve
| para búsqueda global; mientras tanto el filtrado en UI se hace en cliente.
==========================================================================*/
export const buscarObras = async (params = {}) => {
  try {
    const response = await api.get("/obras/buscar", { params });
    return response.data;
  } catch (error) {
    console.error("Error al buscar obras:", error);
    throw error;
  }
};