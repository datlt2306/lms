import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { Chapter, Course, UserProgress } from '@prisma/client'
import { redirect } from 'next/navigation'
import React from 'react'
import CourseSidebarItem from './CourseSidebarItem'

type CouseSidebarProps = {
    course: Course & {
        chapters: Chapter & {
            userProgress: UserProgress[] | null
        }
    }
    progressCount: number
}

const CourseSidebar = async ({ course, progressCount }: CouseSidebarProps) => {
    const { userId } = auth()
    if (!userId) return redirect('/sign-in')
    const purchase = await db.purchases.findUnique({
        where: {
            userId_courseId: { userId, courseId: course.id }
        }
    })
    return (
        <div className='h-full border-r flex flex-col overflow-y-auto shadow-sm'>
            <div className='p-8 flex flex-col border-b'>
                <h1 className='font-semibold'>{course.title}</h1>
            </div>
            <div className='flex flex-col w-full'>
                {course.chapters.map((chapter) => (
                    <CourseSidebarItem
                        key={chapter.key}
                        id={chapter.id}
                        label={chapter.title}
                        isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                        courseId={course.id}
                        isLocked={!chapter.isFree && !purchase}
                    />
                ))}
            </div>
        </div>
    )
}

export default CourseSidebar
