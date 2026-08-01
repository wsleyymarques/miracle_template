export const MAIL_SERVICE = Symbol('MAIL_SERVICE');

export interface MailService {
  sendPasswordResetCode(email: string, code: string): Promise<void>;
}
