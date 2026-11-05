import React, { useCallback, useContext, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { auth, db } from '../config/firebase';
import { COLORS, FONTS, SIZES } from '../theme';

export default function TripsHistoryScreen() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTrips = useCallback(async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(query(
        collection(db, 'trips'),
        where('driverId', '==', auth.currentUser.uid)
      ));
      const loadedTrips = snapshot.docs.map((item) => ({
        ...item.data(),
        id: item.id,
      }));
      const uniqueTrips = Array.from(
        new Map(loadedTrips.map((trip) => [trip.id, trip])).values()
      );
      uniqueTrips.sort((left, right) => (
        (right.actionAt?.seconds || right.acceptedAt?.seconds || 0)
        - (left.actionAt?.seconds || left.acceptedAt?.seconds || 0)
      ));
      setTrips(uniqueTrips);
    } catch (error) {
      console.error('Error al cargar historial de viajes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => {
    loadTrips();
  }, [loadTrips]));

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={trips}
        keyExtractor={(item) => `trip-${item.id}`}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadTrips} />}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Mis viajes</Text>
            <Text style={styles.subtitle}>Aquí verás el historial de tus viajes.</Text>
          </>
        }
        ListEmptyComponent={trips.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Aún no tienes viajes</Text>
            <Text style={styles.emptyText}>
              Cuando completes un viaje, aparecerá aquí.
            </Text>
          </View>
        ) : null}
        renderItem={({ item }) => (
          <View style={styles.tripCard}>
            <Text style={styles.tripTitle}>{item.origin?.address || 'Origen no disponible'}</Text>
            <Text style={styles.tripText}>Destino: {item.destination?.address || 'No disponible'}</Text>
            <Text style={styles.tripText}>Ganancia: $ {item.driverEarnings?.toLocaleString()} COP</Text>
            <Text style={[
              styles.status,
              item.status === 'accepted' ? styles.accepted : styles.rejected,
            ]}>
              {item.status === 'accepted' ? 'Aceptado' : 'Rechazado'}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SIZES.spaceMd, flexGrow: 1 },
  title: {
    fontSize: SIZES.xl,
    fontWeight: FONTS.fontWeightBold,
    color: COLORS.primaryDark,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
    marginTop: SIZES.spaceXs,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
    marginTop: SIZES.spaceXl,
    padding: SIZES.spaceLg,
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: SIZES.md,
    fontWeight: FONTS.fontWeightBold,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
    marginTop: SIZES.spaceXs,
    textAlign: 'center',
  },
  tripCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    marginTop: SIZES.spaceMd,
    padding: SIZES.spaceMd,
  },
  tripTitle: { color: COLORS.textPrimary, fontSize: SIZES.md, fontWeight: FONTS.fontWeightBold },
  tripText: { color: COLORS.textSecondary, fontSize: SIZES.sm, marginTop: SIZES.spaceXs },
  status: { fontSize: SIZES.sm, fontWeight: FONTS.fontWeightBold, marginTop: SIZES.spaceSm },
  accepted: { color: COLORS.success },
  rejected: { color: COLORS.danger },
});
