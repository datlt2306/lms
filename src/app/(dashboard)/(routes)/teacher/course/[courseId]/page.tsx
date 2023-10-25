import { IconBadge } from "@/components/IconBadge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from "lucide-react";
import { redirect } from "next/navigation";
import TitleForm from "./_components/TitleForm";
import DescriptionForm from "./_components/DescriptionForm";
import ImageForm from "./_components/ImageForm";
import CategoryForm from "./_components/CategoryForm";
import PriceForm from "./_components/PriceForm";
type Props = { params: { courseId: string } };

const CourseIdPage = async ({ params }: Props) => {
    const { userId } = auth();
    if (!userId) return redirect("/sign-in");
    const course = await db.course.findUnique({
        where: { id: params.courseId },
    });

    const categories = await db.category.findMany({
        orderBy: {
            name: "asc",
        },
    });

    console.log(categories);
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
                        <IconBadge size="default" icon={LayoutDashboard} />
                        <h2 className="text-xl">Tùy chỉnh khóa học của bạn</h2>
                    </div>
                    <TitleForm initialData={course} courseId={course.id} />
                    <DescriptionForm initialData={course} courseId={course.id} />
                    <ImageForm initialData={course} courseId={course.id} />
                    <CategoryForm
                        initialData={course}
                        courseId={course.id}
                        options={categories.map((category) => ({
                            label: category.name,
                            value: category.id,
                        }))}
                    />
                </div>
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge size="default" icon={ListChecks} />
                            <h2 className="text-xl">Danh sách các phần</h2>
                        </div>
                        <div className="mt-5">Todo List</div>
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge size="default" icon={CircleDollarSign} />
                            <h2 className="text-xl">Khóa học đang bán</h2>
                        </div>
                        <PriceForm initialData={course} courseId={course.id} />
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge size="default" icon={File} />
                            <h2 className="text-xl">Tài nguyên & tệp đính kèm</h2>
                        </div>
                        <ImageForm initialData={course} courseId={course.id} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseIdPage;
