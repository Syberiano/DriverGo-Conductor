import React, { useContext, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import { auth, db } from '../config/firebase';
import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import DriverMap from '../components/maps/DriverMap';
import TripRequestCard from '../components/common/TripRequestCard';
import { COLORS, FONTS, SIZES } from '../theme';

export default function RequestsScreen() {
  const { driverData } = useContext(AuthContext);
  const [savingAction, setSavingAction] = useState(false);
  const [isOnline, setIsOnline] = useState(driverData?.isOnline === true);
  const [activeTrip, setActiveTrip] = useState(null);
  const isApproved = driverData?.status === 'approved';

  useEffect(() => {
    setIsOnline(driverData?.isOnline === true);
  }, [driverData?.isOnline]);

  useEffect(() => {
    if (!isApproved || !isOnline || !auth.currentUser) {
      setActiveTrip(null);
      return undefined;
    }

    const requestsQuery = query(
      collection(db, 'trips'),
      where('targetDriverId', '==', auth.currentUser.uid),
      where('status', '==', 'pending')
    );

    return onSnapshot(
      requestsQuery,
      (snapshot) => {
        const nextRequest = snapshot.docs[0];
        setActiveTrip(nextRequest
          ? { id: nextRequest.id, ...nextRequest.data() }
          : null);
      },
      (error) => {
        console.error('Error al escuchar solicitudes de viaje:', error);
        const message = error.code === 'failed-precondition'
          ? 'Falta un índice de Firestore. Publica firestore.indexes.json y vuelve a intentar.'
          : error.code === 'permission-denied'
            ? 'Firebase no permite consultar estas solicitudes. Revisa las reglas de Firestore.'
            : 'No se pudieron cargar las solicitudes. Revisa tu conexión e inténtalo de nuevo.';
        Alert.alert('Error de solicitudes', message);
      }
    );
  }, [isApproved, isOnline]);

  const handleOnlineChange = async (value) => {
    if (!auth.currentUser) return;

    setIsOnline(value);
    try {
      await updateDoc(doc(db, 'drivers', auth.currentUser.uid), {
        isOnline: value,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error al actualizar disponibilidad:', error);
      setIsOnline(!value);
      Alert.alert('Error', 'No se pudo actualizar tu disponibilidad.');
    }
  };

  const saveTripAction = async (status) => {
    if (!auth.currentUser || !activeTrip || savingAction) {
      return;
    }

    try {
      setSavingAction(true);
      await updateDoc(doc(db, 'trips', activeTrip.id), {
        driverId: auth.currentUser.uid,
        status,
        actionAt: serverTimestamp(),
      });
      Alert.alert(
        status === 'accepted' ? 'Viaje aceptado' : 'Solicitud rechazada',
        status === 'accepted'
          ? `Te diriges a recoger a ${activeTrip.passengerName}.`
          : 'La solicitud se guardó en tu historial.'
      );
    } catch (error) {
      console.error(`Error al guardar la solicitud como ${status}:`, error);
      Alert.alert(
        'Error',
        `No se pudo guardar la solicitud. ${error.code || 'Revisa tu conexión.'}`
      );
    } finally {
      setSavingAction(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Solicitudes</Text>
        {!isApproved ? (
          <View style={styles.notice}>
            <Text style={styles.noticeTitle}>Cuenta pendiente</Text>
            <Text style={styles.noticeText}>
              Las solicitudes aparecerán cuando el administrador apruebe tu registro.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.statusRow}>
              <View>
                <Text style={styles.statusTitle}>Recibir solicitudes</Text>
                <Text style={styles.statusText}>{isOnline ? 'En línea' : 'Desconectado'}</Text>
              </View>
              <Switch
                value={isOnline}
                onValueChange={handleOnlineChange}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={isOnline ? COLORS.primaryDark : '#f4f3f4'}
              />
            </View>
            <DriverMap />
            {isOnline && activeTrip ? (
              <View style={styles.requestSection}>
                <Text style={styles.sectionTitle}>Nueva solicitud</Text>
                <TripRequestCard
                  trip={activeTrip}
                  onAccept={() => saveTripAction('accepted')}
                  onReject={() => saveTripAction('rejected')}
                  disabled={savingAction}
                />
              </View>
            ) : (
              <View style={styles.notice}>
                <Text style={styles.noticeTitle}>
                  {isOnline ? 'Buscando viajes...' : 'Estás desconectado'}
                </Text>
                <Text style={styles.noticeText}>
                  {isOnline
                    ? 'Te avisaremos cuando haya una solicitud cercana.'
                    : 'Activa el interruptor para recibir solicitudes.'}
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SIZES.spaceMd, flexGrow: 1 },
  title: {
    color: COLORS.primaryDark,
    fontSize: SIZES.xl,
    fontWeight: FONTS.fontWeightBold,
    marginBottom: SIZES.spaceMd,
  },
  statusRow: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.spaceMd,
    padding: SIZES.spaceMd,
  },
  statusTitle: { color: COLORS.textPrimary, fontSize: SIZES.md, fontWeight: FONTS.fontWeightBold },
  statusText: { color: COLORS.textSecondary, fontSize: SIZES.sm, marginTop: SIZES.spaceXs },
  requestSection: { marginTop: SIZES.spaceLg },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: SIZES.md,
    fontWeight: FONTS.fontWeightBold,
    marginBottom: SIZES.spaceSm,
  },
  notice: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    marginTop: SIZES.spaceMd,
    padding: SIZES.spaceLg,
  },
  noticeTitle: { color: COLORS.primaryDark, fontSize: SIZES.md, fontWeight: FONTS.fontWeightBold },
  noticeText: { color: COLORS.textSecondary, fontSize: SIZES.sm, marginTop: SIZES.spaceSm, textAlign: 'center' },
});
