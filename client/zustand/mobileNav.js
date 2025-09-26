
import { create } from 'zustand'

export const useMobileNav = create ((set) => ({
    mobileNav: false,
    turnMobileOn: (change) => set({mobileNav: change})
}))