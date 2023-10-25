"use client";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const formSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
});

const CreatePage = () => {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    });
    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/courses", values);
            router.push(`/teacher/course/${response.data.id}`);
            toast.success("Tạo khóa học thành công");
        } catch (error) {
            toast.error((error as Error).message);
        }
    };

    return (
        <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
            <div>
                <h1 className="text-2xl">Tên khóa học</h1>
                <p className="text-sm text-slate-600">
                    Bạn muốn tên khóa học của bạn là gì? Đừng lo, bạn có thể thay đổi nó sau.
                </p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên khóa học</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="Lập trình web..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Bạn sẽ dạy gì trong khóa học này?
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        ></FormField>
                        <div className="flex items-center gap-x-2">
                            <Link href="/">
                                <Button type="button" variant="secondary">
                                    Thoát
                                </Button>
                            </Link>
                            <Button type="submit" disabled={!isValid || isSubmitting}>
                                Tiếp tục
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default CreatePage;
