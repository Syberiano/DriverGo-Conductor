// src/theme/index.js

export const COLORS = {
  // Colores principales (Basados en la paleta Teal y acentos profesionales)
  primary: '#009688',          // Teal principal (botones principales, headers, elementos activos)
  primaryDark: '#00796B',      // Teal oscuro (títulos y textos de mayor jerarquía)
  accent: '#4DB6AC',           // Teal claro (bordes activos, interruptores, indicadores)
  secondary: '#1F2937',        // Gris oscuro corporativo

  // Colores de estado
  success: '#10B981',          // Verde (Ganancias, Disponible, Conductor Aprobado)
  warning: '#F59E0B',          // Amarillo/Naranja (Pendiente de aprobación, Advertencias)
  danger: '#C92A3E',           // Rojo Carmesí (Rechazar viaje, Errores, Cancelado, alertas críticas)
  info: '#3B82F6',             // Azul (Información, Navegación en curso)

  // Neutros y Fondos
  background: '#FFFFFF',       // Fondo principal de las pantallas
  backgroundTint: '#E0F2F1',   // Teal muy claro (fondos de tarjetas destacadas, contenedores sutiles)
  surface: '#F9FAFB',          // Fondo de tarjetas e inputs
  surfaceVariant: '#F3F4F6',   // Fondo secundario
  border: '#E5E7EB',           // Bordes de tarjetas e inputs
  borderError: '#C92A3E',      // Borde cuando hay error en validación

  // Textos
  textPrimary: '#111827',      // Texto principal (Casi negro)
  textSecondary: '#6B7280',    // Texto secundario / Placeholders
  textLight: '#9CA3AF',        // Texto deshabilitado o de menor jerarquía
  textOnPrimary: '#FFFFFF',    // Texto sobre botón o fondo principal oscuro/teñido
};

export const SIZES = {
  // Tamaños de Fuente
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  title: 28,

  // Espaciados (Margins & Paddings)
  spaceXs: 4,
  spaceSm: 8,
  spaceMd: 16,
  spaceLg: 24,
  spaceXl: 32,

  // Radio de Bordes (Border Radius)
  radiusSm: 6,
  radiusMd: 10,
  radiusLg: 16,
  radiusFull: 9999,
};

export const FONTS = {
  regular: 'System',           // Puedes cambiarlo si luego integran fuentes custom (ej: Inter, Roboto)
  medium: 'System',
  bold: 'System',
  fontWeightRegular: '400',
  fontWeightMedium: '600',
  fontWeightBold: '700',
};

export const SHADOWS = {
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};