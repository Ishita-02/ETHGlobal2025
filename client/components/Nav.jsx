"use client"
import Link from "next/link"
import { useMobileNav } from "@/zustand/mobileNav"

const Nav = () => {
    const turnMobileViewOn = useMobileNav((state) => state.turnMobileOn)
    const phoneView = useMobileNav((state) => state.mobileNav)

    return (
        <div className="fixed top-0 left-0 w-full z-150 backdrop-blur bg-white border-b">
            <div className="flex antialiased md:justify-around justify-between md:mx-0 mx-3 items-center text-l py-4">

                <div className="relative flex md:space-x-3 space-x-2 items-center text-gray-900 text-l  md:text-2xl">
                    <div className="bg-orange-500 p-2 rounded-lg">
                        <svg width="26px" height="26px" viewBox="0 0 24 24" strokeWidth="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#ffffff"><path d="M2 8L11.7317 3.13416C11.9006 3.04971 12.0994 3.0497 12.2683 3.13416L22 8" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M20 11V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V11" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    </div>
                    <Link href="/">Novilized</Link>
                </div>

                <div className="flex space-x-8 text-gray-500 md:inline hidden">
                    <Link href="/marketplace" className="hover:text-orange-500">MarketPlace</Link>
                    <Link href="/qr" className="hover:text-orange-500">self/qr</Link>
                    <Link href="/about" className="hover:text-orange-500">Something</Link>
                    <Link href="/profile" className="hover:text-orange-500">Something</Link>
                </div>

                <div className="md:hidden inline">
                    <button
                        onClick={() => {
                            turnMobileViewOn(!phoneView)
                        }}
                    >
                        {!phoneView ? (
                            <svg width="28px" height="28px" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#9a9996">
                                <path d="M3 5H21" stroke="#9a9996" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M3 12H21" stroke="#9a9996" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M3 19H21" stroke="#9a9996" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        ) : (
                            <svg width="28px" height="28px" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#858585">
                                <path d="M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426" stroke="#858585" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Nav
