import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import { COLORS, SIZES, FONTS } from '../../theme';
import { validatePlate } from '../../utils/Validators';

export default function StepVehicle({
  onBack,
  onNext,
  onVehicleTypeChange,
  initialValues = {},
}) {
  const [vehicleData, setVehicleData] = useState({
    brand: initialValues.brand || '',
    model: initialValues.model || '',
    year: initialValues.year || '',
    vehicleType: initialValues.vehicleType || 'car',
    plate: initialValues.plate || '',
    color: initialValues.color || '',
  });

  const [errors, setErrors] = useState({});

  const handleNext = () => {
    let newErrors = {};

    if (!vehicleData.brand.trim()) {
      newErrors.brand = 'La marca del vehículo es obligatoria';
    }

    if (!vehicleData.model.trim()) {
      newErrors.model = 'El modelo del vehículo es obligatorio';
    }

    if (!vehicleData.year.trim() || isNaN(vehicleData.year) || vehicleData.year.length !== 4) {
      newErrors.year = 'Ingrese un año válido (Ej: 2022)';
    }

    if (!validatePlate(vehicleData.plate, vehicleData.vehicleType)) {
      newErrors.plate = vehicleData.vehicleType === 'moto'
        ? 'Placa inválida (Formato requerido: ABC12D)'
        : 'Placa inválida (Formato requerido: ABC123)';
    }

    if (!vehicleData.color.trim()) {
      newErrors.color = 'El color del vehículo es obligatorio';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext(vehicleData);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleRow}>
        <Ionicons name="car-outline" size={26} color={COLORS.primaryDark} />
        <Text style={styles.title}>Información del Vehículo</Text>
      </View>
      <Text style={styles.subtitle}>Paso 2 de 3: Ingrese los datos de su automóvil o moto</Text>

      <View style={styles.pickerContainer}>
        <Ionicons name="options-outline" size={20} color={COLORS.textSecondary} />
        <Picker
          selectedValue={vehicleData.vehicleType}
          onValueChange={(vehicleType) => {
            setVehicleData({
              ...vehicleData,
              vehicleType,
              plate: '',
            });
            onVehicleTypeChange?.();
          }}
          style={styles.picker}
        >
          <Picker.Item label="Automóvil" value="car" />
          <Picker.Item label="Motocicleta" value="moto" />
          <Picker.Item label="Camioneta / SUV" value="suv" />
        </Picker>
      </View>

      <CustomInput
        placeholder="Marca (Ej: Chevrolet, Renault)"
        value={vehicleData.brand}
        onChangeText={(text) => setVehicleData({ ...vehicleData, brand: text })}
        error={errors.brand}
        autoCapitalize="words"
      />

      <CustomInput
        placeholder="Modelo / Línea (Ej: Logan, Spark)"
        value={vehicleData.model}
        onChangeText={(text) => setVehicleData({ ...vehicleData, model: text })}
        error={errors.model}
        autoCapitalize="words"
      />

      <CustomInput
        placeholder="Año (Ej: 2021)"
        value={vehicleData.year}
        onChangeText={(text) => setVehicleData({ ...vehicleData, year: text })}
        error={errors.year}
        keyboardType="numeric"
      />

      <CustomInput
        placeholder="Placa (Ej: ABC123)"
        value={vehicleData.plate}
        onChangeText={(text) => setVehicleData({
          ...vehicleData,
          plate: text.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6),
        })}
        error={errors.plate}
        autoCapitalize="characters"
        maxLength={6}
        icon="card-outline"
      />

      <CustomInput
        placeholder="Color del vehículo"
        value={vehicleData.color}
        onChangeText={(text) => setVehicleData({ ...vehicleData, color: text })}
        error={errors.color}
        autoCapitalize="words"
      />

      <View style={styles.buttonRow}>
        <View style={styles.buttonWrapper}>
          <CustomButton title="Atrás" onPress={onBack} type="secondary" />
        </View>
        <View style={styles.buttonWrapper}>
          <CustomButton title="Siguiente" onPress={handleNext} type="primary" />
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.spaceSm,
    marginBottom: SIZES.spaceXs,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
    paddingLeft: SIZES.spaceMd,
    marginBottom: SIZES.spaceMd,
  },
  picker: {
    flex: 1,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SIZES.spaceLg,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.spaceLg,
    gap: SIZES.spaceMd,
  },
  buttonWrapper: {
    flex: 1,
  },
});