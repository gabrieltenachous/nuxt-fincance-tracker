import { ref, computed, watch, type Ref } from 'vue';
import type { Transaction, Period } from '~/types/interface/transactions';

export const useFetchTransactions = (period: Ref<Period>) => {
  // Obtendo o cliente Supabase a partir do contexto do Nuxt 
  const supabase = useSupabaseClient()

  const transactions = ref<Transaction[]>([]);
  const pending = ref<boolean>(false);

  const income = computed(() =>
    transactions.value.filter((t: Transaction) => t.type === 'Income')
  );
  const expense = computed(() =>
    transactions.value.filter((t: Transaction) => t.type === 'Expense')
  );

  const incomeCount = computed(() => income.value.length);
  const expenseCount = computed(() => expense.value.length);

  const incomeTotal = computed(() =>
    income.value.reduce((sum, transaction) => sum + transaction.amount, 0)
  );
  const expenseTotal = computed(() =>
    expense.value.reduce((sum, transaction) => sum + transaction.amount, 0)
  );

  const fetchTransactions = async (): Promise<Transaction[]> => {
    pending.value = true;
    try {
      const { data, error } = await supabase
      .from('transactions')
      .select()
      .gte('created_at', period.value.from.toISOString())
      .lte('created_at', period.value.to.toISOString())
      .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching transactions:', error);
        return [];
      }

      // Garantir que data seja um array de Transaction
      return data && Array.isArray(data) ? data : [];
    } finally {
      pending.value = false;
    }
  };

  const refresh = async () => {
    transactions.value = await fetchTransactions();
  };

  watch(
    period,
    async () => {
      await refresh();
    },
    { immediate: true }
  );

  const transactionsGroupedByDate = computed(() => {
    const grouped: Record<string, Transaction[]> = {};

    for (const transaction of transactions.value) {
      const date = new Date(transaction.created_at).toISOString().split('T')[0];

      if (!grouped[date]) {
        grouped[date] = [];
      }

      grouped[date].push(transaction);
    }

    return grouped;
  });

  return {
    transactions: {
      all: transactions,
      grouped: {
        byDate: transactionsGroupedByDate,
      },
      income,
      expense,
      incomeTotal,
      expenseTotal,
      incomeCount,
      expenseCount,
    },
    refresh,
    pending,
  };
};
