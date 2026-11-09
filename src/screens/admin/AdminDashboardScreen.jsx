import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { COLORS, SIZES, FONTS } from '../../theme';

const getTimestamp = (value) => value?.toDate?.() || null;

const formatDate = (value) => {
  const date = getTimestamp(value);
  return date ? date.toLocaleDateString('es-CO') : 'Sin fecha';
};

export default function AdminDashboardScreen() {
  const [metrics, setMetrics] = useState({
    activeDrivers: 0,
    pendingDrivers: 0,
    approvedDrivers: 0,
    pendingRequests: 0,
    completedRequests: 0,
    recentApprovals: [],
    recentRequests: [],
  });
  const [loading, setLoading] = useState(false);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [driversSnapshot, tripsSnapshot] = await Promise.all([
        getDocs(collection(db, 'drivers')),
        getDocs(collection(db, 'trips')),
      ]);

      const drivers = driversSnapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));
      const trips = tripsSnapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));
      const approvals = drivers
        .filter((driver) => driver.status === 'approved' && driver.approvedAt)
        .sort((left, right) => (
          (getTimestamp(right.approvedAt)?.getTime() || 0)
          - (getTimestamp(left.approvedAt)?.getTime() || 0)
        ));
      const recentTrips = trips
        .filter((trip) => trip.actionAt || trip.createdAt)
        .sort((left, right) => (
          (getTimestamp(right.actionAt || right.createdAt)?.getTime() || 0)
          - (getTimestamp(left.actionAt || left.createdAt)?.getTime() || 0)
        ));

      setMetrics({
        activeDrivers: drivers.filter(
          (driver) => driver.status === 'approved' && driver.isOnline === true
        ).length,
        pendingDrivers: drivers.filter((driver) => driver.status === 'pending').length,
        approvedDrivers: drivers.filter((driver) => driver.status === 'approved').length,
        pendingRequests: trips.filter((trip) => trip.status === 'pending').length,
        completedRequests: trips.filter((trip) => trip.status === 'completed').length,
        recentApprovals: approvals.slice(0, 5),
        recentRequests: recentTrips.slice(0, 5),
      });
    } catch (error) {
      console.error('Error al cargar métricas administrativas:', error);
      Alert.alert('Error', 'No se pudieron cargar las métricas del panel.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => {
    loadDashboard();
  }, [loadDashboard]));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadDashboard} />}
      >
        <Text style={styles.title}>Panel de administración</Text>
        <Text style={styles.subtitle}>Resumen operativo de DriverGo.</Text>

        <View style={styles.metricsGrid}>
          <MetricCard label="Conductores activos" value={metrics.activeDrivers} color={COLORS.success} />
          <MetricCard label="Pendientes" value={metrics.pendingDrivers} color={COLORS.warning} />
          <MetricCard label="Aprobados" value={metrics.approvedDrivers} color={COLORS.primary} />
          <MetricCard label="Solicitudes pendientes" value={metrics.pendingRequests} color={COLORS.info} />
        </View>

        <Section title="Historial de aprobaciones">
          {metrics.recentApprovals.length === 0 ? (
            <EmptyText text="No hay aprobaciones registradas." />
          ) : metrics.recentApprovals.map((driver) => (
            <View style={styles.historyRow} key={driver.id}>
              <View style={styles.historyContent}>
                <Text style={styles.historyTitle}>{driver.fullName || 'Conductor sin nombre'}</Text>
                <Text style={styles.historyDetail}>{driver.email || 'Sin correo'}</Text>
              </View>
              <Text style={styles.historyDate}>{formatDate(driver.approvedAt)}</Text>
            </View>
          ))}
        </Section>

        <Section title="Historial de solicitudes">
          {metrics.recentRequests.length === 0 ? (
            <EmptyText text="No hay solicitudes registradas." />
          ) : metrics.recentRequests.map((trip) => (
            <View style={styles.historyRow} key={trip.id}>
              <View style={styles.historyContent}>
                <Text style={styles.historyTitle}>
                  {trip.origin?.address || 'Origen no disponible'}
                </Text>
                <Text style={styles.historyDetail}>
                  {trip.destination?.address || 'Destino no disponible'}
                </Text>
              </View>
              <Text style={styles.status}>{trip.status || 'Sin estado'}</Text>
            </View>
          ))}
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

function MetricCard({ label, value, color }) {
  return (
    <View style={styles.metricCard}>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

function EmptyText({ text }) {
  return <Text style={styles.emptyText}>{text}</Text>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SIZES.spaceLg,
    paddingBottom: SIZES.spaceXl,
  },
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
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.spaceSm,
    marginTop: SIZES.spaceLg,
  },
  metricCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    flexBasis: '48%',
    flexGrow: 1,
    minHeight: 100,
    justifyContent: 'center',
    padding: SIZES.spaceMd,
  },
  metricValue: {
    fontSize: SIZES.xxl,
    fontWeight: FONTS.fontWeightBold,
  },
  metricLabel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.xs,
    marginTop: SIZES.spaceXs,
  },
  section: {
    marginTop: SIZES.spaceLg,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: SIZES.md,
    fontWeight: FONTS.fontWeightBold,
    marginBottom: SIZES.spaceSm,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    padding: SIZES.spaceMd,
  },
  historyRow: {
    alignItems: 'center',
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.spaceSm,
  },
  historyContent: {
    flex: 1,
    marginRight: SIZES.spaceSm,
  },
  historyTitle: {
    color: COLORS.textPrimary,
    fontSize: SIZES.sm,
    fontWeight: FONTS.fontWeightMedium,
  },
  historyDetail: {
    color: COLORS.textSecondary,
    fontSize: SIZES.xs,
    marginTop: SIZES.spaceXs,
  },
  historyDate: {
    color: COLORS.textSecondary,
    fontSize: SIZES.xs,
  },
  status: {
    color: COLORS.primaryDark,
    fontSize: SIZES.xs,
    fontWeight: FONTS.fontWeightBold,
    textTransform: 'capitalize',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
    paddingVertical: SIZES.spaceSm,
  },
});
