<script lang="ts">
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

<button class="btn text-base" on:click={() => upload_modal.showModal()}>
	<i class="fa-solid fa-upload"></i>
	Upload
</button>
<dialog bind:this={upload_modal} class="modal">
	<div class="modal-box max-w-11/12">
		<form
			method="post"
			action="?/uploadImage"
			enctype="multipart/form-data"
			class="flex flex-wrap justify-between gap-4"
		>
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
						<i class="fa-solid fa-image-portrait"></i>
					</div>
					<div class="swap-off">
						<i class="fa-solid fa-image"></i>
					</div>
				</label>
			</div>
			<button type="submit" class="btn btn-success w-fit">
				<i class="fa-solid fa-upload"></i>
				Upload
			</button>
		</form>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button></button>
	</form>
</dialog>
