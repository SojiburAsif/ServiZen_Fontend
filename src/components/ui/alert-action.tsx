import * as React from "react";

export function AlertAction({ children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className="col-start-2 mt-2" {...props}>
      {children}
    </div>
  );
}
