import {
  createSessionClient,
  getLoggedInUser,
} from "@/lib/server/appwrite";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
const Signout = async () => {
    const user = await getLoggedInUser();
    if (!user) redirect("/signup");
    async function signOut() {
        "use server";
        const { account } = await createSessionClient();
        await cookies().delete("my-clinic-session");
        await account.deleteSession("current");
        redirect("/signup");
      }
    return (
        <form action={signOut}>
            <button type="submit">Sign out</button>
        </form>
    )
}

export default Signout;