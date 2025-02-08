import { auth } from "@/auth";
import Link from "next/link";

export default async function page() {
  const session = await auth();
  return (
    <div>
      <p>user : {session.user.email}</p>
      take me to qr{" "}
      <Link href="/qr">
        <span className="text-blue-500 underline">here</span>
      </Link>
    </div>
  );
}
