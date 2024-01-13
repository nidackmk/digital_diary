"use client";
import { useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      const res = await createUserWithEmailAndPassword(email, password);
      console.log({ res });
      sessionStorage.setItem("user", true);
      setEmail("");
      setPassword("");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="flex flex-col w-full md:flex-row">
        <div className="bg-white flex justify-center items-center w-full md:w-1/2 h-screen">
          <img src="./appbar.png" alt="" className="h-full w-full object-cover object-center" />
        </div>
        <div className="bg-black flex flex-col justify-center items-center w-full md:w-1/2 py-12 px-4 sm:px-6 lg:px-8">
          <div className="p-10 rounded-lg shadow-xl w-96">
            <h1 className="text-4xl font-bold text-white text-start py-5">Kayıt Ol</h1>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-4 bg-gray-900 rounded-xl outline-none text-white placeholder-gray-500"
            />
            <input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-4 bg-gray-900 rounded-xl outline-none text-white placeholder-gray-500"
            />
            <button onClick={handleSignUp} className="w-full p-3 bg-gray-900 rounded-2xl text-green-600 font-light text-lg hover:bg-green-900">
              Kayıt Ol
            </button>
            <div className="flex items-center justify-between mt-4">
              <a href="#" className="text-xs text-gray-100 cursor-pointer">
                Hesabın Var Mı ?{" "}
              </a>
              <a onClick={() => router.push("/Login")} href="#" className="text-xs text-gray-100 cursor-pointer">
                Giriş Yap!
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
