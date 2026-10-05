<?php
/**
 * Faithful WooCommerce port of the final Shopify bundle page.
 *
 * @package Catakor_Original
 */
defined( 'ABSPATH' ) || exit;

$product = $args['product'];
$config  = $args['config'];
$gallery = $config['gallery'];
$price   = (float) $product->get_price();
$compare = (float) $config['compare'];
$saving  = max( 0, $compare - $price );
$percent = $compare > 0 ? (int) round( ( $saving / $compare ) * 100 ) : 0;
?>
<main id="MainContent" class="content-for-layout focus-none bundle-product-page" role="main">
	<section class="bundle-product-hero" data-product-root>
		<div class="bundle-product-gallery secondary-gallery<?php echo '__bundle_composition__' === $gallery[0] ? ' has-composition' : ''; ?>" data-secondary-gallery>
			<div class="secondary-thumbnail-column">
				<button type="button" class="secondary-thumbnail-arrow" data-thumbnail-shift="-1" disabled aria-label="<?php esc_attr_e( 'Show previous bundle images', 'catakor-original' ); ?>">↑</button>
				<div class="secondary-thumbnails" aria-label="<?php esc_attr_e( 'Bundle images', 'catakor-original' ); ?>">
					<?php foreach ( $gallery as $index => $source ) : ?>
						<button class="<?php echo 0 === $index ? 'is-active' : ''; ?>" type="button" data-gallery-index="<?php echo esc_attr( $index ); ?>" <?php echo $index > 5 ? 'hidden' : ''; ?> aria-label="<?php echo esc_attr( sprintf( __( 'Show bundle image %d', 'catakor-original' ), $index + 1 ) ); ?>">
							<?php if ( '__bundle_composition__' === $source ) : ?>
								<span class="bundle-thumbnail-composition" aria-hidden="true"><img src="https://catakor.com/cdn/shop/files/Main_NAD.png?v=1783679981&amp;width=240" alt=""><img src="https://catakor.com/cdn/shop/files/Main_Glu.png?v=1783680082&amp;width=240" alt=""></span>
							<?php else : ?>
								<img src="<?php echo esc_url( str_replace( 'width=1600', 'width=240', $source ) ); ?>" alt="" width="240" height="240" loading="lazy">
							<?php endif; ?>
						</button>
					<?php endforeach; ?>
				</div>
				<button type="button" class="secondary-thumbnail-arrow" data-thumbnail-shift="1" aria-label="<?php esc_attr_e( 'Show more bundle images', 'catakor-original' ); ?>">↓</button>
			</div>

			<div class="bundle-main-image secondary-main-image has-star">
				<span class="bundle-gallery-star" aria-hidden="true"></span>
				<span class="bundle-product-composition" data-bundle-composition role="img" aria-label="<?php echo esc_attr( $config['title'] ); ?>" <?php echo '__bundle_composition__' === $gallery[0] ? '' : 'hidden'; ?>><img class="is-nad" src="https://catakor.com/cdn/shop/files/Main_NAD.png?v=1783679981&amp;width=1600" alt=""><img class="is-glutathione" src="https://catakor.com/cdn/shop/files/Main_Glu.png?v=1783680082&amp;width=1600" alt=""></span>
				<img src="<?php echo esc_url( '__bundle_composition__' === $gallery[0] ? 'https://catakor.com/cdn/shop/files/Main_NAD.png?v=1783679981&width=1600' : $gallery[0] ); ?>" alt="<?php echo esc_attr( $config['title'] ); ?>" width="1400" height="1400" data-secondary-main-image <?php echo '__bundle_composition__' === $gallery[0] ? 'hidden' : ''; ?>>
				<button class="secondary-image-nav previous" type="button" data-gallery-step="-1" aria-label="<?php esc_attr_e( 'Previous bundle image', 'catakor-original' ); ?>">‹</button>
				<button class="secondary-image-nav next" type="button" data-gallery-step="1" aria-label="<?php esc_attr_e( 'Next bundle image', 'catakor-original' ); ?>">›</button>
			</div>
			<script type="application/json" data-secondary-gallery-json><?php echo wp_json_encode( $gallery ); ?></script>
		</div>

		<div class="bundle-product-details">
			<nav class="bundle-breadcrumb" aria-label="<?php esc_attr_e( 'Breadcrumb', 'catakor-original' ); ?>"><a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Home', 'catakor-original' ); ?></a><span>/</span><a href="<?php echo esc_url( wc_get_page_permalink( 'shop' ) ); ?>"><?php esc_html_e( 'Shop', 'catakor-original' ); ?></a></nav>
			<div class="bundle-rating"><span aria-label="<?php esc_attr_e( '5 out of 5 stars', 'catakor-original' ); ?>">★★★★★</span><b>4.9/5</b></div>
			<div class="bundle-title-row"><h1><?php echo esc_html( $config['title'] ); ?></h1><span><?php esc_html_e( 'Bundle', 'catakor-original' ); ?></span></div>
			<p class="bundle-intro"><?php echo esc_html( $config['intro'] ); ?></p>
			<ul class="bundle-feature-list"><?php foreach ( $config['bullets'] as $bullet ) : ?><li><?php echo esc_html( $bullet ); ?></li><?php endforeach; ?></ul>
			<?php if ( $saving > 0 ) : ?>
				<div class="bundle-price bundle-price--saving"><s><?php echo wp_kses_post( wc_price( $compare ) ); ?></s><strong><?php echo wp_kses_post( $product->get_price_html() ); ?></strong><span><?php echo esc_html( sprintf( __( 'Save %1$s (%2$d%%)', 'catakor-original' ), wp_strip_all_tags( wc_price( $saving ) ), $percent ) ); ?></span></div>
			<?php else : ?>
				<strong class="bundle-price"><?php echo wp_kses_post( $product->get_price_html() ); ?></strong>
			<?php endif; ?>
			<?php if ( $product->is_purchasable() && $product->is_in_stock() ) : ?>
				<form class="cart" action="<?php echo esc_url( $product->get_permalink() ); ?>" method="post" data-woo-product-form><input type="hidden" name="add-to-cart" value="<?php echo esc_attr( $product->get_id() ); ?>"><input type="hidden" name="product_id" value="<?php echo esc_attr( $product->get_id() ); ?>"><input type="hidden" name="quantity" value="1"><button class="bundle-buy-button" type="submit"><span data-add-label><?php esc_html_e( 'Add bundle to bag', 'catakor-original' ); ?></span></button></form>
			<?php else : ?>
				<button class="bundle-buy-button is-disabled" type="button" disabled><?php esc_html_e( 'Sold out', 'catakor-original' ); ?></button>
			<?php endif; ?>
			<div class="secondary-delivery"><span>● <?php esc_html_e( 'Free tracked delivery', 'catakor-original' ); ?></span><span>🇺🇸 <?php esc_html_e( 'Free shipping to USA', 'catakor-original' ); ?></span></div>
			<div class="secondary-guarantee"><span aria-hidden="true">◎</span><b><?php esc_html_e( '30-day', 'catakor-original' ); ?></b> <?php esc_html_e( 'money-back guarantee.', 'catakor-original' ); ?></div>
			<div class="secondary-details-accordions"><details open><summary><?php esc_html_e( 'What’s included', 'catakor-original' ); ?><span aria-hidden="true">+</span></summary><p><?php echo esc_html( $config['intro'] ); ?></p></details><details><summary><?php esc_html_e( 'How to use', 'catakor-original' ); ?><span aria-hidden="true">+</span></summary><p><?php esc_html_e( 'Follow the directions on each product label or the advice of a qualified healthcare professional.', 'catakor-original' ); ?></p></details><details><summary><?php esc_html_e( 'Shipping & Guarantee', 'catakor-original' ); ?><span aria-hidden="true">+</span></summary><p><?php esc_html_e( 'Orders ship to the USA with tracking and are backed by the Catakor money-back guarantee.', 'catakor-original' ); ?></p></details></div>
		</div>
	</section>
</main>
