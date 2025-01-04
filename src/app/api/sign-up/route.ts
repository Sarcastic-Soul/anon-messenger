import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrpt from "bcryptjs";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";

export async function POST(req: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await req.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if (existingUserVerifiedByUsername) {
            return Response.json({ success: false, message: 'Username already exists' }, { status: 400 });
        }

        const existingUserByEmail = await UserModel.findOne({ email });
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({ success: false, message: 'Email already exists' }, { status: 400 });
            } else {
                const hashedPassword = await bcrpt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        } else {
            const hashedPassword = await bcrpt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
            });
            await newUser.save();
        }

        //send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        if (emailResponse.success) {
            return Response.json({ success: true, message: 'Verification email sent' }, { status: 201 });
        } else {
            return Response.json({ success: false, message: emailResponse.message }, { status: 500 });
        }

    } catch (error) {
        console.log('Error signing up:', error);
        return Response.json({ success: false, message: 'Error signing up' }, { status: 500 });
    }
}