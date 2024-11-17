<template>
  <div class="grid grid-cols-3 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100">
    <div class="flex items-center justify-between space-x-4 col-span-2">
      <div class="flex items-center space-x-1">
        <UIcon :name="icon" :class="[iconColor]" />
        <div>{{ transaction.description }}</div>
      </div>

      <div>
        <UBadge color="white" v-if="transaction.category">{{ transaction.category }}</UBadge>
      </div>
    </div>

    <div class="flex items-center justify-end space-x-2">
      <div>{{ currency }}</div>
      <div>
        <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
          <UButton color="white" variant="ghost" trailing-icon="i-heroicons-ellipsis-horizontal" :loading="isLoading" />
          <TransactionModal v-model="isOpen" :transaction="transaction" @saved="emit('edited')" />
        </UDropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PostgrestError } from '@supabase/supabase-js';
import { computed, ref } from 'vue';
import { useCurrency } from '~/composables/useCurrency'; 
import { type Transaction } from '~/types/interface/transactions';

const props = defineProps<{
  transaction: Transaction;
}>();

const emit = defineEmits(['deleted', 'edited']);

const isIncome = computed(() => props.transaction.type === 'Income');
const icon = computed(() =>
  isIncome.value ? 'i-heroicons-arrow-up-right' : 'i-heroicons-arrow-down-left'
);
const iconColor = computed(() =>
  isIncome.value ? 'text-green-600' : 'text-red-600'
);

const { currency } = useCurrency(props.transaction.amount);

const isLoading = ref(false);
const { toastError, toastSuccess } = useAppToast();
const supabase = useSupabaseClient();

const isOpen = ref(false);

const deleteTransaction = async () => {
  if (!props.transaction.id) {
    toastError({ title: 'Transaction ID is missing' });
    return;
  }

  isLoading.value = true;

  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', props.transaction.id);

    if (error) {
      throw error;
    }

    toastSuccess({ title: 'Transaction deleted' });
    emit('deleted', props.transaction.id);
  } catch (error: any) {
    toastError({ 
      title: 'Transaction was not deleted', 
      description: error.message 
    });
  } finally {
    isLoading.value = false;
  }
};


const items = [
  [
    {
      label: 'Edit',
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => (isOpen.value = true),
    },
    {
      label: 'Delete',
      icon: 'i-heroicons-trash-20-solid',
      click: deleteTransaction,
    },
  ],
];
</script>
