<template>
  <header class="flex justify-between items-center mt-10">
    <NuxtLink to="/" class="text-xl font-bold">Finance Tracker</NuxtLink>
    <div>
      <UDropdown :items="items" :ui="{ item: { disabled: 'cursor-text select-text' }, width: 'w-64' }" v-if="user">
        <UAvatar :src="url || defaultAvatar" alt="Avatar" />
        <template #account="{ item }">
          <div class="text-left">
            <p>Signed in as</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ user.email }}</p>
          </div>
        </template>
        <template #item="{ item }">
          <button @click="item.onClick($event)" class="flex items-center justify-between w-full text-left">
            <span class="truncate">{{ item.label }}</span>
            <UIcon :name="item.icon" class="h-4 w-4 text-gray-400 dark:text-gray-500" />
          </button>
        </template>
      </UDropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from '#app';
import { useAvatarUrl } from '~/composables/useAvatarUrl';
import type { ItemsType } from '~/types/interface/u_drop_down_item';

const router = useRouter();
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { url } = useAvatarUrl();
const defaultAvatar = 'https://static-00.iconduck.com/assets.00/profile-default-icon-512x511-v4sw4m29.png'; // Caminho para avatar padrão

const handleSettingsClick = () => {
  router.push('/settings/profile');
};

const handleSignOut = async () => {
  await supabase.auth.signOut();
  router.push('/login');
};

const items: ItemsType = [
  [
    { label: '', icon: '', onClick: () => {} }, // Empty item to replace the AccountItem
  ],
  [
    {
      label: 'Settings',
      icon: 'i-heroicons-cog-8-tooth',
      onClick: handleSettingsClick,
    },
    {
      label: 'Sign out',
      icon: 'i-heroicons-arrow-left-on-rectangle',
      onClick: handleSignOut,
    },
  ],
];


</script>
