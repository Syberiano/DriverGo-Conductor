import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import CustomInput from '../components/common/CustomInput';
import CustomButton from '../components/common/CustomButton';
import { COLORS, SIZES, FONTS } from '../theme';
import { validateEmail } from '../utils/Validators';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    let newErrors = {};

    if (!validateEmail(normalizedEmail)) {
      newErrors.email = 'Ingrese un correo electrónico válido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        await signInWithEmailAndPassword(auth, normalizedEmail, password);
      } catch (error) {
        let errorMessage = 'Ocurrió un error al iniciar sesión.';
        if (error.code === 'auth/user-not-found') {
          errorMessage = 'Este correo no existe en Firebase Authentication.';
        } else if (
          error.code === 'auth/wrong-password' ||
          error.code === 'auth/invalid-credential'
        ) {
          errorMessage = 'La contraseña no es correcta.';
        } else if (error.code === 'auth/operation-not-allowed') {
          errorMessage = 'El acceso por correo está deshabilitado en Firebase.';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'El correo electrónico no es válido.';
        } else if (error.code === 'auth/network-request-failed') {
          errorMessage = 'No hay conexión con Firebase. Revisa internet y vuelve a intentar.';
        }
        Alert.alert('Error de Autenticación', errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>DriverGo</Text>
          <Text style={styles.subtitle}>Iniciar sesión como Conductor</Text>
        </View>

        <View style={styles.formContainer}>
          <CustomInput
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            keyboardType="email-address"
          />

          <CustomInput
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            secureTextEntry
          />

          <CustomButton
            title="Iniciar Sesión"
            onPress={handleLogin}
            type="primary"
            loading={loading}
          />

          <TouchableOpacity
            style={styles.resetButton}
            onPress={async () => {
              const normalizedEmail = email.trim().toLowerCase();
              if (!validateEmail(normalizedEmail)) {
                Alert.alert('Correo requerido', 'Escribe un correo válido para recuperar la contraseña.');
                return;
              }
              try {
                await sendPasswordResetEmail(auth, normalizedEmail);
                Alert.alert('Correo enviado', 'Revisa tu correo para cambiar la contraseña.');
              } catch (error) {
                console.error('Error al enviar recuperación de contraseña:', error);
                Alert.alert(
                  'No se pudo enviar',
                  error.code === 'auth/user-not-found'
                    ? 'Este correo no existe en Firebase Authentication.'
                    : 'No se pudo enviar el correo de recuperación.'
                );
              }
            }}
          >
            <Text style={styles.resetLink}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>¿No tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => navigation && navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Regístrate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flexGrow: 1,
    padding: SIZES.spaceLg,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: SIZES.spaceXl,
  },
  title: {
    fontSize: SIZES.xxl || 32,
    fontWeight: FONTS.fontWeightBold,
    color: COLORS.primaryDark,
    marginBottom: SIZES.spaceXs,
  },
  subtitle: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
  },
  formContainer: {
    width: '100%',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.spaceLg,
  },
  resetButton: {
    alignItems: 'center',
    marginTop: SIZES.spaceSm,
  },
  resetLink: {
    color: COLORS.primaryDark,
    fontSize: SIZES.sm,
    textDecorationLine: 'underline',
  },
  registerText: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  registerLink: {
    fontSize: SIZES.sm,
    fontWeight: FONTS.fontWeightBold,
    color: COLORS.primary,
  },
});