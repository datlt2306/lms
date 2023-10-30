import { Category, Course } from '@prisma/client';


import { getProgress } from './get-process';


import { db } from '@/lib/db';

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

export const getCourse = async (userId, title, categoryId) => {

}