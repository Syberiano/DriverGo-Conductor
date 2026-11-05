import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TripsHistoryScreen from '../screens/TripsHistoryScreen';
import RequestsScreen from '../screens/RequestsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { COLORS } from '../theme';

const Tab = createBottomTabNavigator();

export const TAB_ICONS = {
  Viajes: '🧭',
  Solicitudes: '📋',
  Perfil: '👤',
};

function TabIcon({ name, focused }) {
  return (
    <Text style={{ fontSize: focused ? 22 : 20 }}>
      {TAB_ICONS[name]}
    </Text>
  );
}

export default function DriverTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        headerTintColor: COLORS.primaryDark,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Viajes"
        component={TripsHistoryScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="Viajes" focused={focused} /> }}
      />
      <Tab.Screen
        name="Solicitudes"
        component={RequestsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="Solicitudes" focused={focused} /> }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="Perfil" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}
