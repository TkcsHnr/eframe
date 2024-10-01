<script>
	export let image;
	export let queue = false;
</script>

<div class="dropdown overflow-hidden rounded-box" class:col-span-2={!image.portrait}>
	<div
		tabindex="0"
		role="button"
		class="w-full rounded-box shadow border border-base-300"
		on:contextmenu|preventDefault
	>
		<img class="rounded-box {queue ? 'h-52' : 'sm:h-52'}" src={image.base64} alt="uploaded" />
	</div>
	<!-- svelte-ignore a11y-missing-attribute -->
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<ul
		tabindex="0"
		class="dropdown-content bottom-0 left-1/2 -translate-x-1/2 menu bg-base-200 bg-opacity-90 rounded-t-box z-[2] w-max max-w-full"
	>
		<slot></slot>
	</ul>
</div>
