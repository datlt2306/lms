import { Category, Course } from '@prisma/client';
import { db } from '@/lib/db';
import { getProgress } from './get-process';

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: { id: string }[];
    progress: number | null;
}

type GetCourses = {
    userId: string;
    title?: string;
    categoryId?: string;
}

export const getCourses = async ({ userId, title, categoryId }: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
    try {
        const courses = await db.course.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title || '',
                },
                categoryId
            },
            include: {
                chapters: {
                    where: {
                        isPublished: true
                    },
                    select: {
                        id: true
                    }
                },
                purchases: {
                    where: {
                        userId
                    }
                }
            },
            orderBy: {
                createAt: 'desc'
            },
        })

        const courseWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
            courses.map(async (course) => {
                if (course.purchases.length === 0) {
                    return {
                        ...course,
                        category: null,
                        progress: null,
                    } as CourseWithProgressWithCategory;
                }
                const progressPercentage = await getProgress(userId, course.id);

                return {
                    ...course,
                    category: course.categoryId,
                    chapters: course.chapters,
                    progress: progressPercentage,
                } as CourseWithProgressWithCategory;
            })
        );
        return courseWithProgress;
    } catch (error) {
        console.log('getCourses', error);
        return []
    }

}