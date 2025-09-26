"use client"
import Link from "next/link"
import { useMobileNav } from "@/zustand/mobileNav"

const Nav = () => {
    const turnMobileViewOn = useMobileNav((state) => state.turnMobileOn)
    const phoneView = useMobileNav((state) => state.mobileNav)

    return (
        <div className="fixed top-0 left-0 w-full z-50 backdrop-blur-xs bg-white/30">
            <div className="flex antialiased md:justify-around justify-between md:mx-0 mx-3 items-center text-l py-4">

                <div className="flex space-x-2 items-center text-gray-700 text-l md:text-2xl">
                    <div className="bg-orange-500 p-1 rounded-lg">
                        <svg width="28px" height="28px" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#ffffff">
                            <path d="M4 14V18.4C4 18.7314 4.26863 19 4.6 19H10" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M19 14V18.4C19 18.7314 18.7314 19 18.4 19H14" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14 5H18.4C18.7314 5 19 5.26863 19 5.6V10" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4 10V5.6C4 5.26863 4.26863 5 4.6 5H10" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14 19V20C14 21.1046 13.1046 22 12 22C10.8954 22 10 21.1046 10 20V19" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4 10H5C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14H4" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M19 10H20C21.1046 10 22 10.8954 22 12C22 13.1046 21.1046 14 20 14H19" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14 5V4C14 2.89543 13.1046 2 12 2C10.8954 2 10 2.89543 10 4V5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <Link href="/">K2K</Link>
                </div>

                <div className="flex space-x-8 text-gray-500 md:inline hidden">
                    <Link href="/contact">Offers</Link>
                    <Link href="/login">Posts</Link>
                    <Link href="/about">Message</Link>
                    <Link href="/profile">Profile</Link>
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
