export type Role = "user" | "assistant";

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: string;
}

export interface Thread {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  prompt: string;
}

export interface ChatState {
  threads: Thread[];
  activeThreadId: string | null;
  isLoading: boolean;
  error: string | null;
}
