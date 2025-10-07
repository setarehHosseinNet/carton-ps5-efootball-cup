"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createUserAction } from "./actions";

type State = {
  error?: string;
  ok?: boolean;
};

const initialState: State = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="rounded bg-emerald-600 px-4 py-2 text-white disabled:opacity-60"
    >
      {pending ? "در حال ایجاد..." : "ایجاد"}
    </button>
  );
}

export default function NewUserForm() {
  // createUserAction(prevState, formData) -> State
  const [state, formAction] = useFormState<State, FormData>(createUserAction, initialState);

  return (
    <>
      {state.error && (
        <div className="mb-3 rounded bg-red-50 px-3 py-2 text-red-700">{state.error}</div>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <label className="mb-1 block">نام کاربری</label>
          <input
            name="username"
            required
            autoComplete="username"
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block">رمز عبور</label>
          <input
            name="password"
            type="password"
            required
            autoComplete="new-password"
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block">نقش</label>
          <select name="role" className="w-full rounded border p-2" defaultValue="user">
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        </div>

        <SubmitButton />
      </form>
    </>
  );
}

