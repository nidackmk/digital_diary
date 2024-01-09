'use client';
import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  deleteDoc,
  doc,
  serverTimestamp, // Ekledik
} from 'firebase/firestore';
import { db } from './firebase';
import Image from "next/image";


export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ metin: '' });


  // Add item to database
  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.metin !== '') {
      await addDoc(collection(db, 'items'), {
        metin: newItem.metin.trim(),
        createdAt: serverTimestamp(), // Tarih bilgisini ekledik
      });
      setNewItem({ metin: '' });
    }
  };


  // Read items from database
  useEffect(() => {
    const q = query(collection(db, 'items'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];

      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });

      // Sıralama işlemini burada gerçekleştiriyoruz
      itemsArr.sort((a, b) => b.createdAt - a.createdAt);

      setItems(itemsArr);
      return () => unsubscribe();
    });
  }, []);


  // Delete items from database
  const deleteItem = async (id) => {
    await deleteDoc(doc(db, 'items', id));
  };

  return (
    <main className='flex min-h-screen flex-col items-center justify-between'>
      <div className="w-full relative">
        <Image src="/appbar.png" alt="hero" width={1920} height={500} style={{ objectFit: "cover", height: "300px" }} />
        {/* put Daily Dairy Header on image bottom  */}
        <div className="absolute top-24 left-4 w-full">
          <h1 className="text-3xl font-bold text-white w-96">Bugünü not alın, Yaşadığınız anların Güzelliklerini keşfedin!</h1>
        </div>
      </div>

      <div className=' p-16 rounded-lg w-full'>
        <form className='grid grid-cols-6 items-center text-black'>
          <textarea
            value={newItem.metin}
            onChange={(e) => setNewItem({ ...newItem, metin: e.target.value })}
            className='textarea textarea-success col-span-6 p-3 border mb-3 h-80 focus:shadow-outline-green'
            type='text'
            placeholder='Dear Diary, '
            rows={8} // Burada rows özelliğini ekledik, istediğiniz satır sayısını belirleyebilirsiniz
          />
        </form>
        <button
          onClick={addItem}
          className='btn btn-outline btn-success bg-gray-800 shadow-md hover:shadow-lg '
          type='submit'
        >
          Kaydet
        </button>
        <ul className="flex flex-wrap -mx-2">
          {items.map((item, id) => (
            <li key={id} className='my-4 w-full sm:w-1/2 lg:w-1/3 px-2'>
              <div className='p-4 w-full flex flex-col justify-between bg-slate-950'>
                <span className='text-sm text-white-500'>{item.createdAt && item.createdAt.toDate().toLocaleString()}</span>
                <div className="flex justify-between items-center">
                  {/* Metni sığdırmak ve taşan yerler için ... eklemek */}
                  <span className='capitalize mb-2 text-gray-500 overflow-hidden overflow-ellipsis max-h-40'>{item.metin}</span>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className='p-2 border-l-2 border-slate-900 hover:bg-slate-900'
                  >
                    X
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {items.length < 1 ? (
          ''
        ) :
          (
            <div className='flex justify-between p-3'>

            </div>
          )
        }
      </div>
    </main>
  );
}
