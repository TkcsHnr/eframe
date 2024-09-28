<script lang="ts">
	import type { ActionData } from './$types';

	export let form: ActionData;

	$: portrait = false;
	let files: FileList;
	let img: HTMLImageElement;
	function processFile() {
		const imgSrc = URL.createObjectURL(files[0]);
		img.src = imgSrc;

		const imageTest = new Image();
		imageTest.onload = function () {
			portrait = imageTest.width < imageTest.height;
		};
		imageTest.src = imgSrc;
	}
</script>

<main class="w-full h-full flex flex-col gap-8 items-center p-8 bg-base-300">
	<form method="post" action="?/convert" enctype="multipart/form-data" class="flex gap-4 flex-wrap">
		<input
			type="file"
			name="file"
			accept="image/*"
			required
			class="file-input file-input-bordered w-full max-w-xs"
			bind:files
			on:change={processFile}
		/>
		<div class="flex flex-col">
			<label class="swap btn btn-info">
				<input type="checkbox" name="portrait" bind:checked={portrait} />
				<div class="swap-on">448x600</div>
				<div class="swap-off">600x448</div>
			</label>
		</div>
		<button class="btn btn-success">Convert</button>
	</form>

	{#if files && files[0]}
		<img
			bind:this={img}
			alt="uploaded"
			class="{portrait ? 'w-[448px] h-[600px]' : 'w-[600px] h-[448px]'} object-cover"
		/>
	{:else if form}
		<img src={form.src} alt="from server" />
		<form method="post" action="?/upload" enctype="multipart/form-data">
			<input
				type="text"
				name="pixelArrayString"
				hidden
				value={form.pixelArrayString}
			/>
			<input
				type="text"
				name="base64"
				hidden
				value={form.src}
			/>
			<button class="btn btn-success">Upload</button>
		</form>
	{/if}
</main>
