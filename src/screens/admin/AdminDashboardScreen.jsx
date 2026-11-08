import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SIZES, FONTS } from '../../theme';

export default function AdminDashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Panel de administración</Text>
      <View style={styles.card}>
        <Text style={styles.text}>
          Desde Conductores puedes revisar y aprobar los registros pendientes.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.spaceLg,
  },
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
  },
  text: {
    color: COLORS.textPrimary,
    fontSize: SIZES.md,
  },
});
