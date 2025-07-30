export interface Message {
  id: string;
  content: string;
  type: 'text' | 'image' | 'video';
  senderId: string;
  senderName?: string;
  timestamp: string;
  mediaUrl?: string;
  isReply?: boolean;
  replyTo?: string;
}

export interface ChatMessage {
  message: string;
  isReply?: boolean;
  sender?: string;
  timestamp?: string;
  style?: any;
  messageType?: 'text' | 'image' | 'video';
  mediaUrl?: string;
} 