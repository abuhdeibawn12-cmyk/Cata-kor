<?php
/**
 * Virtual Best Sellers collection containing the three core products.
 *
 * @package Catakor_Original
 */
defined( 'ABSPATH' ) || exit;
get_header();
$products = function_exists( 'wc_get_products' ) ? wc_get_products( array( 'status' => 'publish', 'limit' => -1 ) ) : array();
$products = catakor_original_sort_catalogue( $products, true );
?>
<main id="MainContent" class="content-for-layout focus-none collection-page" role="main">
	<section class="collection-hero best-sellers-hero"><span class="eyebrow">CATA-KOR CUSTOMER FAVOURITES</span><h1>Best Sellers</h1><p>Our three core formulas for cellular energy, healthy aging and antioxidant support.</p></section>
	<section class="collection-shell" id="products">
		<div class="collection-toolbar best-sellers-toolbar"><p>Three formulas. One focused daily routine.</p><span><?php echo esc_html( count( $products ) . ' products' ); ?></span></div>
		<?php if ( $products ) : ?><div class="collection-grid best-sellers-grid" data-collection-grid><?php foreach ( $products as $order => $product ) { catakor_original_product_card( $product, $order + 1 ); } ?></div><?php else : ?><p><?php esc_html_e( 'Products are being prepared. Please check back shortly.', 'catakor-original' ); ?></p><?php endif; ?>
	</section>
</main>
<?php get_footer(); ?>
