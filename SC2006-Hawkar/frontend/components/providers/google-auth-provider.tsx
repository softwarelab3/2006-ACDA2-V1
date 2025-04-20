"use client"

import { GoogleOAuthProvider } from '@react-oauth/google';
import { ReactNode } from 'react';

interface GoogleAuthProviderProps {
  children: ReactNode;
}

export default function GoogleAuthProvider({ children }: GoogleAuthProviderProps) {
  // Get the client ID from environment variables
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  
  
  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}