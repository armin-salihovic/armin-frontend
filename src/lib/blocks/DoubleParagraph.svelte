<script>
	export let block;
</script>

<div class="px-6 md:px-10 sm:px-12 3xl:px-16 4xl:px-24">
	<div class="flex mb-16 3xl:mb-20 4xl:mb-32 grid grid-cols-6 text-base md:text-lg 3xl:text-2xl 4xl:text-3xl gap-4 3xl:gap-5 4xl:gap-8">
		<aside class="md:col-span-2 col-span-6">
			{#if block.title}<h4 class="font-bold">{@html block.title}</h4>{/if}
		</aside>
		<div class="block-paragraph md:col-span-4 col-span-6 flex flex-col lg:flex-row gap-10 3xl:gap-12 4xl:gap-20">
			<div class="w-full lg:w-1/2"><div class="w-full">{@html block.paragraph1}</div></div>
			<div class="w-full lg:w-1/2"><div class="w-full">{@html block.paragraph2}</div></div>
		</div>
	</div>
</div>
