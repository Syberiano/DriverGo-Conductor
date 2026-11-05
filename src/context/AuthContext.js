import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export const AuthContext = createContext();

export const ADMIN_EMAIL = 'useradmin@drivergo.com';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [driverData, setDriverData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeDriver = () => {};
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      unsubscribeDriver();
      if (firebaseUser) {
        setUser(firebaseUser);
        if (firebaseUser.email?.trim().toLowerCase() === ADMIN_EMAIL) {
          setDriverData(null);
        } else {
          unsubscribeDriver = onSnapshot(
            doc(db, 'drivers', firebaseUser.uid),
            (snapshot) => setDriverData(snapshot.exists() ? snapshot.data() : null),
            (error) => {
              console.error('Error al escuchar datos del conductor:', error);
              setDriverData(null);
            }
          );
        }
      } else {
        setUser(null);
        setDriverData(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribeDriver();
      unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setDriverData(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const isAdmin = user?.email?.trim().toLowerCase() === ADMIN_EMAIL;

  return (
    <AuthContext.Provider value={{ user, driverData, loading, isAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}