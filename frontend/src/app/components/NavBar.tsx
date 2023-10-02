"use client";

import { auth } from "@/utils/firebase";
import Image from "next/image";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export const NavBar = () => {
    const [user] = useAuthState(auth);

    return <div className="p-2 flex justify-between items-center">
        {user ? <>
            <div className="flex items-center">
                <Image className="rounded-full mr-2" alt="profile" width={50} height={50} src={user?.photoURL!} /> <p className="text-lg">{user?.displayName}</p>
            </div>
            <button className="btn btn-error" onClick={async () => {
                auth.signOut();
                window.location.href = "/auth/login";
            }}>
                Sign Out
            </button>
        </> : ""}
    </div>
}