import React, { createContext, useState } from "react";
export const datacontext = createContext();
export default function Datacontext({ children }) {
  const [tokenState, setTokenState] = useState(false);
  return (
    <datacontext.Provider value={{ tokenState, setTokenState }}>
      {children}
    </datacontext.Provider>
  );
}
