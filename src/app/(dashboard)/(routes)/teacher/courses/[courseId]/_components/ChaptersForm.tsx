'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Chapter, Course } from '@prisma/client'
import axios from 'axios'
import { Loader2, Pencil, PlusCircle, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as z from 'zod'
import { ChaptersList } from './ChaptersList'
type ChaptersFormProps = {
    initialData: Course & { chapters: Chapter[] }
    courseId: string
}

const formSchema = z.object({
    title: z.string().min(1)
})
const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps) => {
    const [isCreating, setIsCreating] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    const toggleCreating = () => setIsCreating((current) => !current)
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ''
        }
    })

    const { isSubmitting, isValid } = form.formState

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/chapters`, values)
            toast.success('Tạo chương thành công')
            toggleCreating()
            form.reset()
            router.refresh()
        } catch (error) {
            toast.error((error as Error).message)
        }
    }

    const reOrder = async (updateData: { id: string; position: number }[]) => {
        try {
            setIsUpdating(true)
            await axios.put(`/api/courses/${courseId}/chapters/reorder`, { list: updateData })
            toast.success('Cập nhật thứ tự thành công')
            router.refresh()
        } catch (error) {
            toast.error((error as Error).message)
        } finally {
            setIsUpdating(false)
        }
    }
    const onEdit = async (id: string) => {
        try {
            router.push(`/teacher/courses/${courseId}/chapters/${id}`)
        } catch (error) {}
    }
    return (
        <div className='relative mt-6 border bg-slate-100 rounded-md p-4'>
            {isUpdating && (
                <div className='absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center'>
                    <Loader2 className='animate-spin w-6 h-6 text-sky-700' />
                </div>
            )}
            <div className='font-medium flex items-center justify-between'>
                Chương học
                <Button variant='ghost' onClick={toggleCreating}>
                    {isCreating ? (
                        <>Hủy</>
                    ) : (
                        <>
                            <PlusCircle className='h-4 w-4 mr-2' />
                            Thêm
                        </>
                    )}
                </Button>
            </div>

            {isCreating && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-y-8'>
                        <FormField
                            control={form.control}
                            name='title'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            {...field}
                                            placeholder='Giới thiệu về khóa học...'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='flex items-center gap-x-2'>
                            <Button disabled={!isValid || isSubmitting} type='submit'>
                                Tạo mới
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div className={cn('text-sm mt-2', !initialData.chapters.length && 'text-slate-500 italic')}>
                    {!initialData.chapters.length && 'Không có chương nào'}
                    <ChaptersList onEdit={onEdit} onReorder={reOrder} items={initialData.chapters || []} />
                </div>
            )}
            {!isCreating && <p className='text-xs text-muted-foreground mt-4'>Kéo thả để sắp xếp lại các chương học</p>}
        </div>
    )
}

export default ChaptersForm
