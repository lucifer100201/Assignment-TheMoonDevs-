import React from 'react'
import {TransactionTableComponent} from '@material-ui/core';
const TransactionTableStyled = () => {
  return (
    <div>
       <div className="header">
          <p className="header_label">Burn Transactions</p>
        </div>
        <TransactionTableComponent
          burnTransactions={burnTransactions}
          coinData={coinData}
        />
    </div>
  )
}

export default TransactionTableStyled
