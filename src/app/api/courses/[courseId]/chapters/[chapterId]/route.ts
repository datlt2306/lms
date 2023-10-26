import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request, { params }: { params: { courseId: string, chapterId: string } }) => {
    try {
        const { userId } = auth();
        const { isPublished, ...values } = await req.json();

        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        })
        if (!courseOwner) return new NextResponse("Unauthorized", { status: 401 });

        const chapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
            data: {
                ...values
            }
        });

        // Todo Video upload

        return NextResponse.json(chapter, { status: 200 });



    } catch (error) {
        console.log("Update", error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}