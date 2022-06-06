export type LoginStackParamsList = {
  MainLogin: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends LoginStackParamsList {}
  }
}
