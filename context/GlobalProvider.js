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
    const [readerId, setReaderId] = useState(null);

    useEffect(() => {
        let isMounted = true; // Track component mount state
    
        const fetchUser = async () => {
            if (!isMounted) return; // Ensure the component is still mounted
    
            setIsLoading(true); // Start loading
            try {
                const res = await getCurrentUser();
                if (res) {
                    console.log("User fetched successfully:", res);
                    if (isMounted) {
                        setUser(res); // Set the first user
                        setIsLoggedIn(true);
                    }
                } else {
                    //console.log("No user found, setting as logged out.");
                    if (isMounted) {
                        setUser(null);
                        setIsLoggedIn(false);
                    }
                }
            } catch (error) {
                console.log("Error fetching regular user:", error);
            } finally {
                if (isMounted) {
                    setIsLoading(false); // Stop loading after fetching
                }
            }
        };
    
        fetchUser(); // Call the function
    
        return () => {
            isMounted = false; // Clean up on component unmount
        };
    }, []);
    

    // Fetching second user (e.g., admin user)
    useEffect(() => {
        let isMounted = true; // Track component mount state

    
        const fetchUserR = async () => {
            setIsLoadingR(true);
            try {
                const account = await getCurrentUser(); // Check if any user is logged in
                if (account) {
                    const res = await getCurrentUserR();
                    if (res && res.readerId) {
                        setUserR(res); // Set the user if fetched
                        setIsLoggedInR(true);
                        setReaderId(res.readerId);
                    } else {
                        console.warn("No valid userR found:", res);
                        setUserR(null);
                        setIsLoggedInR(false);
                        setReaderId(null);
                    }
                } 
            } catch (error) {
                console.error("Error fetching reader user:", error);
            } finally {
                setIsLoadingR(false);
            }
        };
    
        fetchUserR();

        return () => {
            isMounted = false; // Cleanup on component unmount
        };
    }, []);

    useEffect(() => {
        //console.log("userR updated in GlobalProvider:", userR);
        //console.log("readerId within userR in GlobalProvider:", readerId);
    }, [userR, readerId]);

    
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
                readerId,
                savedBooks, // Provide the saved books to the rest of the app
                setSavedBooks
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider;