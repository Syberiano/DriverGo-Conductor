import React, { useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import { auth, db } from '../config/fireBase';

import StepPersonal from './auth/StepPersonal';
import StepVehicle from './auth/StepVehicle';
import StepDocument from './auth/StepDocument';
import { COLORS } from '../theme';

export default function RegisterScreen({ navigation }) {
  const [currentStep, setCurrentStep] = useState(1);
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
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        finalData.email, 
        'DriverGo2026*'
      );
      const user = userCredential.user;

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
        createdAt: new Date().toISOString(),
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
      console.error('Error al registrar conductor en Firebase:', error);
      let errorMessage = 'Ocurrió un error al procesar tu registro.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'El correo electrónico ingresado ya se encuentra registrado.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El formato del correo electrónico no es válido.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
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
  );
}