import { twMerge } from "tailwind-merge";

export const Layout = ({
  children,
  className,
  ...prop
}: {
  children: React.ReactNode;
  className?: React.ComponentProps<"div">["className"];
} & React.ComponentProps<"div">) => (
  <div className={twMerge("flex h-9/10 flex-col items-center justify-center", className)} {...prop}>
    {children}
  </div>
);
