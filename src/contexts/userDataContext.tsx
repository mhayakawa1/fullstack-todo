import { createContext } from "react";

interface Response {
  email: string;
  picture: string;
  name: string;
}

export const UserDataContext = createContext<Response>({
  email: "",
  picture: "",
  name: "",
});

export const CounterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const userData = {
    email: "username@email.com",
    picture: "",
    name: "First Last",
  };

  return (
    <UserDataContext.Provider value={userData}>
      {children}
    </UserDataContext.Provider>
  );
};
