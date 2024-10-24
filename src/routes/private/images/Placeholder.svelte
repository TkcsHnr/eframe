<script>
    export let portrait;
</script>

<div
	class="rounded-box shadow border border-base-300 bg-base-200 sm:h-52 w-auto flex justify-center items-center'
			{portrait ? 'aspect-[448/600]' : 'aspect-[600/448] col-span-2'} "
>
	<slot></slot>
</div>
