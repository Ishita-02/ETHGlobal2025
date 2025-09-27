const ListingFormUI = () => {
    
    const inputClasses = "mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-800 p-3 border";
    const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
    
    // Note: The orange-600 used here assumes you have it configured in tailwind.config.js
    // If not configured, use bg-[#F97316] and text-[#F97316] for absolute safety.

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl">

                {/* Header Section (Orange Accent) */}
                <div className="p-6 md:p-8 border-b-4 border-orange-600 rounded-t-xl bg-white">
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">
                        Create New Listing
                    </h1>
                    <p className="text-lg text-gray-500">
                        Sell your real estate asset on the Novilized platform.
                    </p>
                </div>

                {/* Form Body */}
                <form className="p-6 md:p-8 space-y-8">
                    
                    {/* 1. Asset Information Section */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                            Asset Information
                        </h2>
                        
                        {/* Title and Address */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="propertyTitle" className={labelClasses}>Property Title / Name</label>
                                <input
                                    type="text"
                                    id="propertyTitle"
                                    placeholder="e.g., St. Louis Street Fractional Unit"
                                    required
                                    className={inputClasses}
                                />
                            </div>
                            <div>
                                <label htmlFor="streetAddress" className={labelClasses}>Street Address</label>
                                <input
                                    type="text"
                                    id="streetAddress"
                                    placeholder="Full street address (optional)"
                                    className={inputClasses}
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className={labelClasses}>Detailed Description</label>
                            <textarea
                                id="description"
                                rows="4"
                                placeholder="Describe the property, its amenities, and investment potential..."
                                required
                                className={`${inputClasses} resize-none`}
                            />
                        </div>
                    </div>

                    {/* 2. Media Upload Section */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                            Property Images
                        </h2>
                        
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center hover:border-orange-500 transition duration-150">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H15m4-19l12 12m-12 0l-12-12m12 12l-12-12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p className="mt-2 text-sm text-gray-600">
                                <label htmlFor="file-upload" className="relative cursor-pointer font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none">
                                    <span>Upload files</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                                </label>
                                <span className="pl-1">or drag and drop</span>
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, up to 10MB each</p>
                        </div>
                    </div>
                    
                    {/* 3. Pricing and Market Settings Section */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                            Pricing & Market Settings
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Minimum Buying Price */}
                            <div>
                                <label htmlFor="minimumPrice" className={labelClasses}>Minimum Selling Price (in $)</label>
                                <div className="relative mt-1 rounded-lg shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <span className="text-gray-500 sm:text-sm">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        id="minimumPrice"
                                        placeholder="30.00"
                                        required
                                        min="0.01"
                                        step="0.01"
                                        className={`${inputClasses} pl-7`}
                                    />
                                </div>
                            </div>
                            
                            {/* Market Type (Goodwill vs Normal) */}
                            <div>
                                <label className={labelClasses} htmlFor="marketType">Market Type</label>
                                <select
                                    id="marketType"
                                    className={inputClasses}
                                    defaultValue="normal" // Static value for UI only
                                >
                                    <option value="normal">Normal Selling</option>
                                    <option value="goodwill">Goodwill Market</option>
                                </select>
                                <p className="mt-1 text-xs text-gray-500">
                                    Standard real estate fractional trading.
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* Submit Button (Orange Accent) */}
                    <div className="pt-5">
                        <button
                            type="submit"
                            className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150"
                        >
                            List Asset Now
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ListingFormUI;