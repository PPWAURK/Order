"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { clsx } from "clsx";

type ConfirmActionButtonProps = {
  action: (formData: FormData) => Promise<void>;
  className?: string;
  confirmMessage: string;
  fields: Record<string, string>;
  label: string;
  pendingLabel?: string;
};

export function ConfirmActionButton({
  action,
  className,
  confirmMessage,
  fields,
  label,
  pendingLabel = "处理中...",
}: ConfirmActionButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      disabled={isPending}
      type="button"
      onClick={() => {
        if (!window.confirm(confirmMessage)) {
          return;
        }

        const formData = new FormData();

        for (const [key, value] of Object.entries(fields)) {
          formData.set(key, value);
        }

        startTransition(async () => {
          await action(formData);
          router.refresh();
        });
      }}
    >
      {isPending ? pendingLabel : label}
    </button>
  );
}
