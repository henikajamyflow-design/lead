import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-2xl text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[linear-gradient(135deg,#00F0FF_0%,#00FF9F_100%)] text-black shadow-[0_0_32px_rgba(0,240,255,0.18)] hover:scale-[1.01]",
        secondary:
          "glass-card text-white hover:border-cyan-300/30 hover:text-cyan-100",
        ghost: "bg-transparent text-zinc-300 hover:bg-white/5 hover:text-white",
        outline: "border border-white/10 bg-black/30 text-white hover:border-cyan-300/30",
        destructive: "bg-[#241116] text-[#ffb0bb] hover:bg-[#34151d]",
      },
      size: {
        sm: "h-9 px-3.5",
        md: "h-11 px-4.5",
        lg: "h-12 px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
