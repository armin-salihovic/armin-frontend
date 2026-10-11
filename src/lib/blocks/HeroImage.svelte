<script>
	import LazyLoadingWrapper from '../../components/LazyLoadingWrapper.svelte';
	import { images } from '../generated/images.js';

	export let block;
	$: desktop = images[block.desktop] ?? {};
	$: mobile = images[block.mobile] ?? {};
	$: objectPosition = `object-position-${block.position || 'center'}`;
	$: backgroundPosition = `bg-position-${block.position || 'center'}`;
	$: loading = block.eager ? 'eager' : 'lazy';
</script>

<div class="mb-10 3xl:mb-12 4xl:mb-20">
	<div class="hidden xs:block mb-3 3xl:mb-4 4xl:mb-6">
		<LazyLoadingWrapper class={backgroundPosition} lqip={desktop.lqip}>
			<img
				src={block.desktop}
				alt={block.alt}
				loading={loading}
				class="hero-img bg-center {objectPosition}"
				style="aspect-ratio: {desktop.aspectRatio};"
			>
		</LazyLoadingWrapper>
	</div>
	<div class="block xs:hidden image-square mb-3">
		<LazyLoadingWrapper lqip={mobile.lqip}>
			<img
				src={block.mobile}
				alt={block.alt}
				style="aspect-ratio: 1/1;"
				loading={loading}
				class="hero-img bg-center bg-position-top"
			>
		</LazyLoadingWrapper>
	</div>
</div>
