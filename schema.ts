export interface ChatHistory { text: string; role: string; }

export interface ChatHistoryEntry {
  id: string;
  title: string;
  history: ChatHistory[]
}

export interface WsMessage {
  type: string;
  message: string;
}