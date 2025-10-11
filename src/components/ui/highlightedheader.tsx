import { cn } from "@/lib/utils";

function HighlightedHeader({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={cn("bg-secondary p-2 rounded-sm pr-10 w-fit", className)}>
            {children}
        </div>
    );
}

export default HighlightedHeader;