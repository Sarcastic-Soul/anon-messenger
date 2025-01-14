import { resend } from '@/lib/resend';
import VerificationEmail from '../../emails/verificationEmail';
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(email: string, username: string, verifyCode: string): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: [email],
            subject: 'Verifiacation Code | AnonMessenger',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        return { success: true, message: 'Email sent successfully' };
    } catch (emailError) {
        console.log('Error sending verification email:', emailError);
        return { success: false, message: 'Error sending verification email' };
    }
}
