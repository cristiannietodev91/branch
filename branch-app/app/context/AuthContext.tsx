import * as React from "react";

type AuthContextType = {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<void>;
};

export const AuthContext = React.createContext<AuthContextType>({
  async signIn(_email, _password) {},
  async signOut() {},
  async refreshToken() {},
});
