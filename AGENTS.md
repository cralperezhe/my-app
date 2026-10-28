# AGENTS.md

## Stack
- Expo SDK `~58.1`, React Native `0.88.0`, React `19.3.0`, TypeScript en todo el código (`.tsx`/`.ts`)
- Entry: `index.js` registers `App` via `registerRootComponent` (Expo root)
- Main UI: `App.tsx` (map app con bottom navigation: tabs Mapa/Rutas)
- Native maps: `react-native-maps@1.29.11` (MapView, Polyline, Circle, MapMarker); parcheado con `pnpm patch` para exponer `./app.plugin.js` en `exports` y usar los types de `dist/` (ver `patches/`)
- Location: `expo-location` with foreground permission; watches position continuously

## Scripts (package.json)
- `pnpm start` → `expo start` (dev server)
- `pnpm android` → `expo run:android`
- `pnpm ios` → `expo run:ios`
- `pnpm web` → `expo start --web`
- Package manager: pnpm (`.npmrc` con `node-linker=hoisted`, requerido por Expo/RN con pnpm)

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
