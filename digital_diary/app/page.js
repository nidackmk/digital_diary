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
  const [newItem, setNewItem] = useState({ metin: ''});


  // Add item to database
  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.metin !== '') {
      await addDoc(collection(db, 'items'), {
        metin: newItem.metin.trim(),
        createdAt: serverTimestamp(), // Tarih bilgisini ekledik
      });
      setNewItem({ metin: ''});
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
    <main className='flex min-h-screen flex-col items-center justify-between sm:p-24 p-4'>
      <div className='z-10 w-full max-w-5xl items-center justify-between font-mono text-sm '>
        <h1 className='text-4xl p-4 text-center'>Digital Diary</h1>
        <div className='bg-slate-800 p-4 rounded-lg'>
          <form className='grid grid-cols-6 items-center text-black'>
            <textarea 
              value={newItem.metin}
              onChange={(e) => setNewItem({ ...newItem, metin: e.target.value })}
              className='textarea textarea-success col-span-3 p-3 border mb-3'
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
          <ul>
            {items.map((item, id) => (
              <li
                key={id}
                className='my-4 w-full flex justify-between bg-slate-950'
              >
                <div className='p-4 w-full flex justify-between'>
                  <span className='capitalize'>{item.metin}</span>
                  <span className='text-sm'>{item.createdAt && item.createdAt.toDate().toLocaleString()}</span> {/* Ekledik */}
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className='ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16'
                >
                  X
                </button>
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
      </div>
    </main>
  );
}
