import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import UserModel from "@/model/user.model";

export async function DELETE(req: Request, context: { params: Promise<{ messageid: string }> }) {
    const { params } = context; // Access the context
    const { messageid: messageId } = await params; // Destructure after awaiting
    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user = session?.user as User;
    if (!session || !_user) {
        return Response.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    try {
        const updatedResult = await UserModel.updateOne(
            { _id: _user._id },
            { $pull: { messages: { _id: messageId } } }
        );
        if (updatedResult.modifiedCount === 0) {
            return Response.json({ success: false, message: 'Message not found' }, { status: 404 });
        }
        return Response.json({ success: true, message: 'Message deleted' }, { status: 200 });
    } catch (error) {
        console.log('Error deleting message:', error);
        return Response.json({ success: false, message: 'Error deleting message' }, { status: 500 });

    }
}
