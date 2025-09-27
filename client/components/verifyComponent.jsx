'use client';

import { useEffect, useState } from 'react';
import { countries, SelfQRcodeWrapper, SelfAppBuilder } from '@selfxyz/qrcode';

export default function VerifyComponent() {
  const [selfApp, setSelfApp] = useState(null);

  useEffect(() => {
    const userId = '0xbc40Cf83d17c3D378B56EDec901b603D1eBCe4E8'; // Replace with actual address
    
    const app = new SelfAppBuilder({
      version: 2,
      appName: 'Novilized Real Estate', 
      scope: 'novilized',
      endpoint: 'https://59013b970854.ngrok-free.app/api/verify', // Your ngrok backend endpoint
      logoBase64: 'https://i.postimg.cc/mrmVf9hm/self.png',
      userId,
      endpointType: 'staging_https',
      userIdType: 'hex',  
      userDefinedData: 'Real Estate Verification',
      disableWebSocket: true,
      connectionType: 'deeplink',
      disclosures: {
        minimumAge: 18,
        excludedCountries: [
          countries.IRAN, 
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
          type="deeplink"
          disableWebSocket={true}
          onSuccess={handleSuccessfulVerification}
          onError={(error) => {
            console.error('Error: ', error);
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