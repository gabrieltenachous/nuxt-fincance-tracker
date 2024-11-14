<template>
    <div class="grid  grid-cols-6 gap-8">
        <UVerticalNavigation :links="links" class="col-span-2"></UVerticalNavigation>
        <div class="col-span-4">
            <NuxtPage></NuxtPage>
        </div>
    </div>
</template>
<script setup>
const links = [
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