import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { recipes, Recipe } from "@/data/recipes";
import { useColors } from "@/hooks/useColors";

const CATEGORIES = ["All", "Smoothie", "Drink", "Breakfast", "Snack", "Lunch", "Wellness Shot"];

function RecipeModal({
  recipe,
  visible,
  onClose,
  colors,
}: {
  recipe: Recipe | null;
  visible: boolean;
  onClose: () => void;
  colors: ReturnType<typeof useColors>;
}) {
  const insets = useSafeAreaInsets();
  if (!recipe) return null;
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
          <Pressable onPress={onClose} style={styles.modalClose}>
            <Feather name="x" size={22} color={colors.mutedForeground} />
          </Pressable>
          <Text style={[styles.modalTitle, { color: colors.foreground }]}>{recipe.title}</Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.modalContent,
            { paddingBottom: insets.bottom + 32 },
          ]}
        >
          <View style={[styles.recipeHero, { backgroundColor: recipe.color }]}>
            <Text style={styles.recipeHeroEmoji}>{recipe.emoji}</Text>
            <View style={styles.recipeBadges}>
              <View style={styles.heroBadge}>
                <Feather name="clock" size={12} color="rgba(255,255,255,0.9)" />
                <Text style={styles.heroBadgeText}>{recipe.time}</Text>
              </View>
              <View style={styles.heroBadge}>
                <Feather name="zap" size={12} color="rgba(255,255,255,0.9)" />
                <Text style={styles.heroBadgeText}>{recipe.calories} cal</Text>
              </View>
            </View>
          </View>

          <View style={styles.benefitsRow}>
            {recipe.benefits.map((b) => (
              <View key={b} style={[styles.benefitTag, { backgroundColor: colors.primary + "20" }]}>
                <Text style={[styles.benefitText, { color: colors.primary }]}>{b}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Ingredients</Text>
          <View style={[styles.ingredientsList, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {recipe.ingredients.map((ing, i) => (
              <View key={i} style={[styles.ingredientRow, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border }]}>
                <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                <Text style={[styles.ingredientText, { color: colors.foreground }]}>{ing}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Instructions</Text>
          {recipe.steps.map((step, i) => (
            <View key={i} style={[styles.stepRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.stepNum, { backgroundColor: recipe.color }]}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <Text style={[styles.stepText, { color: colors.foreground }]}>{step}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

export default function RecipesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const topInset = Platform.OS === "web" ? 67 : insets.top;

  const filtered = recipes.filter((r) => {
    const matchCat = selectedCategory === "All" || r.category === selectedCategory;
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topInset + 12, backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Recipes</Text>
        <View style={[styles.searchBar, { backgroundColor: colors.input, borderColor: colors.border }]}>
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Search recipes..."
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catList}
        >
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => {
                setSelectedCategory(cat);
                Haptics.selectionAsync();
              }}
              style={[
                styles.catChip,
                {
                  backgroundColor:
                    selectedCategory === cat ? colors.primary : colors.card,
                  borderColor:
                    selectedCategory === cat ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.catText,
                  {
                    color:
                      selectedCategory === cat
                        ? "#FFFFFF"
                        : colors.mutedForeground,
                  },
                ]}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: Platform.OS === "web" ? 100 : 100 },
        ]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedRecipe(item);
              setModalVisible(true);
            }}
            style={({ pressed }) => [
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: pressed ? 0.85 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
          >
            <View style={[styles.cardHeader, { backgroundColor: item.color }]}>
              <Text style={styles.cardEmoji}>{item.emoji}</Text>
            </View>
            <View style={styles.cardBody}>
              <View style={[styles.catLabel, { backgroundColor: item.color + "25" }]}>
                <Text style={[styles.catLabelText, { color: item.color }]}>
                  {item.category}
                </Text>
              </View>
              <Text style={[styles.cardTitle, { color: colors.foreground }]} numberOfLines={2}>
                {item.title}
              </Text>
              <View style={styles.cardMeta}>
                <Feather name="clock" size={11} color={colors.mutedForeground} />
                <Text style={[styles.cardMetaText, { color: colors.mutedForeground }]}>
                  {item.time}
                </Text>
                <Text style={[styles.dot2, { color: colors.mutedForeground }]}>·</Text>
                <Text style={[styles.cardMetaText, { color: colors.mutedForeground }]}>
                  {item.calories} cal
                </Text>
              </View>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="search" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No recipes found
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Try a different category or search term
            </Text>
          </View>
        }
      />

      <RecipeModal
        recipe={selectedRecipe}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        colors={colors}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  title: { fontSize: 28, fontWeight: "700", letterSpacing: -0.5, marginBottom: 14 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
  },
  searchInput: { flex: 1, fontSize: 15 },
  catList: { paddingRight: 20, gap: 8 },
  catChip: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
  },
  catText: { fontSize: 13, fontWeight: "600" },
  listContent: { paddingHorizontal: 16, paddingTop: 4 },
  columnWrapper: { gap: 10, marginBottom: 10 },
  card: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardHeader: {
    height: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  cardEmoji: { fontSize: 40 },
  cardBody: { padding: 12 },
  catLabel: {
    alignSelf: "flex-start",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 6,
  },
  catLabelText: { fontSize: 10, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
  cardTitle: { fontSize: 13, fontWeight: "600", lineHeight: 18, marginBottom: 8 },
  cardMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  cardMetaText: { fontSize: 11 },
  dot2: { fontSize: 11 },
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 80, gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: "600" },
  emptyText: { fontSize: 14, textAlign: "center" },
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modalClose: { padding: 4 },
  modalTitle: { fontSize: 16, fontWeight: "700", flex: 1, textAlign: "center" },
  modalContent: { paddingHorizontal: 20, paddingTop: 4 },
  recipeHero: {
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    marginTop: 12,
  },
  recipeHeroEmoji: { fontSize: 72, marginBottom: 12 },
  recipeBadges: { flexDirection: "row", gap: 10 },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  heroBadgeText: { color: "#FFFFFF", fontSize: 12, fontWeight: "600" },
  benefitsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  benefitTag: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  benefitText: { fontSize: 12, fontWeight: "600" },
  sectionLabel: { fontSize: 17, fontWeight: "700", marginBottom: 12 },
  ingredientsList: { borderRadius: 14, borderWidth: 1, marginBottom: 24, overflow: "hidden" },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  ingredientText: { fontSize: 15 },
  stepRow: {
    flexDirection: "row",
    gap: 14,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 10,
    alignItems: "flex-start",
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  stepNumText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
  stepText: { flex: 1, fontSize: 15, lineHeight: 22 },
});
