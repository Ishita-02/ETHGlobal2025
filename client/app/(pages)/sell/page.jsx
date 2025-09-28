"use client"

import React, { useState, useEffect } from 'react';
import useWalletStore from '@/zustand/walletStore';

// Configuration
const LIGHTHOUSE_API_KEY = "b0803b0e.274cba019764496698835b7b9a3e2c49";
const NUM_TOKENS = 100000;

const ListingFormUI = () => {
    const { isConnected, web3Service, account, initWeb3Service } = useWalletStore();

    const [formData, setFormData] = useState({
        propertyTitle: '',
        streetAddress: '',
        minimumPrice: '',
        marketType: 'normal'
    });

    const [uploadingImages, setUploadingImages] = useState(false);
    const [uploadingDocs, setUploadingDocs] = useState(false);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [uploadedDocs, setUploadedDocs] = useState([]);
    const [isDeploying, setIsDeploying] = useState(false);
    const [deploymentStep, setDeploymentStep] = useState('');
    
    // Initialize Web3Service on component mount if wallet is connected
    useEffect(() => {
        if (isConnected && !web3Service) {
        }
    }, [isConnected, web3Service, initWeb3Service]);

    // Upload JSON metadata to IPFS
    const uploadMetadataToIPFS = async (propertyData) => {
        try {
            const metadata = {
                name: propertyData.propertyTitle,
                location: propertyData.streetAddress,
                price: propertyData.minimumPrice,
                marketType: propertyData.marketType,
                timestamp: new Date().toISOString(),
                totalTokens: NUM_TOKENS
            };
            const blob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
            const file = new File([blob], 'property-metadata.json', { type: 'application/json' });

            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('https://node.lighthouse.storage/api/v0/add', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${LIGHTHOUSE_API_KEY}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Metadata upload failed: ${response.statusText}`);
            }

            const data = await response.json();
            return `https://gateway.lighthouse.storage/ipfs/${data.Hash}`;
        } catch (error) {
            console.error('Error uploading metadata:', error);
            throw error;
        }
    };

    const inputClasses = "mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-800 p-3 border";
    const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
    
    const uploadToLighthouse = async (files, setUploading, setUploaded) => {
        if (!files || files.length === 0) return;
        setUploading(true);
        const uploadedFiles = [];
        try {
            for (const file of Array.from(files)) {
                const formData = new FormData();
                formData.append('file', file);
                const response = await fetch('https://node.lighthouse.storage/api/v0/add', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${LIGHTHOUSE_API_KEY}` },
                    body: formData
                });
                if (!response.ok) throw new Error(`Upload failed: ${response.statusText}`);
                const data = await response.json();
                uploadedFiles.push({
                    name: file.name,
                    hash: data.Hash,
                    url: `https://gateway.lighthouse.storage/ipfs/${data.Hash}`,
                    size: file.size
                });
            }
            setUploaded(prev => [...prev, ...uploadedFiles]);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => uploadToLighthouse(e.target.files, setUploadingImages, setUploadedImages);
    const handleDocUpload = (e) => uploadToLighthouse(e.target.files, setUploadingDocs, setUploadedDocs);

    const removeFile = (index, type) => {
        if (type === 'image') {
            setUploadedImages(prev => prev.filter((_, i) => i !== index));
        } else {
            setUploadedDocs(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation checks
        if (!isConnected) {
            alert('Please connect your wallet first using the button in the navigation bar.');
            return;
        }
        
        if (!web3Service) {
            alert('Web3 service is not initialized. Please try reconnecting your wallet.');
            return;
        }
        
        if (uploadedImages.length === 0) {
            alert('Please upload at least one property image');
            return;
        }
        
        if (uploadedDocs.length === 0) {
            alert('Please upload at least one property document');
            return;
        }

        if (!formData.minimumPrice || parseFloat(formData.minimumPrice) <= 0) {
            alert('Please enter a valid minimum price');
            return;
        }

        setIsDeploying(true);

        try {
            // Step 1: Upload metadata to IPFS
            setDeploymentStep('Uploading metadata to IPFS...');
            const dataURI = await uploadMetadataToIPFS(formData);
            const imageURI = uploadedImages[0].url;

            // Step 2: Deploy Property Token Contract using the service
            setDeploymentStep('Deploying Property Token Contract...');
            const propertyTokenAddress = await web3Service.deployPropertyToken({
                name: formData.propertyTitle,
                symbol: formData.propertyTitle.replace(/\s+/g, '').toUpperCase().substring(0, 6),
                location: formData.streetAddress,
                price: formData.minimumPrice
            });

            // Step 3: Register Property using the service
            setDeploymentStep('Registering property in marketplace...');
            const registerTxHash = await web3Service.registerProperty(propertyTokenAddress, dataURI, imageURI);

            // Step 4: Create Sell Offer using the service
            setDeploymentStep('Creating sell offer...');
            const saleType = formData.marketType === 'goodwill' ? 1 : 0;
            const sellOfferTxHash = await web3Service.createSellOffer(propertyTokenAddress, formData.minimumPrice, NUM_TOKENS, saleType);

            setDeploymentStep('Complete!');
            const finalData = {
                ...formData,
                propertyTokenAddress,
                dataURI,
                imageURI,
                registerTxHash,
                sellOfferTxHash,
                totalTokens: NUM_TOKENS,
                images: uploadedImages,
                documents: uploadedDocs
            };
            console.log('Property Listed Successfully:', finalData);
            alert(`Property listed successfully!\n\nProperty Token Address: ${propertyTokenAddress}\nRegistration Tx: ${registerTxHash}\nSell Offer Tx: ${sellOfferTxHash}`);

            // Reset form
            setFormData({ propertyTitle: '', streetAddress: '', minimumPrice: '', marketType: 'normal' });
            setUploadedImages([]);
            setUploadedDocs([]);

        } catch (error) {
            console.error('Deployment error:', error);
            alert('Error listing property: ' + error.message);
        } finally {
            setIsDeploying(false);
            setDeploymentStep('');
        }
    };

    const FileList = ({ files, type }) => (
        <div className="mt-4 space-y-2">
            {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                            <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB •
                                <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-500 ml-1">
                                    View on IPFS
                                </a>
                            </p>
                            <p className="text-xs text-gray-400 font-mono">{file.hash}</p>
                        </div>
                    </div>
                    <button type="button" onClick={() => removeFile(index, type)} className="flex-shrink-0 text-red-400 hover:text-red-500">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            ))}
        </div>
    );

    // Check if form is ready for submission
    const isFormReady = isConnected && web3Service && !uploadingImages && !uploadingDocs && !isDeploying;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl">
                <div className="p-6 md:p-8 border-b-4 border-orange-600 rounded-t-xl bg-white">
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Create New Listing</h1>
                    <p className="text-lg text-gray-500">Sell your real estate asset on the Novilized platform with IPFS storage.</p>
                    
                    {/* Connection Status */}
                    <div className="mt-4">
                        {!isConnected ? (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <p className="text-sm text-yellow-700">⚠️ Please connect your wallet to list a property</p>
                            </div>
                        ) : !web3Service ? (
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                                <p className="text-sm text-orange-700">🔄 Initializing Web3 service...</p>
                            </div>
                        ) : (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <p className="text-sm text-green-700">✅ Wallet connected and Web3 service ready</p>
                            </div>
                        )}
                    </div>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
                    {/* Asset Information Section */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Asset Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="propertyTitle" className={labelClasses}>Property Title / Name</label>
                                <input type="text" id="propertyTitle" name="propertyTitle" value={formData.propertyTitle} onChange={handleInputChange} placeholder="e.g., St. Louis Street Fractional Unit" required className={inputClasses} />
                            </div>
                            <div>
                                <label htmlFor="streetAddress" className={labelClasses}>Street Address</label>
                                <input type="text" id="streetAddress" name="streetAddress" value={formData.streetAddress} onChange={handleInputChange} placeholder="Full street address (optional)" className={inputClasses} />
                            </div>
                        </div>
                    </div>
                    
                    {/* Media Upload Section */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Property Images <span className="text-sm font-normal text-gray-500 ml-2">(Stored on IPFS via Lighthouse)</span></h2>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center hover:border-orange-500 transition duration-150">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H15m4-19l12 12m-12 0l-12-12m12 12l-12-12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            <p className="mt-2 text-sm text-gray-600">
                                <label htmlFor="image-upload" className="relative cursor-pointer font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none">
                                    <span>{uploadingImages ? 'Uploading to IPFS...' : 'Upload images'}</span>
                                    <input id="image-upload" name="image-upload" type="file" className="sr-only" multiple accept="image/*" onChange={handleImageUpload} disabled={uploadingImages} />
                                </label>
                                <span className="pl-1">or drag and drop</span>
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, up to 10MB each</p>
                            {uploadingImages && (
                                <div className="mt-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600 mx-auto"></div>
                                    <p className="text-sm text-gray-500 mt-2">Uploading to IPFS network...</p>
                                </div>
                            )}
                        </div>
                        {uploadedImages.length > 0 && (<FileList files={uploadedImages} type="image" />)}
                    </div>
                    
                    {/* Documents Upload Section */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Property Documents <span className="text-sm font-normal text-gray-500 ml-2">(Stored on IPFS via Lighthouse)</span></h2>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center hover:border-orange-500 transition duration-150">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H15m4-19l12 12m-12 0l-12-12m12 12l-12-12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            <p className="mt-2 text-sm text-gray-600">
                                <label htmlFor="doc-upload" className="relative cursor-pointer font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none">
                                    <span>{uploadingDocs ? 'Uploading to IPFS...' : 'Upload documents'}</span>
                                    <input id="doc-upload" name="doc-upload" type="file" className="sr-only" multiple accept=".pdf,.doc,.docx,.txt" onChange={handleDocUpload} disabled={uploadingDocs} />
                                </label>
                                <span className="pl-1">or drag and drop</span>
                            </p>
                            <p className="text-xs text-gray-500">PDF, DOC, TXT, up to 10MB each</p>
                            {uploadingDocs && (
                                <div className="mt-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600 mx-auto"></div>
                                    <p className="text-sm text-gray-500 mt-2">Uploading to IPFS network...</p>
                                </div>
                            )}
                        </div>
                        {uploadedDocs.length > 0 && (<FileList files={uploadedDocs} type="document" />)}
                    </div>
                    
                    {/* Pricing and Market Settings Section */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Pricing & Market Settings</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="minimumPrice" className={labelClasses}>Minimum Selling Price (in ETH)</label>
                                <div className="relative mt-1 rounded-lg shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><span className="text-gray-500 sm:text-sm">Ξ</span></div>
                                    <input type="number" id="minimumPrice" name="minimumPrice" value={formData.minimumPrice} onChange={handleInputChange} placeholder="1.5" required min="0.0001" step="any" className={`${inputClasses} pl-7`} />
                                </div>
                            </div>
                            <div>
                                <label className={labelClasses} htmlFor="marketType">Market Type</label>
                                <select id="marketType" name="marketType" value={formData.marketType} onChange={handleInputChange} className={inputClasses}>
                                    <option value="normal">Normal Selling</option>
                                    <option value="goodwill">Goodwill Market</option>
                                </select>
                                <p className="mt-1 text-xs text-gray-500">Standard real estate fractional trading.</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Summary Section */}
                    {(uploadedImages.length > 0 || uploadedDocs.length > 0) && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">IPFS Storage Summary</h2>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center">
                                    <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                    <p className="ml-2 text-sm font-medium text-green-800">Files successfully stored on IPFS</p>
                                </div>
                                <div className="mt-2 text-sm text-green-700">
                                    <p>Images: {uploadedImages.length} files</p>
                                    <p>Documents: {uploadedDocs.length} files</p>
                                    <p className="mt-1 text-xs">All files are permanently stored on the decentralized IPFS network and accessible via Lighthouse gateway.</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Deployment Progress */}
                    {isDeploying && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Deployment Progress</h2>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                                    <p className="text-sm font-medium text-blue-800">{deploymentStep}</p>
                                </div>
                                <div className="mt-2 text-xs text-blue-700">
                                    <p>Please confirm all transactions in your wallet...</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Submit Button */}
                    <div className="pt-5">
                        <button type="submit" disabled={!isFormReady} className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isDeploying ? deploymentStep : uploadingImages || uploadingDocs ? 'Uploading Files to IPFS...' : 'Deploy & List Asset'}
                        </button>
                        {!isFormReady && !isDeploying && (
                            <p className="text-xs text-gray-500 mt-2 text-center">
                                {!isConnected ? 'Connect wallet to continue' : !web3Service ? 'Initializing Web3 service...' : 'Complete all fields to proceed'}
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ListingFormUI;