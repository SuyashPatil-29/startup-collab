import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const MaxWidthWrapper = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div className={cn("mx-auto w-full max-w-7xl", className)}>
      <a href="/" className={`text-xl font-bold max-w-7xl`}>
        StartupCollab
      </a>
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
