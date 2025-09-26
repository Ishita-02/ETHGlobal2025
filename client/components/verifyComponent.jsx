'use client';

import { useEffect, useState } from 'react';
import { countries, SelfQRcodeWrapper } from '@selfxyz/qrcode';
import { SelfAppBuilder } from '@selfxyz/qrcode';

export default function VerifyComponent() {
  const [selfApp, setSelfApp] = useState(null);

  useEffect(() => {
    const userId = '0xDC984157F54F2e186cb6E9082bb998CbE7C44c23'; // Replace with actual address
    
    const app = new SelfAppBuilder({
      version: 2,
      appName: process.env.NEXT_PUBLIC_SELF_APP_NAME || 'Self Docs',
      scope: process.env.NEXT_PUBLIC_SELF_SCOPE || 'self-docs',
      endpoint: `${process.env.NEXT_PUBLIC_SELF_ENDPOINT}`,
      logoBase64: 'https://i.postimg.cc/mrmVf9hm/self.png',
      userId,
      endpointType: 'staging_celo',
      userIdType: 'hex',
      userDefinedData: 'Hello from the Docs!!',
      disclosures: {
        minimumAge: 18,
        excludedCountries: [
          countries.CUBA, 
          countries.IRAN, 
          countries.NORTH_KOREA, 
          countries.RUSSIA
        ],
        nationality: true,
        gender: true,
      },
    }).build();

    setSelfApp(app);
  }, []);

  const handleSuccessfulVerification = () => {
    console.log('Verified!');
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      {selfApp ? (
        <SelfQRcodeWrapper
          selfApp={selfApp}
          onSuccess={handleSuccessfulVerification}
          onError={() => {
            console.error('Error: Failed to verify identity');
          }}
        />
      ) : (
        <div className="text-center">
          <p>Loading QR Code...</p>
        </div>
      )}
    </div>
  );
}