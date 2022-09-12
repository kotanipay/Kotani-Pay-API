export interface ApiResponse {
  message: string;
  result: any;
}

export interface ITransaction {
  blockHash: string;
  blockNumber: string;
  confirmations: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  feeCurrency: string;
  from: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  gatewayFee: string;
  gatewayFeeRecipient: string;
  hash: string;
  input: string;
  isError: string;
  nonce: string;
  timeStamp: string;
  to: string;
  transactionIndex: string;
  txreceipt_status: string;
  value: string;
}
