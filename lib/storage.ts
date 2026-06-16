import { v4 as uuidv4 } from 'uuid';
import type { UserProfile } from './types';

const STORAGE_KEY = 'luck_app_users';

function isClient(): boolean {
  return typeof window !== 'undefined';
}

export function getUsers(): UserProfile[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserProfile[]) : [];
  } catch {
    return [];
  }
}

export function getUserById(id: string): UserProfile | null {
  return getUsers().find(u => u.id === id) ?? null;
}

export function saveUsers(users: UserProfile[]): void {
  if (!isClient()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function createUser(data: Omit<UserProfile, 'id' | 'createdAt'>): UserProfile {
  const user: UserProfile = {
    ...data,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
  const users = getUsers();
  users.push(user);
  saveUsers(users);
  return user;
}

export function updateUser(id: string, data: Partial<Omit<UserProfile, 'id' | 'createdAt'>>): UserProfile | null {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...data };
  saveUsers(users);
  return users[idx];
}

export function deleteUser(id: string): void {
  const users = getUsers().filter(u => u.id !== id);
  saveUsers(users);
}
