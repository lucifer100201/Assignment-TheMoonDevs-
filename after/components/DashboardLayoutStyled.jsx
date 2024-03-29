import React from 'react'
import {BurnButtonBarComponent, BurnStatsComponent} from '@material-ui/core';
import {BurnButtonBar} from "../components/BurnButtonBar"
import {BurnStatsContainer} from "../components/BurnStatsContainer"
const DashboardLayoutStyled = () => {
  return (
    <div>
       <div className="top_conatiner burnpage" style={{ alignItems: "flex-start" }}>
          <div className="info_box filled">
            
          <BurnButtonBarComponent
              burnAmount={burnAmount}
              onChangeBurnAmount={onChangeBurnAmount}
              executeBurn={executeBurn}
              txProgress={txProgress}
              txButton={txButton}
              burnTxHash={burnTxHash}
              walletChain={walletChain}
            />
            <h1 className="title">App TOKEN BURN</h1>
            <p className="description medium"></p>

          <BurnButtonBar />
          </div>
          <BurnStatsContainer />
          
          <BurnStatsComponent
            supplies={supplies}
            statsSupplies={statsSupplies}
            walletChain={walletChain}
            tokenAddress={tokenAddress}
            suppliesChain={suppliesChain}
            fetchSupplies={fetchSupplies}
            coinData={coinData}
          />
            
         
        </div>
    </div>
  )
}

export default DashboardLayoutStyled
