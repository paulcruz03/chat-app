'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getChatList, setupFirebase } from '@/lib/firebase-client';
import { ChatHistoryEntry } from '@/schema';

interface AuthContextType {
  user: User | null;
  chats: ChatHistoryEntry[];
  loading: boolean;
  refetchChats: () => {}
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { auth } = setupFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState<ChatHistoryEntry[]>([])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        getChatList().then((snapshot) => {
          if (snapshot.exists()) {
            const loadedItems: ChatHistoryEntry[] = [];

            snapshot.forEach((childSnapshot) => {
              const itemKey = childSnapshot.key;
              const itemValue = childSnapshot.val();

              loadedItems.unshift({
                id: itemKey,
                ...itemValue 
              });
            });

            setChats(loadedItems)
            setLoading(false)
          }
        })
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const refetchChats = async () => {
    const snapshot = await getChatList()
    if (snapshot.exists()) {
      const loadedItems: ChatHistoryEntry[] = [];

      snapshot.forEach((childSnapshot) => {
        const itemKey = childSnapshot.key;
        const itemValue = childSnapshot.val();

        loadedItems.unshift({
          id: itemKey,
          ...itemValue
        });
      });

      setChats(loadedItems)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, chats, refetchChats }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};