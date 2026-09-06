import * as React from "react";

import { cn } from "@/lib/utils";

/** Minimal initials avatar (no image support needed here). */
const Avatar = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span"> & { fallback: string }
>(({ className, fallback, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "inline-flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground",
      className
    )}
    {...props}
  >
    {fallback}
  </span>
));
Avatar.displayName = "Avatar";

export { Avatar };
