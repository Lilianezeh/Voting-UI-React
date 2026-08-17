import { AVATAR_COLORS } from "./constants";

export function getAvatarColor(index: number): string {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

export function getInitials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}