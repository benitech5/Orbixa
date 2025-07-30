// src/types/navigation.ts
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};

export type AuthStackParamList = {
  Login: undefined;
  PhoneLogin: undefined;
  Register: undefined;
  Otp: { phoneNumber: string };
  ProfileSetup: { phoneNumber: string };
};

export type MainStackParamList = {
  Home: undefined;
  Chats: undefined;
  Settings: undefined;
  ChatSettings: undefined;
  Privacy: undefined;
  Notifications: undefined;
  Profile: undefined;
  Account: undefined;
  ChatRoom: { chatId: string; chatName: string };
  ChatDetails: { chatId: string };
  CallScreen: { callId: string; callerName: string; callType: 'audio' | 'video'; isIncoming: boolean };
  CallHistory: undefined;
  GroupChat: { groupId: string; groupName: string };
  MediaGallery: { chatId: string; chatName: string };
  Search: undefined;
  VoiceMessage: { chatId: string; chatName: string };
  InviteToGroup: { groupId: string };
  ForwardMessage: { messageId?: string; chatId?: string };
  SavedMessages: undefined;
  PinnedMessages: { chatId: string };
  MediaShared: { chatId: string; mediaType: 'photos' | 'videos' | 'documents' };
  Confirmation: { 
    message: string; 
    action: 'logout' | 'addAccount' | string;
    onConfirm?: () => void; 
    onCancel?: () => void 
  };
  Contacts: undefined;
  Calls: undefined;
  DataAndStorage: undefined;
  Devices: undefined;
  Language: undefined;
  Theme: undefined;
  ChatFolders: undefined;
  InviteFriends: { groupId?: string; groupName?: string };
  AddContact: undefined;
  ContactProfile: { contactId: string; contactName?: string };
  RecentCalls: undefined;
  CallInfo: { callId: string; callType: 'incoming' | 'outgoing' | 'missed' };
  GlobalSearch: undefined;
  InChatSearch: { chatId: string; chatName: string };
  EditProfile: undefined;
  BlockedUsers: undefined;
  ChatFolderView: { folderId: string; folderName: string };
  NewGroup: undefined;
  GroupInfo: { groupId: string; groupName?: string };
  NewChannel: undefined;
  ChannelInfo: { channelId: string; channelName?: string };
  JoinRequests: { groupId: string; groupName?: string };
  PowerSaving: undefined;
};