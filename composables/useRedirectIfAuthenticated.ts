// Composable para redirecionar o usuário caso já esteja autenticado
import { watch } from 'vue';
import { useRouter } from 'vue-router';

export const useRedirectIfAuthenticated = (url = '/') => { 
    const user = useSupabaseUser();
    const router = useRouter(); // Aqui pegamos o router para usar o método de navegação

    // Watch no user para redirecionar caso já esteja autenticado
    watch(user, (currentUser) => {
        if (currentUser) {
            router.push(url); // Redireciona para a URL fornecida
        }
    }, { immediate: true }); // Immediate: true faz o watch disparar imediatamente após a montagem

    return {
        user
    };
};
