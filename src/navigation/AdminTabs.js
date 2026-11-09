import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminDriversScreen from '../screens/admin/AdminDriversScreen';
import AdminProfileScreen from '../screens/admin/AdminProfileScreen';
import { COLORS } from '../theme';

const Tab = createBottomTabNavigator();

const ADMIN_ICONS = {
  Inicio: 'grid-outline',
  Conductores: 'people-outline',
  Perfil: 'person-outline',
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
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={ADMIN_ICONS.Inicio}
              size={focused ? 24 : 22}
              color={focused ? COLORS.primary : COLORS.textSecondary}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Conductores"
        component={AdminDriversScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={ADMIN_ICONS.Conductores}
              size={focused ? 24 : 22}
              color={focused ? COLORS.primary : COLORS.textSecondary}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={AdminProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={ADMIN_ICONS.Perfil}
              size={focused ? 24 : 22}
              color={focused ? COLORS.primary : COLORS.textSecondary}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
