import React, { useEffect, useState } from 'react';
import { Alert, ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { COLORS, SIZES } from '../../theme';

export default function DriverMap() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadLocation = async () => {
      try {
        const permission = await Location.requestForegroundPermissionsAsync();

        if (permission.status !== 'granted') {
          Alert.alert(
            'Ubicación necesaria',
            'Activa el permiso de ubicación para mostrar tu posición en el mapa.'
          );
          return;
        }

        const current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (mounted) {
          setLocation(current.coords);
        }
      } catch (error) {
        console.error('Error al obtener la ubicación:', error);
        Alert.alert('Error de ubicación', 'No se pudo obtener tu ubicación.');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadLocation();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.messageContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={styles.message}>Cargando mapa...</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.message}>
          No se pudo cargar el mapa. Revisa el permiso de ubicación.
        </Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      showsUserLocation
      showsMyLocationButton
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      <Marker
        coordinate={{
          latitude: location.latitude,
          longitude: location.longitude,
        }}
        title="Tu ubicación"
        description="Ubicación actual del conductor"
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 240,
    width: '100%',
    borderRadius: SIZES.radiusMd,
  },
  messageContainer: {
    height: 240,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.spaceMd,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
  },
  message: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
    textAlign: 'center',
    marginTop: SIZES.spaceSm,
  },
});
