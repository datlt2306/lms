import SearchInput from '@/components/SearchInput'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { getCourses } from '../../../../../actions/get-courses'
import Categories from './_components/Categories'
import CoursesList from '@/components/CoursesList'

type SearchPageProps = {
    searchParams: {
        title: string
        categoryId: string
    }
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
    const { userId } = auth()
    if (!userId) return redirect('/sign-in')
    const categories = await db.category.findMany({
        orderBy: {
            name: 'asc'
        }
    })
    const courses = await getCourses({
        userId,
        ...searchParams
    })
    return (
        <>
            <div className='p-6 md:hidden mb:mb-0 block'>
                <SearchInput />
            </div>
            <div className='p-6 space-y-4'>
                <Categories items={categories} />
                <CoursesList items={courses} />
            </div>
        </>
    )
}

export default SearchPage
