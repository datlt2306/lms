'use client'
import FileUpload from '@/components/FileUpload'
import { Button } from '@/components/ui/button'
import { Attachment, Course } from '@prisma/client'
import axios from 'axios'
import { File, ImageIcon, Pencil, PlusCircle } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import toast from 'react-hot-toast'
import * as z from 'zod'
type AttachmentFormProps = {
    initialData: Course & { attachments: Attachment[] }
    courseId: string
}

const formSchema = z.object({
    url: z.string().min(1)
})
const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
    const router = useRouter()
    const [isEditing, setIsEditing] = React.useState(false)
    const toggleEdit = () => setIsEditing((current) => !current)
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/attachments`, values)
            toast.success('Cập nhật mô tả thành công')
            toggleEdit()
            router.refresh()
        } catch (error) {
            toast.error((error as Error).message)
        }
    }
    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                Danh sách cách tệp tin
                <Button variant='ghost' onClick={toggleEdit}>
                    {isEditing && <>Hủy</>}
                    {!isEditing && (
                        <>
                            <PlusCircle className='h-4 w-4 mr-2' /> Thêm
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <>
                    {initialData.attachments.length == 0 && (
                        <p className='text-sm text-slate-500 italic'>Không có file nào</p>
                    )}
                    {initialData.attachments.length > 0 && (
                        <div className='space-y-2'>
                            {initialData.attachments.map((attachment) => (
                                <div
                                    className='flex items-center p-3 w-full bg-sky-100 border border-sky text-sky-700 rounded-md'
                                    key={attachment.id}
                                >
                                    <File className='h-4 w-4 mr-2 flex-shrink-0' />
                                    <p>{attachment.name}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint='courseAttachment'
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ url })
                            }
                        }}
                    />
                    <div className='text-xs text-muted-foreground mt-4'>Bạn có thể thêm tài liệu, bài giảng...</div>
                </div>
            )}
        </div>
    )
}

export default AttachmentForm
