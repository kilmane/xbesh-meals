import { useState, useEffect } from 'react';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';

export const useFirestore = <T extends { id: string }>(collectionName: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, collectionName),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as T[];
        setData(items);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error(`Error fetching ${collectionName}:`, error);
        setError(error.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user, collectionName]);

  const add = async (item: Omit<T, 'id'>) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...item,
        userId: user.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error: any) {
      console.error(`Error adding ${collectionName}:`, error);
      setError(error.message);
      throw error;
    }
  };

  const update = async (id: string, updates: Partial<Omit<T, 'id'>>) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error: any) {
      console.error(`Error updating ${collectionName}:`, error);
      setError(error.message);
      throw error;
    }
  };

  const remove = async (id: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (error: any) {
      console.error(`Error deleting ${collectionName}:`, error);
      setError(error.message);
      throw error;
    }
  };

  return {
    data,
    loading,
    error,
    add,
    update,
    remove
  };
};
