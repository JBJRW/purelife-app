import React from 'react';
import { Composition } from 'remotion';
import { RecipeVideo } from './RecipeVideo';
import { TipVideo } from './TipVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="RecipeVideo"
        component={RecipeVideo}
        durationInFrames={240}
        fps={30}
        width={2160}
        height={3840}
        defaultProps={{
          name: 'Detox Supreme Green',
          ingredients: ['Spinach (2 cups)', 'Cucumber (1/2)', 'Ginger (2cm)', 'Lemon (1)', 'Coconut water (1 cup)'],
          benefits: 'Deep cleanse for your liver and digestive system',
          category: 'Detox',
        }}
      />
      <Composition
        id="TipVideo"
        component={TipVideo}
        durationInFrames={210}
        fps={30}
        width={2160}
        height={3840}
        defaultProps={{
          content: 'Drink a glass of water as soon as you wake up. Your body loses fluids overnight, and rehydrating first thing helps kickstart your metabolism and mental clarity.',
          topic: 'Hydration',
        }}
      />
    </>
  );
};
