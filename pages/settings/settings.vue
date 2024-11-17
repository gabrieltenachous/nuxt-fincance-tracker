<template>
  <UForm :state="state" :schema="schema" @submit.prevent="saveSettings">
    <UFormGroup label="Transaction View" class="mb-4" help="Choose how you would like to view transactions">
      <!-- Passando transactionViewOptions como array mutável -->
      <USelect v-model="state.transactionView" :options="transactionViewOptions.slice()" />
    </UFormGroup>
    <UButton type="submit" color="black" variant="solid" label="Save" :loading="pending" :disabled="pending" />
  </UForm>
</template>

<script setup lang="ts">
import { z } from 'zod'

const transactionViewOptions = ['Yearly', 'Monthly', 'Daily'] as const;

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { toastSuccess, toastError } = useAppToast()
const pending = ref(false)

const state = ref<{
  transactionView: 'Yearly' | 'Monthly' | 'Daily'
}>({
  transactionView: user.value?.user_metadata?.transaction_view ?? transactionViewOptions[1]
})

const schema = z.object({
  transactionView: z.enum(transactionViewOptions) // Validação do valor baseado nas opções definidas
})

const saveSettings = async () => {
  if (!user.value) {
    toastError({
      title: 'Error',
      description: 'User is not authenticated'
    })
    return
  }

  pending.value = true
  
  try {
    const { error } = await supabase.auth.updateUser({
      data: {
        transaction_view: state.value.transactionView
      }
    })
    
    if (error) throw error // Lança erro caso exista

    toastSuccess({
      title: 'Settings updated',
    })
  } catch (error: unknown) {
    if (error instanceof Error) {
      toastError({
        title: 'Error updating settings',
        description: error.message, // Acesso seguro à mensagem de erro
      })
    } else {
      toastError({
        title: 'Unknown error',
        description: 'An unknown error occurred while updating settings.',
      })
    }
  } finally {
    pending.value = false
  }
}
</script>
