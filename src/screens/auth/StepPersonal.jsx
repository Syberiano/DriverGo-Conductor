import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import DateInput from '../../components/common/DateInput';
import { COLORS, SIZES, FONTS } from '../../theme';
import { validateEmail, validatePhone, validateDocument, validateAge } from '../../utils/Validators';

export default function StepPersonal({ onNext, initialValues = {} }) {
  const [formData, setFormData] = useState({
    fullName: initialValues.fullName || '',
    email: initialValues.email || '',
    phone: initialValues.phone || '',
    documentNumber: initialValues.documentNumber || '',
    birthDate: initialValues.birthDate || '',
  });

  const [errors, setErrors] = useState({});

  const handleNext = () => {
    let newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es obligatorio';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Ingrese un correo electrónico válido';
    }

    if (!validatePhone(formData.phone)) {
      newErrors.phone = 'El teléfono debe tener 10 dígitos numéricos';
    }

    if (!validateDocument(formData.documentNumber)) {
      newErrors.documentNumber = 'El documento debe tener entre 6 y 10 dígitos';
    }

    if (!validateAge(formData.birthDate)) {
      newErrors.birthDate = 'Debe ser mayor de 18 años (Formato: AAAA-MM-DD)';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext(formData);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleRow}>
        <Ionicons name="person-circle-outline" size={26} color={COLORS.primaryDark} />
        <Text style={styles.title}>Información Personal</Text>
      </View>
      <Text style={styles.subtitle}>Paso 1 de 3: Ingrese sus datos para el registro de conductor</Text>

      <CustomInput
        placeholder="Nombre completo"
        value={formData.fullName}
        onChangeText={(text) => setFormData({ ...formData, fullName: text })}
        error={errors.fullName}
        autoCapitalize="words"
      />

      <CustomInput
        placeholder="Correo electrónico"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        error={errors.email}
        keyboardType="email-address"
      />

      <CustomInput
        placeholder="Número de celular (10 dígitos)"
        value={formData.phone}
        onChangeText={(text) => setFormData({
          ...formData,
          phone: text.replace(/[^0-9]/g, '').slice(0, 10),
        })}
        error={errors.phone}
        keyboardType="number-pad"
        maxLength={10}
        icon="call-outline"
      />

      <CustomInput
        placeholder="Número de documento de identidad"
        value={formData.documentNumber}
        onChangeText={(text) => setFormData({
          ...formData,
          documentNumber: text.replace(/[^0-9]/g, ''),
        })}
        error={errors.documentNumber}
        keyboardType="number-pad"
        maxLength={20}
      />

      <DateInput
        placeholder="Fecha de nacimiento (AAAA-MM-DD)"
        value={formData.birthDate}
        onChangeText={(text) => setFormData({ ...formData, birthDate: text })}
        error={errors.birthDate}
        maximumDate={new Date()}
      />

      <View style={styles.buttonContainer}>
        <CustomButton title="Siguiente" onPress={handleNext} type="primary" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SIZES.spaceLg,
    backgroundColor: COLORS.background,
    flexGrow: 1,
  },
  title: {
    fontSize: SIZES.xl,
    fontWeight: FONTS.fontWeightBold,
    color: COLORS.primaryDark,
    marginBottom: SIZES.spaceXs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.spaceSm,
    marginBottom: SIZES.spaceXs,
  },
  subtitle: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SIZES.spaceLg,
  },
  buttonContainer: {
    marginTop: SIZES.spaceLg,
  },
});