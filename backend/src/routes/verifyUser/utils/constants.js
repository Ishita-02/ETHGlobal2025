import { ATTESTATION_ID } from "@selfxyz/core";

// Map of allowed attestation IDs - For offchain verification
export const AllIds = new Map([
    [ATTESTATION_ID.AADHAAR, true], // Aadhaar = ID 2
    [ATTESTATION_ID.PASSPORT, true], // Passport = ID 1
    [ATTESTATION_ID.BIOMETRIC_ID_CARD, true], // Biometric ID Card
]);

// Alternative map if you want to add more documents later
export const CustomIds = new Map([
    [ATTESTATION_ID.AADHAAR, true],
    // Add more documents as needed:
    // [ATTESTATION_ID.PASSPORT, true],
    // [ATTESTATION_ID.BIOMETRIC_ID_CARD, true],
]);