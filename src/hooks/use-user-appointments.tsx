'use client';

import { useMemo } from 'react';
import { collection, query, where, DocumentData } from 'firebase/firestore';
import { useCollection, WithId } from '@/firebase/firestore/use-collection';
import { useFirebase } from '@/firebase/provider';
import { useAuth } from '@/firebase/provider'; // Assuming you have an auth provider

// Assuming Appointment has this structure
interface Appointment {
  patientId: string;
  professionalId: string;
  // ... other appointment fields
}

/**
 * A hook to fetch appointments where the current user is either the patient or the professional.
 *
 * This hook performs two separate queries to Firestore and merges the results.
 * This is necessary to comply with Firestore security rules that do not allow
 * 'OR' queries on different fields for security reasons.
 */
export function useUserAppointments() {
  const { db } = useFirebase();
  const { user } = useAuth();
  const uid = user?.uid;

  // Query for appointments where the user is the patient
  const patientQuery = useMemo(() => {
    if (!uid) return null;
    return query(collection(db, 'appointments'), where('patientId', '==', uid));
  }, [db, uid]);

  // Query for appointments where the user is the professional
  const professionalQuery = useMemo(() => {
    if (!uid) return null;
    return query(collection(db, 'appointments'), where('professionalId', '==', uid));
  }, [db, uid]);

  // Use the generic useCollection hook for each query
  const { data: patientAppointments, isLoading: patientLoading, error: patientError } = useCollection<Appointment>(patientQuery);
  const { data: professionalAppointments, isLoading: professionalLoading, error: professionalError } = useCollection<Appointment>(professionalQuery);

  // Memoize the merged data to prevent re-renders
  const mergedData = useMemo(() => {
    if (!patientAppointments && !professionalAppointments) return null;

    const appointmentsMap = new Map<string, WithId<Appointment>>();

    // Add appointments where user is a patient
    (patientAppointments || []).forEach(appt => {
      appointmentsMap.set(appt.id, appt);
    });

    // Add appointments where user is a professional, avoiding duplicates
    (professionalAppointments || []).forEach(appt => {
      appointmentsMap.set(appt.id, appt);
    });

    return Array.from(appointmentsMap.values());
  }, [patientAppointments, professionalAppointments]);

  return {
    data: mergedData,
    isLoading: patientLoading || professionalLoading,
    // Return the first error encountered
    error: patientError || professionalError,
  };
}
