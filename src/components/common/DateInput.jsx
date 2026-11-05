import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS, SIZES } from '../../theme';

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseDate = (value) => {
  if (!value) return new Date();
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return new Date();
  return new Date(year, month - 1, day);
};

export default function DateInput({
  placeholder,
  value,
  onChangeText,
  error,
  maximumDate,
  minimumDate,
}) {
  const [open, setOpen] = useState(false);

  const handleChange = (event, date) => {
    if (Platform.OS === 'android') setOpen(false);
    if (date) onChangeText(formatDate(date));
  };

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        onPress={() => setOpen(true)}
        style={[styles.input, error && styles.inputError]}
      >
        <Text style={value ? styles.value : styles.placeholder}>
          {value || placeholder}
        </Text>
      </Pressable>
      {open && (
        <DateTimePicker
          value={parseDate(value)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          onChange={handleChange}
        />
      )}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.spaceMd,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    padding: SIZES.spaceMd,
    borderRadius: SIZES.radiusMd,
  },
  inputError: {
    borderColor: COLORS.borderError,
  },
  value: {
    color: COLORS.textPrimary,
    fontSize: SIZES.md,
  },
  placeholder: {
    color: COLORS.textSecondary,
    fontSize: SIZES.md,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: SIZES.xs,
    marginTop: SIZES.spaceXs,
    marginLeft: 2,
  },
});
