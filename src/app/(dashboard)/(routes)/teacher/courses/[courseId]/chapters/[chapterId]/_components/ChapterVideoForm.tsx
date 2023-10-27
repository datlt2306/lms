"use client";
import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Chapter, Course, MuxData } from "@prisma/client";
import axios from "axios";
import { ImageIcon, Pencil, PlusCircle, Video } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import * as z from "zod";
import MuxPlayer from "@mux/mux-player-react";

type ChapterVideoFormProps = {
    initialData: Chapter & { muxData: MuxData | null };
    courseId: string;
    chapterId: string;
};

const formSchema = z.object({
    videoUrl: z.string().min(1),
});
const ChapterVideoForm = ({ initialData, courseId, chapterId }: ChapterVideoFormProps) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = React.useState(false);
    const toggleEdit = () => setIsEditing((current) => !current);
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast.success("Cập nhật bài học thành công");
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error((error as Error).message);
        }
    };
    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Video bài học
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing && <>Hủy</>}
                    {!isEditing && !initialData.videoUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" /> Thêm
                        </>
                    )}
                    {!isEditing && initialData.videoUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                        </>
                    )}
                </Button>
            </div>
            {!isEditing &&
                (!initialData.videoUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <Video className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <MuxPlayer playbackId={initialData?.muxData?.playbackId || ""} />
                    </div>
                ))}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="chapterVideo"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ videoUrl: url });
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">Upload video</div>
                </div>
            )}
            {initialData.videoUrl && !isEditing && (
                <div className="text-xs text-muted-forgeground mt-2">
                    Video có thể mất vài phút để xử lý. Làm mới trang nếu video không hiển thị.
                </div>
            )}
        </div>
    );
};

export default ChapterVideoForm;
