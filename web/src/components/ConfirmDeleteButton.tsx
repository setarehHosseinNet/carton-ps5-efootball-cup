"use client";

type Props = {
  className?: string;
  label?: string;
  message?: string;
};

/** دکمه‌ای که قبل از submit از کاربر تایید می‌گیرد. */
export default function ConfirmDeleteButton({
  className,
  label = "حذف",
  message = "از حذف مطمئن هستید؟",
}: Props) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {label}
    </button>
  );
}
