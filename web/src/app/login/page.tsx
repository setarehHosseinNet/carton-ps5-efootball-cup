// web/src/app/login/page.tsx
import { loginAction } from "./actions";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
    const sp = await searchParams;
    const next =
        typeof sp.next === "string" && sp.next.startsWith("/") ? sp.next : "/";

    const error = typeof sp.error === "string" ? sp.error : "";
    const errorMsg =
        error === "empty"   ? "نام کاربری و رمز عبور را وارد کنید."
            : error === "invalid" ? "نام کاربری یا رمز عبور نادرست است."
                : "";

    // فرم مستقیماً Server Action را صدا می‌زند
    async function submit(fd: FormData) {
        "use server";
        // loginAction خودش در موفقیت/خطا redirect می‌کند
        await loginAction(fd);
    }

    return (
        <main className="container mx-auto max-w-md p-6">
            <h1 className="text-2xl font-bold mb-4">ورود</h1>

            {errorMsg && (
                <p className="mb-3 rounded border border-red-300 bg-red-50 p-2 text-red-700">
                    {errorMsg}
                </p>
            )}

            <form action={submit} className="space-y-3">
                <input
                    name="username"
                    placeholder="نام کاربری"
                    required
                    className="border p-2 w-full"
                    autoComplete="username"
                />
                <input
                    name="password"
                    type="password"
                    placeholder="رمز عبور"
                    required
                    className="border p-2 w-full"
                    autoComplete="current-password"
                />
                <input type="hidden" name="next" value={next} />
                <button type="submit" className="border px-4 py-2 w-full">
                    ورود
                </button>
            </form>
        </main>
    );
}
