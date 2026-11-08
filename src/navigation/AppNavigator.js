import React, { useContext } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthContext } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import DriverTabs from './DriverTabs';
import AdminTabs from './AdminTabs';
import { COLORS } from '../theme';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: COLORS.primaryDark,
        headerTitleStyle: {
          fontWeight: '700',
        },
        headerBackTitle: 'Atrás',
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: 'Registro' }}
      />
    </Stack.Navigator>
  );
}

function MainStack({ driverStatus }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: COLORS.primaryDark,
        headerTitleStyle: {
          fontWeight: '700',
        },
        headerBackTitle: 'Atrás',
      }}
    >
      <Stack.Screen name="DriverTabs" component={DriverTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Editar datos', headerBackTitle: 'Atrás' }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: 'Completar registro', headerBackTitle: 'Atrás' }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { user, isAdmin, driverData, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user && isAdmin ? (
        <AdminTabs />
      ) : user ? (
        <MainStack driverStatus={driverData?.status || 'pending'} />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});