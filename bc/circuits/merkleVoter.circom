pragma circom 2.0.8;
include "../node_modules/circomlib/circuits/poseidon.circom";

template MerkleVoterEligibilityVerifier(levels) {
    signal input actualIdFieldElement;
    signal input pathElements[levels];
    signal input pathIndices[levels];
    signal input registeredRoot; // Public
    signal output eligible;

    // Hash the private ID
    component leafHasher = Poseidon(1);
    leafHasher.inputs[0] <== actualIdFieldElement;
    signal hash <== leafHasher.out;

    // Build the Merkle path
    var i;
    for (i = 0; i < levels; i++) {
        component nodeHasher = Poseidon(2);
        nodeHasher.inputs[0] <== pathIndices[i] === 0 ? hash : pathElements[i];
        nodeHasher.inputs[1] <== pathIndices[i] === 0 ? pathElements[i] : hash;
        hash <== nodeHasher.out;
    }

    // Compare root
    eligible <== (hash === registeredRoot);
    eligible * (eligible - 1) === 0;
}

component main { public [registeredRoot] } = MerkleVoterEligibilityVerifier(3);
