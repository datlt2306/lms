"use client";

import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { useDebounce } from "../../hooks/use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
type Props = {};

const SearchInput = (props: Props) => {
    const [value, setValue] = useState("");
    const debounceValue = useDebounce(value, 500);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathName = usePathname();

    const currentCategory = searchParams.get("categoryId");

    useEffect(() => {
        const url = qs.stringifyUrl(
            {
                url: pathName,
                query: { categoryId: currentCategory, title: debounceValue },
            },
            { skipNull: true, skipEmptyString: true }
        );

        router.push(url);
    }, [debounceValue, currentCategory, router, pathName]);
    return (
        <div className="relative">
            <Search className="w-4 h-4 absolute top-3 left-3 text-slate-600" />
            <Input
                onChange={(e) => setValue(e.target.value)}
                value={value}
                className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
                placeholder="Tìm kiếm khóa học"
            />
        </div>
    );
};

export default SearchInput;
