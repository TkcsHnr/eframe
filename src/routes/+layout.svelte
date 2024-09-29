<script lang="ts">
	import '../app.css';
	import '@fortawesome/fontawesome-free/css/all.min.css';

	import { invalidate, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { redirect } from '@sveltejs/kit';

	export let data;
	$: ({ session, supabase } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});

	$: logout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error);
		}
		invalidateAll();
	};
</script>

<header
	class="w-full flex items-center p-4 gap-4 text-lg h-16 bg-base-200 border-b border-base-content border-opacity-20 shadow"
>
	<a class="link" class:link-primary={$page.route.id == '/'} href="/">Home</a>
	<a
		class="link mr-auto"
		class:link-primary={$page.route.id == '/private/images'}
		href="/private/images"
	>
		Images
	</a>

	{#if session}
		<button class="link link-error" on:click={logout}>Logout</button>
	{:else}
		<a href="/auth" class="link">Login</a>
	{/if}
</header>
<main class="flex flex-col items-center w-full min-h-full p-4 gap-8 pt-8">
	<slot />
</main>
