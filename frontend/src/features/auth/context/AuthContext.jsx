
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const signIn = useCallback(async ({ email, password }) => {
    if (!email.trim() || !password) {
      throw new Error("Enter your email and password.");
    }

    // Prototype only: no real credentials are verified.
    const nameFromEmail = email
      .split("@")[0]
      .replace(/[._-]+/g, " ")
      .replace(/\b\w/g, (character) => character.toUpperCase());

    const demoUser = {
      name: nameFromEmail || "Campus Student",
      email: email.trim(),
      initials: nameFromEmail.charAt(0).toUpperCase() || "S",
    };

    setUser(demoUser);
    return demoUser;
  }, []);

  const signUp = useCallback(async ({ name, email, password }) => {
    if (!name.trim() || !email.trim() || !password) {
      throw new Error("Complete all required fields.");
    }

    // Prototype only: does not create a real account.
    const demoUser = {
      name: name.trim(),
      email: email.trim(),
      initials: name.trim().charAt(0).toUpperCase(),
    };

    setUser(demoUser);
    return demoUser;
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      signIn,
      signUp,
      signOut,
    }),
    [user, signIn, signUp, signOut]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider.");
  }

  return context;
}
