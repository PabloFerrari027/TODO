export interface NotificationStrategy {
  send(to: string, head: string, body: string): Promise<void>;
}
