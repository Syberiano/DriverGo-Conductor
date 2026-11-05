import React, { useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

import { auth, db } from '../config/firebase';

import StepPersonal from './auth/StepPersonal';
import StepVehicle from './auth/StepVehicle';
import StepDocument from './auth/StepDocument';
import { COLORS } from '../theme';

export default function RegisterScreen({ navigation, route }) {
  const vehicleOnly = route?.params?.vehicleOnly === true;
  const [currentStep, setCurrentStep] = useState(vehicleOnly ? 2 : 1);
  const [loading, setLoading] = useState(false);

  const [registrationData, setRegistrationData] = useState({
    fullName: '',
    email: '',
    phone: '',
    documentNumber: '',
    birthDate: '',
    
    brand: '',
    model: '',
    year: '',
    plate: '',
    color: '',
    
    licenseNumber: '',
    licenseExpiry: '',
    soatExpiry: '',
    techReviewExpiry: '',
    mercadoPagoEmail: '',
    termsAccepted: false,
  });

  const handlePersonalNext = (personalValues) => {
    setRegistrationData((prev) => ({ ...prev, ...personalValues }));
    setCurrentStep(2);
  };

  const handleVehicleNext = (vehicleValues) => {
    setRegistrationData((prev) => ({ ...prev, ...vehicleValues }));
    setCurrentStep(3);
  };

  const handleVehicleBack = () => {
    setCurrentStep(1);
  };

  const handleDocumentBack = () => {
    setCurrentStep(2);
  };

  const handleFinalSubmit = async (documentValues) => {
    const finalData = { ...registrationData, ...documentValues };
    let createdUser = null;
    setLoading(true);

    try {
      if (vehicleOnly) {
        if (!auth.currentUser) {
          throw new Error('No hay una sesión autenticada para completar el registro.');
        }
        await updateDoc(doc(db, 'drivers', auth.currentUser.uid), {
          vehicle: {
            brand: finalData.brand,
            model: finalData.model,
            year: finalData.year,
            plate: finalData.plate,
            color: finalData.color,
          },
          documents: {
            licenseNumber: finalData.licenseNumber,
            licenseExpiry: finalData.licenseExpiry,
            soatExpiry: finalData.soatExpiry,
            techReviewExpiry: finalData.techReviewExpiry || 'N/A',
            mercadoPagoEmail: finalData.mercadoPagoEmail,
          },
          updatedAt: serverTimestamp(),
        });
        Alert.alert('Registro completado', 'La información de tu vehículo fue guardada correctamente.', [
          { text: 'Entendido', onPress: () => navigation.goBack() },
        ]);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        finalData.email,
        'DriverGo2026*'
      );
      const user = userCredential.user;
      createdUser = user;

      await setDoc(doc(db, 'drivers', user.uid), {
        uid: user.uid,
        fullName: finalData.fullName,
        email: finalData.email,
        phone: finalData.phone,
        documentNumber: finalData.documentNumber,
        birthDate: finalData.birthDate,
        vehicle: {
          brand: finalData.brand,
          model: finalData.model,
          year: finalData.year,
          plate: finalData.plate,
          color: finalData.color,
        },
        documents: {
          licenseNumber: finalData.licenseNumber,
          licenseExpiry: finalData.licenseExpiry,
          soatExpiry: finalData.soatExpiry,
          techReviewExpiry: finalData.techReviewExpiry || 'N/A',
          mercadoPagoEmail: finalData.mercadoPagoEmail,
        },
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      Alert.alert(
        '¡Registro Exitoso!',
        'Tus datos han sido registrados correctamente. Tu cuenta se encuentra en estado pendiente de aprobación.',
        [
          {
            text: 'Entendido',
            onPress: () => {
              if (navigation && navigation.navigate) {
                navigation.navigate('Login');
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error al registrar conductor:', error);
      if (createdUser) {
        try {
          await deleteUser(createdUser);
        } catch (rollbackError) {
          console.error('No se pudo revertir la cuenta de Auth:', rollbackError);
        }
      }

      let errorMessage = 'Ocurrió un error al procesar tu registro.';

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'El correo electrónico ingresado ya se encuentra registrado.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El formato del correo electrónico no es válido.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      } else if (error.code === 'auth/invalid-api-key') {
        errorMessage = 'La configuración de Firebase contiene una API key inválida.';
      } else if (error.code === 'permission-denied') {
        errorMessage = 'Firebase rechazó el guardado. Revisa las reglas de Firestore.';
      } else if (error.code === 'unavailable') {
        errorMessage = 'No se pudo conectar con Firebase. Revisa tu conexión a internet.';
      } else if (error.code === 'failed-precondition') {
        errorMessage = 'Firestore no está habilitado o requiere una configuración adicional.';
      }

      Alert.alert('Error en el Registro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.container}>
      {currentStep === 1 && (
        <StepPersonal
          onNext={handlePersonalNext}
          initialValues={registrationData}
        />
      )}

      {currentStep === 2 && (
        <StepVehicle
          onBack={handleVehicleBack}
          onNext={handleVehicleNext}
          initialValues={registrationData}
        />
      )}

      {currentStep === 3 && (
        <StepDocument
          onBack={handleDocumentBack}
          onSubmit={handleFinalSubmit}
        />
      )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});