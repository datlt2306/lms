'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { IconBadge } from './IconBadge'
import { BookIcon } from 'lucide-react'
import { formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'
type CourseCardProps = {
    title: string
    id: string
    imageUrl: string
    chaptersLength: number
    price: number
    progress: number | null
    category: string | null
}
const CourseCard = ({ title, id, imageUrl, chaptersLength, price, progress, category }: CourseCardProps) => {
    return (
        <>
            <div>
                <Link href={`/courses/${id}`}>
                    <div className='group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full'>
                        <div className='relative w-full aspect-video rounded-md overflow-hidden'>
                            <Image fill className='object-cover' alt={title} src={imageUrl} />
                        </div>
                        <div className='flex flex-col pt-2'>
                            <h3 className='text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2'>
                                {title}
                            </h3>
                            <p className='text-xs text-muted-foreground'>{category}</p>
                            <div className='my-3 items-center gap-x-2 text-sm md:text-xs'>
                                <div className='flex items-center gap-x-1 text-slate-500'>
                                    <IconBadge size='sm' icon={BookIcon} />
                                    <span>{chaptersLength} Bài giảng</span>
                                </div>
                            </div>
                            {progress !== null ? (
                                <div>Đang học</div>
                            ) : (
                                <p
                                    className='md:text-xs font-medium text-slate-700'
                                    dangerouslySetInnerHTML={{ __html: formatPrice(price || 0) }}
                                />
                            )}
                        </div>
                    </div>
                </Link>
            </div>
        </>
    )
}

export default CourseCard
