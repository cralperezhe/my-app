# AGENTS.md

## Stack
- Expo SDK `~54.0.31`, React Native `0.81.5`, React `19.1.0`, React Navigation not present
- Entry: `index.js` registers `App` via `registerRootComponent` (Expo root)
- Main UI: `App.js` (single-screen map app)
- Native maps: `react-native-maps` (MapView, Polyline, Circle, MapMarker)
- Location: `expo-location` with foreground permission; watches position continuously

## Scripts (package.json)
- `yarn start` / `npm start` → `expo start` (dev server)
- `yarn android` → `expo run:android`
- `yarn ios` → `expo run:ios`  
- `yarn web` → `expo start --web`

## Data & Architecture
- Routes loaded from `src/utils/json/rutas.json` (GeoJSON FeatureCollection, ~4928 lines). All routes start `active: true`.
- `src/utils/normalize.js::geoJsonToPolyline()` maps GeoJSON to `{ id, name, coordinates:[{latitude,longitude}], color, active }` (expects `feature.properties.title`, `feature.properties.stroke`).
- Route filtering in `App.js`: case-insensitive, diacritics-stripped (`normalizeText`), all space-split words must match route name.
- Components: `src/components/{Button,Checkbox,Modal,TextField}.js`; colors in `src/utils/colors.js`.

## Permissions & Config
- iOS permissions declared in `app.json` (`NSLocationWhenInUseUsageDescription`, `NSLocationAlwaysAndWhenInUseUsageDescription`). Spanish strings.
- `app.json`: `newArchEnabled: true`, portrait, light UI, bundle id `com.sarah.example-app`.
- `prettier.config.js`: `tabWidth: 4`, `semi: false`, `singleQuote: true`, `trailingComma: "es5"`.

## Runtime behavior (gotchas)
- Location watch: `Location.watchPositionAsync` with `accuracy: High`, `timeInterval: 2000`, `distanceInterval: 5`. `heading` and `accuracy` stored; accuracy circle and rotated user marker rendered. Subscription cleaned up on unmount.
- Map auto-centers to user location via `mapRef.current?.animateToRegion(...)` on updates.
- If `activeRoutes.length === 0` shows a loading indicator (routes load synchronously from JSON at module scope via `geoJsonToPolyline(routes)`).
- Filter modal lists routes; "Marcar todos"/"Desmarcar todos" toggle all.
