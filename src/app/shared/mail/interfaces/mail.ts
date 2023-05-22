export interface Mail {
  from: string;
  subject: string;
  to: string;
  message: string;
  attachments?: [
    {
        filename: string,
        content: string,
    },
],
}
