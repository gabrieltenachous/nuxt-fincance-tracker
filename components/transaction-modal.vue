<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        {{ isEditing ? 'Edit' : 'Add' }} Transaction
      </template>

      <UForm :state="state" :schema="schema" ref="form" @submit.prevent="save">
        <UFormGroup :required="true" label="Transaction Type" name="type" class="mb-4">
          <USelect :disabled="isEditing" placeholder="Select the transaction type" :options="types"
            v-model="state.type" />
        </UFormGroup>

        <UFormGroup label="Amount" :required="true" name="amount" class="mb-4">
          <UInput type="number" placeholder="Amount" v-model.number="state.amount" />
        </UFormGroup>

        <UFormGroup label="Transaction date" :required="true" name="created_at" class="mb-4">
          <UInput type="date" icon="i-heroicons-calendar-days-20-solid" v-model="state.created_at" />
        </UFormGroup>

        <UFormGroup label="Description" hint="Optional" name="description" class="mb-4">
          <UInput placeholder="Description" v-model="state.description" />
        </UFormGroup>

        <UFormGroup :required="true" label="Category" name="category" class="mb-4" v-if="state.type === 'Expense'">
          <USelect placeholder="Category" :options="categories" v-model="state.category" />
        </UFormGroup>

        <UButton type="submit" color="black" variant="solid" label="Save" :loading="isLoading" />
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { categories, types } from '~/constants';
import { z } from 'zod';
import { ref, computed } from 'vue'; 
import { useAppToast } from '~/composables/useAppToast';
import type { Transaction, TransactionInsert } from '~/types/interface/transactions';
 
const props = defineProps({
  modelValue: Boolean,
  transaction: {
    type: Object as () => Transaction | undefined,
    required: false,
  },
});

const emit = defineEmits(['update:modelValue', 'saved']);
const supabase = useSupabaseClient<{
  transactions: TransactionInsert;
}>();
const { toastError, toastSuccess } = useAppToast();

const isEditing = computed(() => !!props.transaction);

const defaultSchema = z.object({
  created_at: z.string(),
  description: z.string().optional(),
  amount: z.number().positive('Amount needs to be more than 0'),
});

const categoriesEnum = z.enum(categories as [string, ...string[]]);

const incomeSchema = z.object({
  type: z.literal('Income'),
});
const expenseSchema = z.object({
  type: z.literal('Expense'),
  category: categoriesEnum,
});
const investmentSchema = z.object({
  type: z.literal('Investment'),
});
const savingSchema = z.object({
  type: z.literal('Saving'),
});

const schema = z.intersection(
  z.discriminatedUnion('type', [incomeSchema, expenseSchema, investmentSchema, savingSchema]),
  defaultSchema
);


const form = ref();
const isLoading = ref(false);

const initialState: Transaction = isEditing.value
  ? {
      id: props.transaction?.id, // Incluído apenas quando em edição
      type: props.transaction?.type || 'Income', // Valor padrão válido
      amount: props.transaction?.amount || 0,
      created_at: props.transaction?.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
      description: props.transaction?.description || '',
      category: props.transaction?.category || '',
    }
  : {
      id: undefined,
      type: 'Income', // Valor padrão para novas transações
      amount: 0,
      created_at: new Date().toISOString().split('T')[0], // Data padrão válida
      description: '',
      category: '',
    };


const state = ref<Transaction>({ ...initialState });

const resetForm = () => {
  Object.assign(state.value, initialState);
  form.value?.clear();
};

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) resetForm();
    emit('update:modelValue', value);
  },
}); 
const save = async () => {
  if (form.value?.errors.length) return;

  isLoading.value = true;
  try {
    const insertData: TransactionInsert = {
      type: state.value.type,
      amount: state.value.amount,
      created_at: state.value.created_at,
      description: state.value.description || undefined,
      category: state.value.category || undefined,
    };

    const { error } = await supabase
      .from('transactions')
      .upsert(isEditing.value ? { ...insertData, id: props.transaction?.id } : insertData);

    if (!error) {
      toastSuccess({ title: 'Transaction saved' });
      isOpen.value = false;
      emit('saved');
      return;
    }

    throw error;
  } catch (e: any) {
    toastError({
      title: 'Transaction not saved',
      description: e.message,
    });
  } finally {
    isLoading.value = false;
  }
};

</script>
