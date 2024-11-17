export interface Transaction {
    id?: string; // Alterado para opcional
    type: 'Income' | 'Expense' | 'Investment' | 'Saving';
    amount: number;
    created_at: string;
    description?: string;
    category?: string;
  }
  

export interface Period {
    from: Date;
    to: Date;
}

export interface TransactionsState {
    transactions: Transaction[];
    pending: boolean;
}

export type TransactionInsert = {
    id?: string; // `id` deve ser opcional
    type: 'Income' | 'Expense' | 'Investment' | 'Saving';
    description?: string;
    created_at: string;
    amount: number;
    category?: string;
  };
  