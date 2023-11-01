import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Chapter, Course, UserProgress } from '@prisma/client'
import { Menu } from 'lucide-react'
import { CourseSidebar } from './CourseSidebar'

type CourseMobileSidebarProps = {
    course: Course & {
        chapters: Chapter &
            {
                userProgres: UserProgress | null
            }[]
    }
    progressCount: number
}
const CourseMobileSidebar = ({ course, progressCount }: any) => {
    return (
        <Sheet>
            <SheetTrigger className='md:hidden pr-4 hover:opacity-75 transition'>
                <Menu />
            </SheetTrigger>
            <SheetContent className='p-0 bg-white w-72' side='left'>
                <CourseSidebar course={course} progressCount={progressCount} />
            </SheetContent>
        </Sheet>
    )
}

export default CourseMobileSidebar
