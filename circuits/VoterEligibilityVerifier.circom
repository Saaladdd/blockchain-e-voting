pragma circom 2.0.8;

include "../node_modules/circomlib/circuits/comparators.circom";  

template VoterEligibilityVerifier() {
    // Inputs
    signal input dateOfBirth;            // Voter's DOB (as timestamp)
    signal input voterIdHash;            // Hash of voter's ID

    // Public inputs
    signal input minAgeTimestamp;        // Allowed min timestamp (today - 18 years)
    signal input registeredVoterHash;    // Hash from registry

    // Output
    signal output eligible;

    // Check if dateOfBirth <= minAgeTimestamp (means voter >= 18)
    component ageOk = LessEqThan(64);
    ageOk.in[0] <== dateOfBirth;
    ageOk.in[1] <== minAgeTimestamp;

    // Check if voterIdHash == registeredVoterHash
    component idOk = IsEqual();
    idOk.in[0] <== voterIdHash;
    idOk.in[1] <== registeredVoterHash;

    // Final check: both must be true
    eligible <== ageOk.out * idOk.out;
}

component main = VoterEligibilityVerifier();
