'use client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Category } from '@prisma/client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { IconType } from 'react-icons'
import qs from 'query-string'

type CategoryItemProps = {
    label: string
    value?: string
    icon?: IconType
}

const CategoryItem = ({ label, value, icon: Icon }: CategoryItemProps) => {
    const pathName = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()

    const currentCategoryId = searchParams.get('categoryId')
    const currentTitle = searchParams.get('title')

    const isSelected = currentCategoryId === value

    const onClick = () => {
        const url = qs.stringifyUrl(
            {
                url: pathName,
                query: {
                    title: currentTitle,
                    categoryId: isSelected ? null : value
                }
            },
            { skipNull: true, skipEmptyString: true }
        )
        router.push(url)
    }
    return (
        <>
            <Button
                variant='secondary'
                onClick={onClick}
                className={cn(
                    'py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-sky-700 transition',
                    isSelected && 'border-sky-700 bg-sky-200/20 text-sky-800'
                )}
                type='button'
            >
                {Icon && <Icon size={20} />}
                <div className='truncate'>{label}</div>
            </Button>
        </>
    )
}

export default CategoryItem
