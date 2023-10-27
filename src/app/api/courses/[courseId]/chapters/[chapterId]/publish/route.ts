import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request, { params }: { params: { chapterId: string, courseId: string } }) => {
    try {
        const { userId } = auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });
        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        })
        if (!courseOwner) return new NextResponse("Unauthorized", { status: 401 });

        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            }
        })
        const muxData = await db.muxData.findFirst({
            where: {
                chapterId: params.chapterId
            }
        });
        if (!chapter || !muxData || !chapter.title || !chapter.description || !chapter.videoUrl) {
            return new NextResponse("Missing required fields", { status: 404 });
        }

        const publishChapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
            data: {
                isPublished: true
            }
        })
        return NextResponse.json(publishChapter)
    } catch (error) {
        console.log("Publish", error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}