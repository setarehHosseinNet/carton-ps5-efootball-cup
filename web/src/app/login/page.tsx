import { loginAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next = "/" } = await searchParams;

  return (
    <main className="container mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold mb-4">ورود</h1>
      <form action={loginAction} className="space-y-3">
        <input name="username" className="w-full border rounded p-2" placeholder="نام کاربری" />
        <input name="password" type="password" className="w-full border rounded p-2" placeholder="رمز" />
        <input type="hidden" name="next" value={next} />
        <button className="px-4 py-2 rounded bg-black text-white">ورود</button>
      </form>
    </main>
  );
}
