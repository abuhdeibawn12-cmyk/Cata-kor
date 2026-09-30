<?php
/**
 * Original Catakor product collection layout backed by WooCommerce.
 *
 * @package Catakor_Original
 */
defined( 'ABSPATH' ) || exit;
get_header();
?>
<main id="MainContent" class="content-for-layout focus-none collection-page" role="main">
	<section class="collection-hero">
		<span class="eyebrow">CATA-KOR LONGEVITY SUPPORT</span>
		<h1><?php woocommerce_page_title(); ?></h1>
		<p>Science-driven daily formulas made with transparent dosing and trusted quality.</p>
	</section>
	<section class="collection-shell" id="products">
		<div class="collection-toolbar">
			<div class="collection-filter-wrap"><button class="collection-filter-button" type="button" data-filter-toggle aria-expanded="false">Filter: <b data-filter-label>Availability</b><span>+</span></button><fieldset class="collection-filter-menu" data-filter-menu hidden><legend>Availability</legend><label><input type="radio" name="availability" value="all" checked> <span>All products</span></label><label><input type="radio" name="availability" value="in-stock"> <span>In stock</span></label><label><input type="radio" name="availability" value="out-of-stock"> <span>Out of stock</span></label></fieldset></div>
			<div class="collection-sort"><span data-visible-count><?php echo esc_html( $wp_query->found_posts . ' products' ); ?></span><label for="CollectionSort">Sort by:</label><select id="CollectionSort" data-collection-sort><option value="featured">Best selling</option><option value="a-z">Alphabetically, A–Z</option><option value="z-a">Alphabetically, Z–A</option></select></div>
		</div>
		<?php if ( woocommerce_product_loop() ) : ?>
			<div class="collection-grid" data-collection-grid aria-live="polite">
				<?php $order = 0; while ( have_posts() ) : the_post(); global $product; $order++; ?>
					<article class="collection-card<?php echo $product->is_in_stock() ? '' : ' is-sold-out'; ?>" data-collection-card data-title="<?php echo esc_attr( $product->get_name() ); ?>" data-available="<?php echo $product->is_in_stock() ? 'true' : 'false'; ?>" data-original-order="<?php echo esc_attr( $order ); ?>">
						<div class="collection-image-wrap"><span class="collection-sale-badge"><?php echo $product->is_on_sale() ? 'Sale' : 'Cata-Kor'; ?></span><?php if ( ! $product->is_in_stock() ) : ?><span class="collection-stock-badge">Sold out</span><?php endif; ?><?php echo $product->get_image( 'woocommerce_single', array( 'loading' => 'lazy' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></div>
						<div class="collection-card-copy"><h2><?php echo esc_html( $product->get_name() ); ?></h2><p><?php echo esc_html( wp_trim_words( wp_strip_all_tags( $product->get_short_description() ?: $product->get_description() ), 12 ) ); ?></p><a class="collection-product-button" href="<?php echo esc_url( $product->get_permalink() ); ?>"><?php echo $product->is_in_stock() ? 'View Product' : 'Out of stock'; ?></a></div>
					</article>
				<?php endwhile; ?>
			</div>
			<?php woocommerce_pagination(); ?>
		<?php else : woocommerce_no_products_found(); endif; ?>
	</section>
</main>
<?php get_footer(); ?>
