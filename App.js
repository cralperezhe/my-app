import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { geoJsonToPolyline } from "./src/utils/normalize";
import MapView, { MapMarker, Polyline } from "react-native-maps";
import Modal from "./src/components/Modal";
import Button from "./src/components/Button";
import routes from "./src/utils/json/rutas.json";
import * as Location from "expo-location";
import Checkbox from "./src/components/Checkbox";

const { height: windowHeight } = Dimensions.get("window");

export default function App() {
  const [location, setLocation] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [activeRoutes, setActiveRoutes] = useState(geoJsonToPolyline(routes));

  useEffect(() => {
    getActualLocation();
  }, []);

  const getActualLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("", "No hay permisos de ubicación");

      return;
    }
    let location = await Location.getCurrentPositionAsync({});

    setLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0025,
      longitudeDelta: 0.0025,
    });
  };

  const toggleRoute = (routeId) => {
    setActiveRoutes((prev) =>
      prev.map((route) =>
        route.id === routeId ? { ...route, active: !route.active } : route,
      ),
    );
  };

  const _renderItem = ({ item }) => {
    return (
      <View style={{ marginVertical: 5 }}>
        <Checkbox
          key={item.id}
          text={item.name ?? `Ruta ${item.id}`}
          value={item.active}
          onValueChange={() => toggleRoute(item.id)}
        />
      </View>
    );
  };

  if (activeRoutes.length == 0) {
    return (
      <SafeAreaProvider>
        <SafeAreaView>
          <ActivityIndicator color="black" size="large" />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <MapView style={styles.map} initialRegion={location}>
          <MapMarker coordinate={location}></MapMarker>
          {activeRoutes.map(
            (ruta) =>
              ruta.active && (
                <Polyline
                  key={ruta.id}
                  coordinates={ruta.coordinates}
                  strokeWidth={4}
                  strokeColor={ruta.color}
                />
              ),
          )}
        </MapView>
        <TouchableOpacity
          style={styles.floating_button}
          onPress={() => setShowModal(true)}
        >
          <MaterialCommunityIcons name="cog" size={60} color="white" />
        </TouchableOpacity>
        <Modal visible={showModal} closeModal={() => setShowModal(false)}>
          <View style={styles.list_view}>
            <FlatList
              data={activeRoutes}
              renderItem={_renderItem}
              style={{ maxHeight: windowHeight * 0.78 }}
            />
          </View>
          <View style={{ alignItems: "center" }}>
            <Button text="Cerrar" onPress={() => setShowModal(false)} />
          </View>
        </Modal>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  floating_button: {
    position: "absolute",
    bottom: 15,
    right: 15,
    padding: 10,
    margin: 10,
    borderRadius: 100,
    backgroundColor: "black",
  },
  list_view: {
    marginHorizontal: 20,
    marginTop: 10,
  },
});
