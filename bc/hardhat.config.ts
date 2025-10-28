import type { HardhatUserConfig } from "hardhat/config";

import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { configVariable } from "hardhat/config";

const config: HardhatUserConfig = {
  plugins: [hardhatToolboxMochaEthersPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
networks: {
  // 1. This is the network `npx hardhat node` will use.
  // We are using your 'edr-simulated' type,
  // naming it 'hardhat', and setting the chainId to 1337.
  hardhat: {
    type: "edr-simulated",
    chainId: 1337, // <--- CHANGE THIS
    },
    localhost: {
      type: "http",
      url: "http://127.0.0.1:8545",
      chainId: 1337 // <--- AND CHANGE THIS
    },

  // 2. Your other networks
  // Kept your 'hardhatOp' network but gave it a unique chainId.
  hardhatOp: {
    type: "edr-simulated",
    chainType: "op",
    chainId: 1338, // Must be different from 'hardhat'
  },

  // 3. Your corrected Sepolia network
  sepolia: {
    type: "http",
    chainType: "l1",
    url: configVariable("SEPOLIA_RPC_URL"),
    accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    chainId: 11155111,
  },
},
  
  // I have removed your non-standard 'hardhatMainnet' and 'hardhatOp'
  // as they were causing the server to fail.
}

export default config;
