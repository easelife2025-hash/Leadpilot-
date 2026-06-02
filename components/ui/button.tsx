import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary" | "glass" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default: "bg-indigo-600 text-white shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] hover:bg-indigo-700 hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-[1px]",
      glass: "bg-white/60 backdrop-blur-md border border-white/50 shadow-sm hover:shadow-md hover:bg-white/80 text-indigo-900 hover:-translate-y-[1px]",
      outline: "border border-slate-200/80 bg-white/50 backdrop-blur-sm hover:bg-white/90 text-slate-900 hover:shadow-sm",
      secondary: "bg-sky-50 text-sky-700 hover:bg-sky-100",
      ghost: "hover:bg-slate-100/50 text-slate-600 hover:text-slate-900",
      link: "text-indigo-600 underline-offset-4 hover:underline",
    };
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-lg px-3 text-sm",
      lg: "h-12 rounded-xl px-8 text-base",
      icon: "h-10 w-10 rounded-xl",
    };
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
export { Button }
