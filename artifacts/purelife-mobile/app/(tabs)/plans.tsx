import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Linking,
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

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  highlight: string;
  color: string;
  features: string[];
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Starter",
    price: "Free",
    period: "forever",
    highlight: "Begin your wellness journey",
    color: "#7A9080",
    features: [
      "5 AI chat messages/day",
      "Browse 50+ recipes",
      "Healthy store locator",
      "Basic wellness tracking",
    ],
  },
  {
    id: "pro",
    name: "PureLife Pro",
    price: "$9.99",
    period: "per month",
    highlight: "Everything you need to thrive",
    color: "#2D8653",
    popular: true,
    features: [
      "Unlimited Dr. Smoothie AI chats",
      "Full recipe library (200+)",
      "Personalized meal plans",
      "Wellness progress analytics",
      "Weekly wellness video series",
      "Priority support",
    ],
  },
  {
    id: "elite",
    name: "Elite Wellness",
    price: "$24.99",
    period: "per month",
    highlight: "The full PureLife experience",
    color: "#C9973A",
    features: [
      "Everything in PureLife Pro",
      "1-on-1 AI nutrition coaching",
      "Custom smoothie protocols",
      "Advanced health biomarker tracking",
      "Community group access",
      "Early feature access",
    ],
  },
];

function PlanCard({
  plan,
  colors,
  onSelect,
}: {
  plan: Plan;
  colors: ReturnType<typeof useColors>;
  onSelect: (plan: Plan) => void;
}) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onSelect(plan);
      }}
      style={({ pressed }) => [
        styles.planCard,
        {
          backgroundColor: colors.card,
          borderColor: plan.popular ? plan.color : colors.border,
          borderWidth: plan.popular ? 2 : 1,
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      {plan.popular && (
        <View style={[styles.popularBadge, { backgroundColor: plan.color }]}>
          <Text style={styles.popularText}>MOST POPULAR</Text>
        </View>
      )}

      <View style={styles.planHeader}>
        <View>
          <Text style={[styles.planName, { color: colors.foreground }]}>
            {plan.name}
          </Text>
          <Text style={[styles.planHighlight, { color: colors.mutedForeground }]}>
            {plan.highlight}
          </Text>
        </View>
        <View style={styles.priceBlock}>
          <Text style={[styles.price, { color: plan.color }]}>{plan.price}</Text>
          <Text style={[styles.period, { color: colors.mutedForeground }]}>
            {plan.period}
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.featureList}>
        {plan.features.map((feature) => (
          <View key={feature} style={styles.featureRow}>
            <View
              style={[
                styles.featureCheck,
                { backgroundColor: plan.color + "20" },
              ]}
            >
              <Feather name="check" size={12} color={plan.color} />
            </View>
            <Text style={[styles.featureText, { color: colors.foreground }]}>
              {feature}
            </Text>
          </View>
        ))}
      </View>

      {plan.id !== "free" && (
        <View
          style={[
            styles.ctaButton,
            { backgroundColor: plan.popular ? plan.color : plan.color + "20" },
          ]}
        >
          <Text
            style={[
              styles.ctaText,
              { color: plan.popular ? "#FFFFFF" : plan.color },
            ]}
          >
            {plan.id === "free" ? "Current Plan" : "Get Started"}
          </Text>
          {plan.id !== "free" && (
            <Feather
              name="arrow-right"
              size={16}
              color={plan.popular ? "#FFFFFF" : plan.color}
            />
          )}
        </View>
      )}
    </Pressable>
  );
}

export default function PlansScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  const handleSelectPlan = (plan: Plan) => {
    if (plan.id === "free") return;

    if (!user) {
      Alert.alert(
        "Sign in Required",
        "Please sign in to upgrade your plan.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Sign In", onPress: () => router.push("/(tabs)/profile") },
        ]
      );
      return;
    }

    const domain = process.env.EXPO_PUBLIC_DOMAIN;
    const checkoutUrl = domain
      ? `https://${domain}/api/stripe-checkout?plan=${plan.id}`
      : null;

    if (checkoutUrl) {
      Linking.openURL(checkoutUrl).catch(() => {
        Alert.alert("Error", "Could not open checkout. Please try again.");
      });
    } else {
      Alert.alert(
        "Coming Soon",
        `${plan.name} subscription will be available soon! We'll notify you when it launches.`,
        [{ text: "OK" }]
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: topInset + 12,
            paddingBottom: bottomInset + 20,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Text style={styles.headerEmoji}>🌿</Text>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Wellness Plans
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Unlock your full wellness potential with a plan that fits your lifestyle
          </Text>
        </View>

        <View style={styles.plansList}>
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              colors={colors}
              onSelect={handleSelectPlan}
            />
          ))}
        </View>

        <View style={[styles.trustRow]}>
          {[
            { icon: "shield" as const, label: "Cancel anytime" },
            { icon: "lock" as const, label: "Secure payment" },
            { icon: "refresh-cw" as const, label: "7-day free trial" },
          ].map((item) => (
            <View key={item.label} style={styles.trustItem}>
              <Feather name={item.icon} size={16} color={colors.primary} />
              <Text style={[styles.trustText, { color: colors.mutedForeground }]}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20 },
  headerSection: {
    alignItems: "center",
    marginBottom: 28,
  },
  headerEmoji: { fontSize: 48, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: "700", letterSpacing: -0.5, marginBottom: 8, textAlign: "center" },
  subtitle: { fontSize: 15, textAlign: "center", lineHeight: 22, paddingHorizontal: 16 },
  plansList: { gap: 16, marginBottom: 24 },
  planCard: {
    borderRadius: 20,
    padding: 20,
    overflow: "hidden",
  },
  popularBadge: {
    alignSelf: "flex-start",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 14,
  },
  popularText: { color: "#FFFFFF", fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  planName: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  planHighlight: { fontSize: 13 },
  priceBlock: { alignItems: "flex-end" },
  price: { fontSize: 22, fontWeight: "800" },
  period: { fontSize: 11, marginTop: 2 },
  divider: { height: StyleSheet.hairlineWidth, marginBottom: 16 },
  featureList: { gap: 10, marginBottom: 16 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  featureCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: { fontSize: 14, flex: 1 },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 4,
  },
  ctaText: { fontSize: 15, fontWeight: "700" },
  trustRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
  },
  trustItem: { alignItems: "center", gap: 6 },
  trustText: { fontSize: 11, fontWeight: "500", textAlign: "center" },
});
