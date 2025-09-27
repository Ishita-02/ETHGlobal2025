"use client"
import React, { useState } from 'react';
import Image from 'next/image'; // Import the Next.js Image component
// Assuming 'prop' is correctly imported from your assets folder, e.g.,
import prop from "@/assets/hot.jpeg"; 

const UserPortfolio = () => {
    // 1. State for Tab Management
    const [activeTab, setActiveTab] = useState('selling'); // 'selling' or 'buying'

    // --- Dummy Data (Using the local 'prop' image) ---
    const sellingProperties = [
        { id: 1, title: 'St. Louis Street Unit', minPrice: '30.00', restriction: 'indian_only', imageUrl: prop },
        { id: 2, title: 'Downtown Office Space', minPrice: '55.00', restriction: 'none', imageUrl: prop },
        { id: 3, title: 'Coastal Villa Fraction', minPrice: '120.00', restriction: 'none', imageUrl: prop },
    ];
    
    const buyingProperties = [
        { id: 4, title: 'Parisian Flat Share', purchasePrice: '120.00', yield: '4.5%', imageUrl: prop },
        { id: 5, title: 'Mountain Cabin Lot', purchasePrice: '15.00', yield: 'N/A', imageUrl: prop },
    ];
    // ------------------------------------

    // Card Component with Next.js Image
    const PortfolioCard = ({ title, price, secondaryLabel, secondaryValue, restriction, imageUrl, isSelling }) => (
        <div className="w-full border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition duration-300 overflow-hidden bg-white cursor-pointer">
            
            {/* Image Container: relative positioning required for Image fill prop */}
            <div className="relative pt-[60%] overflow-hidden">
                <Image
                    // When using local imports like 'prop', Next.js automatically handles the width/height/src.
                    // The 'fill' prop is still necessary to cover the parent container.
                    src={imageUrl} 
                    alt={title}
                    fill // Fills the parent container
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
                        {isSelling ? 'Min. Selling Price' : 'Purchase Price'}
                    </span>
                    <span className={`text-lg font-bold ${isSelling ? 'text-orange-600' : 'text-gray-800'}`}>
                        ${price}
                    </span>
                </div>

                <div className="flex justify-between items-baseline">
                    <span className="text-sm text-gray-600">{secondaryLabel}</span>
                    <span className={`text-lg font-bold ${isSelling ? 'text-gray-700' : 'text-green-600'}`}>
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
                    My Asset Portfolio
                </h1>
                <p className="text-xl text-gray-500 mb-8">
                    Manage your listed assets and track your acquisitions.
                </p>

                {/* 2. Tab Switcher with onClick Logic */}
                <div className="flex border-b border-gray-300 mb-8">
                    
                    {/* Selling Tab Button */}
                    <button
                        onClick={() => setActiveTab('selling')}
                        className={`py-3 px-6 text-lg font-semibold transition-colors duration-200 
                            ${activeTab === 'selling' 
                                ? 'text-orange-600 border-b-4 border-orange-600' 
                                : 'text-gray-500 hover:text-orange-500 border-b-4 border-transparent'
                            }`}
                    >
                        Selling Portfolio
                        <span className="ml-2 px-2 py-0.5 text-xs font-bold rounded-full bg-orange-600 text-white">
                            {sellingProperties.length}
                        </span>
                    </button>

                    {/* Buying Tab Button */}
                    <button
                        onClick={() => setActiveTab('buying')}
                        className={`py-3 px-6 text-lg font-semibold transition-colors duration-200 
                            ${activeTab === 'buying' 
                                ? 'text-orange-600 border-b-4 border-orange-600' 
                                : 'text-gray-500 hover:text-orange-500 border-b-4 border-transparent'
                            }`}
                    >
                        Buying Portfolio
                        <span className="ml-2 px-2 py-0.5 text-xs font-bold rounded-full bg-gray-300 text-gray-800">
                            {buyingProperties.length}
                        </span>
                    </button>
                </div>

                {/* 3. Portfolio Content Renderer (Conditional Rendering) */}
                <div className="pb-8">
                    {activeTab === 'selling' ? (
                        <>
                            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                                My Listed Properties
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {sellingProperties.map(p => (
                                    <PortfolioCard
                                        key={p.id}
                                        isSelling={true}
                                        title={p.title}
                                        price={p.minPrice}
                                        secondaryLabel="Current Status"
                                        secondaryValue="Listed"
                                        restriction={p.restriction}
                                        // Pass the local image object
                                        imageUrl={p.imageUrl} 
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                                My Acquired Assets
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {buyingProperties.map(p => (
                                    <PortfolioCard
                                        key={p.id}
                                        isSelling={false}
                                        title={p.title}
                                        price={p.purchasePrice}
                                        secondaryLabel="Current Yield"
                                        secondaryValue={p.yield}
                                        // Pass the local image object
                                        imageUrl={p.imageUrl} 
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
};

export default UserPortfolio;