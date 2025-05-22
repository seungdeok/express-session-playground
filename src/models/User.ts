import { User } from "../types/User";

/**
 * sample user data
 */
export const users: User[] = [
  {
    id: 1,
    email: "admin@admin.com",
    username: "admin",
    password: "admin",
    createdAt: new Date("2025-01-01").toISOString(),
  },
];

export const createUser = (
  username: string,
  email: string,
  password: string
): User => {
  const newUser: User = {
    id: users.length + 1,
    username,
    password, // required hash password
    email,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  return newUser;
};
