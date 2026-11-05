import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminDriversScreen from '../screens/admin/AdminDriversScreen';
import AdminProfileScreen from '../screens/admin/AdminProfileScreen';
import { COLORS } from '../theme';

const Tab = createBottomTabNavigator();

const ADMIN_ICONS = {
  Inicio: '🏠',
  Conductores: '👥',
  Perfil: '👤',
};

export default function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        headerTintColor: COLORS.primaryDark,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={AdminDashboardScreen}
        options={{ tabBarIcon: ({ focused }) => <Text style={{ fontSize: focused ? 22 : 20 }}>{ADMIN_ICONS.Inicio}</Text> }}
      />
      <Tab.Screen
        name="Conductores"
        component={AdminDriversScreen}
        options={{ tabBarIcon: ({ focused }) => <Text style={{ fontSize: focused ? 22 : 20 }}>{ADMIN_ICONS.Conductores}</Text> }}
      />
      <Tab.Screen
        name="Perfil"
        component={AdminProfileScreen}
        options={{ tabBarIcon: ({ focused }) => <Text style={{ fontSize: focused ? 22 : 20 }}>{ADMIN_ICONS.Perfil}</Text> }}
      />
    </Tab.Navigator>
  );
}
