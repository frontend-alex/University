import { createContext, useContext, ReactNode, useEffect, useMemo } from "react";
import {
  useQuery,
  useQueryClient,
  QueryObserverResult,
  UseQueryResult,
} from "@tanstack/react-query";
import { decryptToken } from "@/utils/auth";
import { jwtDecode } from "jwt-decode";
import { logout as logoutService } from "@/services/authService";
import api from "@/services/api";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { User, UserResponse } from "@/types/types";
import { SubscriptionTier } from "@/types/enums";

interface DecodedToken {
  id: string;
  exp: number;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refetchUser: () => Promise<QueryObserverResult<User | null, Error>>;

  isFree: boolean;
  isPro: boolean;
  isPremium: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const fetchUser = async (): Promise<User | null> => {
  const token = localStorage.getItem("authToken");
  if (!token) return null;

  const decrypted = await decryptToken(token);
  if (!decrypted) {
    logoutService();
    return null;
  }

  const { exp } = jwtDecode<DecodedToken>(decrypted);
  if (Date.now() / 1000 > exp) {
    logoutService();
    return null;
  }

  const { data } = await api.get<UserResponse>("/users/me", {
    headers: { Authorization: `Bearer ${decrypted}` },
  });

  return data.user;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading: loading,
    refetch,
  }: UseQueryResult<User | null, Error> = useQuery<User | null, Error>({
    queryKey: ["auth", "user"],
    queryFn: fetchUser,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (user && token) {
      connectSocket(token);
    }
  }, [user]);

  const login = async (token: string) => {
    localStorage.setItem("authToken", token);
    await queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
  };

  const logout = () => {
    disconnectSocket();
    logoutService();
    localStorage.removeItem("authToken");
    queryClient.setQueryData(["auth", "user"], null);
  };

  const tier = user?.subscription?.tier ?? SubscriptionTier.Free;

  const contextValue = useMemo(
    () => ({
      user: user ?? null,
      isLoggedIn: !!user,
      loading,
      login,
      logout,
      refetchUser: refetch,
      isFree: tier === SubscriptionTier.Free,
      isPro: tier === SubscriptionTier.Pro,
      isPremium: tier === SubscriptionTier.Premium,
    }),
    [user, loading] 
  );

  return (
    <AuthContext.Provider
      value={contextValue}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
