import { IconBadge } from "@/components/IconBadge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { LayoutDashboard } from "lucide-react";
import { redirect } from "next/navigation";
import TitleForm from "./_components/TitleForm";
import DescriptionForm from "./_components/DescriptionForm";
type Props = { params: { courseId: string } };

const CourseIdPage = async ({ params }: Props) => {
    const { userId } = auth();
    if (!userId) return redirect("/sign-in");
    const course = await db.course.findUnique({
        where: { id: params.courseId },
    });
    if (!course) return <div>Không tìm thấy khóa học</div>;

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
    ];

    const totalFields = requiredFields.length;
    const completedField = requiredFields.filter(Boolean).length;

    const completionText = `${completedField}/${totalFields}`;

    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">Thiết lập khóa học</h1>
                    <span className="text-sm text-slate-700">Đã hoàn thành {completionText}</span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge size="sm" variant="success" icon={LayoutDashboard} />
                        <h2 className="text-xl">Tùy chỉnh khóa học của bạn</h2>
                    </div>
                    <TitleForm initialData={course} courseId={course.id} />
                    <DescriptionForm initialData={course} courseId={course.id} />
                </div>
            </div>
        </div>
    );
};

export default CourseIdPage;
