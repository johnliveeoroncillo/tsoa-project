import {
    createTransport,
    TransportOptions,
    SentMessageInfo,
    Transporter,
} from 'nodemailer';
import path from 'path';
import ejs from 'ejs';

export class EmailService {
    private readonly EMAIL_FROM =
        process.env.EMAIL_FROM || 'noreply@example.com';
    private readonly SMTP_HOST = process.env.SMTP_HOST || 'smtp.example.com';
    private readonly SMTP_PORT = process.env.SMTP_PORT || 587;
    private readonly SMTP_USER = process.env.SMTP_USER || 'smtp_user';
    private readonly SMTP_PASSWORD =
        process.env.SMTP_PASSWORD || 'smtp_password';
    private readonly SMTP_SECURE =
        (process.env?.SMTP_SECURE ?? 'false') === 'true';
    private readonly transporter: Transporter;

    constructor() {
        this.transporter = createTransport({
            host: this.SMTP_HOST,
            port: this.SMTP_PORT,
            secure: this.SMTP_SECURE,
            auth: {
                user: this.SMTP_USER,
                pass: this.SMTP_PASSWORD,
            },
        } as TransportOptions);
    }

    async sendTemplatedEmail(
        to: string,
        subject: string,
        template: string,
        data: Record<string, any>,
    ): Promise<SentMessageInfo> {
        const html = await ejs.renderFile(
            path.join(__dirname, '..', 'email', template + '.ejs'),
            data,
        );
        return await this.sendEmail(to, subject, '', html);
    }

    async sendEmail(
        to: string,
        subject: string,
        text: string,
        html?: string,
    ): Promise<SentMessageInfo> {
        return await this.transporter.sendMail({
            from: this.EMAIL_FROM,
            to,
            subject,
            text,
            html,
        });
    }
}
