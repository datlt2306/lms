import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import Mux from '@mux/mux-node'

const { Video } = new Mux(process.env.MUX_TOKEN_ID!, process.env.MUX_TOKEN_SECRET!)

export const DELETE = async (req: Request, { params }: { params: { courseId: string } }) => {
    try {
        const { userId } = auth()
        if (!userId) return new NextResponse('Unauthorized', { status: 401 })

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            },
            include: {
                chapters: {
                    include: {
                        muxData: true
                    }
                }
            }
        })

        if (!course) return new NextResponse('Not Found', { status: 404 })

        for (const chapter of course.chapters) {
            if (chapter.muxData?.assetId) {
                await Video.Assets.del(chapter.muxData.assetId)
            }
        }

        const deleteCourse = await db.course.delete({
            where: {
                id: params.courseId
            }
        })

        return NextResponse.json(deleteCourse, { status: 200 })
    } catch (error) {
        console.log('[Delete Course]', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}

export const PATCH = async (req: Request, { params }: { params: { courseId: string } }) => {
    try {
        const { userId } = auth()
        const { courseId } = params

        const values = await req.json()
        if (!userId) return new NextResponse('Unauthorized', { status: 401 })

        const course = await db.course.update({
            where: {
                id: courseId,
                userId
            },
            data: {
                ...values
            }
        })

        return NextResponse.json(course, { status: 200 })
    } catch (error) {
        return new NextResponse('Internal Error', { status: 500 })
    }
}
