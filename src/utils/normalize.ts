import type { Route } from './types'

export const geoJsonToPolyline = (geojson: unknown): Route[] => {
    const { features } = geojson as {
        features: {
            properties?: { id?: number; title?: string; stroke?: string }
            geometry?: { coordinates: [number, number][] }
        }[]
    }

    return features.map((feature) => {
        const property = feature.properties
        const coords = (feature.geometry?.coordinates ?? []).map(
            ([lng, lat]) => ({
                latitude: lat,
                longitude: lng,
            })
        )

        return {
            id: Number(property?.id ?? Math.random()),
            name: property?.title ?? 'Ruta',
            coordinates: coords,
            color: property?.stroke as string,
            active: true,
        }
    })
}
