export function createUser(
  id: string,
  name: string,
  password: string,
  email: string,
  picture: string,
  isGoogleAccount: boolean
) {
  return {
    id: id,
    name: name,
    password: password,
    email: email,
    picture: picture,
    isGoogleAccount: isGoogleAccount,
  };
}

export interface User {
  id: string;
  name: string;
  password: string;
  email: string;
  picture: string;
  isGoogleAccount: boolean;
}

const users: User[] = [
  createUser(
    "1",
    "First Last",
    "asdfghjkl",
    "email@email.com",
    "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg",
    false
  ),
];

export function findUser(email: string) {
  return users.find((element: User) => element.email === email);
}

export function addUser(newUser: User) {
  users.push(newUser);
}

export default users;