<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import ImageControl from './ImageControl.svelte';

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

<div class="grid grid-cols-2 sm:flex flex-wrap max-w-5xl gap-4 pb-32 justify-center">
	{#each data.images as image}
		<ImageControl {image} ></ImageControl>
	{/each}
</div>