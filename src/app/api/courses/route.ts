import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export const POST = async (req: Request, res: Response) => {
    try {
        const { userId } = auth();
        const { title } = await req.json();
        if (!userId) return new NextResponse('Unauthorized', { status: 401 });

        const course = await db.course.create({
            data: {
                userId, title
            }
        });

        return new NextResponse(JSON.stringify(course), { status: 200 });
    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}