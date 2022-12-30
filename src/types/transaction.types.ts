export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
}

export type TransactionCardMetadata = {
  card_id: string;
  merchant: {
    id: string;
    category_code: string;
    country_code: string;
    name: string;
  };
};

export type TransactionTransferMetadata = {
  sender: {
    name: string;
  };
  // I am assuming we'd get some more information about wire transfers so they can actually be linked to what we have in our database
  iban?: string;
  bic?: string;
};

export enum WebhookTransactionType {
  CARD_AUTHORIZATION = 'CARD_AUTHORIZATION',
  // ... other types
}

export enum WebhookTransactionStatus {
  OPEN = 'OPEN',
  // ... other statuses
}

export interface WebhookTransactionInterface {
  id: string;
  amount: {
    value: number;
    unit: 'cents' | 'dollars';
    currency: Currency;
  };
  type: WebhookTransactionType;
  status: WebhookTransactionStatus;
  meta_info: TransactionCardMetadata | TransactionTransferMetadata;
}
