import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import Mux from '@mux/mux-node'

const { Video } = new Mux(process.env.MUX_TOKEN_ID!, process.env.MUX_TOKEN_SECRET!)
export const DELETE = async (req: Request, { params }: { params: { courseId: string; chapterId: string } }) => {
    try {
        const { userId } = auth()
        if (!userId) return new NextResponse('Unauthorized', { status: 401 })

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        })
        if (!courseOwner) return new NextResponse('Unauthorized', { status: 401 })

        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            }
        })

        if (!chapter) return new NextResponse('Not Found', { status: 404 })

        if (chapter.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId
                }
            })
            if (existingMuxData) {
                await Video.Assets.del(existingMuxData.assetId)
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                })
            }
        }
        const deleteChapters = await db.chapter.delete({
            where: {
                id: params.chapterId
            }
        })

        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true
            }
        })

        if (!publishedChaptersInCourse.length) {
            await db.course.update({
                where: {
                    id: params.courseId
                },
                data: {
                    isPublished: false
                }
            })
        }

        return NextResponse.json(deleteChapters, { status: 200 })
    } catch (error) {
        console.log('Delete', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
export const PATCH = async (req: Request, { params }: { params: { courseId: string; chapterId: string } }) => {
    try {
        const { userId } = auth()
        const { isPublished, ...values } = await req.json()

        if (!userId) return new NextResponse('Unauthorized', { status: 401 })

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        })
        if (!courseOwner) return new NextResponse('Unauthorized', { status: 401 })

        const chapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
            data: {
                ...values
            }
        })

        // TODO: Video upload

        if (values.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId
                }
            })
            if (existingMuxData) {
                await Video.Assets.del(existingMuxData.assetId!)
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                })
            }

            const asset = await Video.Assets.create({
                input: values.videoUrl,
                playback_policy: 'public',
                test: false
            })

            await db.muxData.create({
                data: {
                    chapterId: params.chapterId,
                    assetId: asset.id,
                    playbackId: asset.playback_ids?.[0]?.id ?? ''
                }
            })
        }

        return NextResponse.json(chapter, { status: 200 })
    } catch (error) {
        console.log('Update', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
