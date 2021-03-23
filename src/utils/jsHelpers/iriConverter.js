export const getIriFromId = (id, iriPrefix) => (id ? `${iriPrefix}/${id}` : null);
export const getIdFromIri = (iri, iriPrefix) => (iri ? iri.replace(`${iriPrefix}/`, '') : null);
