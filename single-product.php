<?php
/**
 * Original Catakor product layout backed by WooCommerce product data.
 *
 * @package Catakor_Original
 */
defined( 'ABSPATH' ) || exit;
get_header();
while ( have_posts() ) : the_post();
	global $product;
	$image_ids = array_values( array_filter( array_merge( array( $product->get_image_id() ), $product->get_gallery_image_ids() ) ) );
	$images    = array_map( static fn( $id ) => wp_get_attachment_image_url( $id, 'full' ), $image_ids );
	$images    = array_values( array_filter( $images ) );
	if ( empty( $images ) ) {
		$images[] = wc_placeholder_img_src( 'woocommerce_single' );
	}
	$variations = $product->is_type( 'variable' ) ? $product->get_available_variations() : array();
	usort(
		$variations,
		static function ( $a, $b ) {
			preg_match( '/(\d+)/', implode( ' ', $a['attributes'] ), $ma );
			preg_match( '/(\d+)/', implode( ' ', $b['attributes'] ), $mb );
			return (int) ( $mb[1] ?? 0 ) <=> (int) ( $ma[1] ?? 0 );
		}
	);
	$selected_variation = $variations[0] ?? null;
?>
<main id="MainContent" class="content-for-layout focus-none product-page" role="main">
	<section class="secondary-product-hero" data-product-root>
		<div class="secondary-gallery" data-secondary-gallery>
			<div class="secondary-thumbnail-column"><button type="button" class="secondary-thumbnail-arrow" data-thumbnail-shift="-1" disabled aria-label="Show previous product images">↑</button><div class="secondary-thumbnails"><?php foreach ( $images as $index => $image ) : ?><button class="<?php echo 0 === $index ? 'is-active' : ''; ?>" type="button" data-gallery-index="<?php echo esc_attr( $index ); ?>" aria-label="Show product image <?php echo esc_attr( $index + 1 ); ?>"><img src="<?php echo esc_url( $image ); ?>" alt="" width="240" height="240"></button><?php endforeach; ?></div><button type="button" class="secondary-thumbnail-arrow" data-thumbnail-shift="1" aria-label="Show more product images">↓</button></div>
			<div class="secondary-main-image has-star"><span class="secondary-gallery-star" aria-hidden="true"></span><img src="<?php echo esc_url( $images[0] ); ?>" alt="<?php echo esc_attr( $product->get_name() ); ?> product view" width="1600" height="1600" data-secondary-main-image><button class="secondary-image-nav previous" type="button" data-gallery-step="-1" aria-label="Previous product image">‹</button><button class="secondary-image-nav next" type="button" data-gallery-step="1" aria-label="Next product image">›</button></div>
			<script type="application/json" data-secondary-gallery-json><?php echo wp_json_encode( $images ); ?></script>
		</div>

		<div class="secondary-product-details">
			<div class="secondary-rating"><span aria-label="5 out of 5 stars">★★★★★</span><b><?php echo esc_html( $product->get_average_rating() ?: '4.9' ); ?>/5</b></div>
			<div class="secondary-title-row"><h1><?php echo esc_html( $product->get_name() ); ?></h1><span><?php echo $product->is_on_sale() ? 'SALE' : 'CATA-KOR'; ?></span></div>
			<p class="secondary-subtitle"><?php echo esc_html( wp_trim_words( wp_strip_all_tags( $product->get_short_description() ), 18 ) ); ?></p>

			<?php if ( $variations ) : ?>
				<div class="secondary-quantity-heading"><h2>Select Quantity</h2><span data-selected-capsules><?php echo esc_html( implode( ' / ', $selected_variation['attributes'] ) ); ?></span></div>
				<div class="secondary-pack-grid">
					<?php foreach ( $variations as $index => $variation ) : $variation_product = wc_get_product( $variation['variation_id'] ); $attributes_json = wp_json_encode( $variation['attributes'] ); ?>
						<button class="secondary-pack <?php echo 0 === $index ? 'is-selected' : ''; ?>" type="button" data-secondary-pack data-variation-id="<?php echo esc_attr( $variation['variation_id'] ); ?>" data-attributes="<?php echo esc_attr( $attributes_json ); ?>" data-total="<?php echo esc_attr( $variation_product->get_price() ); ?>" aria-pressed="<?php echo 0 === $index ? 'true' : 'false'; ?>"><em><?php echo 0 === $index ? 'BEST VALUE' : ( 1 === $index ? 'MOST POPULAR' : '' ); ?></em><span class="secondary-pack-image" aria-hidden="true"><img src="<?php echo esc_url( $images[0] ); ?>" alt="" width="160" height="160"></span><strong><?php echo esc_html( implode( ' / ', $variation['attributes'] ) ); ?></strong><span><?php echo wp_kses_post( $variation_product->get_price_html() ); ?></span></button>
					<?php endforeach; ?>
				</div>
				<div class="secondary-one-time"><span>ONE-TIME PURCHASE</span><strong data-secondary-total><?php echo wp_kses_post( wc_price( $selected_variation['display_price'] ) ); ?></strong></div>
				<form class="cart" action="<?php echo esc_url( $product->get_permalink() ); ?>" method="post" data-woo-product-form>
					<input type="hidden" name="add-to-cart" value="<?php echo esc_attr( $product->get_id() ); ?>"><input type="hidden" name="product_id" value="<?php echo esc_attr( $product->get_id() ); ?>"><input type="hidden" name="variation_id" value="<?php echo esc_attr( $selected_variation['variation_id'] ); ?>" data-variation-input><input type="hidden" name="quantity" value="1">
					<?php foreach ( $selected_variation['attributes'] as $attribute => $value ) : ?><input type="hidden" name="<?php echo esc_attr( $attribute ); ?>" value="<?php echo esc_attr( $value ); ?>" data-variation-attribute="<?php echo esc_attr( $attribute ); ?>"><?php endforeach; ?>
					<button class="secondary-add-button" type="submit"><span>Add to Cart</span> <strong data-add-price><?php echo wp_kses_post( wc_price( $selected_variation['display_price'] ) ); ?></strong></button>
				</form>
			<?php else : ?>
				<div class="secondary-one-time"><span>ONE-TIME PURCHASE</span><strong><?php echo wp_kses_post( $product->get_price_html() ); ?></strong></div>
				<form class="cart" action="<?php echo esc_url( $product->get_permalink() ); ?>" method="post" data-woo-product-form><input type="hidden" name="add-to-cart" value="<?php echo esc_attr( $product->get_id() ); ?>"><input type="number" name="quantity" value="1" min="1" max="<?php echo esc_attr( $product->get_max_purchase_quantity() ); ?>"><button class="secondary-add-button" type="submit">Add to Cart <strong><?php echo wp_kses_post( $product->get_price_html() ); ?></strong></button></form>
			<?php endif; ?>

			<div class="secondary-delivery"><span>● Free tracked delivery</span><span>🇺🇸 FREE Shipping to USA</span></div>
			<div class="secondary-guarantee"><span aria-hidden="true">◎</span><b>Less than 1%</b> of customers claim our Money Back Guarantee.</div>
			<div class="secondary-details-accordions"><details open><summary>Details<span aria-hidden="true">+</span></summary><div><?php echo wp_kses_post( wpautop( $product->get_description() ) ); ?></div></details><details><summary>How to Use<span aria-hidden="true">+</span></summary><p>Follow the directions on the product label or the advice of a qualified healthcare professional.</p></details><details><summary>Shipping &amp; Guarantee<span aria-hidden="true">+</span></summary><p>Orders ship to the USA with tracking. Contact support@catakor.store if you need help with an order.</p></details></div>
		</div>
	</section>
</main>
<?php endwhile; get_footer(); ?>
