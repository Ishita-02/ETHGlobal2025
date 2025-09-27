"use client"

import Image from "next/image";
import prop from "@/assets/hot.jpeg";
import { DirectionAwareHover } from "@/components/ui/direction-aware-hover";
import React, { useState, useMemo } from 'react';


// --- START: MarketCard Component Definition ---
const MarketCard = ({ title, minBuyingPrice, restriction, imageUrl, marketType, DirectionAwareHoverComponent }) => {
    const restrictionColor = restriction === 'indian_only' 
        ? 'border-orange-400 text-orange-700' 
        : 'border-gray-300 text-gray-500';
    
    const DirHover = DirectionAwareHoverComponent;

    return (
        // The width is now managed purely by the parent grid (w-full)
        <div className="flex flex-col bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 w-full overflow-hidden">
            
            <div className="relative">
                <DirHover 
                    imageUrl={imageUrl} 
                    className="w-full h-48 object-cover" 
                    children={
                        <div className="text-white text-sm font-semibold uppercase tracking-wider">
                            {marketType}
                        </div>
                    } 
                />
            </div>
            
            <div className="p-4 space-y-3">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <div className="text-lg font-semibold text-gray-800 leading-snug">
                        {title}
                    </div>
                    <div className="text-xl font-bold text-orange-600 ml-4">
                        ${minBuyingPrice}
                    </div>
                </div>

               
            </div>
        </div>
    );
};
// --- END: MarketCard Component Definition ---


// --- START: Main Market Component ---

const ALL_LISTINGS = [
    { id: 1, title: 'St. Louis Fractional Unit', price: '30.00', restriction: 'indian_only', image: prop, type: 'Goodwill' },
    { id: 2, title: 'Luxury Downtown Office Space', price: '55.00', restriction: 'none', image: prop, type: 'Normal Selling' },
    { id: 3, title: 'Coastal Miami Apartment Share', price: '18.50', restriction: 'none', image: prop, type: 'Normal Selling' },
    { id: 4, title: 'Mumbai Residential Unit', price: '45.00', restriction: 'indian_only', image: prop, type: 'Goodwill' },
    { id: 5, title: 'Tokyo Retail Investment', price: '75.00', restriction: 'none', image: prop, type: 'Goodwill' },
    { id: 6, title: 'Berlin Warehouse Space', price: '90.00', restriction: 'none', image: prop, type: 'Normal Selling' },
    { id: 7, title: 'Manhattan Studio Unit', price: '110.00', restriction: 'none', image: prop, type: 'Normal Selling' },
    { id: 8, title: 'Rural Farm Plot Share', price: '10.00', restriction: 'indian_only', image: prop, type: 'Goodwill' },
];

export default function Market() {
    
    const [activeFilter, setActiveFilter] = useState('all');

    const filteredListings = useMemo(() => {
        if (activeFilter === 'all') {
            return ALL_LISTINGS;
        }
        return ALL_LISTINGS.filter(listing => 
            listing.type === activeFilter
        );
    }, [activeFilter]);
    
    const getTabClasses = (tabName) => {
        const baseClasses = "px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm md:text-base";
        const activeClasses = "bg-orange-600 text-white border-2 border-orange-600 font-semibold shadow-md";
        const inactiveClasses = "bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-300";

        return `${baseClasses} ${activeFilter === tabName ? activeClasses : inactiveClasses}`;
    };


    return (
        <div className="flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

            {/* Market Filter/Tab Section */}
            <div className="flex space-x-3 mt-2">
                
                {/* All Markets Tab */}
                <div 
                    className={getTabClasses('all')}
                    onClick={() => setActiveFilter('all')}
                > 
                    All Markets 
                    <span className="ml-1 text-xs font-bold">({ALL_LISTINGS.length})</span>
                </div>
                
                {/* Goodwill Tab */}
                <div 
                    className={getTabClasses('Goodwill')}
                    onClick={() => setActiveFilter('Goodwill')}
                > 
                    Goodwill 
                    <span className="ml-1 text-xs font-bold">({ALL_LISTINGS.filter(l => l.type === 'Goodwill').length})</span>
                </div>
                
                {/* Normal Selling Tab */}
                <div 
                    className={getTabClasses('Normal Selling')}
                    onClick={() => setActiveFilter('Normal Selling')}
                > 
                    Normal Selling 
                    <span className="ml-1 text-xs font-bold">({ALL_LISTINGS.filter(l => l.type === 'Normal Selling').length})</span>
                </div>
            </div>

            {/* Cards Grid: ***UPDATED TO grid-cols-4 on md screens and up*** */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-10">

                {filteredListings.length > 0 ? (
                    filteredListings.map(listing => (
                        <MarketCard
                            key={listing.id}
                            title={listing.title}
                            minBuyingPrice={listing.price}
                            restriction={listing.restriction}
                            imageUrl={listing.image}
                            marketType={listing.type}
                            DirectionAwareHoverComponent={DirectionAwareHover} 
                        />
                    ))
                ) : (
                    <div className="text-xl text-gray-500 p-8 w-full text-center border-2 border-dashed border-gray-300 rounded-lg">
                        No listings found for the **{activeFilter}** market type.
                    </div>
                )}
            </div>
        </div>
    )
}
// --- END: Main Market Component ---