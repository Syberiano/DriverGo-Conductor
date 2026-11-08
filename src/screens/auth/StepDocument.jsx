import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import DateInput from '../../components/common/DateInput';
import { COLORS, SIZES, FONTS } from '../../theme';
import { validateAlphanumeric, validateEmail } from '../../utils/Validators';

export default function StepDocument({ onBack, onSubmit, initialValues = {} }) {
  const [documents, setDocuments] = useState({
    licenseNumber: initialValues.licenseNumber || '',
    licenseExpiry: initialValues.licenseExpiry || '',
    soatExpiry: initialValues.soatExpiry || '',
    techReviewExpiry: initialValues.techReviewExpiry || '',
    mercadoPagoEmail: initialValues.mercadoPagoEmail || '',
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    let newErrors = {};
    if (!validateAlphanumeric(documents.licenseNumber)) {
      newErrors.licenseNumber = 'La licencia solo permite letras y números';
    }
    if (!documents.licenseExpiry.trim()) newErrors.licenseExpiry = 'Fecha de vencimiento obligatoria';
    if (!documents.soatExpiry.trim()) newErrors.soatExpiry = 'Fecha de SOAT obligatoria';
    if (!validateEmail(documents.mercadoPagoEmail)) newErrors.mercadoPagoEmail = 'Correo de Mercado Pago inválido';
    if (!documents.termsAccepted) newErrors.termsAccepted = 'Debe aceptar los términos y condiciones';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(documents);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleRow}>
        <Ionicons name="document-text-outline" size={26} color={COLORS.primaryDark} />
        <Text style={styles.title}>Documentos y Pagos</Text>
      </View>
      <Text style={styles.subtitle}>Ningún dato bancario sensible se almacena en la app.</Text>

      <CustomInput
        placeholder="Número de Licencia de Conducción"
        value={documents.licenseNumber}
        onChangeText={(text) => setDocuments({
          ...documents,
          licenseNumber: text.replace(/[^a-zA-Z0-9]/g, '').toUpperCase(),
        })}
        error={errors.licenseNumber}
        autoCapitalize="characters"
        icon="id-card-outline"
        ellipsizeMode="tail"
      />

      <DateInput
        placeholder="Vencimiento Licencia (AAAA-MM-DD)"
        value={documents.licenseExpiry}
        onChangeText={(text) => setDocuments({ ...documents, licenseExpiry: text })}
        error={errors.licenseExpiry}
        minimumDate={new Date()}
        icon="calendar-outline"
      />

      <DateInput
        placeholder="Vencimiento SOAT (AAAA-MM-DD)"
        value={documents.soatExpiry}
        onChangeText={(text) => setDocuments({ ...documents, soatExpiry: text })}
        error={errors.soatExpiry}
        minimumDate={new Date()}
      />

      <DateInput
        placeholder="Vencimiento Tecno-mecánica (Si aplica)"
        value={documents.techReviewExpiry}
        onChangeText={(text) => setDocuments({ ...documents, techReviewExpiry: text })}
        minimumDate={new Date(2000, 0, 1)}
        icon="construct-outline"
      />

      <CustomInput
        placeholder="Correo de Mercado Pago para pagos"
        keyboardType="email-address"
        value={documents.mercadoPagoEmail}
        onChangeText={(text) => setDocuments({ ...documents, mercadoPagoEmail: text })}
        error={errors.mercadoPagoEmail}
      />

      <View style={styles.termsContainer}>
        <Switch
          value={documents.termsAccepted}
          onValueChange={(val) => setDocuments({ ...documents, termsAccepted: val })}
          trackColor={{ false: COLORS.border, true: COLORS.primary }}
        />
        <Text style={styles.termsText}>
          Acepto los términos y condiciones. Entiendo que la plataforma aplica una comisión del 20% sobre los viajes.
        </Text>
      </View>
      {errors.termsAccepted && <Text style={styles.errorText}>{errors.termsAccepted}</Text>}

      <View style={styles.buttonRow}>
        <View style={styles.buttonWrapper}>
          <CustomButton title="Atrás" onPress={() => onBack(documents)} type="secondary" />
        </View>
        <View style={styles.buttonWrapper}>
          <CustomButton title="Enviar" onPress={handleSubmit} type="primary" />
        </View>
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
  subtitle: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SIZES.spaceMd,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.spaceMd,
    gap: SIZES.spaceSm,
  },
  termsText: {
    flex: 1,
    fontSize: SIZES.sm,
    color: COLORS.textPrimary,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: SIZES.xs,
    marginTop: SIZES.spaceXs,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.spaceXl,
    gap: SIZES.spaceMd,
  },
  buttonWrapper: {
    flex: 1,
  },
});