pragma circom 2.0.8;

// Make sure circomlib is installed
include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

template VoterEligibilityVerifier() {
    // Private input (voter’s real ID as field element)
    signal input actualIdFieldElement;

    // Public input (hash from registered list)
    signal input registeredVoterHash;

    // Output (eligible = 1 if match)
    signal output eligible;

    // Hash the private ID
    component hasher = Poseidon(1);
    hasher.inputs[0] <== actualIdFieldElement;

    // Compare
    component idOk = IsEqual();
    idOk.in[0] <== hasher.out;
    idOk.in[1] <== registeredVoterHash;

    eligible <== idOk.out;

    // Keep it binary
    eligible * (eligible - 1) === 0;
}

component main { public [registeredVoterHash] } = VoterEligibilityVerifier();
