import { ref, watch } from 'vue';

export const useAvatarUrl = () => {
  const supabase = useSupabaseClient(); 
  const user = useSupabaseUser();

  const getPublicUrl = (): string | null => {
    const avatarPath = user.value?.user_metadata?.avatar_url;
    if (!avatarPath) return null;

    const { data } = supabase.storage.from('avatars').getPublicUrl(avatarPath);
    return data?.publicUrl || null;
  };

  const url = ref<string | null>(getPublicUrl());

  watch(user, () => {
    url.value = getPublicUrl();
  }, { immediate: true });

  return { url };
};
