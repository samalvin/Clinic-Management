// import LoginPage from '@/app/Login/page'
import { getLoggedInUser } from "@/lib/server/appwrite";
import { redirect } from "next/navigation";

const Settings = async () => {
   const user = await getLoggedInUser();
   console.log({user})
  if (!user) redirect("/Login");

  return (
    <>
      <h1>Settings</h1>
      <p>Settings page</p>
    </>
  )
}

export default Settings