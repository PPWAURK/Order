"use client";

import { useFormStatus } from "react-dom";

import { clsx } from "clsx";

type SubmitButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  pendingLabel?: string;
};

export function SubmitButton({
  children,
  className,
  disabled,
  pendingLabel = "提交中...",
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      {...props}
      className={clsx(
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      disabled={pending || disabled}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
