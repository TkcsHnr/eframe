<script lang="ts">
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let upload_modal: HTMLDialogElement;

	$: portrait = false;
	let files: FileList;
	function processFile() {
		const imageTest = new Image();
		imageTest.onload = function () {
			portrait = imageTest.width < imageTest.height;
			URL.revokeObjectURL(imageTest.src);
		};
		imageTest.src = URL.createObjectURL(files[0]);
	}
</script>

{#if form?.error}
	<div role="alert" class="alert alert-error">
		<span>{form.error.message}</span>
	</div>
{/if}
<!-- Open the modal using ID.showModal() method -->
<button class="btn" on:click={() => upload_modal.showModal()}>
	<i class="fa-solid fa-plus"></i>
	Upload new image
</button>
<dialog bind:this={upload_modal} class="modal">
	<div class="modal-box max-w-11/12">
		<form method="post" action="?/upload" enctype="multipart/form-data" class="flex flex-col gap-4">
			<input
				type="file"
				name="file"
				accept="image/*"
				required
				class="file-input file-input-bordered w-full max-w-xs"
				bind:files
				on:change={processFile}
			/>
			<input type="checkbox" name="portrait" bind:value={portrait} hidden />
			<div class="join">
				<div
					class="join-item flex items-center bg-base-200 rounded-btn border border-base-content border-opacity-20 px-4"
				>
					Orientation:
				</div>
				<label
					class="join-item swap btn btn-square border border-base-content border-opacity-20 text-lg"
				>
					<input type="checkbox" name="portrait" bind:checked={portrait} />
					<div class="swap-on">
						<i class="fa-solid fa-up-down"></i>
					</div>
					<div class="swap-off">
						<i class="fa-solid fa-left-right"></i>
					</div>
				</label>
			</div>
			<div class="flex gap-4 justify-between">
				<form method="dialog">
					<button class="btn btn-error">Cancel</button>
				</form>
				<button type="submit" class="btn btn-success">Upload</button>
			</div>
		</form>
	</div>
</dialog>
<div class="flex flex-wrap gap-4 justify-center">
	{#each data.images as image}
		<div class:dropdown={data.current_id != image.id} >
			<div
				tabindex="0"
				role="button"
				class="h-fit p-4 mb-1 rounded-box bg-base-200 shadow border border-base-300 indicator
				{data.current_id == image.id ? 'outline outline-info outline-4' : ''}"
				on:contextmenu|preventDefault
			>
				<img class="h-52" src={image.base64} alt="uploaded" />
				{#if data.current_id == image.id}
					<span class="indicator-item indicator-center badge badge-info">current</span>
				{/if}
			</div>
			<!-- svelte-ignore a11y-missing-attribute -->
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			{#if data.current_id != image.id}
				<ul
					tabindex="0"
					class="dropdown-content menu bg-base-200 rounded-box z-[1] max-w-52 w-full p-2 shadow"
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
	{/each}
</div>
