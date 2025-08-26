
// src/contexts/UserContext.tsx
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signOut, type User as FirebaseUser, deleteUser as deleteFirebaseAuthUser } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { getClientAuth } from '@/lib/firebaseClient';
import { countries as allCountries } from '@/lib/data';

const countryData = [...new Set(allCountries)].map(country => {
    if (country === 'Global') return { name: country, currencyCode: 'USD', languageCode: 'en' };
    if (['Canada', 'United States', 'Australia', 'United Kingdom', 'Ireland', 'New Zealand', 'Singapore', 'South Africa'].includes(country)) return { name: country, currencyCode: 'USD', languageCode: 'en'};
    if (['Germany', 'Austria', 'France', 'Spain', 'Italy', 'Netherlands', 'Belgium', 'Portugal', 'Greece', 'Finland', 'Luxembourg', 'Cyprus', 'Estonia', 'Latvia', 'Lithuania', 'Malta', 'Slovenia', 'Slovakia'].includes(country)) return { name: country, currencyCode: 'EUR', languageCode: 'en' };
    if (country === 'Japan') return { name: country, currencyCode: 'JPY', languageCode: 'ja' };
    if (country === 'China') return { name: country, currencyCode: 'CNY', languageCode: 'zh' };
    return { name: country, currencyCode: 'USD', languageCode: 'en'};
}).sort((a, b) => {
    if (a.name === 'Global') return -1;
    if (b.name === 'Global') return 1;
    if (a.name === 'United States') return -1;
    if (b.name === 'United States') return 1;
    return a.name.localeCompare(b.name);
});


type UserTier = 'Free' | 'Basic' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

type ShoppingList = {
    id: string;
    name: string;
    productIds: string[];
    createdAt: Date;
}

type User = {
    uid: string;
    name: string;
    email: string | null;
    goCoins: number;
    mfaEnabled: boolean;
    hyperSearchCredits: number;
    shoppingLists: ShoppingList[];
} | null;

interface UserContextType {
  user: User;
  userTier: UserTier;
  isLoaded: boolean;
  isPixiChatOpen: boolean;
  setPixiChatOpen: (isOpen: boolean) => void;
  handleLogout: () => void;
  handleTierChange: (tier: UserTier) => Promise<void>;
  handleAuthSuccess: (firebaseUser: FirebaseUser, isNewUser?: boolean, name?: string | null) => Promise<void>;
  deleteAccount: () => Promise<void>;
  selectedCountry: typeof countryData[0];
  setSelectedCountry: React.Dispatch<React.SetStateAction<typeof countryData[0]>>;
  hyperSearchCredits: number;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [userTier, setUserTier] = useState<UserTier>('Free');
  const [hyperSearchCredits, setHyperSearchCredits] = useState(2);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countryData[0]);
  const [isPixiChatOpen, setPixiChatOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleAuthSuccess = useCallback(async (firebaseUser: FirebaseUser, isNewUser = false) => {
      const auth = getClientAuth();
      if (!db || !auth) return;

      const userDocRef = doc(db, "users", firebaseUser.uid);
      let userDoc;

      try {
          userDoc = await getDoc(userDocRef);

          if (isNewUser || !userDoc.exists()) {
              await setDoc(userDocRef, {
                  fullName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'New User',
                  email: firebaseUser.email,
                  createdAt: serverTimestamp(),
                  tier: 'Free',
                  goCoins: 0,
                  mfaEnabled: false,
                  hyperSearchCredits: 2,
                  shoppingLists: [],
              });
              userDoc = await getDoc(userDocRef); // Re-fetch the doc after creating it
          }
          
          const data = userDoc.data();
          if (data) {
              setUser({
                  uid: firebaseUser.uid,
                  name: data.fullName,
                  email: data.email,
                  goCoins: data.goCoins || 0,
                  mfaEnabled: data.mfaEnabled || false,
                  hyperSearchCredits: data.hyperSearchCredits ?? 2,
                  shoppingLists: data.shoppingLists || [],
              });
              setUserTier(data.tier || 'Free');
              setHyperSearchCredits(data.tier === 'Free' ? (data.hyperSearchCredits ?? 2) : Infinity);
          }
          
          if (isNewUser) {
            toast({
                title: "Account Created!",
                description: "Welcome to Shopiggo! Let's get you set up.",
            });
            router.push('/signup/membership');
          } else {
            toast({
                title: "Signed In",
                description: "Welcome back!",
            });
            router.push('/search');
          }

      } catch (e) {
          console.error("Error during auth success handling:", e);
          toast({ title: "Error", description: "Could not set up your user profile.", variant: "destructive" });
      }
  }, [router, toast]);


  useEffect(() => {
    const auth = getClientAuth();
    // If we're on the server, auth will be a mock object.
    // The `onAuthStateChanged` method will not exist on the mock.
    if (!auth || typeof auth.onAuthStateChanged !== 'function') {
        setIsLoaded(true);
        return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            // Only fetch user data if the user object isn't already being set by handleAuthSuccess
            if ((!user || user.uid !== firebaseUser.uid) && db) {
                 const userDocRef = doc(db, "users", firebaseUser.uid);
                 const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setUser({
                        uid: firebaseUser.uid,
                        name: data.fullName || firebaseUser.displayName || 'User',
                        email: firebaseUser.email,
                        goCoins: data.goCoins || 0,
                        mfaEnabled: data.mfaEnabled || false,
                        hyperSearchCredits: data.hyperSearchCredits ?? 2,
                        shoppingLists: data.shoppingLists || [],
                    });
                    setUserTier(data.tier || 'Free');
                    setHyperSearchCredits(data.tier === 'Free' ? (data.hyperSearchCredits ?? 2) : Infinity);
                }
            }
        } else {
            setUser(null);
            setUserTier('Free');
            setHyperSearchCredits(0);
        }
        setIsLoaded(true);
    });

    return () => unsubscribe();
  }, [user]);


  const handleLogout = useCallback(() => {
    const auth = getClientAuth();
    if (!auth) return;
    signOut(auth).then(() => {
      setUser(null);
      setUserTier('Free');
      setPixiChatOpen(false);
      router.push('/');
    }).catch((error) => {
      toast({
        title: "Logout Error",
        description: error.message,
        variant: "destructive"
      });
    });
  }, [router, toast]);

  const handleTierChange = useCallback(async (newTier: UserTier) => {
      if(user) {
        if (!db) return;
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { tier: newTier });
        setUserTier(newTier);
        setHyperSearchCredits(newTier === 'Free' ? (user.hyperSearchCredits ?? 2) : Infinity);
      }
  }, [user]);
  
  const deleteAccount = useCallback(async () => {
    const auth = getClientAuth();
    const deleteUrl = process.env.NEXT_PUBLIC_DELETE_USER_ACCOUNT_URL;
    if (!deleteUrl) {
      throw new Error('Deletion service URL is not configured.');
    }

    const currentUser = auth?.currentUser;
    if (!currentUser) {
        throw new Error("No user is currently signed in.");
    }
    
    const idToken = await currentUser.getIdToken(true);
    
    const response = await fetch(deleteUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete account on the server.');
    }

    setUser(null);
    setUserTier('Free');
    
    toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted."
    });

    router.push('/hot-deals');

}, [toast, router]);


  return (
    <UserContext.Provider value={{ user, userTier, isLoaded, isPixiChatOpen, setPixiChatOpen, handleLogout, handleTierChange, handleAuthSuccess, deleteAccount, selectedCountry, setSelectedCountry, hyperSearchCredits }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
