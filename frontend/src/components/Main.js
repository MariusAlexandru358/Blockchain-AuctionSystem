import '../styles/Main.css'

import React, { useState, useEffect} from 'react';
import { useWallet } from '../utils/Context';
import { useNavigate } from 'react-router-dom';


export const Main = () => {
  const navigate = useNavigate();

  const { wallet, initializeWallet } = useWallet();
  const [ethereumAddress, setEthereumAddress] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [factoryContractAddress, setFactoryContractAddress] = useState('');
  const [showContractFields, setShowContractFields] = useState(false);
  const [factoryContrc, setFactoryAddress] = useState('');

  const POINTS_CONTRACT_ADDRESS = "0x2787d3802683F26245fb289b7332a2730F58803A";
  const FACTORY_CONTRACT_ADDRESS = "0x5d96D872e49A16f8399CacA7E9B48AE973311ECD";


  const clearForm = (bShow) => {
    setShowContractFields(bShow);
  }

  const handleVotingContractButtonClick = () => {
    clearForm(true);
  };

  const handleCancelButtonClick = () => {
    clearForm(false);
  };

  const handleContractButtonClick = () => {
    clearForm(false);
  };
  
  const fetchAddress = async () => {
    setEthereumAddress(wallet.address);
  };


  useEffect(() => {
    fetchAddress();
  },[wallet]);


  return (
    <div className="App">
      <div className="App-header">
        <h2>Connected to ...</h2>
        <p>My Address: {ethereumAddress}</p>
        <p>Points Contract: {(contractAddress?contractAddress:POINTS_CONTRACT_ADDRESS)}</p>
        <p>Auction Factory Contract: {(factoryContractAddress?factoryContractAddress:FACTORY_CONTRACT_ADDRESS)}</p>

        {!showContractFields && (
        <button onClick={handleVotingContractButtonClick}>Set Points Contract Address</button>
        )
        }

        {!showContractFields  && (
        <button onClick={()=>navigate('/points', {state: {contractAddress: (contractAddress?contractAddress:POINTS_CONTRACT_ADDRESS)} })}>Points</button>
        )
        }
        
        {!showContractFields  && (
        <button onClick={()=>navigate('/auction-list', {state: {factoryContractAddress: (factoryContractAddress?factoryContractAddress:FACTORY_CONTRACT_ADDRESS)} })}>Auction List</button>
        )
        }

        {!showContractFields  && (
        <button onClick={()=>navigate('/auction-create', {state: {factoryContractAddress: (factoryContractAddress?factoryContractAddress:FACTORY_CONTRACT_ADDRESS)} })}>Create Auction</button>
        )
        }

        {showContractFields && (
          <div>
         <div className="line-container">
         <div >
           <label>Points Contract Address:</label>
           <input
             type="text"
             value={contractAddress}
             onChange={(e) => setContractAddress(e.target.value)}
           />
         </div>
         <div >
           <label>Auction Factory Contract Address:</label>
           <input
             type="text"
             value={factoryContractAddress}
             onChange={(e) => setFactoryContractAddress(e.target.value)}
           />
         </div>
      
         <br />
         <div>
         <button onClick={handleContractButtonClick}>Confirm</button>
         <button onClick={handleCancelButtonClick}>Cancel</button>
         </div>
          </div>
         
       </div>
        
        )}
        
      </div>
      </div>
  );
};

