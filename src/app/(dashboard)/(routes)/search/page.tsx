import { db } from "@/lib/db";
import React from "react";
import Categories from "./_components/Categories";
import SearchInput from "@/components/SearchInput";

type Props = {};

const SearchPage = async (props: Props) => {
    const categories = await db.category.findMany({
        orderBy: {
            name: "asc",
        },
    });
    return (
        <>
            <div className="p-6 md:hidden mb:mb-0 block">
                <SearchInput />
            </div>
            <div className="p-6">
                <Categories items={categories} />
            </div>
        </>
    );
};

export default SearchPage;
