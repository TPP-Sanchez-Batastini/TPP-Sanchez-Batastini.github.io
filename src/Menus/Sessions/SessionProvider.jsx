import { SessionContext } from "./SessionContext";
import React, { useState } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google';

export const SessionProvider = ( {childElement} ) => {
  
    const [session, setSession] = useState({
        user: undefined,
        exp: undefined,
        jwt: undefined
    });


    React.useEffect(() => {
        const localSessionStr = localStorage.getItem("session");
        if (localSessionStr){
            const localSession = JSON.parse(localSessionStr);
            if (localSession && new Date(localSession.exp) > new Date()){
                setSession({
                    user: localSession.user,
                    exp: localSession.exp,
                    jwt: localSession.jwt
                });
            }else{
                setSession({
                    user: undefined,
                    exp: undefined,
                    jwt: undefined
                });
                localStorage.setItem("session", null);
            }
        }
    }, []);

    return (
        <GoogleOAuthProvider clientId="18785041157-s9ga39r0i6up45radtj3soo6je1pneon.apps.googleusercontent.com">
            <SessionContext.Provider value={{session, setSession}}>
                {childElement}
            </SessionContext.Provider>
        </GoogleOAuthProvider>
    )
}
