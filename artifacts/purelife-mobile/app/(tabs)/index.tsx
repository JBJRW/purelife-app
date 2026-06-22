import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { recipes } from "@/data/recipes";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const [streak, setStreak] = useState(7);

  const featuredRecipe = recipes[0];

  const topInset = Platform.OS === "web" ? 67 : insets.top;

  const quickActions = [
    {
      id: "chat",
      icon: "message-circle" as const,
      label: "Dr. Smoothie",
      color: colors.primary,
      route: "/(tabs)/chat" as const,
    },
    {
      id: "recipes",
      icon: "book-open" as const,
      label: "Recipes",
      color: colors.accent,
      route: "/(tabs)/recipes" as const,
    },
    {
      id: "profile",
      icon: "user" as const,
      label: "Profile",
      color: colors.mutedForeground,
      route: "/(tabs)/profile" as const,
    },
  ];

  const stats = [
    { label: "Day Streak", value: streak.toString(), unit: "🔥", color: colors.accent },
    { label: "Recipes Tried", value: "12", unit: "✅", color: colors.primary },
    { label: "Wellness Score", value: "87", unit: "%", color: "#5CB87A" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: topInset + 16,
            paddingBottom: Platform.OS === "web" ? 100 : 100,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.mutedForeground }]}>
              {getGreeting()}
            </Text>
            <Text style={[styles.name, { color: colors.foreground }]}>
              {user?.email?.split("@")[0] ?? "Wellness Seeker"} 🌿
            </Text>
          </View>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/(tabs)/profile");
            }}
            style={[
              styles.avatarButton,
              { backgroundColor: colors.primary + "30" },
            ]}
          >
            <Feather name="user" size={20} color={colors.primary} />
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <View
              key={stat.label}
              style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Text style={styles.statUnit}>{stat.unit}</Text>
              <Text style={[styles.statValue, { color: stat.color }]}>
                {stat.value}
              </Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Quick Access
          </Text>
        </View>

        <View style={styles.quickActionsRow}>
          {quickActions.map((action) => (
            <Pressable
              key={action.id}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push(action.route);
              }}
              style={({ pressed }) => [
                styles.quickAction,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  opacity: pressed ? 0.7 : 1,
                  transform: [{ scale: pressed ? 0.96 : 1 }],
                },
              ]}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: action.color + "20" },
                ]}
              >
                <Feather name={action.icon} size={22} color={action.color} />
              </View>
              <Text style={[styles.quickActionLabel, { color: colors.foreground }]}>
                {action.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Featured Recipe
          </Text>
          <Pressable onPress={() => router.push("/(tabs)/recipes")}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/(tabs)/recipes");
          }}
          style={({ pressed }) => [
            styles.featuredCard,
            {
              backgroundColor: featuredRecipe.color,
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            },
          ]}
        >
          <Text style={styles.featuredEmoji}>{featuredRecipe.emoji}</Text>
          <View style={styles.featuredInfo}>
            <Text style={styles.featuredCategory}>{featuredRecipe.category}</Text>
            <Text style={styles.featuredTitle}>{featuredRecipe.title}</Text>
            <View style={styles.featuredMeta}>
              <View style={styles.metaTag}>
                <Feather name="clock" size={12} color="rgba(255,255,255,0.8)" />
                <Text style={styles.metaText}>{featuredRecipe.time}</Text>
              </View>
              <View style={styles.metaTag}>
                <Feather name="zap" size={12} color="rgba(255,255,255,0.8)" />
                <Text style={styles.metaText}>{featuredRecipe.calories} cal</Text>
              </View>
            </View>
          </View>
        </Pressable>

        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push("/(tabs)/chat");
          }}
          style={({ pressed }) => [
            styles.chatBanner,
            {
              backgroundColor: colors.card,
              borderColor: colors.primary + "40",
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <View
            style={[
              styles.chatBannerIcon,
              { backgroundColor: colors.primary + "20" },
            ]}
          >
            <Text style={{ fontSize: 24 }}>🥤</Text>
          </View>
          <View style={styles.chatBannerText}>
            <Text style={[styles.chatBannerTitle, { color: colors.foreground }]}>
              Ask Dr. Smoothie AI
            </Text>
            <Text style={[styles.chatBannerSub, { color: colors.mutedForeground }]}>
              Get personalized wellness advice
            </Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.primary} />
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  greeting: { fontSize: 14, fontWeight: "500", marginBottom: 2 },
  name: { fontSize: 24, fontWeight: "700", letterSpacing: -0.5 },
  avatarButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
  },
  statUnit: { fontSize: 18, marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: "700", letterSpacing: -0.5 },
  statLabel: { fontSize: 11, fontWeight: "500", marginTop: 2, textAlign: "center" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", letterSpacing: -0.3 },
  seeAll: { fontSize: 14, fontWeight: "600" },
  quickActionsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 28,
  },
  quickAction: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionLabel: { fontSize: 12, fontWeight: "600" },
  featuredCard: {
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
    minHeight: 130,
  },
  featuredEmoji: { fontSize: 52 },
  featuredInfo: { flex: 1 },
  featuredCategory: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255,255,255,0.75)",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.4,
    marginBottom: 10,
  },
  featuredMeta: { flexDirection: "row", gap: 10 },
  metaTag: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: "500" },
  chatBanner: {
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  chatBannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  chatBannerText: { flex: 1 },
  chatBannerTitle: { fontSize: 15, fontWeight: "700", marginBottom: 2 },
  chatBannerSub: { fontSize: 13, fontWeight: "400" },
});
