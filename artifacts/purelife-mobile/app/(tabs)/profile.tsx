import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

function AuthForm({ colors }: { colors: ReturnType<typeof useColors> }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setError("");
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const { error: err } =
      mode === "signin"
        ? await signIn(email.trim(), password)
        : await signUp(email.trim(), password);

    setLoading(false);

    if (err) {
      setError(err);
    } else if (mode === "signup") {
      Alert.alert("Welcome!", "Check your email to confirm your account.");
    }
  };

  return (
    <View style={styles.authContainer}>
      <View style={[styles.authCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={styles.authEmoji}>🌿</Text>
        <Text style={[styles.authTitle, { color: colors.foreground }]}>
          {mode === "signin" ? "Welcome back" : "Join PureLife"}
        </Text>
        <Text style={[styles.authSub, { color: colors.mutedForeground }]}>
          {mode === "signin"
            ? "Sign in to your wellness account"
            : "Create your free wellness account"}
        </Text>

        {error ? (
          <View style={[styles.errorBox, { backgroundColor: colors.destructive + "18", borderColor: colors.destructive + "40" }]}>
            <Feather name="alert-circle" size={14} color={colors.destructive} />
            <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
          </View>
        ) : null}

        <View style={[styles.inputField, { backgroundColor: colors.input, borderColor: colors.border }]}>
          <Feather name="mail" size={16} color={colors.mutedForeground} />
          <TextInput
            style={[styles.inputText, { color: colors.foreground }]}
            placeholder="Email address"
            placeholderTextColor={colors.mutedForeground}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
        </View>

        <View style={[styles.inputField, { backgroundColor: colors.input, borderColor: colors.border }]}>
          <Feather name="lock" size={16} color={colors.mutedForeground} />
          <TextInput
            style={[styles.inputText, { color: colors.foreground }]}
            placeholder="Password"
            placeholderTextColor={colors.mutedForeground}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />
        </View>

        <Pressable
          onPress={handleSubmit}
          disabled={loading}
          style={({ pressed }) => [
            styles.submitButton,
            {
              backgroundColor: colors.primary,
              opacity: loading || pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitText}>
              {mode === "signin" ? "Sign In" : "Create Account"}
            </Text>
          )}
        </Pressable>

        <Pressable
          onPress={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError("");
          }}
        >
          <Text style={[styles.toggleText, { color: colors.mutedForeground }]}>
            {mode === "signin" ? "No account? " : "Already have one? "}
            <Text style={{ color: colors.primary, fontWeight: "600" }}>
              {mode === "signin" ? "Create one" : "Sign in"}
            </Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function ProfileView({ colors }: { colors: ReturnType<typeof useColors> }) {
  const { user, signOut } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleSignOut = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoggingOut(true);
    await signOut();
    setLoggingOut(false);
  };

  const displayName = user?.email?.split("@")[0] ?? "Wellness Member";
  const initial = displayName[0]?.toUpperCase() ?? "W";

  const menuItems = [
    { icon: "heart" as const, label: "Wellness Goals", sub: "Set your health intentions" },
    { icon: "bar-chart-2" as const, label: "Progress", sub: "Track your wellness journey" },
    { icon: "bell" as const, label: "Notifications", sub: "Daily wellness reminders" },
    { icon: "shield" as const, label: "Privacy", sub: "Manage your data" },
  ];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.profileContent}
    >
      <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarInitial}>{initial}</Text>
        </View>
        <Text style={[styles.displayName, { color: colors.foreground }]}>{displayName}</Text>
        <Text style={[styles.email, { color: colors.mutedForeground }]}>{user?.email}</Text>
        <View style={[styles.memberBadge, { backgroundColor: colors.accent + "25" }]}>
          <Text style={[styles.memberBadgeText, { color: colors.accent }]}>🌿 Wellness Member</Text>
        </View>
      </View>

      <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {menuItems.map((item, i) => (
          <Pressable
            key={item.label}
            style={({ pressed }) => [
              styles.menuItem,
              i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <View style={[styles.menuIcon, { backgroundColor: colors.primary + "18" }]}>
              <Feather name={item.icon} size={18} color={colors.primary} />
            </View>
            <View style={styles.menuText}>
              <Text style={[styles.menuLabel, { color: colors.foreground }]}>{item.label}</Text>
              <Text style={[styles.menuSub, { color: colors.mutedForeground }]}>{item.sub}</Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={handleSignOut}
        disabled={loggingOut}
        style={({ pressed }) => [
          styles.signOutButton,
          {
            backgroundColor: colors.destructive + "18",
            borderColor: colors.destructive + "30",
            opacity: loggingOut || pressed ? 0.7 : 1,
          },
        ]}
      >
        {loggingOut ? (
          <ActivityIndicator size="small" color={colors.destructive} />
        ) : (
          <>
            <Feather name="log-out" size={18} color={colors.destructive} />
            <Text style={[styles.signOutText, { color: colors.destructive }]}>Sign Out</Text>
          </>
        )}
      </Pressable>
    </ScrollView>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, loading } = useAuth();

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: topInset + 12, backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          {user ? "Profile" : "Account"}
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : user ? (
        <ProfileView colors={colors} />
      ) : (
        <AuthForm colors={colors} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 28, fontWeight: "700", letterSpacing: -0.5 },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  authContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  authCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 28,
    alignItems: "center",
    gap: 12,
  },
  authEmoji: { fontSize: 48, marginBottom: 4 },
  authTitle: { fontSize: 24, fontWeight: "700", letterSpacing: -0.5, textAlign: "center" },
  authSub: { fontSize: 15, textAlign: "center", marginBottom: 4 },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    width: "100%",
  },
  errorText: { fontSize: 13, flex: 1 },
  inputField: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
    width: "100%",
  },
  inputText: { flex: 1, fontSize: 15 },
  submitButton: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    width: "100%",
    marginTop: 4,
  },
  submitText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  toggleText: { fontSize: 14, marginTop: 4 },
  profileContent: { padding: 20, gap: 14, paddingBottom: 40 },
  profileCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 28,
    alignItems: "center",
    gap: 6,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  avatarInitial: { color: "#FFFFFF", fontSize: 28, fontWeight: "700" },
  displayName: { fontSize: 22, fontWeight: "700", letterSpacing: -0.4 },
  email: { fontSize: 14 },
  memberBadge: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 4,
  },
  memberBadgeText: { fontSize: 13, fontWeight: "600" },
  menuCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 15,
    gap: 14,
  },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: { flex: 1 },
  menuLabel: { fontSize: 15, fontWeight: "600" },
  menuSub: { fontSize: 12, marginTop: 1 },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 15,
    marginTop: 4,
    marginBottom: 8,
  },
  signOutText: { fontSize: 16, fontWeight: "600" },
});
