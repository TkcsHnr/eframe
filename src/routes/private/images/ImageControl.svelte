<script>
	import ActionButton from './ActionButton.svelte';

	export let image;
</script>

<div class="dropdown overflow-hidden rounded-box" class:col-span-2={!image.portrait}>
	<div
		tabindex="0"
		role="button"
		class="w-full rounded-box shadow border border-base-300"
		on:contextmenu|preventDefault
	>
		<img class="rounded-box sm:h-52" src={image.base64} alt="uploaded" />
	</div>
	<!-- svelte-ignore a11y-missing-attribute -->
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<ul
		tabindex="0"
		class="dropdown-content bottom-0 left-1/2 -translate-x-1/2 menu bg-base-200 bg-opacity-90 rounded-t-box z-[2] w-full max-w-44"
	>
		<ActionButton name="queueNext" desc="Queue next" image_id={image.id} fa="fa-solid fa-turn-up" />
		<ActionButton
			name="queueLast"
			desc="Queue last"
			image_id={image.id}
			fa="fa-solid fa-turn-down"
		/>
		<ActionButton name="delete" desc="Delete" image_id={image.id} fa="fa-solid fa-trash-can" del />
	</ul>
</div>
