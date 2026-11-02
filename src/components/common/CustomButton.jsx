import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SIZES, FONTS } from '../../theme';

export default function CustomButton({ title, onPress, type = 'primary', loading = false, disabled = false }) {
  const isPrimary = type === 'primary';
  const isDanger = type === 'danger';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPrimary && styles.primaryButton,
        isDanger && styles.dangerButton,
        !isPrimary && !isDanger && styles.secondaryButton,
        (disabled || loading) && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary || isDanger ? COLORS.textOnPrimary : COLORS.textPrimary} />
      ) : (
        <Text
          style={[
            styles.text,
            (isPrimary || isDanger) ? styles.textLightColor : styles.textDarkColor,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: SIZES.spaceMd - 2,
    paddingHorizontal: SIZES.spaceLg,
    borderRadius: SIZES.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SIZES.spaceSm / 2,
  },
  primaryButton: {
    backgroundColor: COLORS.primary, // #009688
  },
  dangerButton: {
    backgroundColor: COLORS.danger, // #C92A3E
  },
  secondaryButton: {
    backgroundColor: COLORS.surfaceVariant,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  disabledButton: {
    opacity: 0.5,
  },
  text: {
    fontSize: SIZES.md,
    fontWeight: FONTS.fontWeightMedium,
  },
  textLightColor: {
    color: COLORS.textOnPrimary,
  },
  textDarkColor: {
    color: COLORS.textPrimary,
  },
});