import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { z } from 'zod';
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(req: Request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(req.url);
        const queryParams = { username: searchParams.get('username') }

        //Zod Validation
        const result = UsernameQuerySchema.safeParse(queryParams);

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json({ success: false, message: usernameErrors }, { status: 400 });
        }

        const { username } = result.data;
        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });
        if (existingVerifiedUser) {
            return Response.json({ success: false, message: 'Username already exists' }, { status: 400 });
        }

        return Response.json({ success: true, message: 'Username is unique' }, { status: 200 });
    }
    catch (error) {
        console.log('Error checking username:', error);
        return Response.json({ success: false, message: 'Error checking username' }, { status: 500 });
    }
}
