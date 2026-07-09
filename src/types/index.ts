export interface User {
  id: string;
  name: string;
  email: string | null;
  avatar: string; // can be a URL (Google photo) or an 'avatar-N' identifier
  status: string;
  accentColor?: string;
  blurIntensity?: string;
  clockFormat24h?: boolean;
  sidebarSettings?: string;
}

export interface LinkedGoogleAccount {
  id: string;
  googleEmail: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  userId: string;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  isShared: boolean;
  userId: string;
  updatedAt: string;
  user: { id: string; name: string; avatar: string };
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  assigneeId: string | null;
  creatorId: string;
  assignee?: { id: string; name: string; avatar: string } | null;
  creator?: { id: string; name: string; avatar: string };
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  category: string;
  clicks: number;
  isShared: boolean;
  userId: string;
}

export interface Reminder {
  id: string;
  text: string;
  dueDate: string;
  isCompleted: boolean;
  userId: string;
}

export interface Message {
  id: string;
  text: string;
  userId: string;
  createdAt: string;
  user: { id: string; name: string; avatar: string };
}

export interface Wallpaper {
  id: string;
  name: string;
  url: string;
  isCustom?: boolean;
}
