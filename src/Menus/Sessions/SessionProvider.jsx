import { SessionContext } from "./SessionContext";
import { useState } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google';

export const SessionProvider = ( {childElement} ) => {
  
    const [session, setSession] = useState({
        user: undefined,
        jwt: undefined
    });

    return (
        <GoogleOAuthProvider clientId="18785041157-s9ga39r0i6up45radtj3soo6je1pneon.apps.googleusercontent.com">
            <SessionContext.Provider value={{session, setSession}}>
                {childElement}
            </SessionContext.Provider>
        </GoogleOAuthProvider>
    )
}
