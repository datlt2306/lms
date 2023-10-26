import { IconBadge } from "@/components/IconBadge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ArrowLeft, Eye, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ChapterTitleForm from "./_components/ChangeTitleForm";
import { Course } from "@prisma/client";
import ChapterDescriptionForm from "./_components/ChapterDescriptionForm";
import ChapterAccessForm from "./_components/ChapterAccessForm";

type ChapterIdPageProps = {
    params: { chapterId: string; courseId: string };
};

const ChapterIdPage = async ({ params }: ChapterIdPageProps) => {
    const { userId } = auth();
    if (!userId) return redirect("/sign-in");

    const chapter = await db.chapter.findUnique({
        where: { id: params.chapterId, courseId: params.courseId },
        include: { muxData: true },
    });
    if (!chapter) return redirect(`/`);

    const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

    const totalFields = requiredFields.length;
    const completedField = requiredFields.filter(Boolean).length;

    const completionText = `${completedField}/${totalFields}`;
    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <Link
                        href={`/teacher/courses/${params.courseId}`}
                        className="flex items-center text-sm hover:opacity-75 transition mb-6"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại khóa học
                    </Link>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col gap-y-2">
                            <h1 className="text-2xl font-medium">Chapter creation</h1>
                            <span className="text-sm text-slate-700">
                                Complete {completionText}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className="text-xl">Tùy chỉnh</h2>
                        </div>
                        <ChapterTitleForm
                            initialData={chapter}
                            courseId={params.courseId}
                            chapterId={params.chapterId}
                        />
                        <ChapterDescriptionForm
                            initialData={chapter}
                            courseId={params.courseId}
                            chapterId={params.chapterId}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={Eye} />
                            <h2 className="text-xl">Thiết lập</h2>
                        </div>
                        <ChapterAccessForm
                            initialData={chapter}
                            courseId={params.courseId}
                            chapterId={params.chapterId}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChapterIdPage;
