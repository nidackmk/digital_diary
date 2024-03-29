"use client";
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  deleteDoc,
  doc,
  serverTimestamp, // Traih alanı için ekledik
} from "firebase/firestore";
import { db } from "./firebase";
import Image from "next/image";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ metin: "" });
  const [selectedItem, setSelectedItem] = useState(null);
  const [alertShow, setAlertShow] = useState(false);

  //useRouter ile sayfa yönlendirmesi
  const router = useRouter();

  const auth = getAuth();

  const [user, setUser] = useState();

  const logout = () => {
    setUser("");
    typeof window !== "undefined" && localStorage.removeItem("user");
  };

  //if firebaseuser not logged in redirect to login page
  useEffect(() => {
    //check localstorage for user
    const data = localStorage.getItem("user");
    if (data != null) {
      router.push("/");
    } else {
      router.push("/Login");
    }
  }, [user]);

  useEffect(() => {
    //check localstorage for user
    const data = localStorage.getItem("user");
    if (data != null) {
      setUser(JSON.parse(data));
    } else {
      router.push("/Login");
    }
  }, []);

  // Firebase Authentication'dan kullanıcının oturum durumunu takip etmek için
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);

        localStorage.setItem("user", true);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  // Firebase'e veri ekleme
  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.metin !== "") {
      await addDoc(collection(db, "items"), {
        metin: newItem.metin.trim(),
        createdAt: serverTimestamp(), // Tarih bilgisini ekledik
        userEmail: user ? user.email : null, // Kullanıcının e-posta bilgisini kaydediyoruz
      });
      setNewItem({ metin: "" });
    }
  };

  useEffect(() => {
    //Kelime sınırı aşıldığında uyarı gösterme
    if (newItem.metin.length > 3000) {
      setAlertShow(true);
    }
  }, [newItem.metin]);

  // Firebase'den verileri okuma
  useEffect(() => {
    const q = query(collection(db, "items"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];

      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });

      // Sıralama işlemini burada gerçekleştiriyoruz
      itemsArr.sort((a, b) => b.createdAt - a.createdAt);

      // Eğer kullanıcı giriş yapmışsa, sadece kendi günlüklerini göster
      if (user) {
        itemsArr = itemsArr.filter((item) => item.userEmail === user.email);
      }

      setItems(itemsArr);
    });

    return () => unsubscribe();
  }, [user]);

  // Firebase'den veri silme
  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "items", id));
  };

  // Metin çok uzun olduğu zaman kutucukların içinden taşma oluyordu.
  // Belli bir uzunluk sınırı ekleyerek bunu önledik
  function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-black">
      <div className="w-full relative shadow-lg shadow-green-900">
        <Image src="/appbar.png" alt="hero" width={1920} height={500} style={{ objectFit: "cover", height: "300px", width: "100%" }} />
        <div className="absolute top-24 left-4 w-full">
          <h1 className="text-3xl font-bold text-white w-96">Bugünü not alın, Yaşadığınız anların Güzelliklerini keşfedin!</h1>
        </div>
      </div>

      <div className="px-16 rounded-lg w-full pt-16">
        {alertShow && (
          <div role="alert" className="alert alert-error mb-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => setAlertShow(false)}
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-slate-900">Yazı sınırınızı aştınız...</span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-light text-white w-96 px-2">Sevgili günlük, </h1>
          <button onClick={logout} className="btn btn-outline btn-error bg-gray-800 shadow-md hover:shadow-lg ">
            Çıkış Yap{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-log-out"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
        <div className="flex flex-col justify-between items-start px-2 py-8 gap-4">
          <textarea
            value={newItem.metin}
            onChange={(e) => setNewItem({ ...newItem, metin: e.target.value })}
            className="textarea textarea-success bg-gray-800 border w-full text-slate-300 shadow-lg shadow-green-900"
            maxLength="3002"
            type="text"
            placeholder="Bugün... "
            rows={8}
          />

          <button onClick={addItem} className="btn btn-outline btn-success bg-gray-800 shadow-md hover:shadow-lg " type="submit">
            Kaydet
          </button>
        </div>
        <hr className="border-gray-600" />
        <div className="px-2 py-7">
          <h1 className="text-3xl font-light text-white">Günlüklerim</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-12 mt-4">
          {items.map((item, id) => (
            <div key={id} className="px-2">
              <div className="p-4 h-96 flex flex-col bg-gray-800 rounded-lg shadow-lg shadow-green-900 border border-1 border-green-800">
                <div className="flex justify-between items-center">
                  <span className="text-md font-bold text-white">
                    {item.createdAt && item.createdAt.toDate("en-US").toLocaleString("tr-TR", { hour12: false })}
                  </span>
                  <button onClick={() => deleteItem(item.id)} className="p-2 text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                    </svg>
                  </button>
                </div>
                <div>
                  <hr className="border-gray-600" />
                  <div
                    className="text-sm cursor-pointer pt-4"
                    onClick={() => {
                      setSelectedItem(item.metin);
                      document.getElementById("my_modal_3").showModal();
                    }}
                  >
                    <p className="text-slate-300 font-light ">{truncateText(item.metin, 500)}</p>
                  </div>

                  <dialog id="my_modal_3" className="modal">
                    <div className="modal-box">
                      <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                      </form>
                      <div className="w-full p-6">
                        <h1 className="text-2xl font-bold text-white">Günlük Detayı</h1>
                        <h1 className="text-sm font-bold text-white">{item.createdAt && item.createdAt.toDate().toLocaleString()}</h1>
                      </div>
                      <div className="w-full px-6">
                        <p className="text-justify">{selectedItem}</p>
                      </div>
                    </div>
                  </dialog>
                </div>
              </div>
            </div>
          ))}
        </div>
        {items.length < 1 ? "" : <div className="flex justify-between p-3"></div>}
      </div>
    </main>
  );
}
