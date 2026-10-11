<script>
	import LazyLoadingWrapper from '../../components/LazyLoadingWrapper.svelte';
	import { images } from '../generated/images.js';

	export let block;
	$: image = images[block.src] ?? {};
</script>

<div class="px-6 md:px-10 sm:px-12 3xl:px-16 4xl:px-24">
	<div class="mb-8 md:mb-16 3xl:mb-20 4xl:mb-32 {block.frame ? 'block-image-frame' : ''}">
		<LazyLoadingWrapper lqip={image.lqip}>
			<img
				src={block.src}
				alt={block.alt}
				loading="lazy"
				class="w-full h-full"
				style="aspect-ratio: {block.aspectRatio};"
			>
		</LazyLoadingWrapper>
	</div>
</div>
