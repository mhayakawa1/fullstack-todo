const isProduction = process.env.NODE_ENV === "production";

export const url = `${isProduction ? "https://fullstack-todo-app-server.onrender.com" : "https://localhost:8080"}/api/`;

export const clientId = (isProduction
  ? process.env.CLIENT_ID
  : process.env.REACT_APP_CLIENT_ID) || "";
