import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'
import { getProgress } from '../../../../../actions/get-process'
import CouseSidebar from './_components/CourseSidebar'

type CourseLayoutProps = {
    children: React.ReactNode
    params: { courseId: string }
}

const CourseLayout = async ({ children, params }: CourseLayoutProps) => {
    const { userId } = auth()
    if (!userId) return redirect('/sign-in')

    const course = await db.course.findUnique({
        where: {
            id: params.courseId
        },
        include: {
            chapters: {
                where: { isPublished: true },
                include: {
                    userProgress: {
                        where: { userId }
                    }
                },
                orderBy: {
                    position: 'asc'
                }
            }
        }
    })

    if (!course) return redirect('/')

    const progressCount = await getProgress(userId, course.id)
    return (
        <div className='h-full'>
            <div className='hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50'>
                <CouseSidebar course={course} progressCount={progressCount} />
            </div>
            <main className='md:pl-80 h-full'>{children}</main>
        </div>
    )
}

export default CourseLayout
