"use client";
import { auth, provider } from "@/utils/firebase";
import { getAuth, signInWithPopup } from "firebase/auth";
import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { useAuthState } from 'react-firebase-hooks/auth';


export default function Page() {
  const [user] = useAuthState(auth);

  useEffect(()=>{
    if(user){
      window.location.href = "/play/online";
    }
  }, [user]);

  return (
    <div >
      {user ? <p>{auth.currentUser?.displayName}</p> : ""}
      <button className="btn " onClick={() => {
        if(user){
          auth.signOut();
        }else{
          window.my_modal_1.showModal();
        }
      }}>
        {user ? "Sign Out" : "Sign Up"}
      </button>
      <dialog id="my_modal_1" className="modal">
        <form
          method="dialog"
          className="modal-box flex items-center flex-col space-y-4 bg-stone-900 sm:w-1/2  sm:max-w-lg sm:p-12"
        >
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-neutral-700 text-xl font-semibold">
            ✕
          </button>
          <div className="text-center">
            <h3 className="text-4xl text-white font-bold">Join Now</h3>
            <p className="py-2 font-semibold text-neutral-400">
              and Start Playing Chess!
            </p>
          </div>
          <input
            type="text"
            placeholder="Username"
            className="input bg-stone-600/50 w-full rounded-md text-neutral-300 "
          />
          <input
            type="email"
            placeholder="Email"
            className="input bg-stone-600/50 w-full rounded-md text-neutral-300 "
          />
          <input
            type="text"
            placeholder="Password"
            className="input bg-stone-600/50 w-full rounded-md text-neutral-300 "
          />
          <button className="bg-lime-300/70 font-bold border border-b-8 border-green-900/70 rounded-b-2xl rounded-xl sm:text-xl  text-white p-2 py-3 w-full">
            Sign Up
          </button>
          <p className="text-sm">OR</p>
          <div className="w-full p-3 px-6 text-black rounded-md bg-white flex">
            <FcGoogle className="inline-block mr-2 text-3xl" />
            <button
              className="text-black font-semibold text-sm bg-white w-full mr-6"
              onClick={() => signInWithPopup(auth, provider)}
            >
              Sign Up with Google
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
