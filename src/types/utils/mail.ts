export interface Mail {
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
  type: "plain" | "html" | "markdown";
}
