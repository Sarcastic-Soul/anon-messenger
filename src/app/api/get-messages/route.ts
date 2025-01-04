import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import UserModel from "@/model/user.model";
import mongoose from "mongoose";

export async function GET(req: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user: User = session?.user as User;
    if (!session || !_user) {
        return Response.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    const userId = new mongoose.Types.ObjectId(_user._id);
    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } }, // Safely unwind messages
            { $sort: { "messages.createdAt": -1 } },
            {
                $group: {
                    _id: "$_id",
                    messages: { $push: "$messages" },
                },
            },
        ]).exec();

        if (!user || user.length === 0) {
            return Response.json({ success: false, message: 'User not found' }, { status: 404 });
        }
        return Response.json({ success: true, messages: user[0].messages }, { status: 200 });
    } catch (error) {
        console.log('Error getting messages:', error);
        return Response.json({ success: false, message: 'Error getting messages' }, { status: 500 });
    }
}