import {
  Component,
  inject,
  signal,
  computed,
  effect,
  ElementRef,
  viewChild,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppStateService } from '../../core/services/app-state.service';
import { SupportChatService } from '../../core/services/support-chat.service';
import { LangService } from '../../core/services/lang.service';
import {
  ChatActor,
  SupportConversation,
  SupportMessage,
} from '../../core/models/chat.model';

const REACTION_OPTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];
const MAX_IMAGE_BYTES = 6 * 1024 * 1024;
const MAX_AUDIO_SECONDS = 90;

@Component({
  selector: 'app-floating-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './floating-chat.component.html',
  styleUrl: './floating-chat.component.css',
})
export class FloatingChatComponent implements OnInit, OnDestroy {
  protected readonly appState = inject(AppStateService);
  protected readonly chatService = inject(SupportChatService);
  private readonly langService = inject(LangService);

  readonly isEn = this.langService.isEn;
  readonly isOpen = signal<boolean>(false);
  readonly messageValue = signal<string>('');
  readonly menuMessageId = signal<string>('');
  readonly reactionMessageId = signal<string>('');
  readonly replyMessage = signal<SupportMessage | null>(null);
  readonly editMessage = signal<SupportMessage | null>(null);
  readonly deleteMessage = signal<SupportMessage | null>(null);
  readonly isSearchOpen = signal<boolean>(false);
  readonly messageSearch = signal<string>('');
  readonly errorMessage = signal<string>('');
  readonly isRecording = signal<boolean>(false);
  readonly recordingSeconds = signal<number>(0);
  readonly isSupportActive = signal<boolean>(false);

  readonly identity = signal<{ id: string; name: string }>(
    this.chatService.getSupportCustomerIdentity()
  );
  readonly conversation = signal<SupportConversation | null>(null);

  readonly messagesContainer = viewChild<ElementRef<HTMLDivElement>>('messagesRef');
  readonly imageInput = viewChild<ElementRef<HTMLInputElement>>('imageInputRef');
  readonly textInput = viewChild<ElementRef<HTMLTextAreaElement>>('inputRef');

  readonly reactionOptions = REACTION_OPTIONS;

  private mediaRecorder: MediaRecorder | null = null;
  private mediaStream: MediaStream | null = null;
  private audioChunks: Blob[] = [];
  private recordingTimer: any = null;
  private recordingSecondsCount = 0;
  private unsubChat: (() => void) | null = null;
  private unsubOpen: (() => void) | null = null;

  readonly actor = computed<ChatActor>(() => ({
    id: this.identity().id,
    type: 'customer',
    name: this.identity().name,
  }));

  readonly unreadCount = computed(() => this.conversation()?.unreadForCustomer ?? 0);

  readonly messages = computed<SupportMessage[]>(() => {
    const conv = this.conversation();
    return conv ? this.chatService.getVisibleSupportMessages(conv, this.actor()) : [];
  });

  readonly normalizedSearch = computed(() => this.messageSearch().trim().toLowerCase());

  readonly searchResultCount = computed(() => {
    const query = this.normalizedSearch();
    if (!query) return 0;
    return this.messages().filter((m) =>
      this.chatService.getSupportMessagePreview(m).toLowerCase().includes(query)
    ).length;
  });

  ngOnInit(): void {
    this.syncChat();
    this.unsubChat = this.chatService.subscribe(() => this.syncChat());
    this.unsubOpen = this.chatService.subscribeOpen(() => this.openChat());
  }

  ngOnDestroy(): void {
    this.unsubChat?.();
    this.unsubOpen?.();
    this.cleanupRecording();
  }

  syncChat(): void {
    const latestIdentity = this.chatService.getSupportCustomerIdentity();
    this.identity.set(latestIdentity);
    this.conversation.set(this.chatService.getConversationForCustomer(latestIdentity.id));
  }

  toggleChat(): void {
    if (this.isOpen()) {
      this.isOpen.set(false);
    } else {
      this.openChat();
    }
  }

  openChat(): void {
    this.syncChat();
    this.isOpen.set(true);
    if (this.identity().id) {
      this.chatService.markSupportConversationReadByCustomer(this.identity().id);
      this.conversation.set(this.chatService.getConversationForCustomer(this.identity().id));
    }
    setTimeout(() => {
      this.scrollToBottom();
      this.textInput()?.nativeElement.focus();
    }, 100);
  }

  closeChat(): void {
    this.isOpen.set(false);
    this.menuMessageId.set('');
    this.reactionMessageId.set('');
    this.deleteMessage.set(null);
  }

  scrollToBottom(): void {
    const el = this.messagesContainer()?.nativeElement;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }

  showError(err: unknown): void {
    const text = err instanceof Error ? err.message : 'حدث خطأ غير متوقع.';
    this.errorMessage.set(text);
    setTimeout(() => this.errorMessage.set(''), 3500);
  }

  clearComposerMode(): void {
    this.replyMessage.set(null);
    this.editMessage.set(null);
    this.messageValue.set('');
  }

  sendMessage(event?: Event): void {
    event?.preventDefault();
    const text = this.messageValue().trim();
    if (!text) return;

    try {
      const conv = this.conversation();
      const editing = this.editMessage();

      if (editing && conv) {
        this.chatService.editSupportMessage(conv.id, editing.id, text, this.actor());
      } else {
        const ident = this.chatService.getSupportCustomerIdentity();
        this.chatService.sendCustomerSupportMessage(ident, {
          text,
          kind: 'text',
          replyToMessageId: this.replyMessage()?.id,
        });
      }
      this.clearComposerMode();
      this.syncChat();
      setTimeout(() => this.scrollToBottom(), 50);
    } catch (error) {
      this.showError(error);
    }
  }

  async onImageSelected(event: Event): Promise<void> {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.showError(new Error('اختاري صورة صحيحة.'));
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      this.showError(new Error('حجم الصورة يجب ألا يزيد عن 6 ميجابايت.'));
      return;
    }

    try {
      const mediaUrl = await this.fileToDataUrl(file);
      const ident = this.chatService.getSupportCustomerIdentity();
      this.chatService.sendCustomerSupportMessage(ident, {
        kind: 'image',
        mediaUrl,
        mimeType: file.type,
        fileName: file.name,
        replyToMessageId: this.replyMessage()?.id,
      });
      this.replyMessage.set(null);
      this.syncChat();
      setTimeout(() => this.scrollToBottom(), 50);
    } catch (err) {
      this.showError(err);
    }
  }

  private fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ''));
      reader.onerror = () => reject(new Error('تعذر قراءة الملف.'));
      reader.readAsDataURL(file);
    });
  }

  async startRecording(): Promise<void> {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      this.showError(new Error('المتصفح لا يدعم تسجيل الرسائل الصوتية.'));
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      this.audioChunks = [];
      this.mediaStream = stream;
      this.mediaRecorder = recorder;
      this.recordingSecondsCount = 0;
      this.recordingSeconds.set(0);

      recorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) this.audioChunks.push(event.data);
      });

      recorder.addEventListener('stop', async () => {
        this.cleanupRecording();
        this.isRecording.set(false);
        try {
          const blob = new Blob(this.audioChunks, {
            type: recorder.mimeType || 'audio/webm',
          });
          if (blob.size === 0) throw new Error('لم يتم تسجيل صوت واضح.');
          const mediaUrl = await this.fileToDataUrl(blob as unknown as File);
          const ident = this.chatService.getSupportCustomerIdentity();
          this.chatService.sendCustomerSupportMessage(ident, {
            kind: 'audio',
            mediaUrl,
            mimeType: blob.type,
            durationSeconds: Math.max(1, this.recordingSecondsCount),
            replyToMessageId: this.replyMessage()?.id,
          });
          this.replyMessage.set(null);
          this.syncChat();
          setTimeout(() => this.scrollToBottom(), 50);
        } catch (err) {
          this.showError(err);
        }
      });

      recorder.start(250);
      this.isRecording.set(true);
      this.recordingTimer = setInterval(() => {
        this.recordingSecondsCount += 1;
        this.recordingSeconds.set(this.recordingSecondsCount);
        if (this.recordingSecondsCount >= MAX_AUDIO_SECONDS && recorder.state !== 'inactive') {
          recorder.stop();
        }
      }, 1000);
    } catch {
      this.showError(new Error('اسمحي للمتصفح باستخدام الميكروفون لإرسال فويس.'));
    }
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }

  private cleanupRecording(): void {
    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
  }

  formatRecordingTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const rem = seconds % 60;
    return `${minutes}:${rem.toString().padStart(2, '0')}`;
  }

  aggregateReactions(message: SupportMessage): { emoji: string; count: number }[] {
    const map = new Map<string, number>();
    for (const r of message.reactions || []) {
      map.set(r.emoji, (map.get(r.emoji) || 0) + 1);
    }
    return Array.from(map.entries()).map(([emoji, count]) => ({ emoji, count }));
  }

  reactToMessage(message: SupportMessage, emoji: string): void {
    const conv = this.conversation();
    if (!conv) return;
    this.chatService.toggleSupportMessageReaction(conv.id, message.id, emoji, this.actor());
    this.reactionMessageId.set('');
    this.menuMessageId.set('');
    this.syncChat();
  }

  async copyMessage(message: SupportMessage): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.chatService.getSupportMessagePreview(message));
      this.menuMessageId.set('');
    } catch {
      this.showError(new Error('تعذر نسخ الرسالة.'));
    }
  }

  chooseReply(message: SupportMessage): void {
    this.replyMessage.set(message);
    this.editMessage.set(null);
    this.menuMessageId.set('');
    this.textInput()?.nativeElement.focus();
  }

  chooseEdit(message: SupportMessage): void {
    this.editMessage.set(message);
    this.replyMessage.set(null);
    this.messageValue.set(message.text || '');
    this.menuMessageId.set('');
    this.textInput()?.nativeElement.focus();
  }

  confirmDelete(mode: 'me' | 'everyone'): void {
    const conv = this.conversation();
    const toDelete = this.deleteMessage();
    if (!conv || !toDelete) return;
    this.chatService.deleteSupportMessage(conv.id, toDelete.id, mode, this.actor());
    this.deleteMessage.set(null);
    this.syncChat();
  }
}
