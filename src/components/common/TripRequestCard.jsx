import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomButton from '../common/CustomButton';
import { COLORS, SIZES, SHADOWS } from '../../theme';

export default function TripRequestCard({ trip, onAccept, onReject }) {
  if (!trip) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>¡Nueva solicitud de viaje!</Text>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Categoría:</Text>
        <Text style={styles.value}>{trip.category?.toUpperCase()}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Recogida:</Text>
        <Text style={styles.value} numberOfLines={1}>{trip.origin?.address}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Destino:</Text>
        <Text style={styles.value} numberOfLines={1}>{trip.destination?.address}</Text>
      </View>

      <View style={styles.earningsContainer}>
        <Text style={styles.labelEarnings}>Ganancia estimada:</Text>
        <Text style={styles.earnings}>$ {trip.driverEarnings?.toLocaleString()} COP</Text>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <CustomButton title="Rechazar" onPress={onReject} type="danger" />
        </View>
        <View style={styles.buttonWrapper}>
          <CustomButton title="Aceptar" onPress={onAccept} type="primary" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    bottom: SIZES.spaceLg,
    left: SIZES.spaceMd,
    right: SIZES.spaceMd,
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.spaceLg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
    title: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
    textAlign: 'center',
    marginBottom: SIZES.spaceMd,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.spaceSm,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
  },
  value: {
    fontWeight: '500',
    fontSize: SIZES.sm,
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: 'right',
  },
  earningsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundTint,
    padding: SIZES.spaceSm,
    borderRadius: SIZES.radiusSm,
    marginVertical: SIZES.spaceSm,
  },
  labelEarnings: {
    color: COLORS.primaryDark,
    fontWeight: '600',
    fontSize: SIZES.sm,
  },
  earnings: {
    fontWeight: 'bold',
    fontSize: SIZES.md,
    color: COLORS.success,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.spaceSm,
    gap: SIZES.spaceSm,
  },
  buttonWrapper: {
    flex: 1,
  },
});