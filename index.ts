import dotenv from 'dotenv';
import { Coinbase, Wallet } from "@coinbase/coinbase-sdk";


dotenv.config(); // Load environment variables from .env file

// Coinbase Credentials setup
const apiKeyName = process.env.API_KEY || '';
const apiSecret = process.env.API_SECRET || '';
// Create a new instance of the Coinbase class
Coinbase.configure({ apiKeyName: apiKeyName, privateKey: apiSecret });

// Create a new wallet in Coinbase Project on base-sepolia Mainnet
//This differ from the Coinbase Mainnet
async function createWallet() {
  try {
    const wallet = await Wallet.create();
    const faucetTransaction = await wallet.faucet();
    //const address = await wallet.getDefaultAddress();

    //console.log(`Faucet transaction: ${faucetTransaction}`);
    //console.log(`Address: ${address}`);
    console.log(`Wallet sucessfully funded with ${faucetTransaction}`);
    console.log(`Wallet successfully created: `, wallet.toString());

    return wallet;
  } catch (error) {
    console.error('Error creating wallet:', error);
    throw error;
  }
}
//Export / Save wallets
//Save the seed phrase and the wallet id in a secure place. You will need them to recover your wallet.
async function exportWallet(wallet: Wallet) {
  try {
    const data = await wallet.export();
    const filePath = `./secure/wallet-${wallet}.json`;
    // Save the wallet data to a file
    await wallet.saveSeedToFile(filePath, true); // Save the seed phrase to a file true to encrypt the seed phrase
    console.log('Wallet data:', data);
    console.log('Wallet data saved to:', filePath);
  
  } catch (error) {
    console.error('Error exporting wallet:', error);
    throw error;
  }
}

async function listWallets() {
  try {
      const wallets = await Wallet.listWallets();
      console.log('Wallets:', wallets);
  } catch (error) {
      console.error('Error listing wallets:', error);
  }
}

//Main function
async function main() {
  try {
    const wallet = await createWallet();
    await exportWallet(wallet);
    await listWallets();

  } catch (error) {
    console.error('Something went wrong...', error);
  }
}

main();
