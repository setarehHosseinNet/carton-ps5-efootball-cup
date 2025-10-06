"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createGroupAction, type CreateGroupState } from "./actions";

const initialState: CreateGroupState = {};

export default function NewGroupForm() {
  const [state, formAction] = useFormState(createGroupAction, initialState);
  const { pending } = useFormStatus();

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="rounded bg-red-50 p-2 text-red-700">{state.error}</div>
      )}
      {state?.success && (
        <div className="rounded bg-emerald-50 p-2 text-emerald-700">
          گروه با موفقیت ایجاد شد.
        </div>
      )}

      <div>
        <label className="block mb-1">نام گروه</label>
        <input name="name" required className="w-full border rounded p-2" />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
      >
        {pending ? "در حال ثبت..." : "ثبت"}
      </button>
    </form>
  );
}
