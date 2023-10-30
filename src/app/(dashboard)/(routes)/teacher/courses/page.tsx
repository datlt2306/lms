import { Button } from '@/components/ui/button'
import Link from 'next/link'

import { columns } from './_components/Column'
import { DataTable } from './_components/DataTable'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { PlusCircle } from 'lucide-react'

const CoursePage = async () => {
    const { userId } = auth()
    if (!userId) return redirect('/sign-in')

    const course = await db.course.findMany({
        where: { userId },
        orderBy: { createAt: 'desc' }
    })
    return (
        <>
            <div className='p-6'>
                <div className='flex items-center justify-between'>
                    <h2 className='text-2xl'>Danh sách khóa học</h2>
                </div>
                <div className='py-6'>
                    <DataTable columns={columns} data={course} />
                </div>
            </div>
        </>
    )
}

export default CoursePage
