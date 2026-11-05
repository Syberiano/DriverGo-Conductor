import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import CustomButton from '../components/common/CustomButton';
import { COLORS, SIZES, FONTS } from '../theme';

export default function ProfileScreen({ navigation }) {
  const { driverData, logout } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
        <Text style={styles.title}>Mi Perfil</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            Estado: {driverData?.status === 'pending' ? 'Pendiente de Aprobación' : 'Aprobado'}
          </Text>
          </View>
      </View>

        <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información Personal</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Nombre Completo:</Text>
          <Text style={styles.value}>{driverData?.fullName || 'No disponible'}</Text>

          <Text style={styles.label}>Correo Electrónico:</Text>
          <Text style={styles.value}>{driverData?.email || 'No disponible'}</Text>

          <Text style={styles.label}>Teléfono:</Text>
          <Text style={styles.value}>{driverData?.phone || 'No disponible'}</Text>

          <Text style={styles.label}>N° de Documento:</Text>
          <Text style={styles.value}>{driverData?.documentNumber || 'No disponible'}</Text>
          </View>
      </View>

        <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información del Vehículo</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Marca y Modelo:</Text>
          <Text style={styles.value}>
            {driverData?.vehicle?.brand} {driverData?.vehicle?.model} ({driverData?.vehicle?.year})
          </Text>

          <Text style={styles.label}>Placa:</Text>
          <Text style={styles.value}>{driverData?.vehicle?.plate || 'No disponible'}</Text>

          <Text style={styles.label}>Color:</Text>
          <Text style={styles.value}>{driverData?.vehicle?.color || 'No disponible'}</Text>
          </View>
      </View>

        <View style={styles.footer}>
          <CustomButton
            title={driverData?.vehicle ? 'Editar datos' : 'Registrar vehículo'}
            onPress={() => navigation.navigate(driverData?.vehicle ? 'EditProfile' : 'Register', driverData?.vehicle ? undefined : { vehicleOnly: true })}
            type="primary"
          />
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
  },
  header: {
    alignItems: 'center',
    marginVertical: SIZES.spaceLg,
  },
  title: {
    fontSize: SIZES.xxl || 28,
    fontWeight: FONTS.fontWeightBold,
    color: COLORS.primaryDark,
    marginBottom: SIZES.spaceSm,
  },
  statusBadge: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.spaceMd,
    paddingVertical: SIZES.spaceXs,
    borderRadius: SIZES.radiusSm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusText: {
    fontSize: SIZES.sm,
    fontWeight: FONTS.fontWeightBold,
    color: COLORS.primary,
  },
  section: {
    marginBottom: SIZES.spaceLg,
  },
  sectionTitle: {
    fontSize: SIZES.md,
    fontWeight: FONTS.fontWeightBold,
    color: COLORS.textPrimary,
    marginBottom: SIZES.spaceSm,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
    padding: SIZES.spaceMd,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  label: {
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: SIZES.spaceXs,
  },
  value: {
    fontSize: SIZES.sm,
    fontWeight: FONTS.fontWeightBold,
    color: COLORS.textPrimary,
    marginBottom: SIZES.spaceSm,
  },
  footer: {
    marginTop: SIZES.spaceXl,
    marginBottom: SIZES.spaceLg,
  },
});