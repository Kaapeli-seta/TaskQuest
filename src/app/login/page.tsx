import { redirect } from "next/navigation";
import { login } from "../../lib/authActions";

import Link from "next/link";

export default function Login() {
  return (
    <section>
      <div className="flex flex-col p-8">
        <form
          action={async (formData) => {
            "use server";
            await login(formData);
            redirect("/");
          }}
        >
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-foreground text-sm font-bold mb-2"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-foreground text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            type="submit"
            className="m-2.5 cursor-pointer rounded-md bg-bg-shade p-2.5 duration-500 hover:bg-bg-darker"
          >
            Login
          </button>
          <Link
            href="/register"
            className="m-2.5 cursor-pointer rounded-md bg-bg-shade p-2.5 duration-500 hover:bg-bg-darker"
          >
            or Register
          </Link>
        </form>
      </div>
    </section>
  );
}
