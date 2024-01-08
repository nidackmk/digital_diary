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
    <main className='flex min-h-screen w-full flex-col items-center justify-between '>
      <div className='w-full px-0 items-center justify-between font-mono text-sm h-screen h-1/2 mb-10' style={{ backgroundImage: "url('/app/appbar.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="bg-success w-full flex justify-center items-end px-0 h-full">
          <h1 className='text-2xl text-white'>Dear Diary</h1>
        </div>
      </div>

      <div className=' p-10 rounded-lg w-full'>
        <form className='grid grid-cols-6 items-center text-black'>
          <textarea
            value={newItem.metin}
            onChange={(e) => setNewItem({ ...newItem, metin: e.target.value })}
            className='textarea textarea-success col-span-6 p-3 border mb-3 h-40'
            type='text'
            placeholder='Dear Diary, '
          />
        </form>
        <button
          onClick={addItem}
          className='btn btn-outline btn-success'
          type='submit'
        >
          Kaydet
        </button>
        <ul className="flex flex-wrap -mx-2">
          {items.map((item, id) => (
            <li
              key={id}
              className='my-4 w-full sm:w-1/2 lg:w-1/3 px-2'
            >
              <div className='p-4 w-full flex flex-col justify-between bg-slate-950 h-full'>
                <span className='text-sm'>{item.createdAt && item.createdAt.toDate().toLocaleString()}</span>
                <div className="flex justify-between items-center">
                  <span className='capitalize mb-2'>{item.metin}</span>
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
