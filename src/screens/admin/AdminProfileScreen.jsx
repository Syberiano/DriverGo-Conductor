import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/common/CustomButton';
import { AuthContext } from '../../context/AuthContext';
import { COLORS, SIZES, FONTS } from '../../theme';

export default function AdminProfileScreen() {
  const { user, logout } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Perfil de administrador</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Correo</Text>
        <Text style={styles.value}>{user?.email}</Text>
      </View>
      <CustomButton title="Cerrar sesión" onPress={logout} type="secondary" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SIZES.spaceLg },
  title: {
    fontSize: SIZES.xl,
    fontWeight: FONTS.fontWeightBold,
    color: COLORS.primaryDark,
    marginBottom: SIZES.spaceMd,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
    padding: SIZES.spaceMd,
    marginBottom: SIZES.spaceLg,
  },
  label: { color: COLORS.textSecondary, fontSize: SIZES.xs },
  value: { color: COLORS.textPrimary, fontSize: SIZES.md, marginTop: SIZES.spaceXs },
});
