type AuthState = {
  isLoading: boolean;
  isSignOut: boolean;
  userToken: string | null;
};

type ActionType =
  | { type: "RESTORE_TOKEN"; token: string }
  | { type: "SIGN_IN"; token: string }
  | { type: "SIGN_OUT" };

export function authReducer(
  prevState: AuthState,
  action: ActionType
): AuthState {
  switch (action.type) {
    case "RESTORE_TOKEN":
      return {
        ...prevState,
        userToken: action.token,
        isLoading: false,
      };
    case "SIGN_IN":
      return {
        ...prevState,
        isSignOut: false,
        userToken: action.token,
      };
    case "SIGN_OUT":
      return {
        ...prevState,
        isSignOut: true,
        userToken: null,
      };
  }
}
