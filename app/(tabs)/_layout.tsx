import React from 'react';
import { Redirect, Stack, Tabs } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Tabs>
      <Tabs.Screen
        name='index'
        options={{
          title: 'Recipes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="restaurant"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='search'
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="search"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='favorites'
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="heart"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
