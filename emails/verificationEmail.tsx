import { Html, Head, Font, Preview, Heading, Row, Section, Text } from "@react-email/components";

interface VerificationEmailProps {
    username: string;
    otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
    return (
        <Html lang="en">
            <Head>
                <Font fontFamily="Roboto" fallbackFontFamily='Verdana' webFont={{ url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap", format: 'woff2' }} />
                <title>Verification Code</title>
            </Head>
            <Preview>Here&apos;s your verification code: {otp}</Preview>
            <Section>
                <Row>
                    <Heading as="h2"> Hello {username},</Heading>
                </Row>
                <Row>
                    <Text>
                        Thank you for registering. Please use the following code to verify your email address.
                    </Text>
                </Row>
                <Row>
                    <Text>
                        Verification code: <strong>{otp}</strong>
                    </Text>
                </Row>
                <Row>
                    <Text>
                        If you did not request this code, please ignore this email.
                    </Text>
                </Row>
            </Section>
        </Html>
    );
}
