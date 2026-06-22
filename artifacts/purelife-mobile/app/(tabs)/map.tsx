import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

interface HealthStore {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  rating: number;
  address: string;
}

const SEED_STORES: HealthStore[] = [
  { id: "1", name: "Whole Foods Market", category: "Organic Grocery", latitude: 34.0522, longitude: -118.2437, rating: 4.5, address: "123 Market St" },
  { id: "2", name: "Erewhon Market", category: "Premium Health", latitude: 34.0825, longitude: -118.3692, rating: 4.8, address: "7660 Beverly Blvd" },
  { id: "3", name: "Sprouts Farmers Market", category: "Natural Grocery", latitude: 34.0614, longitude: -118.2977, rating: 4.3, address: "456 Vine St" },
  { id: "4", name: "Natural Café & Juicery", category: "Juice Bar", latitude: 34.0445, longitude: -118.2652, rating: 4.6, address: "789 Health Blvd" },
  { id: "5", name: "Green Leaf Wellness", category: "Wellness Center", latitude: 34.0712, longitude: -118.3210, rating: 4.7, address: "321 Wellness Way" },
];

const CATEGORY_ICONS: Record<string, string> = {
  "Organic Grocery": "shopping-bag",
  "Premium Health": "star",
  "Natural Grocery": "shopping-cart",
  "Juice Bar": "coffee",
  "Wellness Center": "heart",
};

export default function MapScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const [selectedStore, setSelectedStore] = useState<HealthStore | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  async function goToMyLocation() {
    setLocationLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      const loc = await Location.getCurrentPositionAsync({});
      mapRef.current?.animateToRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 800);
    }
    setLocationLoading(false);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 12, backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>
          Healthy Stores
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          {SEED_STORES.length} places near you
        </Text>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          provider={PROVIDER_DEFAULT}
          initialRegion={{
            latitude: 34.0522,
            longitude: -118.2437,
            latitudeDelta: 0.08,
            longitudeDelta: 0.08,
          }}
          showsUserLocation
          showsMyLocationButton={false}
        >
          {SEED_STORES.map((store) => (
            <Marker
              key={store.id}
              coordinate={{ latitude: store.latitude, longitude: store.longitude }}
              onPress={() => {
                setSelectedStore(store);
                Haptics.selectionAsync();
              }}
            >
              <View
                style={[
                  styles.markerPin,
                  {
                    backgroundColor:
                      selectedStore?.id === store.id ? colors.accent : colors.primary,
                  },
                ]}
              >
                <Feather
                  name={(CATEGORY_ICONS[store.category] ?? "map-pin") as any}
                  size={14}
                  color="#FFFFFF"
                />
              </View>
            </Marker>
          ))}
        </MapView>

        <Pressable
          onPress={goToMyLocation}
          style={[
            styles.locationButton,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              bottom: selectedStore ? 200 : 24,
            },
          ]}
        >
          {locationLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Feather name="navigation" size={20} color={colors.primary} />
          )}
        </Pressable>
      </View>

      {selectedStore ? (
        <View
          style={[
            styles.storeCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.storeCardHeader}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: colors.primary + "20" },
              ]}
            >
              <Feather
                name={(CATEGORY_ICONS[selectedStore.category] ?? "map-pin") as any}
                size={22}
                color={colors.primary}
              />
            </View>
            <View style={styles.storeInfo}>
              <Text style={[styles.storeName, { color: colors.foreground }]} numberOfLines={1}>
                {selectedStore.name}
              </Text>
              <Text style={[styles.storeCategory, { color: colors.mutedForeground }]}>
                {selectedStore.category}
              </Text>
            </View>
            <Pressable
              onPress={() => setSelectedStore(null)}
              style={[styles.closeBtn, { backgroundColor: colors.muted }]}
            >
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </Pressable>
          </View>
          <View style={styles.storeMeta}>
            <View style={styles.metaRow}>
              <Feather name="map-pin" size={13} color={colors.mutedForeground} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                {selectedStore.address}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Feather name="star" size={13} color={colors.accent} />
              <Text style={[styles.metaText, { color: colors.foreground }]}>
                {selectedStore.rating.toFixed(1)}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storeList}
          style={[
            styles.storeScroll,
            { backgroundColor: colors.background, borderTopColor: colors.border },
          ]}
        >
          {SEED_STORES.map((store) => (
            <Pressable
              key={store.id}
              onPress={() => {
                setSelectedStore(store);
                mapRef.current?.animateToRegion(
                  {
                    latitude: store.latitude,
                    longitude: store.longitude,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                  },
                  600
                );
                Haptics.selectionAsync();
              }}
              style={({ pressed }) => [
                styles.storeChip,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Feather
                name={(CATEGORY_ICONS[store.category] ?? "map-pin") as any}
                size={14}
                color={colors.primary}
              />
              <Text
                style={[styles.chipName, { color: colors.foreground }]}
                numberOfLines={1}
              >
                {store.name}
              </Text>
              <View style={styles.chipRating}>
                <Feather name="star" size={10} color={colors.accent} />
                <Text style={[styles.chipRatingText, { color: colors.accent }]}>
                  {store.rating.toFixed(1)}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 10 },
  title: { fontSize: 28, fontWeight: "700", letterSpacing: -0.5 },
  subtitle: { fontSize: 13, marginTop: 2 },
  mapContainer: { flex: 1 },
  markerPin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  locationButton: {
    position: "absolute",
    right: 16,
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  storeCard: { margin: 16, borderRadius: 20, padding: 16, borderWidth: 1 },
  storeCardHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  iconBox: { width: 46, height: 46, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  storeInfo: { flex: 1 },
  storeName: { fontSize: 16, fontWeight: "700" },
  storeCategory: { fontSize: 12, marginTop: 2 },
  closeBtn: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  storeMeta: { flexDirection: "row", gap: 16 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  metaText: { fontSize: 13 },
  storeScroll: { borderTopWidth: StyleSheet.hairlineWidth },
  storeList: { paddingHorizontal: 16, paddingVertical: 14, gap: 10 },
  storeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: 200,
  },
  chipName: { fontSize: 13, fontWeight: "600", flex: 1 },
  chipRating: { flexDirection: "row", alignItems: "center", gap: 3 },
  chipRatingText: { fontSize: 11, fontWeight: "600" },
});
