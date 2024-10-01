<script lang="ts">
	export let name;
	export let desc;
	export let image_id;
	export let fa;

	export let del = false;
</script>

<li>
	<form action="?/{name}" method="post" class="flex">
		<input type="number" name="image_id" hidden value={image_id} />
		<button type="submit" class="text-left w-full {del ? 'text-error' : ''}">
			<i class="{fa} mr-2"></i>
			{desc}
		</button>
	</form>
</li>
