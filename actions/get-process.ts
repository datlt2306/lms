import { db } from "@/lib/db";

export const getProgress = async (userId: string, courseId: string): Promise<number> => {
    try {
        const publishChapters = await db.chapter.findMany({
            where: {
                courseId,
                isPublished: true,
            },
            select: {
                id: true,
            },
        });

        const publishChapterIds = publishChapters.map((chapter) => chapter.id);
        const validCompleteChapters = await db.userProgress.count({
            where: {
                userId,
                chaperId: {
                    in: publishChapterIds,
                },
                isComplete: true,
            },
        });

        const progressPercentage = (validCompleteChapters / publishChapterIds.length) * 100;

        return progressPercentage;
    } catch (error) {
        console.log("GET_PROGRESS", error);
        return 0;
    }
};
