export interface ChatHistory {
  id: string;
  title: string;
  history: { text: string; role: string; }
}