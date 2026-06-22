import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

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
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: 67 + 12, backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Healthy Stores</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          {SEED_STORES.length} wellness locations near you
        </Text>
      </View>

      <View style={[styles.mapPlaceholder, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Feather name="map" size={36} color={colors.primary} />
        <Text style={[styles.mapTitle, { color: colors.foreground }]}>Interactive Map</Text>
        <Text style={[styles.mapSub, { color: colors.mutedForeground }]}>
          Open in Expo Go on your phone for the full map experience
        </Text>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {SEED_STORES.map((store) => (
          <Pressable
            key={store.id}
            onPress={() => {
              setSelected(store.id);
              Haptics.selectionAsync();
            }}
            style={({ pressed }) => [
              styles.storeRow,
              {
                backgroundColor: selected === store.id ? colors.primary + "15" : colors.card,
                borderColor: selected === store.id ? colors.primary : colors.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <View style={[styles.iconBox, { backgroundColor: colors.primary + "20" }]}>
              <Feather
                name={(CATEGORY_ICONS[store.category] ?? "map-pin") as any}
                size={20}
                color={colors.primary}
              />
            </View>
            <View style={styles.storeInfo}>
              <Text style={[styles.storeName, { color: colors.foreground }]} numberOfLines={1}>
                {store.name}
              </Text>
              <Text style={[styles.storeMeta, { color: colors.mutedForeground }]}>
                {store.category} · {store.address}
              </Text>
            </View>
            <View style={styles.ratingRow}>
              <Feather name="star" size={12} color={colors.accent} />
              <Text style={[styles.rating, { color: colors.accent }]}>
                {store.rating.toFixed(1)}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 10 },
  title: { fontSize: 28, fontWeight: "700", letterSpacing: -0.5 },
  subtitle: { fontSize: 13, marginTop: 2 },
  mapPlaceholder: {
    margin: 16,
    borderRadius: 20,
    borderWidth: 1,
    padding: 28,
    alignItems: "center",
    gap: 10,
  },
  mapTitle: { fontSize: 18, fontWeight: "700" },
  mapSub: { fontSize: 13, textAlign: "center", lineHeight: 20 },
  list: { flex: 1 },
  storeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  storeInfo: { flex: 1 },
  storeName: { fontSize: 15, fontWeight: "700" },
  storeMeta: { fontSize: 12, marginTop: 2 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  rating: { fontSize: 12, fontWeight: "600" },
});
