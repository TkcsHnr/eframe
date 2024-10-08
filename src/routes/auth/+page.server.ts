import { redirect } from '@sveltejs/kit';

import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ url, request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) {
			console.error(error);
		}

		const redirectTo = url.searchParams.get('redirectTo');
		if (redirectTo) {
			redirect(303, `/${redirectTo.slice(1)}`);
		}
		redirect(303, '/private/images');
	}
};
