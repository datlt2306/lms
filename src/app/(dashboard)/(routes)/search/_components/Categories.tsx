"use client";
import { Category } from "@prisma/client";
import React from "react";
import { IconType } from "react-icons";
import {
    FcEngineering,
    FcFilmReel,
    FcMultipleDevices,
    FcMusic,
    FcOldTimeCamera,
    FcSalesPerformance,
    FcSportsMode,
} from "react-icons/fc";
import CategoryItem from "./CategoryItem";
type CategoriesProps = {
    items: Category[];
};
const iconMap: Record<Category["name"], IconType> = {
    Music: FcMusic,
    Photography: FcOldTimeCamera,
    "Web Development": FcMultipleDevices,
    "Mobile Development": FcMultipleDevices,
    "Game Development": FcSportsMode,
    "Software Engineering": FcEngineering,
    Sales: FcSalesPerformance,
    Filming: FcFilmReel,
};
const Categories = ({ items }: CategoriesProps) => {
    return (
        <div className="flex items-center gap-x-2 overflow-auto pb-2">
            {items.map((item) => (
                <CategoryItem
                    key={item.id}
                    label={item.name}
                    icon={iconMap[item.name]}
                    value={item.id}
                />
            ))}
        </div>
    );
};

export default Categories;
