import React, { useState } from "react";

export const AuthContext = React.createContext({
  isAuth: false,
  login: () => {}
});

const AuthContextProvider = props => {
  const [isAuth, setIsAuth] = useState(false);
  const login = () => {
    setIsAuth(true);
  };
  return (
    <AuthContext.Provider value={{ isAuth: isAuth, login: login }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;