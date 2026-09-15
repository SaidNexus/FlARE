import { Injectable } from '@angular/core';
import {
  ChatActor,
  SupportConversation,
  SupportMessage,
} from '../models/chat.model';

const SUPPORT_CHAT_STORAGE_KEY = 'flare-support-chat-conversations-v4';
const CUSTOMER_ID_STORAGE_KEY = 'flare-support-customer-id';
const CUSTOMER_PROFILE_STORAGE_KEY = 'flare-support-customer-profile';
const SUPPORT_CHAT_UPDATED_EVENT = 'flare-support-chat-updated';
const OPEN_CUSTOMER_CHAT_EVENT = 'flare-open-customer-support-chat';

function nowIso(): string {
  return new Date().toISOString();
}

function currentTime(): string {
  return new Intl.DateTimeFormat('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date());
}

@Injectable({
  providedIn: 'root',
})
export class SupportChatService {
  getSupportCustomerIdentity(): { id: string; name: string } {
    if (typeof window === 'undefined') return { id: 'cust-1', name: 'عميل فلير' };
    let id = localStorage.getItem(CUSTOMER_ID_STORAGE_KEY);
    if (!id) {
      id = 'cust-' + Math.random().toString(36).slice(2, 10);
      localStorage.setItem(CUSTOMER_ID_STORAGE_KEY, id);
    }
    const profile = localStorage.getItem(CUSTOMER_PROFILE_STORAGE_KEY);
    const name = profile ? JSON.parse(profile).name || 'عميل فلير' : 'عميل فلير';
    return { id, name };
  }

  getConversations(): SupportConversation[] {
    try {
      const stored = localStorage.getItem(SUPPORT_CHAT_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  saveConversations(conversations: SupportConversation[]): void {
    localStorage.setItem(SUPPORT_CHAT_STORAGE_KEY, JSON.stringify(conversations));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(SUPPORT_CHAT_UPDATED_EVENT));
    }
  }

  getConversationForCustomer(customerId: string): SupportConversation {
    const list = this.getConversations();
    let conv = list.find((c) => c.customerId === customerId);
    if (!conv) {
      conv = {
        id: 'conv-' + customerId,
        customerId,
        customerName: this.getSupportCustomerIdentity().name,
        unreadForCustomer: 0,
        unreadForStaff: 0,
        messages: [
          {
            id: 'msg-welcome',
            sender: 'staff',
            text: 'مرحبًا بك في متجر FLARE! يسعدنا تقديم المساعدة والإجابة على أي استفسارات تخص منتجاتنا وطلباتك.',
            sentAt: currentTime(),
            readAt: nowIso(),
          },
        ],
      };
      list.push(conv);
      this.saveConversations(list);
    }
    return conv;
  }

  getVisibleSupportMessages(
    conversation: SupportConversation,
    actor: ChatActor
  ): SupportMessage[] {
    return (conversation.messages || []).filter(
      (m) => !(m.deletedForActors || []).includes(actor.id)
    );
  }

  getSupportMessagePreview(message?: SupportMessage | null): string {
    if (!message) return '';
    if (message.deletedForEveryone) return 'تم حذف هذه الرسالة';
    if (message.text) return message.text;
    if (message.kind === 'image') return '📷 صورة';
    if (message.kind === 'audio') return '🎤 رسالة صوتية';
    return 'رسالة';
  }

  markSupportConversationReadByCustomer(customerId: string): void {
    const list = this.getConversations();
    const conv = list.find((c) => c.customerId === customerId);
    if (conv) {
      conv.unreadForCustomer = 0;
      conv.messages = (conv.messages || []).map((m) =>
        m.sender === 'staff' && !m.readAt ? { ...m, readAt: nowIso() } : m
      );
      this.saveConversations(list);
    }
  }

  sendCustomerSupportMessage(
    identity: { id: string; name: string },
    payload: {
      text?: string;
      kind?: 'text' | 'image' | 'audio';
      mediaUrl?: string;
      mimeType?: string;
      fileName?: string;
      durationSeconds?: number;
      replyToMessageId?: string;
    }
  ): void {
    const list = this.getConversations();
    let conv = list.find((c) => c.customerId === identity.id);
    if (!conv) {
      conv = this.getConversationForCustomer(identity.id);
    }

    let replyTo: any = null;
    if (payload.replyToMessageId) {
      const parent = conv.messages.find((m) => m.id === payload.replyToMessageId);
      if (parent) {
        replyTo = {
          messageId: parent.id,
          sender: parent.sender,
          preview: this.getSupportMessagePreview(parent),
        };
      }
    }

    const newMessage: SupportMessage = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      sender: 'customer',
      text: payload.text,
      kind: payload.kind || 'text',
      mediaUrl: payload.mediaUrl,
      mimeType: payload.mimeType,
      fileName: payload.fileName,
      durationSeconds: payload.durationSeconds,
      sentAt: currentTime(),
      readAt: null,
      replyTo,
    };

    conv.messages.push(newMessage);
    conv.unreadForStaff = (conv.unreadForStaff || 0) + 1;

    // Simulate automated staff reply after 3.5 seconds if first customer message
    const isFirstCustomerMessage =
      conv.messages.filter((m) => m.sender === 'customer').length === 1;

    this.saveConversations(list);

    if (isFirstCustomerMessage) {
      setTimeout(() => {
        const freshList = this.getConversations();
        const freshConv = freshList.find((c) => c.customerId === identity.id);
        if (freshConv) {
          freshConv.messages.push({
            id: 'msg-auto-reply',
            sender: 'staff',
            text: 'شكراً لتواصلك معنا! تلقينا رسالتك وسيتواصل معك أحد مستشاري العناية خلال دقائق.',
            sentAt: currentTime(),
            readAt: null,
          });
          freshConv.unreadForCustomer = (freshConv.unreadForCustomer || 0) + 1;
          this.saveConversations(freshList);
        }
      }, 3500);
    }
  }

  editSupportMessage(
    conversationId: string,
    messageId: string,
    newText: string,
    actor: ChatActor
  ): void {
    const list = this.getConversations();
    const conv = list.find((c) => c.id === conversationId);
    if (conv) {
      const msg = conv.messages.find((m) => m.id === messageId);
      if (msg && msg.sender === actor.type) {
        msg.text = newText;
        msg.editedAt = nowIso();
        this.saveConversations(list);
      }
    }
  }

  deleteSupportMessage(
    conversationId: string,
    messageId: string,
    mode: 'me' | 'everyone',
    actor: ChatActor
  ): void {
    const list = this.getConversations();
    const conv = list.find((c) => c.id === conversationId);
    if (conv) {
      const msg = conv.messages.find((m) => m.id === messageId);
      if (msg) {
        if (mode === 'everyone') {
          msg.deletedForEveryone = true;
          msg.text = undefined;
          msg.mediaUrl = undefined;
        } else {
          msg.deletedForActors = [...(msg.deletedForActors || []), actor.id];
        }
        this.saveConversations(list);
      }
    }
  }

  toggleSupportMessageReaction(
    conversationId: string,
    messageId: string,
    emoji: string,
    actor: ChatActor
  ): void {
    const list = this.getConversations();
    const conv = list.find((c) => c.id === conversationId);
    if (conv) {
      const msg = conv.messages.find((m) => m.id === messageId);
      if (msg) {
        msg.reactions = msg.reactions || [];
        const existingIndex = msg.reactions.findIndex(
          (r) => r.emoji === emoji && r.actorId === actor.id
        );
        if (existingIndex >= 0) {
          msg.reactions.splice(existingIndex, 1);
        } else {
          msg.reactions.push({ emoji, actorId: actor.id });
        }
        this.saveConversations(list);
      }
    }
  }

  subscribe(callback: () => void): () => void {
    if (typeof window === 'undefined') return () => {};
    window.addEventListener(SUPPORT_CHAT_UPDATED_EVENT, callback);
    window.addEventListener('storage', callback);
    return () => {
      window.removeEventListener(SUPPORT_CHAT_UPDATED_EVENT, callback);
      window.removeEventListener('storage', callback);
    };
  }

  subscribeOpen(callback: () => void): () => void {
    if (typeof window === 'undefined') return () => {};
    window.addEventListener(OPEN_CUSTOMER_CHAT_EVENT, callback);
    return () => {
      window.removeEventListener(OPEN_CUSTOMER_CHAT_EVENT, callback);
    };
  }

  triggerOpenChat(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(OPEN_CUSTOMER_CHAT_EVENT));
    }
  }
}
