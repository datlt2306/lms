'use client'

import ConfirmModal from '@/components/modals/ConfirmModal'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { Loader2, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { set } from 'zod'

type ChapterActionsProps = {
    disabled: boolean
    courseId: string
    chapterId: string
    isPublished: boolean
}

const ChapterActions = ({ disabled, courseId, chapterId, isPublished }: ChapterActionsProps) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const onClick = async () => {
        try {
            setIsLoading(true)
            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`)
                toast.success(`Bỏ xuất bản bài học thành công`)
            } else {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`)
                toast.success(`Xuất bản bài học thành công`)
            }
            router.refresh()
        } catch (error) {
            toast.error((error as Error).message)
        } finally {
            setIsLoading(false)
        }
    }
    const onDelete = async () => {
        try {
            setIsLoading(true)
            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`)
            toast.success(`Xóa bài học thành công`)
            router.push(`/teacher/courses/${courseId}`)
        } catch (error) {
            toast.error((error as Error).message)
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className='flex items-center gap-x-2'>
            <Button onClick={onClick} disabled={disabled || isLoading} variant='outline' size='sm'>
                {isPublished ? 'Bỏ xuất bản' : 'Xuất bản'}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size='sm' disabled={isLoading}>
                    {isLoading ? <Loader2 className='animate-spin' /> : <Trash className='w-4 h-4' />}
                </Button>
            </ConfirmModal>
        </div>
    )
}

export default ChapterActions
