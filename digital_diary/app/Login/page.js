// Login.js
"use client";

import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth"; // Firebase Authentication'dan doğrulama işlemleri için kullanılacak metot

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Firebase Authentication'da kullanıcı girişi
      // Bu kısmı Firebase Authentication ile uyumlu bir şekilde güncellemelisiniz
      // Örnek: await signInWithEmailAndPassword(auth, email, password);
      // Hata durumunda catch bloğunu kullanabilirsiniz.
      // Daha fazla bilgi için Firebase Authentication dokümantasyonuna göz atın: https://firebase.google.com/docs/auth/web/password-auth
      // onLogin fonksiyonu, kullanıcı başarıyla giriş yaptığında ana sayfaya yönlendirmek için kullanılabilir.
      onLogin(); // Bu fonksiyonu kullanıcı girişi başarılı olduktan sonra çağırabilirsiniz.
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-md w-full p-6 bg-gray-800 rounded-md shadow-lg">
        <h2 className="text-3xl font-semibold text-white mb-6">Giriş Yap</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-white">E-posta</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-green-500"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-white">Şifre</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-green-500"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
