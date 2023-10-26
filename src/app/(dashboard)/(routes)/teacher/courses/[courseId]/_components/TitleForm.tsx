"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField, FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
type TitleFormProps = {
    initialData: Course;
    courseId: string;
};

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Tiêu đề không được để trống",
    }),
});
const TitleForm = ({ initialData, courseId }: TitleFormProps) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = React.useState(false);
    const toggleEdit = () => setIsEditing((current) => !current);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title || "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Cập nhật tiêu đề thành công");
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error((error as Error).message);
        }
    };
    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Tên khóa học
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing ? (
                        <>Hủy</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && <p className="text-sm mt-2">{initialData.title}</p>}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            {...field}
                                            placeholder="Nhập tiêu đề khóa học"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button disabled={!isValid || isSubmitting} type="submit">
                                Lưu
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
};

export default TitleForm;
