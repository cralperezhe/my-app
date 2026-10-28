import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useEffect, useRef, useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { geoJsonToPolyline } from './src/utils/normalize'
import MapView, { Circle, MapMarker, Polyline } from 'react-native-maps'
import Modal from './src/components/Modal'
import Button from './src/components/Button'
import routes from './src/utils/json/rutas.json'
import * as Location from 'expo-location'
import Checkbox from './src/components/Checkbox'
import colors from './src/utils/colors'
import TextField from './src/components/TextField'
import WelcomeScreen from './src/components/WelcomeScreen'
import BottomNavigation, { TabKey, TabItem } from './src/components/BottomNavigation'
import type { Route, MapRegion } from './src/utils/types'

const { height: windowHeight } = Dimensions.get('window')

const TABS: TabItem[] = [
    { key: 'mapa', label: 'Mapa', icon: 'map-outline' },
    { key: 'rutas', label: 'Rutas', icon: 'google-maps' },
]

export default function App() {
    const [location, setLocation] = useState<MapRegion | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [search, setSearch] = useState('')
    const [heading, setHeading] = useState(0)
    const [accuracy, setAccuracy] = useState<number | null>(null)
    const [welcomeDone, setWelcomeDone] = useState(false)
    const [activeTab, setActiveTab] = useState<TabKey>('mapa')

    const [activeRoutes, setActiveRoutes] = useState<Route[]>(
        geoJsonToPolyline(routes)
    )

    const mapRef = useRef<MapView | null>(null)
    const locationSuscription = useRef<Location.LocationSubscription | null>(null)

    useEffect(() => {
        if (!welcomeDone) return
        getActualLocation()
        return () => {
            if (locationSuscription.current) {
                locationSuscription.current.remove()
                locationSuscription.current = null
            }
        }
    }, [welcomeDone])

    const normalizeText = (text = '') =>
        text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')

    const filteredRoutes = activeRoutes.filter((route) => {
        const name = normalizeText(route.name ?? `Ruta ${route.id}`)
        const query = normalizeText(search)

        if (!query) return true

        const words = query.split(' ').filter(Boolean)

        return words.every((word) => name.includes(word))
    })

    const getActualLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
            Alert.alert('', 'No hay permisos de ubicación')
            return
        }
        if (locationSuscription.current) {
            locationSuscription.current.remove()
            locationSuscription.current = null
        }
        locationSuscription.current = await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,
                timeInterval: 2000,
                distanceInterval: 5,
            },
            (location) => {
                const region: MapRegion = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.0025,
                    longitudeDelta: 0.0025,
                }
                setLocation(region)
                setHeading(location.coords.heading ?? 0)
                setAccuracy(location.coords.accuracy ?? null)

                mapRef.current?.animateToRegion(region, 500)
            }
        )
    }

    const toggleRoute = (routeId: number) => {
        setActiveRoutes((prev) =>
            prev.map((route) =>
                route.id === routeId
                    ? { ...route, active: !route.active }
                    : route
            )
        )
    }

    const markAllRoutes = () => {
        setActiveRoutes((prev) =>
            prev.map((route) => ({ ...route, active: true }))
        )
    }

    const unmarkAllRoutes = () => {
        setActiveRoutes((prev) =>
            prev.map((route) => ({ ...route, active: false }))
        )
    }

    const _renderItem = ({ item }: { item: Route }) => {
        return (
            <View style={{ marginVertical: 5 }}>
                <Checkbox
                    key={item.id}
                    text={item.name ?? `Ruta ${item.id}`}
                    value={item.active}
                    onValueChange={() => toggleRoute(item.id)}
                    color={item.color}
                />
            </View>
        )
    }

    if (!welcomeDone) {
        return (
            <SafeAreaProvider>
                <WelcomeScreen onStart={() => setWelcomeDone(true)} />
            </SafeAreaProvider>
        )
    }

    if (activeRoutes.length == 0) {
        return (
            <SafeAreaProvider>
                <SafeAreaView>
                    <ActivityIndicator color="black" size="large" />
                </SafeAreaView>
            </SafeAreaProvider>
        )
    }

    return (
        <SafeAreaProvider>
            <View style={styles.container}>
                {activeTab === 'mapa' && (
                    <>
                        <MapView
                            style={styles.map}
                            initialRegion={location}
                            ref={mapRef}
                        >
                            {accuracy && (
                                <Circle
                                    center={location}
                                    radius={accuracy}
                                    strokeWidth={1}
                                    strokeColor="rgba(0,122,255,0.3)"
                                    fillColor="rgba(0,122,255,0.15)"
                                />
                            )}
                            <MapMarker
                                coordinate={location}
                                anchor={{ x: 0.5, y: 0.5 }}
                                rotation={heading}
                                flat
                            >
                                <View style={styles.iosLocationOuter}>
                                    <View style={styles.iosLocationInner} />
                                </View>
                            </MapMarker>
                            {activeRoutes.map(
                                (ruta) =>
                                    ruta.active && (
                                        <Polyline
                                            key={ruta.id}
                                            coordinates={ruta.coordinates}
                                            strokeWidth={4}
                                            strokeColor={ruta.color}
                                        />
                                    )
                            )}
                        </MapView>
                        <TouchableOpacity
                            style={styles.floating_button}
                            onPress={() => setShowModal(true)}
                        >
                            <MaterialCommunityIcons
                                name="filter-cog"
                                size={60}
                                color={colors.primary}
                            />
                        </TouchableOpacity>
                    </>
                )}
                {activeTab === 'rutas' && (
                    <View style={styles.routes_screen}>
                        <Text style={styles.routes_title}>Rutas</Text>
                        <FlatList
                            data={filteredRoutes}
                            renderItem={_renderItem}
                            style={{ maxHeight: windowHeight * 0.8 }}
                            ListEmptyComponent={
                                <Text style={styles.routes_empty}>
                                    No hay rutas que coincidan
                                </Text>
                            }
                        />
                    </View>
                )}
                <BottomNavigation
                    tabs={TABS}
                    activeTab={activeTab}
                    onChangeTab={setActiveTab}
                />
                <Modal
                    visible={showModal}
                    closeModal={() => setShowModal(false)}
                    style={{ backgroundColor: colors.primary_dark }}
                >
                    <View style={styles.header}>
                        <TextField
                            style={{ flex: 1 }}
                            value={search}
                            onChangeText={setSearch}
                            placeholder="Buscar ruta"
                        />
                        <TouchableOpacity
                            style={styles.close_button}
                            onPress={() => setShowModal(false)}
                        >
                            <MaterialCommunityIcons
                                name="close-thick"
                                size={34}
                                color={colors.primary_dark}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.list_view}>
                        <FlatList
                            data={filteredRoutes}
                            renderItem={_renderItem}
                            style={{ maxHeight: windowHeight * 0.74 }}
                        />
                    </View>
                    <View
                        style={{
                            justifyContent: 'center',
                            flexDirection: 'row',
                        }}
                    >
                        <Button
                            text="Marcar todos"
                            onPress={markAllRoutes}
                            style={{ backgroundColor: colors.accent_dark }}
                        />
                        <Button
                            text="Desmarcar todos"
                            onPress={unmarkAllRoutes}
                            style={{ backgroundColor: colors.accent_dark }}
                        />
                    </View>
                </Modal>
            </View>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 7,
        justifyContent: 'center',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    floating_button: {
        position: 'absolute',
        bottom: 100,
        right: 15,
        padding: 10,
        margin: 10,
        borderRadius: 100,
        backgroundColor: colors.primary_light,
    },
    list_view: {
        marginHorizontal: 20,
    },
    routes_screen: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    routes_title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 10,
        color: colors.primary_dark,
    },
    routes_empty: {
        textAlign: 'center',
        marginTop: 30,
        color: colors.primary_dark,
    },
    iosLocationOuter: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,122,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iosLocationInner: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#007AFF',
        borderWidth: 2,
        borderColor: 'white',
    },
    close_button: {
        padding: 10,
        marginVertical: 10,
        borderRadius: 100,
        backgroundColor: colors.primary_light,
    },
})
