<template>
  <UForm :state="state" :schema="schema" @submit.prevent="saveProfile">
    <UFormGroup class="mb-4" label="Full Name" name="name">
      <UInput v-model="state.name" />
    </UFormGroup>

    <UFormGroup class="mb-4" label="Email" name="email"
      help="You will receive a confirmation email on both the old and the new addresses if you modify the email address">
      <UInput v-model="state.email" />
    </UFormGroup>

    <UButton type="submit" color="black" variant="solid" label="Save" :looading="pending" :disabled="pending"/>
  </UForm>
</template>
  
<script setup lang="ts">
  import { z } from 'zod'

  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const { toastSuccess, toastError } = useAppToast()
  const pending = ref(false)

  // Verifique se o usuário está disponível antes de acessar suas propriedades

  const state = ref({
    name: user.value?.user_metadata?.full_name,
    email: user.value?.email
  })

  const schema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email()
  })

  const saveProfile = async () => {
  if (!user.value) {
    toastError({
      title: 'Error',
      description: 'User is not authenticated'
    })
    return
  }

  pending.value = true
  try {
    const data: { full_name?: string; email?: string } = {
      full_name: state.value.name,
    }

    // Atualiza o email somente se for diferente do atual
    if (state.value.email !== user.value.email) {
      data.email = state.value.email
    }

    // Atualiza o full_name nos metadados do usuário (user_metadata)
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: data.full_name
      }
    })

    if (error) throw error // Lança erro se existir

    // Caso o email também precise ser atualizado
    if (data.email) {
      const { error: emailError } = await supabase.auth.updateUser({
        email: data.email,
      })
      if (emailError) throw emailError // Lança erro se existir
    }

    toastSuccess({
      title: 'Profile updated',
      description: 'Your Profile has been updated'
    })
  } catch (error: unknown) {
    if (error instanceof Error) {
      toastError({
        title: 'Error updating profile',
        description: error.message
      })
    } else {
      toastError({
        title: 'Unknown error',
        description: 'An unknown error occurred'
      })
    }
  } finally {
    pending.value = false
  }
}

</script>
