<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import ActionButton from './ActionButton.svelte';
	import ImageControl from './ImageControl.svelte';
	import UploadModal from './UploadModal.svelte';

	export let data: PageData;
	export let form: ActionData;
</script>

{#if form?.error}
	<div role="alert" class="alert alert-error">
		<span>{form.error.message}</span>
	</div>
{/if}

{#if data.queue.length > 0}
	<div class="flex items-center">
		<h2 class="text-2xl font-bold">Queue</h2>
		<div class="divider divider-horizontal"></div>
		<form action="?/clearQueue" method="post">
			<button type="submit" class="btn">
				<i class="fa-solid fa-bomb"></i>
				Remove all
			</button>
		</form>
	</div>
	<div class="carousel carousel-center bg-neutral rounded-box max-w-5xl space-x-4 p-4">
		{#each data.queue as queueItem}
			<div class="carousel-item">
				<ImageControl image={queueItem.image} queue>
					<ActionButton
						name="deleteFromQueue"
						desc="Remove"
						position={queueItem.position}
						fa="fa-solid fa-trash-can"
						del
					/>
				</ImageControl>
			</div>
		{/each}
	</div>
{/if}

<div class="flex items-center">
	<h2 class="text-2xl font-bold">Images</h2>
	<div class="divider divider-horizontal"></div>
	<UploadModal />
</div>

<div class="grid grid-cols-2 sm:flex flex-wrap max-w-5xl gap-4 justify-center">
	{#each data.images as image}
		<ImageControl {image}>
			<ActionButton
				name="addToQueueEnd"
				desc="Add to end"
				image_id={image.id}
				fa="fa-solid fa-right-to-bracket"
			/>
			<ActionButton
				name="addToQueueFront"
				desc="Add to front"
				image_id={image.id}
				fa="fa-solid fa-right-to-bracket rotate-180"
			/>
			<ActionButton
				name="deleteImage"
				desc="Delete"
				image_id={image.id}
				fa="fa-solid fa-trash-can"
				del
			/>
		</ImageControl>
	{/each}
</div>
