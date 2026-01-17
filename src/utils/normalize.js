export const geoJsonToPolyline = (geojson) => {
  return geojson.features.map((feature) => {
    const coords = feature.geometry.coordinates.map(([lng, lat]) => ({
      latitude: lat,
      longitude: lng,
    }));

    return {
      id: feature.properties?.id ?? Math.random().toString(),
      name: feature.properties?.title ?? "Ruta",
      coordinates: coords,
      color: feature.properties.stroke,
      active: true,
    };
  });
};
