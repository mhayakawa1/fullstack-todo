const isProduction = process.env.NODE_ENV === "production";

export const url = `${isProduction ? "https://fullstack-todo-app-server.onrender.com" : "https://localhost:8080"}/api/`;

function getClientId() {
  let value = "";
  const id = process.env.CLIENT_ID;
  const reactId = process.env.REACT_APP_CLIENT_ID;
  if (id) {
    value = id;
  } else if (reactId) {
    value = reactId;
  }
  return value;
}

export const clientId = getClientId();
