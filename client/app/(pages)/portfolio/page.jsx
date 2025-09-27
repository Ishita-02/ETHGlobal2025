"use client"
import React from 'react'; // useState is no longer needed
import Image from 'next/image';
import prop from "@/assets/hot.jpeg"; 

const UserPortfolio = () => {
    // 1. Removed state for tab management (no longer needed)

    // --- Dummy Data (Only keeping the selling/listed data) ---
    const sellingProperties = [
        { id: 1, title: 'St. Louis Street Unit', minPrice: '30.00', restriction: 'indian_only', imageUrl: prop },
        { id: 2, title: 'Downtown Office Space', minPrice: '55.00', restriction: 'none', imageUrl: prop },
        { id: 3, title: 'Coastal Villa Fraction', minPrice: '120.00', restriction: 'none', imageUrl: prop },
    ];
    // ------------------------------------

    // Card Component (Simplified, no longer needs to check isSelling flag)
    const PortfolioCard = ({ title, price, secondaryLabel, secondaryValue, imageUrl }) => (
        <div className="w-full border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition duration-300 overflow-hidden bg-white cursor-pointer">
            
            {/* Image Container */}
            <div className="relative pt-[60%] overflow-hidden">
                <Image
                    src={imageUrl} 
                    alt={title}
                    fill 
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
            </div>
            
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
                    {title}
                </h3>
                
                <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm text-gray-600">
                        Min. Selling Price
                    </span>
                    {/* Price is always for selling, so use a fixed color */}
                    <span className="text-lg font-bold text-orange-600">
                        ${price}
                    </span>
                </div>

                <div className="flex justify-between items-baseline">
                    <span className="text-sm text-gray-600">{secondaryLabel}</span>
                    <span className="text-lg font-bold text-gray-700">
                        {secondaryValue}
                    </span>
                </div>

            </div>
        </div>
    );


    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                    My Listed Tokens
                </h1>
                <p className="text-xl text-gray-500 mb-8">
                    Manage your listed real estate assets.
                </p>

                {/* 2. Simplified Header/Tab Display (No tabs, just a title) */}
                <div className="pb-8">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">
                        Selling Portfolio 
                        <span className="ml-3 px-3 py-1 text-sm font-bold rounded-full bg-orange-600 text-white">
                            {sellingProperties.length} Tokens
                        </span>
                    </h2>
                    
                    {/* 3. Portfolio Content Renderer (Only rendering the selling content) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sellingProperties.map(p => (
                            <PortfolioCard
                                key={p.id}
                                title={p.title}
                                price={p.minPrice}
                                secondaryLabel="Current Status"
                                secondaryValue="Listed"
                                // 'restriction' is no longer used in the Card UI but remains in data
                                imageUrl={p.imageUrl} 
                            />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default UserPortfolio;