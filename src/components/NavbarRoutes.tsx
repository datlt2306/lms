'use client'
import { UserButton } from '@clerk/nextjs'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { LogOut } from 'lucide-react'
import Link from 'next/link'
import SearchInput from './SearchInput'

type Props = {}

const NavbarRoutes = (props: Props) => {
    const pathName = usePathname()

    const teacherPage = pathName?.includes('/teacher')
    const isPlayerPage = pathName?.includes('/chapter')
    const isSearchPage = pathName === '/search'

    return (
        <>
            {isSearchPage && (
                <div className='hidden md:block'>
                    <SearchInput />
                </div>
            )}
            <div className='flex gap-x-2 ml-auto'>
                {/* <UserButton afterSignOutUrl="/" /> */}
                {teacherPage || isPlayerPage || isSearchPage ? (
                    <Link href='/'>
                        <Button size='sm' variant='secondary'>
                            <LogOut className='h-4 w-4 mr-2' /> Thoát
                        </Button>
                    </Link>
                ) : (
                    <Link href='/teacher/courses'>
                        <Button size='sm' variant='ghost'>
                            Chế độ giảng viên
                        </Button>
                    </Link>
                )}
                <UserButton afterSignOutUrl='/' />
            </div>
        </>
    )
}

export default NavbarRoutes
