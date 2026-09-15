export interface ChatActor {
  id: string;
  type: 'customer' | 'staff';
  name: string;
}

export interface ChatReaction {
  emoji: string;
  count?: number;
  actorId?: string;
}

export interface SupportMessageReply {
  messageId: string;
  sender: 'customer' | 'staff';
  preview: string;
}

export interface SupportMessage {
  id: string;
  sender: 'customer' | 'staff';
  text?: string;
  kind?: 'text' | 'image' | 'audio';
  mediaUrl?: string;
  mimeType?: string;
  fileName?: string;
  durationSeconds?: number;
  sentAt: string;
  readAt?: string | null;
  editedAt?: string | null;
  forwarded?: boolean;
  replyTo?: SupportMessageReply | null;
  deletedForEveryone?: boolean;
  deletedForActors?: string[];
  reactions?: { emoji: string; actorId: string }[];
}

export interface SupportConversation {
  id: string;
  customerId: string;
  customerName: string;
  unreadForCustomer: number;
  unreadForStaff: number;
  messages: SupportMessage[];
}
