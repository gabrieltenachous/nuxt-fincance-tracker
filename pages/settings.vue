<template>
    <div class="grid  grid-cols-6 gap-8">
        <UVerticalNavigation :links="links" class="col-span-2"></UVerticalNavigation>
        <div class="col-span-4">
            <NuxtPage></NuxtPage>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { Links } from '~/types/interface/links'; // Importa a interface externa
// Tipando a variável 'links' com a interface 'Links'
const links: Links[] = [
    {
        label: 'Profile',
        to: '/settings/profile'
    },
    {
        label: 'Avatar',
        to: '/settings/avatar'
    },
    {
        label: 'Settings',
        to: '/settings/settings'
    }
]
</script>
