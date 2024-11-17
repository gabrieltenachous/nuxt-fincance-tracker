<template>
    <UCard>
        <template #header>
            Signing in...
        </template>
        Wait a moment while we sign you in...
    </UCard>
</template>

<script setup lang="ts">
// Usando o composable para redirecionar se já estiver autenticado
useRedirectIfAuthenticated();
</script>
