import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

const WELLNESS_SYSTEM_PROMPT = `You are Dr. Smoothie AI — the lead wellness intelligence for PureLife Wellness Club, a premium global health platform. You combine nutritional science with personalized guidance.

PERSONALITY: Warm, authoritative, science-backed. Never preachy. Think of a brilliant friend who happens to be a nutritionist.

IMPORTANT: Do not give medical diagnoses or prescriptions. You are a nutritional motivation platform, not a medical service. Always recommend consulting a doctor for health conditions. Speak in the user's language. Base recommendations on natural ingredient properties.`;

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_INTRO: Message = {
  id: "intro",
  role: "assistant",
  content:
    "Hi! I'm Dr. Smoothie 🥤 — your AI-powered wellness guide. Ask me anything about nutrition, recipes, healthy habits, or your wellness journey!",
};

function getApiUrl() {
  const domain = process.env.EXPO_PUBLIC_DOMAIN;
  if (domain) return `https://${domain}/api/chat`;
  return "/api/chat";
}

function MessageBubble({
  message,
  colors,
}: {
  message: Message;
  colors: ReturnType<typeof useColors>;
}) {
  const isUser = message.role === "user";
  return (
    <View
      style={[
        styles.bubbleRow,
        isUser ? styles.bubbleRowUser : styles.bubbleRowAssistant,
      ]}
    >
      {!isUser && (
        <View
          style={[styles.avatar, { backgroundColor: colors.primary + "25" }]}
        >
          <Text style={{ fontSize: 16 }}>🥤</Text>
        </View>
      )}
      <View
        style={[
          styles.bubble,
          isUser
            ? [styles.bubbleUser, { backgroundColor: colors.primary }]
            : [
                styles.bubbleAssistant,
                { backgroundColor: colors.card, borderColor: colors.border },
              ],
          { maxWidth: "82%" },
        ]}
      >
        <Text
          style={[
            styles.bubbleText,
            { color: isUser ? "#FFFFFF" : colors.foreground },
          ]}
        >
          {message.content}
        </Text>
      </View>
    </View>
  );
}

export default function ChatScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { session } = useAuth();
  const [messages, setMessages] = useState<Message[]>([SYSTEM_INTRO]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setInput("");
    setIsLoading(true);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    const assistantId = (Date.now() + 1).toString();

    setMessages((prev) => [
      { id: assistantId, role: "assistant", content: "" },
      userMsg,
      ...prev,
    ]);

    try {
      const conversationHistory = [...messages]
        .reverse()
        .filter((m) => m.id !== "intro")
        .map((m) => ({ role: m.role, content: m.content }));

      conversationHistory.push({ role: "user", content: text });

      const response = await fetch(getApiUrl(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token
            ? { Authorization: `Bearer ${session.access_token}` }
            : {}),
        },
        body: JSON.stringify({
          system: [
            {
              type: "text",
              text: WELLNESS_SYSTEM_PROMPT,
              cache_control: { type: "ephemeral" },
            },
          ],
          messages: conversationHistory,
        }),
      });

      if (!response.ok) throw new Error(`API ${response.status}`);

      const data = await response.json();

      const reply =
        data?.content?.[0]?.text ||
        data?.reply ||
        data?.message ||
        "I couldn't generate a response. Please try again.";

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: reply } : m
        )
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content:
                  "Sorry, I'm having trouble connecting. Please try again.",
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, session]);

  const renderItem = useCallback(
    ({ item }: { item: Message }) => (
      <MessageBubble message={item} colors={colors} />
    ),
    [colors]
  );

  const suggestions = [
    "Best morning smoothie?",
    "Help me reduce inflammation",
    "Protein-rich vegan meals",
    "Improve my energy levels",
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: topInset + 12,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.headerAvatar,
            { backgroundColor: colors.primary + "20" },
          ]}
        >
          <Text style={{ fontSize: 22 }}>🥤</Text>
        </View>
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            Dr. Smoothie AI
          </Text>
          <View style={styles.onlineRow}>
            <View style={[styles.onlineDot, { backgroundColor: "#4CAF50" }]} />
            <Text
              style={[styles.onlineText, { color: colors.mutedForeground }]}
            >
              Always available
            </Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          inverted
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          scrollEnabled={!!messages.length}
          ListHeaderComponent={
            isLoading && messages[0]?.content === "" ? (
              <View
                style={[
                  styles.typingBubble,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : null
          }
        />

        {messages.length === 1 && (
          <View style={styles.suggestions}>
            <Text
              style={[
                styles.suggestionsTitle,
                { color: colors.mutedForeground },
              ]}
            >
              Try asking...
            </Text>
            <View style={styles.suggestionsGrid}>
              {suggestions.map((s) => (
                <Pressable
                  key={s}
                  onPress={() => {
                    setInput(s);
                    Haptics.selectionAsync();
                  }}
                  style={({ pressed }) => [
                    styles.suggestionChip,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.suggestionText,
                      { color: colors.foreground },
                    ]}
                  >
                    {s}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        <View
          style={[
            styles.inputBar,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
              paddingBottom: bottomInset + 12,
            },
          ]}
        >
          <View
            style={[
              styles.inputWrapper,
              {
                backgroundColor: colors.input,
                borderColor: colors.border,
              },
            ]}
          >
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              placeholder="Ask Dr. Smoothie..."
              placeholderTextColor={colors.mutedForeground}
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={sendMessage}
              blurOnSubmit={false}
            />
            <Pressable
              onPress={sendMessage}
              disabled={!input.trim() || isLoading}
              style={({ pressed }) => [
                styles.sendButton,
                {
                  backgroundColor:
                    input.trim() && !isLoading
                      ? colors.primary
                      : colors.muted,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Feather name="arrow-up" size={18} color="#FFFFFF" />
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 16, fontWeight: "700" },
  onlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  onlineDot: { width: 7, height: 7, borderRadius: 4 },
  onlineText: { fontSize: 12 },
  messageList: { paddingHorizontal: 16, paddingTop: 12 },
  bubbleRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-end",
    gap: 8,
  },
  bubbleRowUser: { justifyContent: "flex-end" },
  bubbleRowAssistant: { justifyContent: "flex-start" },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleUser: { borderBottomRightRadius: 4 },
  bubbleAssistant: {
    borderBottomLeftRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
  },
  bubbleText: { fontSize: 15, lineHeight: 22 },
  typingBubble: {
    alignSelf: "flex-start",
    padding: 14,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 12,
    marginLeft: 40,
    marginHorizontal: 16,
  },
  suggestions: { paddingHorizontal: 16, paddingBottom: 8 },
  suggestionsTitle: { fontSize: 12, fontWeight: "500", marginBottom: 8 },
  suggestionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  suggestionChip: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
  },
  suggestionText: { fontSize: 13, fontWeight: "500" },
  inputBar: {
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderRadius: 24,
    borderWidth: 1,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    maxHeight: 120,
    paddingVertical: 4,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
