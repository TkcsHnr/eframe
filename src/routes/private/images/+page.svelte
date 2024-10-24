<script lang="ts">
	import { deleting, images, queue, queueDeleting, uploading } from '$lib/stores';
	import { onMount } from 'svelte';
	import type { ActionData, PageData } from './$types';
	import ActionButton from './ActionButton.svelte';
	import ImageControl from './ImageControl.svelte';
	import UploadModal from './UploadModal.svelte';
	import Placeholder from './Placeholder.svelte';

	export let data: PageData;
	export let form: ActionData;

	let sleepSeconds = data.sleepSeconds;
	function secondsToTime(seconds: number) {
		let hours = Math.floor(seconds / 3600)
			.toString()
			.padStart(2, '0');
		let minutes = Math.floor((seconds % 3600) / 60)
			.toString()
			.padStart(2, '0');

		return hours + ':' + minutes;
	}
	onMount(() => {
		$images = data.images || [];
		$queue = data.queue || [];
	});
	
</script>

{#if form?.error}
	<div role="alert" class="alert alert-error">
		<span>{form.error.message}</span>
	</div>
{/if}

{#if $queue.length > 0}
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
		{#each $queue as queueItem}
			<div class="carousel-item">
				{#if $queueDeleting.includes(queueItem.id)}
					<Placeholder portrait={queueItem.image.portrait}>
						<span class="loading loading-spinner loading-md text-error"></span>
					</Placeholder>
				{:else}
					<ImageControl image={queueItem.image} queue>
						<ActionButton
							name="deleteFromQueue"
							desc="Remove"
							fa="fa-solid fa-trash-can"
							id={queueItem.id}
							del
						/>
					</ImageControl>
				{/if}
			</div>
		{/each}
	</div>
{/if}

<form action="?/updateTime" method="post" class="flex items-center gap-2 w-full max-w-md">
	<label for="time" class="badge badge-neutral">{secondsToTime(sleepSeconds)}</label>
	<input
		bind:value={sleepSeconds}
		type="range"
		min="0"
		max="86400"
		step="1800"
		class="range"
		name="seconds"
	/>
	<button type="submit" class="btn btn-success btn-sm btn-circle">
		<i class="fa-solid fa-right-from-bracket"></i>
	</button>
</form>

<div class="flex items-center">
	<h2 class="text-2xl font-bold">Images</h2>
	<div class="divider divider-horizontal"></div>
	<UploadModal />
</div>

<div class="grid grid-cols-2 sm:flex flex-wrap max-w-5xl gap-4 justify-center">
	{#if $uploading != ''}
		<Placeholder portrait={$uploading == 'portrait'}>
			<span class="loading loading-spinner loading-md"></span>
		</Placeholder>
	{/if}
	{#each $images as image}
		{#if $deleting.includes(image.id)}
			<Placeholder portrait={image.portrait}>
				<span class="loading loading-spinner loading-md text-error"></span>
			</Placeholder>
		{:else}
			<ImageControl {image}>
				<ActionButton
					name="addToQueueEnd"
					desc="Add to end"
					id={image.id}
					fa="fa-solid fa-right-to-bracket"
				/>
				<ActionButton
					name="addToQueueFront"
					desc="Add to front"
					id={image.id}
					fa="fa-solid fa-right-to-bracket rotate-180"
				/>
				<ActionButton
					name="deleteImage"
					desc="Delete"
					id={image.id}
					fa="fa-solid fa-trash-can"
					del
				/>
			</ImageControl>
		{/if}
	{/each}
</div>
