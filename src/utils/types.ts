export interface Route {
    id: number
    name: string
    coordinates: { latitude: number; longitude: number }[]
    color: string
    active: boolean
}

export interface MapRegion {
    latitude: number
    longitude: number
    latitudeDelta: number
    longitudeDelta: number
}
