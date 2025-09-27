"use client"

import { useListForm } from '@/zustand/listing';

const ListingFormUI = () => {
    const { list, turnListOn } = useListForm();

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        turnListOn({
            ...list,
            [id]: value
        });
    };

    // --- Post Listing ---
    async function postListing (e) {
        e.preventDefault(); // 👈 stop form refresh

        try {
            const response = await fetch("http://localhost:3000/SellToken", { // 👈 add http://
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(list)
            });

            const data = await response.json();
            console.log("Listing created:", data);

            alert(`Listing created: ${data.message || "Success"}`);
        } catch (error) {
            console.error("Error posting listing:", error);
            alert("Failed to create listing. Check console for details.");
        }
    }

    const inputClasses = "mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-800 p-3 border";
    const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl">
                {/* Header */}
                <div className="p-6 md:p-8 border-b-4 border-orange-600 rounded-t-xl bg-white">
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">
                        Create New Listing
                    </h1>
                    <p className="text-lg text-gray-500">
                        Sell your real estate asset on the Novilized platform.
                    </p>
                </div>

                {/* Form Body */}
                <form onSubmit={postListing} className="p-6 md:p-8 space-y-8">
                    
                    {/* Example: Title */}
                    <div>
                        <label htmlFor="name" className={labelClasses}>Property Title / Name</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="e.g., St. Louis Street Fractional Unit"
                            required
                            className={inputClasses}
                            value={list.name}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* More fields ... */}

                    {/* Submit Button */}
                    <div className="pt-5">
                        <button
                            type="submit"  // 👈 form triggers postListing
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
