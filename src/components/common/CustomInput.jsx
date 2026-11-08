import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../theme';

export default function CustomInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  autoCapitalize = 'none',
  icon,
  maxLength,
  ellipsizeMode = 'tail',
  numberOfLines = 1,
}) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        {icon && <Ionicons name={icon} size={20} color={COLORS.textSecondary} style={styles.inputIcon} />}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textSecondary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
          ellipsizeMode={ellipsizeMode}
          numberOfLines={numberOfLines}
        />
        {secureTextEntry && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            hitSlop={8}
            onPress={() => setIsVisible((current) => !current)}
            style={styles.visibilityButton}
          >
            <Text style={styles.visibilityIcon}>{isVisible ? '◉' : '◌'}</Text>
          </Pressable>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.spaceMd,
    width: '100%',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: SIZES.spaceMd,
    fontSize: SIZES.sm,
    color: COLORS.textPrimary,
  },
  inputIcon: {
    marginLeft: SIZES.spaceMd,
  },
  inputError: {
    borderColor: COLORS.borderError, // #C92A3E
  },
  visibilityButton: {
    paddingHorizontal: SIZES.spaceMd,
  },
  visibilityIcon: {
    color: COLORS.textSecondary,
    fontSize: SIZES.lg,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: SIZES.xs,
    marginTop: SIZES.spaceXs,
    marginLeft: 2,
  },
});