"use client";
import { UserButton } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";

type Props = {};

const NavbarRoutes = (props: Props) => {
    const pathName = usePathname();
    const router = useRouter();

    const teacherPage = pathName?.includes("/teacher");
    const isPlayerPage = pathName?.includes("/chapter");

    return (
        <div className="flex gap-x-2 ml-auto">
            {/* <UserButton afterSignOutUrl="/" /> */}
            {teacherPage || isPlayerPage ? (
                <Button size="sm" variant="secondary">
                    <LogOut className="h-4 w-4 mr-2" /> Exits
                </Button>
            ) : (
                <Link href="/teacher/course">
                    <Button size="sm" variant="ghost">
                        Teacher mode
                    </Button>
                </Link>
            )}
            <UserButton afterSignOutUrl="/" />
        </div>
    );
};

export default NavbarRoutes;
