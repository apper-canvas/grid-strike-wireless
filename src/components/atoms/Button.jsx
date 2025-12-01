import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  disabled = false,
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary/80 text-white border-primary/20 hover:shadow-neon",
    secondary: "bg-gradient-to-r from-secondary to-secondary/80 text-white border-secondary/20 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]",
    outline: "bg-transparent text-white border-primary hover:bg-primary/10 hover:shadow-neon",
    ghost: "bg-transparent text-white/80 border-transparent hover:bg-white/10 hover:text-white",
    success: "bg-gradient-to-r from-success to-success/80 text-white border-success/20 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
  }

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl"
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg border-2 font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button