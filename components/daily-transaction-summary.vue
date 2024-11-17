<template>
    <div class="grid grid-cols-2 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-bold">
        <div class="flex items-center justify-between">
            {{ date }}
        </div>
        <div class="flex items-center justify-end mr-10">
            {{ currency }}
        </div>
    </div>
</template>
<script setup lang="ts">
import type { Transaction } from '~/types/interface/transactions';
// Tipando a propriedade 'transactions' como um array de 'Transaction'
const props = defineProps({
  date: String,
  transactions: {
    type: Array as () => Transaction[],  // Definindo o tipo adequado para 'transactions'
    required: true
  }
});

// Computed para somar os valores das transações
const sum = computed(() => {
  let total = 0;
  for (const transaction of props.transactions) {
    if (transaction.type === 'Income') {
      total += transaction.amount;
    } else if (transaction.type === 'Expense') {
      total -= transaction.amount;
    }
  }
  return total;
});

// Supondo que 'useCurrency' formate o valor de acordo com a moeda
const useCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',  // Ajuste o código da moeda conforme necessário
  }).format(amount);
};

// Computed para formatar o valor total em moeda
const currency = computed(() => useCurrency(sum.value));
</script>
