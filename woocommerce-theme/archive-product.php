<?php
/**
 * Original Catakor product collection layout backed by WooCommerce.
 *
 * @package Catakor_Original
 */
defined( 'ABSPATH' ) || exit;
get_header();
$catalogue_products = array();
while ( have_posts() ) {
	the_post();
	$product = wc_get_product( get_the_ID() );
	if ( $product ) {
		$catalogue_products[] = $product;
	}
}
$catalogue_products = catakor_original_sort_catalogue( $catalogue_products );
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
			<div class="collection-sort"><span data-visible-count><?php echo esc_html( count( $catalogue_products ) . ' products' ); ?></span><label for="CollectionSort">Sort by:</label><select id="CollectionSort" data-collection-sort><option value="featured">Featured</option><option value="a-z">Alphabetically, A–Z</option><option value="z-a">Alphabetically, Z–A</option></select></div>
		</div>
		<?php if ( $catalogue_products ) : ?>
			<div class="collection-grid" data-collection-grid aria-live="polite">
				<?php foreach ( $catalogue_products as $order => $product ) { catakor_original_product_card( $product, $order + 1 ); } ?>
			</div>
		<?php else : woocommerce_no_products_found(); endif; ?>
	</section>
</main>
<?php get_footer(); ?>
