import React, { ChangeEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWallet, useAppSupplies, useChainSelector, useEthersSigner } from './customHooks';
import { DashboardLayoutStyled } from '../after/components/DashboardLayoutStyled';
import { TransactionTableStyled } from '../after/components/TransactionTableStyled';
import { ChainSelectorComponent, AppToastComponent } from '@material-ui/core';


const BurnPageStyled = styled.div``;


enum BurnTxProgress {
  default = "Burn App Tokens",
  burning = "Burning...",
}


export const BurnPage = () => {

  const { walletAddress, isWalletConnected, openConnectModal } = useWallet();
  const { openChainSelector, setOpenChainSelector } = useChainSelector();
  const { chains: receiveChains } = useWallet();
  const { supplies, allSupplies, setSuppliesChain, suppliesChain, fetchSupplies } = useAppSupplies(true);
  const [burnTransactions, setBurnTransactions] = useState<any[]>([]);
  const [burnAmount, setBurnAmount] = useState("");
  const { toastMsg, toastSev, showToast } = useAppToast();
  const ethersSigner = useEthersSigner({
    chainId: walletChain?.id ?? chainEnum.mainnet,
  });
  const [txButton, setTxButton] = useState<BurnTxProgress>(BurnTxProgress.default);
  const [txProgress, setTxProgress] = useState<boolean>(false);
  const [burnTxHash, setBurnTxHash] = useState<string | null>(null);

 
  useEffect(() => {
    CoinGeckoApi.fetchCoinData()
      .then((data: any) => setCoinData(data?.market_data))
      .catch((err) => console.error(err));
  }, []);


  const onChangeBurnAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setBurnAmount("");
    } else if (!isNaN(parseFloat(value))) {
      setBurnAmount(value);
    }
  };


  const executeBurn = async () => {
    if (!isWalletConnected) {
      openConnectModal();
      return;
    }
    if (burnAmount === "") {
      console.log("Enter amount to migrate");
      showToast("Enter amount to migrate", ToastSeverity.warning);
      return;
    }
 
    try {
      const newTokenAddress = fetchAddressForChain(walletChain?.id, "newToken");
      const oftTokenContract = new Contract(newTokenAddress, oftAbi, ethersSigner);
      const amount = parseEther(burnAmount);
      setTxButton(BurnTxProgress.burning);
      setTxProgress(true);
      const burnTx = await oftTokenContract.burn(amount);
      setBurnTxHash(burnTx.hash);
      await burnTx.wait();
      setTxButton(BurnTxProgress.default);
      setTxProgress(false);
      refetchTransactions();
      fetchSupplies();
    } catch (err) {
      console.error(err);
      setTxButton(BurnTxProgress.default);
      setTxProgress(false);
      showToast("Burn Failed!", ToastSeverity.error);
    }
  };


  const refetchTransactions = () => {
    Promise.all(ChainScanner.fetchAllTxPromises(isChainTestnet(walletChain?.id)))
      .then((results: any) => {
        let res = results.flat();
        res = ChainScanner.sortOnlyBurnTransactions(res);
        res = res.sort((a: any, b: any) => b.timeStamp - a.timeStamp);
        setBurnTransactions(res);
      })
      .catch((err) => console.error(err));
  };


  useEffect(() => {
    if (!walletChain) return;
    let isSubscribed = true;
    if (isSubscribed) setBurnTransactions([]);
    const isTestnet = isChainTestnet(walletChain?.id);
    let _chainObjects: any[] = [mainnet, avalanche, fantom];
    if (isTestnet) _chainObjects = [sepolia, avalancheFuji, fantomTestnet];
    Promise.all(ChainScanner.fetchAllTxPromises(isTestnet))
      .then((results: any) => {
        if (isSubscribed) {
          let new_chain_results: any[] = [];
          results.forEach((results_a: any[], index: number) => {
            new_chain_results.push(
              results_a.map((tx: any) => ({
                ...tx,
                chain: _chainObjects[index],
              }))
            );
          });
          let res = new_chain_results.flat();
          res = ChainScanner.sortOnlyBurnTransactions(res);
          res = res.sort((a: any, b: any) => b.timeStamp - a.timeStamp);
          setBurnTransactions(res);
        }
      })
      .catch((err) => console.error(err));
    return () => {
      isSubscribed = false;
    };
  }, [walletChain, isOldToken]);

  return (
    <BurnPageStyled>
      <DashboardLayoutStyled className="burnpage" />
      <TransactionTableStyled />
      <ChainSelectorComponent
        openChainSelector={openChainSelector}
        setOpenChainSelector={setOpenChainSelector}
        chains={receiveChains}
        selectedChain={suppliesChain}
        setSelectedChain={setSuppliesChain}
      />
      <AppToastComponent
        position={{ vertical: "bottom", horizontal: "center" }}
        message={toastMsg}
        severity={toastSev}
      />
    </BurnPageStyled>
  );
};
