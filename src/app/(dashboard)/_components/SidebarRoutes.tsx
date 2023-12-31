'use client'

type Props = {}
import { BarChart, Compass, Layout, List } from 'lucide-react'
import { usePathname } from 'next/navigation'
import SidebarItem from './SidebarItem'

const guestRoutes = [
    {
        icon: Layout,
        label: 'Thống kê',
        href: '/'
    },
    {
        icon: Compass,
        label: 'Browse',
        href: '/search'
    }
]

const teacherRoutes = [
    {
        icon: List,
        label: 'Khóa học',
        href: '/teacher/courses'
    },
    {
        icon: BarChart,
        label: 'Phân tích',
        href: '/teacher/analytics'
    }
]

const SidebarRoutes = (props: Props) => {
    const pathName = usePathname()
    const isTeacherPage = pathName?.includes('/teacher')
    const routes = isTeacherPage ? teacherRoutes : guestRoutes
    return (
        <div className='flex flex-col w-full'>
            {routes.map((route) => (
                <SidebarItem key={route.href} icon={route.icon} label={route.label} href={route.href} />
            ))}
        </div>
    )
}

export default SidebarRoutes
