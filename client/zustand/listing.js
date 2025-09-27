
import { create } from 'zustand'

export const useListForm= create ((set) => ({
    list: {
        name: "",
        address: "",
        description: "",
        imageUrl: "",
        price: "",
        typeOfSelling:""

    },
    turnListOn: (change) => set({list: change})
}))