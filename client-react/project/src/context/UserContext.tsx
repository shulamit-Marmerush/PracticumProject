import { User } from "../types/User";
import React, { createContext, useContext, useState, ReactNode } from 'react';

type userContextType = {
    user: User | null;
    setMyUser: (user: User) => void;
}

// ערך ברירת מחדל עבור הקונטקסט
const defaultContextValue: userContextType = {
    user: null,
    setMyUser: () => {} // פונקציה ריקה כערך ברירת מחדל
};

const UserContext = createContext<userContextType>(defaultContextValue);

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const setMyUser = (newUser: User) => {
        setUser(newUser);
    };

    return (
        <UserContext.Provider value={{ user, setMyUser }}>
            {children}
        </UserContext.Provider>
    );
};

// פונקציה כדי להשתמש בקונטקסט
export const useUserContext = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
};

export default UserProvider;
