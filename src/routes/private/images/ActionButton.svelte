<script lang="ts">
	import { enhance } from '$app/forms';
	import { deleting } from '$lib/stores';

	export let name;
	export let desc;
	export let image_id;
	export let position = null;
	export let fa;

	export let del = false;
</script>

<li>
	<form
		action="?/{name}"
		method="post"
		class="flex"
		use:enhance={() => {
			if (name == 'deleteImage') {
				$deleting = [...$deleting, image_id];
				return async ({ update }) => {
					await update();
					$deleting = $deleting.filter((id) => id != image_id);
				};
			}
		}}
	>
		<input type="number" name="image_id" hidden value={image_id} />
		<input type="number" name="position" hidden value={position} />
		<button type="submit" class="text-left w-full {del ? 'text-error' : ''}">
			<i class="{fa} mr-2"></i>
			{desc}
		</button>
	</form>
</li>
