import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../theme';

export default function CustomInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  autoCapitalize = 'none',
}) {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textSecondary}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
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
    fontSize: SIZES.md,
    color: COLORS.textPrimary,
  },
  inputError: {
    borderColor: COLORS.borderError, // #C92A3E
  },
  errorText: {
    color: COLORS.danger,
    fontSize: SIZES.xs,
    marginTop: SIZES.spaceXs,
    marginLeft: 2,
  },
});