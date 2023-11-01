import { IconBadge } from '@/components/IconBadge'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from 'lucide-react'
import { redirect } from 'next/navigation'
import TitleForm from './_components/TitleForm'
import DescriptionForm from './_components/DescriptionForm'
import ImageForm from './_components/ImageForm'
import CategoryForm from './_components/CategoryForm'
import PriceForm from './_components/PriceForm'
import AttachmentForm from './_components/AttachmentForm'
import ChaptersForm from './_components/ChaptersForm'
import Actions from './_components/Actions'
import Banner from '@/components/Banner'
type Props = { params: { courseId: string } }

const CourseIdPage = async ({ params }: Props) => {
    const { userId } = auth()
    if (!userId) return redirect('/sign-in')
    const course = await db.course.findUnique({
        where: { id: params.courseId, userId },
        include: {
            chapters: {
                orderBy: {
                    position: 'asc'
                }
            },
            attachments: {
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    })

    const categories = await db.category.findMany({
        orderBy: {
            name: 'asc'
        }
    })

    if (!course) return redirect('/')

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
        course.chapters.some((chapter) => chapter.isPublished)
    ]

    const totalFields = requiredFields.length
    const completedField = requiredFields.filter(Boolean).length

    const completionText = `${completedField}/${totalFields}`
    const isComplete = requiredFields.every(Boolean)
    return (
        <>
            {!course.isPublished && (
                <Banner
                    variant='warning'
                    label='Khóa học này vẫn chưa được xuất bản. Nó sẽ không hiển thị đối với người học'
                />
            )}
            <div className='p-6'>
                <div className='flex items-center justify-between'>
                    <div className='flex flex-col gap-y-2'>
                        <h1 className='text-2xl font-medium'>Thiết lập khóa học</h1>
                        <span className='text-sm text-slate-700'>Đã hoàn thành {completionText}</span>
                    </div>
                    <Actions disabled={!isComplete} courseId={params.courseId} isPublished={course.isPublished} />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
                    <div>
                        <div className='flex items-center gap-x-2'>
                            <IconBadge size='default' icon={LayoutDashboard} />
                            <h2 className='text-xl'>Tùy chỉnh khóa học của bạn</h2>
                        </div>
                        <TitleForm initialData={course} courseId={course.id} />
                        <DescriptionForm initialData={course} courseId={course.id} />
                        <ImageForm initialData={course} courseId={course.id} />
                        <CategoryForm
                            initialData={course}
                            courseId={course.id}
                            options={categories.map((category) => ({
                                label: category.name,
                                value: category.id
                            }))}
                        />
                    </div>
                    <div className='space-y-6'>
                        <div>
                            <div className='flex items-center gap-x-2'>
                                <IconBadge size='default' icon={ListChecks} />
                                <h2 className='text-xl'>Danh sách các chương</h2>
                            </div>
                            <ChaptersForm initialData={course} courseId={course.id} />
                        </div>
                        <div>
                            <div className='flex items-center gap-x-2'>
                                <IconBadge size='default' icon={CircleDollarSign} />
                                <h2 className='text-xl'>Khóa học đang bán</h2>
                            </div>
                            <PriceForm initialData={course} courseId={course.id} />
                        </div>
                        <div>
                            <div className='flex items-center gap-x-2'>
                                <IconBadge size='default' icon={File} />
                                <h2 className='text-xl'>Tài nguyên & tệp đính kèm</h2>
                            </div>
                            <AttachmentForm initialData={course} courseId={course.id} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CourseIdPage
