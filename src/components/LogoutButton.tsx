import { logout } from "@/lib/authActions";

const LogoutButton = () => {
  return (
    <form
      className="flex justify-end"
      action={async () => {
        "use server";
        await logout();
      }}
    >
      <button
        type="submit"
        className="m-4 bg-background hover:bg-bg-darker text-foreground  font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Logout
      </button>
    </form>
  );
};

export default LogoutButton;
