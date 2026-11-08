import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import TripRequestCard from '../components/common/TripRequestCard';
import CustomButton from '../components/common/CustomButton';
import DriverMap from '../components/maps/DriverMap';
import { COLORS, SIZES, FONTS } from '../theme';

export default function HomeScreen({ navigation }) {
  const { driverData, logout } = useContext(AuthContext);
  const [isOnline, setIsOnline] = useState(false);
  const [activeTrip, setActiveTrip] = useState({
    id: 'trip_101',
    category: 'Viaje',
    passengerName: 'Carlos Gómez',
    origin: { address: 'Parque Lleras, El Poblado' },
    destination: { address: 'Centro Comercial Santafé' },
    driverEarnings: 18500,
    distance: 4.2,
  });

  const handleToggleOnline = (value) => {
    setIsOnline(value);
  };

  const handleAcceptTrip = () => {
    Alert.alert('Viaje Aceptado', 'Te diriges a recoger a ' + activeTrip.passengerName);
  };

  const handleRejectTrip = () => {
    setActiveTrip(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.welcomeText}>Hola,</Text>
          <Text style={styles.driverName}>
            {driverData?.fullName || 'Conductor'}
          </Text>
        </View>

        <View style={styles.headerRight}>
          {/* Botón / Avatar para ir al Perfil */}
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.profileButtonText}>👤</Text>
          </TouchableOpacity>

          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>
              {isOnline ? 'En línea' : 'Desconectado'}
            </Text>
            <Switch
              value={isOnline}
              onValueChange={handleToggleOnline}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={isOnline ? COLORS.primaryDark : '#f4f3f4'}
            />
          </View>
        </View>
        </View>

        <View style={styles.mapSection}>
          <Text style={styles.sectionTitle}>Tu ubicación</Text>
          <DriverMap />
        </View>

        <View style={styles.content}>
        {!isOnline ? (
          <View style={styles.offlineBox}>
            <Text style={styles.offlineTitle}>Estás desconectado</Text>
            <Text style={styles.offlineSubtitle}>
              Ponte en línea para comenzar a recibir solicitudes de viajes cercanos.
            </Text>
          </View>
        ) : activeTrip ? (
          <View style={styles.tripSection}>
            <Text style={styles.sectionTitle}>Solicitud de Viaje Entrante</Text>
            <TripRequestCard
              trip={activeTrip}
              onAccept={handleAcceptTrip}
              onReject={handleRejectTrip}
            />
          </View>
        ) : (
          <View style={styles.waitingBox}>
            <Text style={styles.waitingTitle}>Buscando viajes...</Text>
            <Text style={styles.waitingSubtitle}>
              Te avisaremos en cuanto haya una solicitud cercana a tu ubicación.
            </Text>
          </View>
        )}
        </View>

        <View style={styles.footer}>
          <CustomButton
            title="Cerrar Sesión"
            onPress={logout}
            type="secondary"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.spaceLg,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.spaceMd,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginTop: SIZES.spaceLg,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.spaceMd,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButtonText: {
    fontSize: 18,
  },
  welcomeText: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  driverName: {
    fontSize: SIZES.lg,
    fontWeight: FONTS.fontWeightBold,
    color: COLORS.primaryDark,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: SIZES.xs,
    fontWeight: FONTS.fontWeightBold,
    color: COLORS.textPrimary,
    marginBottom: SIZES.spaceXs,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: SIZES.spaceXl,
  },
  mapSection: {
    marginTop: SIZES.spaceMd,
  },
  offlineBox: {
    alignItems: 'center',
    padding: SIZES.spaceLg,
  },
  offlineTitle: {
    fontSize: SIZES.lg,
    fontWeight: FONTS.fontWeightBold,
    color: COLORS.textPrimary,
    marginBottom: SIZES.spaceXs,
  },
  offlineSubtitle: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  waitingBox: {
    alignItems: 'center',
    padding: SIZES.spaceLg,
  },
  waitingTitle: {
    fontSize: SIZES.lg,
    fontWeight: FONTS.fontWeightBold,
    color: COLORS.primary,
    marginBottom: SIZES.spaceXs,
  },
  waitingSubtitle: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  tripSection: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: SIZES.md,
    fontWeight: FONTS.fontWeightBold,
    color: COLORS.textPrimary,
    marginBottom: SIZES.spaceMd,
  },
  footer: {
    marginBottom: SIZES.spaceMd,
  },
});