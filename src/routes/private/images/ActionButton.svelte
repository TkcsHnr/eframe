<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { deleting, images, queue, queueDeleting } from '$lib/stores';

	export let name;
	export let desc;
	export let id: number;
	export let fa;

	export let del = false;
</script>

<li>
	<form
		action="?/{name}"
		method="post"
		class="flex"
		use:enhance={() => {
			return async ({ update, result }) => {
				if (name == 'deleteImage') {
					$deleting = [...$deleting, id];
					await update();
					$deleting = $deleting.filter((id) => id != id);
					$images = $images.filter((img) => img.id != id);
					$queue = $queue.filter((q) => q.image.id != id);
				} else if (name == 'deleteFromQueue') {
					$queueDeleting = [...$queueDeleting, id];
					await update();
					$queueDeleting = $queueDeleting.filter((qid) => qid != id);
					$queue = $queue.filter((q) => q.id != id);
				} else if(name == 'addToQueueFront') {
					await update();
					$queue = [$page.data.queue.shift(), ...$queue];
				} else if(name == 'addToQueueEnd') {
					await update();
					$queue = [...$queue, $page.data.queue.pop()];
				}
			};
		}}
	>
		<input type="number" name="id" hidden bind:value={id} />
		<button type="submit" class="text-left w-full {del ? 'text-error' : ''}">
			<i class="{fa} mr-2"></i>
			{desc}
		</button>
	</form>
</li>
