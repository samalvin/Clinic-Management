'use server'
import { createAdminClient } from "@/lib/server/appwrite";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
export async function signInWithEmail({ email, password }) {
    "use server";

    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);
    
    await cookies().set("my-clinic-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    
    redirect("/Dashboard");
}
