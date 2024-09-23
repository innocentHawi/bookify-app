import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, getCurrentUserR } from '../lib/appwrite'

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true);

    const [isLoggedInR, setIsLoggedInR] = useState(false); // Second user login state
    const [userR, setUserR] = useState(null); // Second user state
    const [isLoadingR, setIsLoadingR] = useState(true); // Second user loading state
    const [savedBooks, setSavedBooks] = useState([]); // New state for saved books

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true); // Start loading
            try {
                const res = await getCurrentUser();
                if (res) {
                    setUser(res); // Set the first user
                    setIsLoggedIn(true);
                } else {
                    setUser(null);
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.log("Error fetching regular user:", error);
            } finally {
                setIsLoading(false); // Stop loading after fetching
            }
        };

        fetchUser(); // Call the function
    }, []);

    // Fetching second user (e.g., admin user)
    useEffect(() => {
        const fetchUserR = async () => {
            setIsLoadingR(true); // Start loading
            try {
                const res = await getCurrentUserR();
                if (res) {
                    setUserR(res); // Set the second user
                    setIsLoggedInR(true);
                } else {
                    setUserR(null);
                    setIsLoggedInR(false);
                }
            } catch (error) {
                console.log("Error fetching second user:", error);
            } finally {
                setIsLoadingR(false); // Stop loading after fetching
            }
        };

        fetchUserR(); // Call the function
    }, []);
    

    return (
        <GlobalContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                user,
                setUser,
                isLoading,

                isLoggedInR,
                setIsLoggedInR,
                userR,
                setUserR,
                isLoadingR,
                savedBooks, // Provide the saved books to the rest of the app
                setSavedBooks
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider;