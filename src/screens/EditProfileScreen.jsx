import React, { useContext, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import CustomButton from '../components/common/CustomButton';
import CustomInput from '../components/common/CustomInput';
import { AuthContext } from '../context/AuthContext';
import { auth, db } from '../config/firebase';
import { COLORS, FONTS, SIZES } from '../theme';

export default function EditProfileScreen({ navigation }) {
  const { driverData } = useContext(AuthContext);
  const [form, setForm] = useState({
    fullName: driverData?.fullName || '',
    phone: driverData?.phone || '',
    brand: driverData?.vehicle?.brand || '',
    model: driverData?.vehicle?.model || '',
    year: driverData?.vehicle?.year || '',
    plate: driverData?.vehicle?.plate || '',
    color: driverData?.vehicle?.color || '',
  });
  const [loading, setLoading] = useState(false);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const saveChanges = async () => {
    if (!form.fullName.trim() || !form.brand.trim() || !form.model.trim() || !form.plate.trim()) {
      Alert.alert('Datos incompletos', 'Completa tu nombre, marca, modelo y placa.');
      return;
    }

    try {
      setLoading(true);
      await updateDoc(doc(db, 'drivers', auth.currentUser.uid), {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        vehicle: {
          brand: form.brand.trim(),
          model: form.model.trim(),
          year: form.year.trim(),
          plate: form.plate.trim().toUpperCase(),
          color: form.color.trim(),
        },
        status: 'pending',
        changeRequest: 'profile_and_vehicle',
        updatedAt: serverTimestamp(),
      });
      Alert.alert(
        'Cambios enviados',
        'Tus cambios quedaron pendientes de aprobación.',
        [{ text: 'Entendido', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      Alert.alert('Error', 'No se pudieron guardar los cambios.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Editar datos</Text>
        <Text style={styles.subtitle}>
          Al guardar, el administrador debe aprobar nuevamente los cambios.
        </Text>
        <Text style={styles.sectionTitle}>Información personal</Text>
        <View style={styles.card}>
          <CustomInput placeholder="Nombre completo" value={form.fullName} onChangeText={(value) => update('fullName', value)} />
          <CustomInput placeholder="Teléfono" value={form.phone} onChangeText={(value) => update('phone', value)} keyboardType="phone-pad" />
        </View>
        <Text style={styles.sectionTitle}>Vehículo</Text>
        <View style={styles.card}>
          <CustomInput placeholder="Marca" value={form.brand} onChangeText={(value) => update('brand', value)} />
          <CustomInput placeholder="Modelo" value={form.model} onChangeText={(value) => update('model', value)} />
          <CustomInput placeholder="Año" value={form.year} onChangeText={(value) => update('year', value)} keyboardType="numeric" />
          <CustomInput placeholder="Placa" value={form.plate} onChangeText={(value) => update('plate', value)} autoCapitalize="characters" />
          <CustomInput placeholder="Color" value={form.color} onChangeText={(value) => update('color', value)} />
        </View>
        <CustomButton title="Enviar cambios" onPress={saveChanges} loading={loading} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SIZES.spaceMd, flexGrow: 1 },
  title: { color: COLORS.primaryDark, fontSize: SIZES.xl, fontWeight: FONTS.fontWeightBold },
  subtitle: { color: COLORS.textSecondary, fontSize: SIZES.sm, marginBottom: SIZES.spaceLg, marginTop: SIZES.spaceXs },
  sectionTitle: { color: COLORS.textPrimary, fontSize: SIZES.md, fontWeight: FONTS.fontWeightBold, marginBottom: SIZES.spaceSm, marginTop: SIZES.spaceMd },
  card: { backgroundColor: COLORS.surface, borderColor: COLORS.border, borderRadius: SIZES.radiusMd, borderWidth: 1, padding: SIZES.spaceMd },
});
