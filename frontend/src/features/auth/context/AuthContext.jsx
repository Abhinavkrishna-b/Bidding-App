
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiRequest } from "../../../services/api.js";
import AuthContext from "./authContext.js";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    setAuthError("");

    try {
      const result = await apiRequest("/auth/me");
      setUser(result.user);
      return result.user;
    } catch (error) {
      setAuthError(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    apiRequest("/auth/me")
      .then((result) => {
        if (active) setUser(result.user);
      })
      .catch((error) => {
        if (active) setAuthError(error.message);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const result = await apiRequest("/auth/signin", {
      method: "POST",
      body: { email, password },
    });

    setUser(result.user);
    setAuthError("");
    return result.user;
  }, []);

  const signUp = useCallback(({ name, email, password }) => {
    return apiRequest("/auth/signup", {
      method: "POST",
      body: { name, email, password },
    }).then((result) => {
      setUser(result.user);
      setAuthError("");
      return result.user;
    });
  }, []);

  const signOut = useCallback(async () => {
    await apiRequest("/auth/signout", { method: "POST" });
    setUser(null);
    setAuthError("");
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      authError,
      signIn,
      signUp,
      signOut,
      refreshUser,
    }),
    [user, isLoading, authError, signIn, signUp, signOut, refreshUser]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
