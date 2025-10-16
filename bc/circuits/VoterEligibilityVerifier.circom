pragma circom 2.0.8;

include "../node_modules/circomlib/circuits/comparators.circom";

template VoterEligibilityVerifier() {
    // Private inputs
    signal input dateOfBirth;            
    signal input voterIdHash;            

    // Public inputs
    signal input minAgeTimestamp;        
    signal input registeredVoterHash;    

    // Public output
    signal output eligible;

    component ageOk = LessEqThan(64);
    ageOk.in[0] <== dateOfBirth;
    ageOk.in[1] <== minAgeTimestamp;

    component idOk = IsEqual();
    idOk.in[0] <== voterIdHash;
    idOk.in[1] <== registeredVoterHash;

    eligible <== ageOk.out * idOk.out;
}

component main = VoterEligibilityVerifier();
