<script>
	export let current_id;
	export let image;
</script>

<div class:dropdown={current_id != image.id} class:col-span-2={!image.portrait}>
	<div
		tabindex="0"
		role="button"
		class="indicator w-full mb-1 rounded-box shadow border border-base-300"
		on:contextmenu|preventDefault
	>
		<img
			class="rounded-box sm:h-52
            {current_id == image.id ? 'outline outline-success outline-4' : ''}"
			src={image.base64}
			alt="uploaded"
		/>
		{#if image.id == current_id}
			<span class="indicator-item indicator-center badge badge-success font-medium rounded-t-none rounded-b-btn mt-2 pb-1">current</span>
		{/if}
	</div>
	<!-- svelte-ignore a11y-missing-attribute -->
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	{#if current_id != image.id}
		<ul
			tabindex="0"
			class="dropdown-content border border-base-300 menu bg-base-200 rounded-box z-[1] max-w-52 w-full p-2 shadow"
		>
			<li>
				<form action="?/set_current" method="post" class="flex">
					<input type="number" name="id" hidden value={image.id} />
					<button type="submit" class="text-left grow">
						<i class="fa-solid fa-paper-plane"></i>
						Set as current
					</button>
				</form>
			</li>
			<li>
				<form action="?/delete" method="post" class="flex">
					<input type="number" name="id" hidden value={image.id} />
					<button type="submit" class="link-error text-left grow">
						<i class="fa-solid fa-trash-can"></i>
						Delete
					</button>
				</form>
			</li>
		</ul>
	{/if}
</div>
