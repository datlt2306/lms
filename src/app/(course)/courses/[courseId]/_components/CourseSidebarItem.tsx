'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CheckCircle, Circle, Lock } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

type CourseSidebarItemProps = {
    label: string
    id: string
    isCompleted: boolean
    courseId: string
    isLocked: boolean
}

const CourseSidebarItem = ({ label, id, isCompleted, courseId, isLocked }: CourseSidebarItemProps) => {
    const pathName = usePathname()
    const router = useRouter()

    const Icon = isLocked ? Lock : isCompleted ? CheckCircle : Circle
    const isActive = pathName === `/courses/${courseId}/${id}`
    const onClick = () => {
        router.push(`/courses/${courseId}/chapter/${id}`)
    }
    return (
        <Button
            onClick={onClick}
            type='button'
            className={cn(
                'flex items-center gap-x-2 text-slate-500 text-sm font-[500] transition-all hover:text-slate-500 hover:bg-slate-300/2',
                isActive && 'text-slate-700 bg-slate-200/2 hover:bg-slate-200/2 hover:text-slate-700',
                isCompleted && 'text-emerald-700 hover:text-emerald-700',
                isCompleted && isActive && 'bg-emerald-700'
            )}
            variant='secondary'
        >
            <div className='flex items-center gap-x-2 py-4'>
                <Icon
                    size={22}
                    className={cn('text-slate-500', isActive && 'text-slate-700', isCompleted && 'text-emerald-700')}
                />
                {label}
            </div>
            <div
                className={cn(
                    'ml-auto opacity-0 border-2 border-slate-700 h-full transition-all',
                    isActive && 'opacity-100',
                    isCompleted && 'bg-emerald-200'
                )}
            ></div>
        </Button>
    )
}

export default CourseSidebarItem
