import { getAll, setAll, KEYS } from './storage';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'hr' | 'employee';
  employeeId?: string;
  password?: string;
  createdAt: string;
}

export function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'hash_' + Math.abs(hash).toString(36);
}

export function login(email: string, password: string): User | null {
  const users = getAll<User>(KEYS.USERS);
  const hashed = simpleHash(password);
  const user = users.find(u => u.email === email && u.password === hashed);
  if (user) {
    const { password: _, ...safeUser } = user;
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(safeUser));
    return safeUser as User;
  }
  return null;
}

export function signup(data: { name: string; email: string; phone?: string; role: 'admin' | 'hr' | 'employee'; password: string }): User {
  const users = getAll<User>(KEYS.USERS);
  if (users.find(u => u.email === data.email)) {
    throw new Error('Email already exists');
  }
  const newUser: User = {
    id: 'user_' + Date.now(),
    name: data.name,
    email: data.email,
    phone: data.phone,
    role: data.role,
    password: simpleHash(data.password),
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  setAll(KEYS.USERS, users);
  const { password: _, ...safeUser } = newUser;
  return safeUser as User;
}

export function logout() {
  localStorage.removeItem(KEYS.CURRENT_USER);
}

export function getCurrentUser(): User | null {
  try {
    const data = localStorage.getItem(KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

export function hasRole(roles: string[]): boolean {
  const user = getCurrentUser();
  return user ? roles.includes(user.role) : false;
}
