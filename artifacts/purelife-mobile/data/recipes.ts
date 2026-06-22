export interface Recipe {
  id: string;
  title: string;
  category: string;
  time: string;
  calories: number;
  emoji: string;
  ingredients: string[];
  steps: string[];
  benefits: string[];
  color: string;
}

export const recipes: Recipe[] = [
  {
    id: "1",
    title: "Green Power Smoothie",
    category: "Smoothie",
    time: "5 min",
    calories: 180,
    emoji: "🥬",
    color: "#1A5C3A",
    ingredients: [
      "2 cups fresh spinach",
      "1 frozen banana",
      "1 cup coconut water",
      "1 tbsp chia seeds",
      "½ avocado",
      "Juice of 1 lime",
    ],
    steps: [
      "Add coconut water to blender first",
      "Add spinach and blend until smooth",
      "Add banana, avocado and chia seeds",
      "Blend on high for 60 seconds",
      "Pour and enjoy immediately",
    ],
    benefits: ["Antioxidant-rich", "Energy boost", "Anti-inflammatory"],
  },
  {
    id: "2",
    title: "Golden Turmeric Latte",
    category: "Drink",
    time: "8 min",
    calories: 120,
    emoji: "✨",
    color: "#C9973A",
    ingredients: [
      "1½ cups oat milk",
      "1 tsp turmeric",
      "½ tsp cinnamon",
      "¼ tsp ginger",
      "1 tsp honey",
      "Pinch of black pepper",
    ],
    steps: [
      "Warm oat milk in a saucepan over medium heat",
      "Whisk in turmeric, cinnamon and ginger",
      "Add honey and black pepper",
      "Heat until steaming, do not boil",
      "Froth and serve",
    ],
    benefits: ["Anti-inflammatory", "Digestive support", "Immune boost"],
  },
  {
    id: "3",
    title: "Berry Antioxidant Bowl",
    category: "Breakfast",
    time: "10 min",
    calories: 290,
    emoji: "🫐",
    color: "#4A3580",
    ingredients: [
      "1 cup mixed berries (frozen)",
      "½ banana",
      "¼ cup Greek yogurt",
      "2 tbsp almond butter",
      "Granola to top",
      "Fresh berries to garnish",
    ],
    steps: [
      "Blend frozen berries and banana until thick",
      "Pour into a bowl",
      "Add dollops of almond butter",
      "Top with granola and fresh berries",
      "Serve immediately",
    ],
    benefits: ["High in antioxidants", "Probiotic-rich", "Sustained energy"],
  },
  {
    id: "4",
    title: "Matcha Chia Pudding",
    category: "Snack",
    time: "5 min + overnight",
    calories: 210,
    emoji: "🍵",
    color: "#3A7D44",
    ingredients: [
      "3 tbsp chia seeds",
      "1 cup coconut milk",
      "1 tsp matcha powder",
      "1 tbsp maple syrup",
      "Fresh mango to top",
    ],
    steps: [
      "Whisk matcha into coconut milk",
      "Stir in chia seeds and maple syrup",
      "Refrigerate overnight or 4+ hours",
      "Stir well before serving",
      "Top with fresh mango",
    ],
    benefits: ["Rich in omega-3s", "L-theanine focus", "High fiber"],
  },
  {
    id: "5",
    title: "Immunity Ginger Shot",
    category: "Wellness Shot",
    time: "3 min",
    calories: 30,
    emoji: "⚡",
    color: "#E88B2D",
    ingredients: [
      "2-inch knob fresh ginger",
      "1 lemon (juiced)",
      "Pinch of cayenne",
      "1 tsp raw honey",
      "¼ tsp black pepper",
    ],
    steps: [
      "Juice the ginger using a juicer or press",
      "Combine with lemon juice",
      "Add cayenne and black pepper",
      "Stir in honey",
      "Drink immediately as a shot",
    ],
    benefits: ["Immune support", "Anti-nausea", "Metabolism boost"],
  },
  {
    id: "6",
    title: "Avocado Green Goddess Bowl",
    category: "Lunch",
    time: "15 min",
    calories: 420,
    emoji: "🥑",
    color: "#2D8653",
    ingredients: [
      "1 ripe avocado",
      "2 cups mixed greens",
      "½ cup edamame",
      "¼ cup cucumber",
      "Sesame dressing",
      "Hemp seeds",
    ],
    steps: [
      "Arrange greens in a bowl",
      "Halve and slice the avocado",
      "Add edamame and cucumber",
      "Drizzle with sesame dressing",
      "Sprinkle hemp seeds and serve",
    ],
    benefits: ["Healthy fats", "Complete protein", "Hormone support"],
  },
];
