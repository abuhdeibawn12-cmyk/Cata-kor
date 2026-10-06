<?php
/**
 * Original Catakor product layout backed by WooCommerce product data.
 *
 * @package Catakor_Original
 */
defined( 'ABSPATH' ) || exit;
get_header();
while ( have_posts() ) :
	the_post();
	global $product;

	$bundle_config = catakor_original_bundle_config( $product );
	if ( $bundle_config ) {
		get_template_part( 'template-parts/single', 'bundle', array( 'product' => $product, 'config' => $bundle_config ) );
		continue;
	}

	$is_nmn = catakor_original_is_nmn_product( $product );

	$image_ids = array_values( array_filter( array_merge( array( $product->get_image_id() ), $product->get_gallery_image_ids() ) ) );
	$images    = array_map( static fn( $id ) => wp_get_attachment_image_url( $id, 'full' ), $image_ids );
	$images    = array_values( array_filter( $images ) );

	if ( $is_nmn ) {
		// Preserve the exact NMN gallery order used by the Catakor Shopify theme.
		$images = array_map(
			'catakor_original_asset',
			array(
				'nmn-gallery/01-main.png',
				'nmn-gallery/02-results.jpg',
				'nmn-gallery/03-facts.jpg',
				'nmn-gallery/04-benefits.jpg',
				'nmn-gallery/05-formula.jpg',
				'nmn-gallery/06-quality.jpg',
				'nmn-gallery/07-ingredients.jpg',
				'nmn-gallery/08-testing.jpg',
				'nmn-gallery/09-made-usa.jpg',
				'nmn-gallery/10-lifestyle.jpg',
				'nmn-gallery/11-two-pack.png',
				'nmn-gallery/12-three-pack.png',
			)
		);
	}

	if ( empty( $images ) ) {
		$images[] = wc_placeholder_img_src( 'woocommerce_single' );
	}

	$variations = $product->is_type( 'variable' ) ? $product->get_available_variations() : array();
	usort(
		$variations,
		static function ( $a, $b ) use ( $is_nmn ) {
			if ( $is_nmn ) {
				return (float) $b['display_price'] <=> (float) $a['display_price'];
			}
			preg_match( '/(\d+)/', implode( ' ', $a['attributes'] ), $ma );
			preg_match( '/(\d+)/', implode( ' ', $b['attributes'] ), $mb );
			return (int) ( $mb[1] ?? 0 ) <=> (int) ( $ma[1] ?? 0 );
		}
	);

	if ( $is_nmn ) {
		$variations = array_slice( $variations, 0, 3 );
	}

	$selected_variation = $variations[0] ?? null;
	$product_title      = $is_nmn ? 'NMN 4-IN-1 NAD+ SUPPORT' : $product->get_name();
	$product_badge      = $is_nmn ? '1000MG' : ( $product->is_on_sale() ? 'SALE' : 'CATA-KOR' );
	$product_subtitle   = $is_nmn ? 'Designed to build, recycle, protect, and activate NAD+ pathways.' : wp_trim_words( wp_strip_all_tags( $product->get_short_description() ), 18 );
	$rating_label       = $is_nmn ? '4.9/5 (399+ reviews)' : ( ( $product->get_average_rating() ?: '4.9' ) . '/5' );

	$nmn_packs = array(
		array(
			'label' => '3 Jars + 1 FREE',
			'jars'  => 4,
			'badge' => 'BEST VALUE',
		),
		array(
			'label' => '2 Jars',
			'jars'  => 2,
			'badge' => 'MOST POPULAR',
		),
		array(
			'label' => '1 Jar',
			'jars'  => 1,
			'badge' => '',
		),
	);
?>
<main id="MainContent" class="content-for-layout focus-none product-page" role="main">
	<section class="secondary-product-hero<?php echo $is_nmn ? ' is-nmn-product' : ''; ?>" data-product-root>
		<div class="secondary-gallery" data-secondary-gallery>
			<div class="secondary-thumbnail-column">
				<button type="button" class="secondary-thumbnail-arrow" data-thumbnail-shift="-1" disabled aria-label="Show previous product images">↑</button>
				<div class="secondary-thumbnails">
					<?php foreach ( $images as $index => $image ) : ?>
						<button class="<?php echo 0 === $index ? 'is-active' : ''; ?>" type="button" data-gallery-index="<?php echo esc_attr( $index ); ?>" <?php echo $index > 5 ? 'hidden' : ''; ?> aria-label="Show product image <?php echo esc_attr( $index + 1 ); ?>">
							<img src="<?php echo esc_url( $image ); ?>" alt="" width="240" height="240">
						</button>
					<?php endforeach; ?>
				</div>
				<button type="button" class="secondary-thumbnail-arrow" data-thumbnail-shift="1" aria-label="Show more product images">↓</button>
			</div>
			<div class="secondary-main-image has-star">
				<span class="secondary-gallery-star" aria-hidden="true"></span>
				<img src="<?php echo esc_url( $images[0] ); ?>" alt="<?php echo esc_attr( $product_title ); ?> product view 1" width="1600" height="1600" data-secondary-main-image>
				<button class="secondary-image-nav previous" type="button" data-gallery-step="-1" aria-label="Previous product image">‹</button>
				<button class="secondary-image-nav next" type="button" data-gallery-step="1" aria-label="Next product image">›</button>
			</div>
			<script type="application/json" data-secondary-gallery-json><?php echo wp_json_encode( $images ); ?></script>
		</div>

		<div class="secondary-product-details">
			<div class="secondary-rating"><span aria-label="5 out of 5 stars">★★★★★</span><b><?php echo esc_html( $rating_label ); ?></b></div>
			<div class="secondary-title-row"><h1><?php echo esc_html( $product_title ); ?></h1><span><?php echo esc_html( $product_badge ); ?></span></div>
			<p class="secondary-subtitle"><?php echo esc_html( $product_subtitle ); ?></p>

			<?php if ( $variations ) : ?>
				<div class="secondary-quantity-heading"><h2>Select Quantity</h2><span data-selected-capsules><?php echo $is_nmn ? '240 Capsules' : esc_html( implode( ' / ', $selected_variation['attributes'] ) ); ?></span></div>
				<div class="secondary-pack-grid">
					<?php foreach ( $variations as $index => $variation ) : ?>
						<?php
						$variation_product = wc_get_product( $variation['variation_id'] );
						$attributes_json   = wp_json_encode( $variation['attributes'] );
						$pack              = $is_nmn ? $nmn_packs[ $index ] : array(
							'label' => implode( ' / ', $variation['attributes'] ),
							'jars'  => max( 1, 3 - $index ),
							'badge' => 0 === $index ? 'BEST VALUE' : ( 1 === $index ? 'MOST POPULAR' : '' ),
						);
						$price       = (float) $variation_product->get_price();
						$per_jar     = $price / max( 1, $pack['jars'] );
						$price_label = $is_nmn && $pack['jars'] > 1 ? wc_price( $per_jar ) . '/each' : $variation_product->get_price_html();
						?>
						<button class="secondary-pack <?php echo 0 === $index ? 'is-selected' : ''; ?>" type="button" data-secondary-pack data-jars="<?php echo esc_attr( $pack['jars'] ); ?>" data-variation-id="<?php echo esc_attr( $variation['variation_id'] ); ?>" data-attributes="<?php echo esc_attr( $attributes_json ); ?>" data-total="<?php echo esc_attr( $price ); ?>" aria-pressed="<?php echo 0 === $index ? 'true' : 'false'; ?>">
							<?php if ( $pack['badge'] ) : ?><em><?php echo esc_html( $pack['badge'] ); ?></em><?php endif; ?>
							<span class="secondary-pack-image jars-<?php echo esc_attr( $pack['jars'] ); ?>" aria-hidden="true">
								<?php for ( $jar = 0; $jar < $pack['jars']; $jar++ ) : ?><img src="<?php echo esc_url( $images[0] ); ?>" alt="" width="160" height="160"><?php endfor; ?>
							</span>
							<strong><?php echo esc_html( $pack['label'] ); ?></strong>
							<span><?php echo wp_kses_post( $price_label ); ?></span>
						</button>
					<?php endforeach; ?>
				</div>
				<div class="secondary-one-time"><span>ONE-TIME PURCHASE</span><strong data-secondary-total><?php echo wp_kses_post( wc_price( $selected_variation['display_price'] ) ); ?></strong></div>
				<form class="cart" action="<?php echo esc_url( $product->get_permalink() ); ?>" method="post" data-woo-product-form>
					<input type="hidden" name="add-to-cart" value="<?php echo esc_attr( $product->get_id() ); ?>">
					<input type="hidden" name="product_id" value="<?php echo esc_attr( $product->get_id() ); ?>">
					<input type="hidden" name="variation_id" value="<?php echo esc_attr( $selected_variation['variation_id'] ); ?>" data-variation-input>
					<input type="hidden" name="quantity" value="1">
					<?php foreach ( $selected_variation['attributes'] as $attribute => $value ) : ?><input type="hidden" name="<?php echo esc_attr( $attribute ); ?>" value="<?php echo esc_attr( $value ); ?>" data-variation-attribute="<?php echo esc_attr( $attribute ); ?>"><?php endforeach; ?>
					<button class="secondary-add-button" type="submit"><span data-add-label>Add to Cart</span> <strong data-add-price><?php echo wp_kses_post( wc_price( $selected_variation['display_price'] ) ); ?></strong></button>
				</form>
			<?php else : ?>
				<div class="secondary-one-time"><span>ONE-TIME PURCHASE</span><strong><?php echo wp_kses_post( $product->get_price_html() ); ?></strong></div>
				<form class="cart" action="<?php echo esc_url( $product->get_permalink() ); ?>" method="post" data-woo-product-form><input type="hidden" name="add-to-cart" value="<?php echo esc_attr( $product->get_id() ); ?>"><input type="hidden" name="product_id" value="<?php echo esc_attr( $product->get_id() ); ?>"><input type="number" name="quantity" value="1" min="1" max="<?php echo esc_attr( $product->get_max_purchase_quantity() ); ?>"><button class="secondary-add-button" type="submit"><span data-add-label>Add to Cart</span> <strong><?php echo wp_kses_post( $product->get_price_html() ); ?></strong></button></form>
			<?php endif; ?>

			<div class="product-flash-hint" role="note">
				<span class="product-flash-hint__icon" aria-hidden="true">⚡</span>
				<span><strong><?php esc_html_e( 'Limited One-Time Offer Available', 'catakor-original' ); ?></strong><small><?php esc_html_e( 'Continue to checkout to reveal your private flash deal.', 'catakor-original' ); ?></small></span>
			</div>

			<div class="secondary-delivery"><span>● Free tracked delivery</span><span>🇺🇸 FREE Shipping to USA</span></div>
			<div class="secondary-guarantee"><span aria-hidden="true">◎</span><b>Less than 1%</b> of customers claim our Money Back Guarantee.</div>

			<?php if ( $is_nmn ) : ?>
				<div class="secondary-details-accordions">
					<details open><summary>How to Use<span aria-hidden="true">+</span></summary><p>Take two capsules daily with water, with or without food.</p></details>
					<details><summary>Ingredients<span aria-hidden="true">+</span></summary><p>NMN, trimethylglycine (TMG), quercetin and trans-resveratrol. See the product label for the complete ingredient list.</p></details>
					<details><summary>Shipping &amp; Guarantee<span aria-hidden="true">+</span></summary><p>Orders include tracked U.S. delivery and are backed by the Cata-Kor money-back guarantee.</p></details>
					<details><summary>Third-Party Tested<span aria-hidden="true">+</span></summary><p>Every batch is independently tested for identity, purity and quality before release.</p></details>
				</div>
			<?php else : ?>
				<div class="secondary-details-accordions"><details open><summary>Details<span aria-hidden="true">+</span></summary><div><?php echo wp_kses_post( wpautop( $product->get_description() ) ); ?></div></details><details><summary>How to Use<span aria-hidden="true">+</span></summary><p>Follow the directions on the product label or the advice of a qualified healthcare professional.</p></details><details><summary>Shipping &amp; Guarantee<span aria-hidden="true">+</span></summary><p>Orders ship to the USA with tracking. Contact support@catakor.store if you need help with an order.</p></details></div>
			<?php endif; ?>
		</div>
	</section>
</main>
<?php
endwhile;
get_footer();
?>
