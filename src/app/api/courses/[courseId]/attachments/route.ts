import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export const POST = async (req: Request, { params }: { params: { courseId: string } }) => {
    try {
        const { userId } = auth()
        const { url } = await req.json()

        if (!userId) return new NextResponse('Unauthorized', { status: 401 })
        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        })
        if (!courseOwner) return new NextResponse('Unauthorized', { status: 401 })

        const attachment = await db.attachment.create({
            data: {
                url,
                name: url.split('/').pop(),
                courseId: params.courseId
            }
        })

        return NextResponse.json(attachment, { status: 201 })
    } catch (error) {
        console.log('Course_id_Attachment_Route_Error', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
