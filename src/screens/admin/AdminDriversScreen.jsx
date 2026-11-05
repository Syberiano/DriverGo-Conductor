import React, { useCallback, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, getDocs, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import CustomButton from '../../components/common/CustomButton';
import { db } from '../../config/firebase';
import { COLORS, SIZES, FONTS } from '../../theme';

export default function AdminDriversScreen() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadDrivers = useCallback(async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'drivers'));
      const loadedDrivers = snapshot.docs
        .map((item) => ({ id: item.id, ...item.data() }))
        .sort((left, right) => (left.status === 'pending' ? -1 : 1) - (right.status === 'pending' ? -1 : 1));
      setDrivers(loadedDrivers);
    } catch (error) {
      console.error('Error al cargar conductores pendientes:', error);
      Alert.alert('Error', 'No se pudieron cargar los conductores.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => {
    loadDrivers();
  }, [loadDrivers]));

  const approveDriver = async (driverId) => {
    try {
      await updateDoc(doc(db, 'drivers', driverId), {
        status: 'approved',
        approvedAt: serverTimestamp(),
      });
      setDrivers((current) => current.map((driver) => (
        driver.id === driverId ? { ...driver, status: 'approved' } : driver
      )));
      Alert.alert('Conductor aprobado', 'El registro fue aprobado correctamente.');
    } catch (error) {
      console.error('Error al aprobar conductor:', error);
      Alert.alert('Error', 'No se pudo aprobar el conductor.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={drivers}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadDrivers} />}
        ListHeaderComponent={<Text style={styles.title}>Conductores y estados</Text>}
        ListEmptyComponent={!loading ? <Text style={styles.empty}>No hay conductores registrados.</Text> : null}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.fullName || 'Sin nombre'}</Text>
            <Text style={styles.detail}>{item.email || 'Sin correo'}</Text>
            <Text style={styles.detail}>
              Vehículo: {item.vehicle?.brand || 'Sin registrar'} {item.vehicle?.model || ''}
            </Text>
            <Text style={[styles.status, item.status === 'approved' ? styles.approved : styles.pending]}>
              {item.status === 'approved' ? 'Aprobado' : 'Pendiente de aprobación'}
            </Text>
            {item.status !== 'approved' && (
              <CustomButton title="Aprobar" onPress={() => approveDriver(item.id)} />
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SIZES.spaceMd },
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
    marginBottom: SIZES.spaceMd,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  name: { fontSize: SIZES.md, fontWeight: FONTS.fontWeightBold, color: COLORS.textPrimary },
  detail: { color: COLORS.textSecondary, marginTop: SIZES.spaceXs },
  status: { fontSize: SIZES.sm, fontWeight: FONTS.fontWeightBold, marginTop: SIZES.spaceSm },
  pending: { color: COLORS.warning },
  approved: { color: COLORS.success },
  empty: { color: COLORS.textSecondary, textAlign: 'center', marginTop: SIZES.spaceLg },
});
