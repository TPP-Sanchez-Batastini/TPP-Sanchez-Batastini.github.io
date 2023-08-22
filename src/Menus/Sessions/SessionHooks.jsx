import { useContext } from 'react';
import { SessionContext } from './SessionContext';

export const SessionHooks = () => {
  
    const { session, setSession } = useContext(SessionContext);


    const setSessionWithResponse = (loginResponse) => {
        localStorage.setItem("session", JSON.stringify({
            user: loginResponse.user,
            exp: loginResponse.exp,
            jwt: loginResponse.jwt
        }));
        setSession({
            user: loginResponse.user,
            exp: loginResponse.exp,
            jwt: loginResponse.jwt
        });
    }

    const getUser = () => {
        return session.user ? session.user : undefined;
    }

    const getJWT = () => {
        return session.jwt ? session.jwt : undefined;
    }

    return({
        setSessionWithResponse,
        getUser,
        getJWT
    })
}
