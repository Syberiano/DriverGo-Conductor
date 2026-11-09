import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import TripsHistoryScreen from '../screens/TripsHistoryScreen';
import RequestsScreen from '../screens/RequestsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { COLORS } from '../theme';

const Tab = createBottomTabNavigator();

export const TAB_ICONS = {
  Viajes: 'map-outline',
  Solicitudes: 'notifications-outline',
  Perfil: 'person-outline',
};

function TabIcon({ name, focused }) {
  return (
    <Ionicons
      name={TAB_ICONS[name]}
      size={focused ? 24 : 22}
      color={focused ? COLORS.primary : COLORS.textSecondary}
    />
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
        name="Solicitudes"
        component={RequestsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="Solicitudes" focused={focused} /> }}
      />
      <Tab.Screen
        name="Viajes"
        component={TripsHistoryScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="Viajes" focused={focused} /> }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="Perfil" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}
