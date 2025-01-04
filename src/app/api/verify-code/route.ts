import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";

export async function POST(req: Request) {
    await dbConnect();
    try {
        const { username, code } = await req.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedUsername });

        if (!user) {
            return Response.json({ success: false, message: 'User not found' }, { status: 404 });
        }
        if (user.verifyCode !== code) {
            return Response.json({ success: false, message: 'Invalid code' }, { status: 400 });
        }
        if (new Date(user.verifyCodeExpiry) < new Date()) {
            return Response.json({ success: false, message: 'Code expired' }, { status: 400 });
        }

        user.isVerified = true;
        await user.save();
        return Response.json({ success: true, message: 'User verified' }, { status: 200 });
    } catch (error) {
        console.log('Error verifying code:', error);
        return Response.json({ success: false, message: 'Error verifying code' }, { status: 500 });
    }
}
