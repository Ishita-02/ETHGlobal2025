// components/ClientWrapper.jsx
"use client";

import { useMobileNav } from "@/zustand/mobileNav";
import Link from 'next/link'; // Assuming you use next/link for navigation

export default function ClientWrapper({ children }) {
  // Now, the state logic runs only in the browser (client-side)
  const phoneView = useMobileNav((set) => set.mobileNav);
  const turnMobileViewOn = useMobileNav((state) => state.turnMobileOn);

  return (
    <div className="pt-[100px]">
      {!phoneView ? (
        children
      ) : (
        <div className='mt-30 ml-4 flex flex-col space-y-10 text-2xl text-gray-500'>
          <Link href="/" onClick={() => turnMobileViewOn(false)}> Home </Link>
          <Link href="/qr" onClick={() => turnMobileViewOn(false)}> qr </Link>
           <Link href="/sell" onClick={() => turnMobileViewOn(false)}> Listing</Link>
          <Link href="/portfolio" onClick={() => turnMobileViewOn(false)}> Portfolio</Link>
        </div>
      )}
    </div>
  );
}