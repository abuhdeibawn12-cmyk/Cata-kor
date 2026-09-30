<?php
/**
 * Theme bootstrap for the faithful Catakor storefront port.
 *
 * @package Catakor_Original
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'CATAKOR_ORIGINAL_VERSION', '1.0.3' );

function catakor_original_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'woocommerce' );
	add_theme_support( 'wc-product-gallery-zoom' );
	add_theme_support( 'wc-product-gallery-lightbox' );
	add_theme_support( 'wc-product-gallery-slider' );
	register_nav_menus(
		array(
			'primary' => __( 'Primary menu', 'catakor-original' ),
			'footer'  => __( 'Footer menu', 'catakor-original' ),
		)
	);
}
add_action( 'after_setup_theme', 'catakor_original_setup' );

function catakor_original_body_classes( $classes ) {
	$classes[] = 'catakor-original';
	$classes[] = 'gradient';
	if ( is_front_page() ) {
		$classes[] = 'template-index';
	}
	if ( function_exists( 'is_shop' ) && ( is_shop() || is_product_category() ) ) {
		$classes[] = 'collection-page';
	}
	if ( function_exists( 'is_product' ) && is_product() ) {
		$classes[] = 'product-page';
		$classes[] = 'secondary-product-page';
	}
	if ( is_page( array( 'about', 'about-us' ) ) ) {
		$classes[] = 'about-page';
	}
	if ( is_page( array( 'science', 'science-benefits' ) ) ) {
		$classes[] = 'science-page';
	}
	return $classes;
}
add_filter( 'body_class', 'catakor_original_body_classes' );

function catakor_original_assets() {
	$base = 'https://catakor.com/cdn/shop/t/30/assets/';
	$styles = array(
		'catakor-fonts'          => 'ctr-fonts.css?v=33620314625453731761784232020',
		'catakor-base'           => 'base.css?v=178001382125810248591784235215',
		'catakor-global'         => 'custom_global.css?v=29487461453391734241783342909',
		'catakor-list-menu'      => 'component-list-menu.css?v=151968516119678728991783342909',
		'catakor-menu-drawer'    => 'component-menu-drawer.css?v=34969289367098718861783342907',
		'catakor-search'         => 'component-search.css?v=165164710990765432851783342908',
		'catakor-header'         => 'ctr-header.css?v=162015902809576919211784232022',
		'catakor-announcement'   => 'ctr-announcement-bar.css?v=110795639498918864111784232018',
		'catakor-product-card'   => 'ctr-product-card.css?v=10214758350778157541784232024',
		'catakor-footer'         => 'ctr-footer.css?v=35464477652263202381784232021',
		'catakor-section-footer' => 'section-footer.css?v=175770306225944324451784232025',
	);

	foreach ( $styles as $handle => $asset ) {
		wp_enqueue_style( $handle, $base . $asset, array(), null );
	}

	wp_enqueue_style( 'catakor-inline-original', get_template_directory_uri() . '/assets/original-inline.css', array( 'catakor-base' ), CATAKOR_ORIGINAL_VERSION );
	wp_enqueue_style( 'catakor-shopify-port', get_template_directory_uri() . '/assets/shopify-port.css', array( 'catakor-inline-original' ), CATAKOR_ORIGINAL_VERSION );
	wp_enqueue_style( 'catakor-original', get_stylesheet_uri(), array( 'catakor-shopify-port' ), CATAKOR_ORIGINAL_VERSION );
	wp_enqueue_style( 'catakor-swiper', 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css', array(), '11' );

	wp_enqueue_script( 'catakor-swiper', 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js', array(), '11', true );
	wp_enqueue_script( 'catakor-featured-products', $base . 'ctr-featured-products.js?v=74438116447009516941784232020', array( 'catakor-swiper' ), null, true );
	wp_enqueue_script( 'catakor-experts', $base . 'ctr-experts.js?v=111528262561475102601784232019', array( 'catakor-swiper' ), null, true );
	wp_enqueue_script( 'catakor-original', get_template_directory_uri() . '/assets/theme.js', array(), CATAKOR_ORIGINAL_VERSION, true );

	wp_localize_script(
		'catakor-original',
		'catakorStore',
		array(
			'homeUrl'    => home_url( '/' ),
			'cartUrl'    => function_exists( 'wc_get_cart_url' ) ? wc_get_cart_url() : home_url( '/cart/' ),
			'accountUrl' => function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'myaccount' ) : home_url( '/my-account/' ),
			'cartCount'  => function_exists( 'WC' ) && WC()->cart ? WC()->cart->get_cart_contents_count() : 0,
		)
	);
}
add_action( 'wp_enqueue_scripts', 'catakor_original_assets', 20 );

function catakor_original_fragment( $name ) {
	$file = get_template_directory() . '/generated/' . sanitize_file_name( $name ) . '.html';
	if ( is_readable( $file ) ) {
		// Fragments are generated from the merchant-owned original storefront snapshot.
		echo file_get_contents( $file ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped, WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
	}
}

function catakor_original_woocommerce_wrapper_start() {
	echo '<main id="MainContent" class="catakor-wc-shell content-for-layout focus-none" role="main">';
}

function catakor_original_woocommerce_wrapper_end() {
	echo '</main>';
}

remove_action( 'woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10 );
remove_action( 'woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10 );
add_action( 'woocommerce_before_main_content', 'catakor_original_woocommerce_wrapper_start', 10 );
add_action( 'woocommerce_after_main_content', 'catakor_original_woocommerce_wrapper_end', 10 );
remove_action( 'woocommerce_sidebar', 'woocommerce_get_sidebar', 10 );

function catakor_original_cart_count_fragment( $fragments ) {
	$count = WC()->cart ? WC()->cart->get_cart_contents_count() : 0;
	$fragments['span.catakor-cart-count'] = '<span class="catakor-cart-count">' . absint( $count ) . '</span>';
	return $fragments;
}
add_filter( 'woocommerce_add_to_cart_fragments', 'catakor_original_cart_count_fragment' );

function catakor_original_asset( $file ) {
	return get_template_directory_uri() . '/assets/original/' . ltrim( $file, '/' );
}
