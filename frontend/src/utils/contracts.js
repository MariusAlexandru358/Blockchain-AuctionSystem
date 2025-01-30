import { ethers } from 'ethers';

// Replace with your deployed contract address and ABI
const ERC20_CONTRACT_ADDRESS = "0xYourERC20ContractAddress";
const ERC20_ABI = [
  // Add your contract's ABI here
];

export const depositPoints = async (provider, amount) => {
  try {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(ERC20_CONTRACT_ADDRESS, ERC20_ABI, signer);
    const tx = await contract.deposit({ value: ethers.utils.parseEther(amount) });
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Deposit failed:", error);
    return false;
  }
};

export const withdrawPoints = async (provider, points) => {
  try {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(ERC20_CONTRACT_ADDRESS, ERC20_ABI, signer);
    const tx = await contract.withdraw(points);
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Withdraw failed:", error);
    return false;
  }
};
