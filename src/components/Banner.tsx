import { AlertTriangle, CheckCircleIcon, CheckIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const bannerVariants = cva("border text-center p-4 text-sm flex items-center w-full", {
    variants: {
        variant: {
            warning: "bg-yellow-200/80 border-yellow-30 text-primary",
            success: "bg-emerald-700 border-emerald-700 text-secondary",
        },
        defaultVariants: { warining: "warning" },
    },
});
const iconMap = {
    warning: AlertTriangle,
    success: CheckCircleIcon,
};
interface BannerProps extends VariantProps<typeof bannerVariants> {
    label: string;
}

const Banner = ({ label, variant }: BannerProps) => {
    const Icon = iconMap[variant || "warning"];
    return (
        <div className={cn(bannerVariants({ variant }))}>
            <Icon className="h-6 w-6 mr-2" />
            {label}
        </div>
    );
};

export default Banner;
