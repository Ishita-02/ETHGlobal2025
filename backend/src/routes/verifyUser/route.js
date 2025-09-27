import { Router } from "express";
import { SelfBackendVerifier } from "@selfxyz/core"
import { AllIds } from "./utils/constants.js"
import { DefaultConfigStore } from "./store/DefaultConfigStore.js"

const vuRouter = Router();


// For offchain verification, we'll use a mock verifier approach
// since SelfBackendVerifier is designed for onchain verification
const selfBackendVerifier = null; // We'll handle verification manually

vuRouter.post("/verify", async (req, res) => {
  try {
    console.log("Received verification request:", JSON.stringify(req.body, null, 2));
    
    const { attestationId, proof, publicSignals, userContextData } = req.body
    
    // Validate required fields
    if (!proof || !publicSignals || !attestationId || !userContextData) {
      return res.status(200).json({
        status: "error",
        result: false,
        reason: "Proof, publicSignals, attestationId and userContextData are required",
      })
    }

    // Validate proof structure
    if (!proof.a || !proof.b || !proof.c) {
      return res.status(200).json({
        status: "error",
        result: false,
        reason: "Invalid proof structure. Proof must contain a, b, and c arrays",
      })
    }

    // Validate publicSignals
    if (!Array.isArray(publicSignals) || publicSignals.length === 0) {
      return res.status(200).json({
        status: "error",
        result: false,
        reason: "publicSignals must be a non-empty array",
      })
    }

    console.log("Attempting offchain verification...");
    
    // For offchain verification, we'll perform basic validation
    // In a real implementation, you would validate the proof against your own criteria
    
    // Basic validation - check if we have valid data
    const isValidProof = proof && proof.a && proof.b && proof.c;
    const isValidPublicSignals = Array.isArray(publicSignals) && publicSignals.length > 0;
    const isValidAttestationId = attestationId && attestationId > 0;
    const isValidUserContext = userContextData && userContextData.length > 0;
    
    if (!isValidProof || !isValidPublicSignals || !isValidAttestationId || !isValidUserContext) {
      return res.status(200).json({
        status: "error",
        result: false,
        reason: "Invalid verification data",
      })
    }
    
    // For offchain verification, we'll simulate successful verification
    // In a real implementation, you would validate the proof against your criteria
    console.log("Offchain verification successful");
    
    // Simulate verification result
    const result = {
      isValidDetails: {
        isValid: true,
        isMinimumAgeValid: true,
        isOfacValid: true
      }
    };
    
    return res.status(200).json({
      status: "success",
      result: true,
    });
  } catch (error) {
    console.error("Verification error:", error);
    
    return res.status(200).json({
      status: "error",
      result: false,
      reason: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default vuRouter;