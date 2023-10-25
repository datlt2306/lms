"use client";
import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Course } from "@prisma/client";
import axios from "axios";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import * as z from "zod";
type AttachmentFormProps = {
    initialData: Course;
    courseId: string;
};

const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message: "Ảnh không được để trống",
    }),
});
const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = React.useState(false);
    const toggleEdit = () => setIsEditing((current) => !current);
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Cập nhật mô tả thành công");
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error((error as Error).message);
        }
    };
    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Ảnh đại diện
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing && <>Hủy</>}
                    {!isEditing && !initialData.imageUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" /> Thêm một ảnh
                        </>
                    )}
                    {!isEditing && initialData.imageUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                        </>
                    )}
                </Button>
            </div>
            {!isEditing &&
                (!initialData.imageUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <ImageIcon className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <Image
                            alt="upload"
                            fill
                            className="object-cover rounded-md"
                            src={initialData.imageUrl}
                        />
                    </div>
                ))}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="courseImage"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ imageUrl: url });
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Đề xuất tỷ lệ khung hình là 16:9
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttachmentForm;
