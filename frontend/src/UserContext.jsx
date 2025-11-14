import { createContext, useState, useEffect } from 'react';
import {fetchAPI} from './util';

export const UserContext = createContext(null);

export default function User({children}) {
    // set to null if user not logged in
    const [username, setUsername] = useState(null);
    const fetchMe = async () => {
        const r = await fetchAPI('/check', {
            method: 'GET'
        });
        if (r.ok) {
            const data = await r.json();
            return data.username;
        } 
        return null;
    }
    useEffect(() => {
        async function main() {
            setUsername(await fetchMe());
        }
        main();
    }, [setUsername]);
    return (
        <UserContext.Provider value={{username, setUsername}}>
        {children}
        </UserContext.Provider>
    )
}