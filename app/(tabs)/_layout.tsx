import React from 'react';
import { Redirect, Stack, Tabs } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

export default function TabLayout() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textLight,
      tabBarStyle: {
        backgroundColor: COLORS.white,
        borderTopColor: COLORS.border,
        borderTopWidth: 0,
        paddingBottom: 8,
        paddingTop: 8,
        height: 80, // this styles all related to tab bar
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
      },
      // headerStyle: {
      //   backgroundColor: COLORS.background,
      //   borderBottomColor: COLORS.border,
      //   borderBottomWidth: 1,
      // }, this related to header
    }}>
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
