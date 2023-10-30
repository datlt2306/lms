import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { Chapter } from '@prisma/client'
import { NextResponse } from 'next/server'

export const PATCH = async (req: Request, { params }: { params: { courseId: string } }) => {
    try {
        const { userId } = auth()

        if (!userId) return new NextResponse('Unauthorized', { status: 401 })

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        })

        if (!course) return new NextResponse('Not Found', { status: 404 })

        const unPublishCourse = await db.course.update({
            where: {
                id: params.courseId,
                userId
            },
            data: {
                isPublished: false
            }
        })
        return NextResponse.json(unPublishCourse)
    } catch (error) {
        console.log('Publish course', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
