<?php
/**
 * Theme bootstrap for the faithful Catakor storefront port.
 *
 * @package Catakor_Original
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'CATAKOR_ORIGINAL_VERSION', '1.4.9' );

/** Supply the Catakor browser-tab mark when WordPress has no Site Icon set. */
function catakor_original_favicon() {
	if ( function_exists( 'has_site_icon' ) && has_site_icon() ) {
		return;
	}
	$favicon = get_template_directory_uri() . '/assets/favicon.svg';
	echo '<link rel="icon" type="image/svg+xml" href="' . esc_url( $favicon ) . '">';
	echo '<link rel="shortcut icon" href="' . esc_url( $favicon ) . '">';
}
add_action( 'wp_head', 'catakor_original_favicon', 2 );

/**
 * Serve Revolut's Apple Pay domain-verification file on managed hosts.
 *
 * Pressable does not allow the Revolut plugin's PHP process to create the
 * required .well-known directory in ABSPATH. Keeping the official file in the
 * theme and serving it through WordPress gives Apple and Revolut the exact
 * public URL they require without depending on document-root write access.
 */
function catakor_original_apple_pay_verification_file() {
	$request_uri  = isset( $_SERVER['REQUEST_URI'] ) ? wp_unslash( $_SERVER['REQUEST_URI'] ) : '';
	$request_path = wp_parse_url( $request_uri, PHP_URL_PATH );
	$verify_path  = '/.well-known/apple-developer-merchantid-domain-association';

	if ( $verify_path !== $request_path ) {
		return;
	}

	$file = get_template_directory() . '/assets/apple-developer-merchantid-domain-association';
	if ( ! is_readable( $file ) ) {
		status_header( 404 );
		exit;
	}

	status_header( 200 );
	header( 'Content-Type: text/plain; charset=utf-8' );
	header( 'Cache-Control: public, max-age=3600' );
	header( 'Content-Length: ' . (string) filesize( $file ) );
	readfile( $file ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_read_readfile
	exit;
}
add_action( 'template_redirect', 'catakor_original_apple_pay_verification_file', -1000 );

/**
 * Complete Revolut Apple Pay onboarding after the verification URL is live.
 *
 * This mirrors the official gateway's domain-registration step while avoiding
 * its failed attempt to write the verification file into ABSPATH.
 */
function catakor_original_register_revolut_apple_pay_domain() {
	if ( ! is_admin() || ! current_user_can( 'manage_woocommerce' ) ) {
		return;
	}

	$merchant_api_class    = '\\Revolut\\Plugin\\Infrastructure\\Api\\MerchantApi';
	$service_provider_class = '\\Revolut\\Wordpress\\ServiceProvider';
	if ( ! class_exists( $merchant_api_class ) || ! class_exists( $service_provider_class ) ) {
		return;
	}

	$domain = wp_parse_url( home_url( '/' ), PHP_URL_HOST );
	if ( ! is_string( $domain ) || '' === $domain ) {
		return;
	}

	$config_provider = $service_provider_class::apiConfigProvider();
	$config          = $config_provider->getConfig();
	$secret_key      = $config->getSecretKey();
	$settings        = get_option( 'woocommerce_revolut_payment_request_settings', array() );

	if (
		'yes' === ( $settings['apple_pay_merchant_onboarded'] ?? '' ) &&
		$domain === ( $settings['apple_pay_merchant_onboarded_domain'] ?? '' ) &&
		$secret_key === ( $settings['apple_pay_merchant_onboarded_api_key'] ?? '' )
	) {
		return;
	}

	try {
		$merchant_api_class::private()->post(
			'/apple-pay/domains/register',
			array( 'domain' => $domain )
		);
	} catch ( Throwable $error ) {
		error_log( 'Catakor Revolut Apple Pay onboarding failed: ' . $error->getMessage() ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
		return;
	}

	$settings['apple_pay_merchant_onboarded_domain']  = $domain;
	$settings['apple_pay_merchant_onboarded_api_key'] = $secret_key;
	$settings['apple_pay_merchant_onboarded']         = 'yes';
	update_option( 'woocommerce_revolut_payment_request_settings', $settings );
}
add_action( 'admin_init', 'catakor_original_register_revolut_apple_pay_domain', 1000 );

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
	if ( get_query_var( 'catakor_best_sellers' ) ) {
		$classes[] = 'collection-page';
		$classes[] = 'best-sellers-page';
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
	if ( function_exists( 'is_checkout' ) && is_checkout() ) {
		wp_enqueue_style( 'catakor-checkout', get_template_directory_uri() . '/assets/checkout.css', array( 'catakor-original' ), CATAKOR_ORIGINAL_VERSION );
	}
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
			'checkoutUrl'=> function_exists( 'wc_get_checkout_url' ) ? wc_get_checkout_url() : home_url( '/checkout/' ),
			'accountUrl' => function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'myaccount' ) : home_url( '/my-account/' ),
			'cartCount'  => function_exists( 'WC' ) && WC()->cart ? WC()->cart->get_cart_contents_count() : 0,
			'addToCartUrl' => class_exists( 'WC_AJAX' ) ? WC_AJAX::get_endpoint( 'add_to_cart' ) : home_url( '/?wc-ajax=add_to_cart' ),
			'ajaxUrl'      => admin_url( 'admin-ajax.php' ),
			'cartNonce'    => wp_create_nonce( 'catakor-cart' ),
			'currency'     => function_exists( 'get_woocommerce_currency' ) ? get_woocommerce_currency() : 'USD',
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
	$hidden = 0 === $count ? ' hidden' : '';
	$fragments['span.catakor-cart-count'] = '<span class="catakor-cart-count"' . $hidden . '>' . absint( $count ) . '</span>';
	$fragments['p[data-cart-summary]'] = '<p data-cart-summary>' . esc_html( catakor_original_cart_summary() ) . '</p>';
	$fragments['div[data-cart-content]'] = '<div data-cart-content>' . catakor_original_cart_content() . '</div>';
	return $fragments;
}
add_filter( 'woocommerce_add_to_cart_fragments', 'catakor_original_cart_count_fragment' );

/**
 * Add a product or variation to the cart and return the refreshed theme drawer.
 *
 * WooCommerce's generic wc-ajax endpoint is intended primarily for simple
 * catalogue buttons. Handling the product-page form here keeps variation IDs
 * and attributes together, so the NMN pack choices add cleanly without a page
 * reload or a false error state.
 */
function catakor_original_ajax_add_to_cart() {
	check_ajax_referer( 'catakor-cart', 'nonce' );
	if ( ! function_exists( 'WC' ) || ! WC()->cart ) {
		wp_send_json( array( 'error' => true, 'message' => __( 'The shopping bag is unavailable.', 'catakor-original' ) ), 400 );
	}

	$product_id   = isset( $_POST['product_id'] ) ? absint( $_POST['product_id'] ) : 0;
	$variation_id = isset( $_POST['variation_id'] ) ? absint( $_POST['variation_id'] ) : 0;
	$quantity     = isset( $_POST['quantity'] ) ? max( 1, wc_stock_amount( wp_unslash( $_POST['quantity'] ) ) ) : 1;
	$product      = wc_get_product( $variation_id ?: $product_id );
	$variation    = array();

	foreach ( $_POST as $key => $value ) { // phpcs:ignore WordPress.Security.NonceVerification.Missing -- Checked above.
		if ( 0 === strpos( $key, 'attribute_' ) ) {
			$variation[ wc_clean( wp_unslash( $key ) ) ] = wc_clean( wp_unslash( $value ) );
		}
	}

	if ( ! $product_id || ! $product || ! $product->exists() || ! $product->is_purchasable() ) {
		wp_send_json( array( 'error' => true, 'message' => __( 'This selection is not available.', 'catakor-original' ) ), 400 );
	}

	$cart_item_key = WC()->cart->add_to_cart( $product_id, $quantity, $variation_id, $variation );
	if ( ! $cart_item_key ) {
		wp_send_json( array( 'error' => true, 'message' => __( 'This selection could not be added to the shopping bag.', 'catakor-original' ) ), 400 );
	}

	WC()->cart->calculate_totals();
	WC()->cart->set_session();
	WC()->cart->maybe_set_cart_cookies();
	wp_send_json(
		array(
			'error'     => false,
			'fragments' => apply_filters( 'woocommerce_add_to_cart_fragments', array() ),
			'cart_hash' => WC()->cart->get_cart_hash(),
		)
	);
}
add_action( 'wp_ajax_catakor_add_to_cart', 'catakor_original_ajax_add_to_cart' );
add_action( 'wp_ajax_nopriv_catakor_add_to_cart', 'catakor_original_ajax_add_to_cart' );

function catakor_original_asset( $file ) {
	return get_template_directory_uri() . '/assets/original/' . ltrim( $file, '/' );
}

/**
 * Exact non-CA-AKG bundles from the final Catakor Shopify catalogue.
 *
 * @return array<string,array<string,mixed>>
 */
function catakor_original_bundle_configs() {
	return array(
		'nad-nmn' => array(
			'slugs'   => array( 'bundle-nad-nmn', 'bundle-liposomal-nad-nmn-complex' ),
			'sku'     => 'bundle-nad-nmn',
			'title'   => 'BUNDLE: LIPOSOMAL NAD+ & NMN COMPLEX',
			'intro'   => 'A two-formula pairing for daily cellular energy and healthy-aging support.*',
			'benefit' => 'Dual cellular energy support*',
			'compare' => 89.98,
			'image'   => 'https://catakor.com/cdn/shop/files/Main_NMN_NAD.png?v=1783680342&width=1600',
			'gallery' => array(
				'https://catakor.com/cdn/shop/files/Main_NMN_NAD.png?v=1783680342&width=1600',
				'https://catakor.com/cdn/shop/files/2_265dc661-93dd-4723-8cf6-3c9138f9c018.jpg?v=1783169420&width=1600',
				'https://catakor.com/cdn/shop/files/61JmcdKRxyL._AC_SL1500_299f1d09-6053-4757-bb18-7240b3d34490.jpg?v=1783169420&width=1600',
				'https://catakor.com/cdn/shop/files/3_9fc18715-b342-4262-840f-d76f4248430d.jpg?v=1783169420&width=1600',
			),
			'bullets' => array( 'NMN supports NAD+ levels*', 'Quercetin supports cellular renewal*', 'TMG supports methylation balance*', 'Resveratrol supports SIRT1 activity*' ),
		),
		'nmn-glutathione' => array(
			'slugs'   => array( 'bundle-nmn-glutathione', 'bundle-ultimate-longevity-nmn-1000-mg-liposomal-glutathione-500-mg-ca-akg-biotin-hyaluronic-acid-msm-vitamin-c' ),
			'sku'     => 'bundle-nmn-glu',
			'title'   => 'BUNDLE: NMN COMPLEX & LIPOSOMAL GLUTATHIONE',
			'intro'   => 'A two-formula pairing for cellular energy and antioxidant defense support.*',
			'benefit' => 'Cellular energy and antioxidant support*',
			'compare' => 89.98,
			'image'   => 'https://catakor.com/cdn/shop/files/Main_NMN_GLU.png?v=1783680215&width=1600',
			'gallery' => array(
				'https://catakor.com/cdn/shop/files/Main_NMN_GLU.png?v=1783680215&width=1600',
				'https://catakor.com/cdn/shop/files/1_a4492c5f-0598-4b82-adf0-9bf3547ee037.png?v=1780411784&width=1600',
				'https://catakor.com/cdn/shop/files/2_91acbaea-daa9-4c27-96df-b5caf0741a56.jpg?v=1780411783&width=1600',
				'https://catakor.com/cdn/shop/files/3_cc69d014-2422-4a31-b5bb-174fbe4c8de6.jpg?v=1780411783&width=1600',
			),
			'bullets' => array( 'NMN supports NAD+ levels*', 'TMG supports methylation balance*', 'Liposomal glutathione supports antioxidant defenses*', 'Vitamin C supports normal immune function*' ),
		),
		'nad-glutathione' => array(
			'slugs'   => array( 'bundle-nad-glutathione' ),
			'sku'     => 'bundle-nad-glu',
			'title'   => 'BUNDLE: LIPOSOMAL NAD+ & GLUTATHIONE',
			'intro'   => 'A two-formula pairing for cellular energy and antioxidant defense support.*',
			'benefit' => 'Cellular energy and antioxidant defense support*',
			'compare' => 79.98,
			'image'   => '__bundle_composition__',
			'gallery' => array(
				'__bundle_composition__',
				'https://catakor.com/cdn/shop/files/20.jpg?v=1783169994&width=1600',
				'https://catakor.com/cdn/shop/files/21.jpg?v=1783169994&width=1600',
				'https://catakor.com/cdn/shop/files/26.jpg?v=1783169994&width=1600',
			),
			'bullets' => array( 'LipoNAD supports cellular energy production*', 'Resveratrol supports healthy cellular function*', 'Liposomal glutathione supports antioxidant defenses*', 'Vitamin C supports normal immune function*' ),
		),
		'nad-nmn-glutathione' => array(
			'slugs'   => array( 'bundle-nad-nmn-glutathione', 'bundle-cellular-power-trio-nad-advanced-500-mg-nmn-1000-mg-ca-akg-1000-mg-resveratrol-tmg-msm' ),
			'sku'     => 'bundle-nad-nmn-glu',
			'title'   => 'BUNDLE: LIPOSOMAL NAD+ & NMN COMPLEX & GLUTATHIONE',
			'intro'   => 'Three complementary formulas for cellular energy, healthy aging and antioxidant defense support.*',
			'benefit' => 'Complete cellular energy and antioxidant support*',
			'compare' => 129.97,
			'image'   => 'https://catakor.com/cdn/shop/files/Main_NMN_NAD_GLU.png?v=1783680368&width=1600',
			'gallery' => array(
				'https://catakor.com/cdn/shop/files/Main_NMN_NAD_GLU.png?v=1783680368&width=1600',
				'https://catakor.com/cdn/shop/files/20.jpg?v=1783169994&width=1600',
				'https://catakor.com/cdn/shop/files/21.jpg?v=1783169994&width=1600',
				'https://catakor.com/cdn/shop/files/22.jpg?v=1783169994&width=1600',
			),
			'bullets' => array( 'Third-party tested for identity, purity and quality', 'Three complementary daily formulas', 'Made in the USA', 'Manufactured from globally sourced ingredients' ),
		),
	);
}

/** Match a WooCommerce product to a verified final-store bundle. */
function catakor_original_bundle_config( $product ) {
	if ( ! $product instanceof WC_Product ) {
		return null;
	}
	$slug = $product->get_slug();
	$sku  = strtolower( $product->get_sku() );
	foreach ( catakor_original_bundle_configs() as $key => $config ) {
		if ( in_array( $slug, $config['slugs'], true ) || $config['sku'] === $sku ) {
			$config['key'] = $key;
			return $config;
		}
	}
	return null;
}

/** Classify the three core products without treating NMN bundles as NMN. */
function catakor_original_product_role( $product ) {
	if ( catakor_original_bundle_config( $product ) ) {
		return 'bundle';
	}
	$name = strtolower( $product->get_name() );
	if ( false !== strpos( $name, 'liposomal nad' ) ) {
		return 'nad';
	}
	if ( false !== strpos( $name, 'glutathione' ) ) {
		return 'glutathione';
	}
	if ( false !== strpos( $name, 'nmn' ) ) {
		return 'nmn';
	}
	return '';
}

/** Return the parent product when a cart line contains a variation. */
function catakor_original_parent_product( $product ) {
	if ( $product instanceof WC_Product_Variation ) {
		$parent = wc_get_product( $product->get_parent_id() );
		if ( $parent instanceof WC_Product ) {
			return $parent;
		}
	}
	return $product;
}

/** Convert a core-product variation into the jar tier used by Flash Checkout. */
function catakor_original_flash_jar_count( $product ) {
	if ( ! $product instanceof WC_Product ) {
		return 1;
	}
	$parts = array( $product->get_name() );
	if ( $product instanceof WC_Product_Variation ) {
		$parts = array_merge( $parts, array_values( $product->get_attributes() ) );
	}
	$label = strtolower( implode( ' ', array_filter( $parts ) ) );
	if ( preg_match( '/3\s*(?:jar|jars|bottle|bottles)?\s*\+\s*1\s*(?:free)?/i', $label ) ) {
		return 4;
	}
	if ( preg_match( '/(\d+)\s*(?:jar|jars|bottle|bottles)/i', $label, $matches ) ) {
		return max( 1, absint( $matches[1] ) );
	}
	if ( false !== strpos( $label, 'full cellular support' ) ) {
		return 4;
	}
	if ( false !== strpos( $label, 'see real results' ) ) {
		return 2;
	}
	if ( false !== strpos( $label, 'just starting out' ) ) {
		return 1;
	}
	return 1;
}

/** Find the published variable/simple products eligible for private Flash offers. */
function catakor_original_flash_catalogue() {
	$catalogue = array();
	$products  = wc_get_products(
		array(
			'status' => 'publish',
			'limit'  => -1,
			'order'  => 'ASC',
			'orderby'=> 'ID',
		)
	);
	foreach ( $products as $product ) {
		$role = catakor_original_product_role( $product );
		if ( in_array( $role, array( 'nad', 'glutathione', 'nmn' ), true ) && ! isset( $catalogue[ $role ] ) ) {
			$catalogue[ $role ] = $product;
		}
	}
	return $catalogue;
}

/** Return every purchasable pack for a core product, keyed by its live Woo variation. */
function catakor_original_flash_pack_options( $product ) {
	$options = array();
	if ( ! $product instanceof WC_Product ) {
		return $options;
	}
	if ( $product instanceof WC_Product_Variable ) {
		foreach ( $product->get_children() as $variation_id ) {
			$variation = wc_get_product( $variation_id );
			if ( ! $variation instanceof WC_Product_Variation || ! $variation->is_purchasable() || ! $variation->is_in_stock() ) {
				continue;
			}
			$jars    = catakor_original_flash_jar_count( $variation );
			$label   = $jars >= 4
				? __( '3 Jars + 1 FREE', 'catakor-original' )
				: sprintf( _n( '%d Jar', '%d Jars', $jars, 'catakor-original' ), $jars );
			$options[] = array(
				'product_id'   => $product->get_id(),
				'variation_id' => $variation->get_id(),
				'attributes'   => $variation->get_variation_attributes(),
				'jars'         => $jars,
				'label'        => $label,
				'price'        => (float) $variation->get_price(),
				'product'      => $variation,
			);
		}
	} elseif ( $product->is_purchasable() && $product->is_in_stock() ) {
		$options[] = array(
			'product_id'   => $product->get_id(),
			'variation_id' => 0,
			'attributes'   => array(),
			'jars'         => 1,
			'label'        => __( '1 Jar', 'catakor-original' ),
			'price'        => (float) $product->get_price(),
			'product'      => $product,
		);
	}
	usort( $options, static function ( $left, $right ) { return $left['jars'] <=> $right['jars']; } );
	return $options;
}

/** Resolve a requested jar tier, treating NMN's 3 + 1 free pack as the top tier. */
function catakor_original_flash_pack_for_tier( $product, $requested_jars ) {
	$options = catakor_original_flash_pack_options( $product );
	foreach ( $options as $option ) {
		if ( (int) $option['jars'] === (int) $requested_jars ) {
			return $option;
		}
	}
	if ( $requested_jars >= 3 ) {
		foreach ( $options as $option ) {
			if ( $option['jars'] >= 3 ) {
				return $option;
			}
		}
	}
	return null;
}

/** Use the storefront artwork customers already recognise in Flash offer cards. */
function catakor_original_flash_image_url( $product ) {
	$product = catakor_original_parent_product( $product );
	if ( 'nmn' === catakor_original_product_role( $product ) ) {
		return catakor_original_asset( 'nmn-gallery/01-main.png' );
	}
	$image_id = $product instanceof WC_Product ? $product->get_image_id() : 0;
	$image    = $image_id ? wp_get_attachment_image_url( $image_id, 'woocommerce_single' ) : '';
	return $image ? $image : wc_placeholder_img_src( 'woocommerce_single' );
}

/** Build the currently valid, one-per-regular-product private Flash offers. */
function catakor_original_flash_offers() {
	if ( ! function_exists( 'WC' ) || ! WC()->cart ) {
		return array();
	}
	$catalogue = catakor_original_flash_catalogue();
	$accepted  = WC()->session ? (array) WC()->session->get( 'catakor_flash_accepted_sources', array() ) : array();
	$seen      = array();
	$present   = array();
	$offers    = array();
	$roles     = array( 'nad', 'glutathione', 'nmn' );

	foreach ( WC()->cart->get_cart() as $cart_item ) {
		$item_product = catakor_original_parent_product( $cart_item['data'] );
		$role         = catakor_original_product_role( $item_product );
		if ( in_array( $role, $roles, true ) ) {
			$present[ $role ] = true;
		}
	}

	foreach ( WC()->cart->get_cart() as $source_key => $cart_item ) {
		if ( ! empty( $cart_item['_catakor_flash_offer'] ) || ! empty( $accepted[ $source_key ] ) ) {
			continue;
		}
		$source_product = $cart_item['data'];
		$source_parent  = catakor_original_parent_product( $source_product );
		$source_role    = catakor_original_product_role( $source_parent );
		if ( ! in_array( $source_role, $roles, true ) || isset( $seen[ $source_role ] ) ) {
			continue;
		}
		$seen[ $source_role ] = true;
		$source_jars          = catakor_original_flash_jar_count( $source_product );
		$target_role          = $source_role;
		$target_jars          = 1;
		$discount             = 20;
		$replaces             = true;

		if ( 1 === $source_jars ) {
			$target_jars = 2;
		} elseif ( 2 === $source_jars ) {
			$target_jars = 3;
		} else {
			$discount = 25;
			$replaces = false;
			$candidates = array_values( array_diff( $roles, array( $source_role ) ) );
			$not_present = array_values( array_filter( $candidates, static function ( $role ) use ( $present ) { return empty( $present[ $role ] ); } ) );
			if ( $not_present ) {
				$candidates = $not_present;
			}
			$target_role = reset( $candidates );
		}

		$target_parent = $catalogue[ $target_role ] ?? null;
		$target_pack   = catakor_original_flash_pack_for_tier( $target_parent, $target_jars );
		if ( ! $target_parent || ! $target_pack || $target_pack['price'] <= 0 ) {
			continue;
		}
		$present[ $target_role ] = true;
		$token_material = implode( '|', array( $source_key, $target_pack['product_id'], $target_pack['variation_id'], $discount, $replaces ? 1 : 0 ) );
		$offers[] = array(
			'token'             => hash_hmac( 'sha256', $token_material, wp_salt( 'nonce' ) ),
			'source_key'        => $source_key,
			'source_name'       => $source_parent->get_name(),
			'source_role'       => $source_role,
			'target_role'       => $target_role,
			'target_product_id' => $target_pack['product_id'],
			'target_variation_id'=> $target_pack['variation_id'],
			'target_attributes' => $target_pack['attributes'],
			'product_name'      => $target_parent->get_name(),
			'image'             => catakor_original_flash_image_url( $target_parent ),
			'pack_label'        => $target_pack['label'],
			'jars'              => $target_pack['jars'],
			'discount'          => $discount,
			'replaces'          => $replaces,
			'original_price'    => (float) $target_pack['price'],
			'sale_price'        => (float) wc_format_decimal( $target_pack['price'] * ( 1 - ( $discount / 100 ) ), wc_get_price_decimals() ),
		);
	}
	return $offers;
}

/** AJAX: return live, server-validated Flash Checkout offers. */
function catakor_original_ajax_flash_offers() {
	check_ajax_referer( 'catakor-cart', 'nonce' );
	$public_offers = array_map(
		static function ( $offer ) {
			return array_intersect_key(
				$offer,
				array_flip( array( 'token', 'source_name', 'product_name', 'image', 'pack_label', 'jars', 'discount', 'replaces', 'original_price', 'sale_price' ) )
			);
		},
		catakor_original_flash_offers()
	);
	wp_send_json_success( array( 'offers' => $public_offers ) );
}
add_action( 'wp_ajax_catakor_flash_offers', 'catakor_original_ajax_flash_offers' );
add_action( 'wp_ajax_nopriv_catakor_flash_offers', 'catakor_original_ajax_flash_offers' );

/** AJAX: accept a Flash offer after recomputing it against the current cart. */
function catakor_original_ajax_accept_flash_offer() {
	check_ajax_referer( 'catakor-cart', 'nonce' );
	if ( ! function_exists( 'WC' ) || ! WC()->cart ) {
		wp_send_json_error( array( 'message' => __( 'The shopping bag is unavailable.', 'catakor-original' ) ), 400 );
	}
	$token = isset( $_POST['offer_token'] ) ? wc_clean( wp_unslash( $_POST['offer_token'] ) ) : '';
	$offer = null;
	foreach ( catakor_original_flash_offers() as $candidate ) {
		if ( $token && hash_equals( $candidate['token'], $token ) ) {
			$offer = $candidate;
			break;
		}
	}
	$cart = WC()->cart->get_cart();
	if ( ! $offer || ! isset( $cart[ $offer['source_key'] ] ) ) {
		wp_send_json_error( array( 'message' => __( 'This private offer is no longer available.', 'catakor-original' ) ), 409 );
	}
	$quantity = $offer['replaces'] ? max( 1, absint( $cart[ $offer['source_key'] ]['quantity'] ) ) : 1;
	$item_data = array(
		'_catakor_flash_offer'        => true,
		'_catakor_flash_discount'     => absint( $offer['discount'] ),
		'_catakor_flash_original_price'=> (float) $offer['original_price'],
		'_catakor_flash_sale_price'   => (float) $offer['sale_price'],
		'_catakor_flash_source_key'   => $offer['replaces'] ? '' : $offer['source_key'],
		'_catakor_flash_source_role'  => $offer['source_role'],
		'_catakor_flash_id'           => wp_generate_uuid4(),
	);
	$added_key = WC()->cart->add_to_cart(
		$offer['target_product_id'],
		$quantity,
		$offer['target_variation_id'],
		$offer['target_attributes'],
		$item_data
	);
	if ( ! $added_key ) {
		wp_send_json_error( array( 'message' => __( 'The private offer could not be added.', 'catakor-original' ) ), 409 );
	}
	if ( $offer['replaces'] ) {
		WC()->cart->remove_cart_item( $offer['source_key'] );
	}
	$accepted = WC()->session ? (array) WC()->session->get( 'catakor_flash_accepted_sources', array() ) : array();
	$accepted[ $offer['source_key'] ] = true;
	if ( WC()->session ) {
		WC()->session->set( 'catakor_flash_accepted_sources', $accepted );
	}
	WC()->cart->calculate_totals();
	WC()->cart->set_session();
	WC()->cart->maybe_set_cart_cookies();
	wp_send_json_success(
		array(
			'content' => catakor_original_cart_content(),
			'summary' => catakor_original_cart_summary(),
			'count'   => WC()->cart->get_cart_contents_count(),
		)
	);
}
add_action( 'wp_ajax_catakor_accept_flash_offer', 'catakor_original_ajax_accept_flash_offer' );
add_action( 'wp_ajax_nopriv_catakor_accept_flash_offer', 'catakor_original_ajax_accept_flash_offer' );

/** Apply the private discount to eligible lines before WooCommerce totals. */
function catakor_original_apply_flash_prices( $cart ) {
	if ( ! $cart instanceof WC_Cart ) {
		return;
	}
	foreach ( $cart->get_cart() as $cart_item ) {
		if ( empty( $cart_item['_catakor_flash_offer'] ) || ! $cart_item['data'] instanceof WC_Product ) {
			continue;
		}
		$discount = absint( $cart_item['_catakor_flash_discount'] ?? 0 );
		$original = (float) ( $cart_item['_catakor_flash_original_price'] ?? 0 );
		if ( ! in_array( $discount, array( 20, 25 ), true ) || $original <= 0 ) {
			continue;
		}
		$cart_item['data']->set_price( (float) wc_format_decimal( $original * ( 1 - ( $discount / 100 ) ), wc_get_price_decimals() ) );
	}
}
add_action( 'woocommerce_before_calculate_totals', 'catakor_original_apply_flash_prices', 20 );

/** Never stack a coupon on top of a private Flash price. */
function catakor_original_exclude_flash_from_coupons( $valid, $product, $coupon, $cart_item ) {
	return ! empty( $cart_item['_catakor_flash_offer'] ) ? false : $valid;
}
add_filter( 'woocommerce_coupon_is_valid_for_product', 'catakor_original_exclude_flash_from_coupons', 10, 4 );

/** Show the private discount clearly in cart, checkout and customer order details. */
function catakor_original_flash_item_data( $data, $cart_item ) {
	if ( ! empty( $cart_item['_catakor_flash_offer'] ) ) {
		$data[] = array(
			'key'   => __( 'Flash Sale', 'catakor-original' ),
			'value' => sprintf( __( '%d%% off', 'catakor-original' ), absint( $cart_item['_catakor_flash_discount'] ?? 0 ) ),
		);
	}
	return $data;
}
add_filter( 'woocommerce_get_item_data', 'catakor_original_flash_item_data', 10, 2 );

function catakor_original_flash_order_item_meta( $item, $cart_item_key, $values ) {
	if ( ! empty( $values['_catakor_flash_offer'] ) ) {
		$item->add_meta_data( __( 'Flash Sale', 'catakor-original' ), sprintf( __( '%d%% off', 'catakor-original' ), absint( $values['_catakor_flash_discount'] ?? 0 ) ), true );
	}
}
add_action( 'woocommerce_checkout_create_order_line_item', 'catakor_original_flash_order_item_meta', 10, 3 );

/** Keep the original CATA15 rule aligned with the public offer. */
function catakor_original_ensure_cata15_coupon() {
	if ( ! class_exists( 'WC_Coupon' ) ) {
		return;
	}
	$coupon_id = wc_get_coupon_id_by_code( 'CATA15' );
	if ( $coupon_id && '1.4.1' === get_option( 'catakor_cata15_coupon_version' ) ) {
		return;
	}
	$coupon = $coupon_id ? new WC_Coupon( $coupon_id ) : new WC_Coupon();
	$coupon->set_code( 'CATA15' );
	$coupon->set_discount_type( 'percent' );
	$coupon->set_amount( 15 );
	$coupon->set_description( '15% off regular Catakor items. Private Flash Sale items are excluded.' );
	$coupon->set_individual_use( false );
	$coupon->save();
	update_option( 'catakor_cata15_coupon_version', '1.4.1', false );
}
add_action( 'init', 'catakor_original_ensure_cata15_coupon', 40 );

/** Enable WooCommerce customer sign-in and account creation. */
function catakor_original_enable_customer_accounts() {
	update_option( 'woocommerce_enable_myaccount_registration', 'yes' );
	update_option( 'woocommerce_enable_checkout_login_reminder', 'yes' );
	update_option( 'woocommerce_enable_signup_and_login_from_checkout', 'yes' );
	update_option( 'woocommerce_registration_generate_username', 'yes' );
	update_option( 'woocommerce_registration_generate_password', 'yes' );
}
add_action( 'after_switch_theme', 'catakor_original_enable_customer_accounts' );

/** Remove the digital-download endpoint from this physical-products store. */
function catakor_original_account_menu_items( $items ) {
	unset( $items['downloads'] );
	return $items;
}
add_filter( 'woocommerce_account_menu_items', 'catakor_original_account_menu_items', 100 );

/** Keep bookmarked download URLs inside the customer account dashboard. */
function catakor_original_redirect_account_downloads() {
	if ( function_exists( 'is_account_page' ) && function_exists( 'is_wc_endpoint_url' ) && is_account_page() && is_wc_endpoint_url( 'downloads' ) ) {
		wp_safe_redirect( wc_get_page_permalink( 'myaccount' ) );
		exit;
	}
}
add_action( 'template_redirect', 'catakor_original_redirect_account_downloads', 20 );

/** Keep checkout delivery to the single service offered by Catakor. */
function catakor_original_usa_free_shipping_rate( $rates, $package ) {
	$country = strtoupper( (string) ( $package['destination']['country'] ?? '' ) );
	if ( $country && 'US' !== $country ) {
		return array();
	}

	$rate = new WC_Shipping_Rate(
		'catakor_free_shipping',
		__( 'FREE USA SHIPPING · 5–8 BUSINESS DAYS', 'catakor-original' ),
		0,
		array(),
		'catakor_free_shipping',
		0
	);
	return array( 'catakor_free_shipping' => $rate );
}
add_filter( 'woocommerce_package_rates', 'catakor_original_usa_free_shipping_rate', 100, 2 );

/** Catakor currently sells and delivers to the United States only. */
function catakor_original_usa_only_countries( $countries ) {
	$usa = isset( $countries['US'] ) ? $countries['US'] : __( 'United States (US)', 'woocommerce' );
	return array( 'US' => $usa );
}
add_filter( 'woocommerce_countries_allowed_countries', 'catakor_original_usa_only_countries', 100 );
add_filter( 'woocommerce_countries_shipping_countries', 'catakor_original_usa_only_countries', 100 );

/** Prevent a saved international profile from masking the USA-only delivery rate. */
function catakor_original_checkout_country_value( $value, $input ) {
	if ( in_array( $input, array( 'billing_country', 'shipping_country' ), true ) ) {
		return 'US';
	}
	return $value;
}
add_filter( 'woocommerce_checkout_get_value', 'catakor_original_checkout_country_value', 100, 2 );

/** Replace WooCommerce's long generic delivery error with the store rule. */
function catakor_original_usa_shipping_message() {
	return __( 'FREE USA SHIPPING · 5–8 BUSINESS DAYS. Enter a valid US delivery address to continue.', 'catakor-original' );
}
add_filter( 'woocommerce_cart_no_shipping_available_html', 'catakor_original_usa_shipping_message' );
add_filter( 'woocommerce_no_shipping_available_html', 'catakor_original_usa_shipping_message' );

/** Keep the single free-delivery promise visible before the address is complete. */
function catakor_original_show_shipping_before_address() {
	return 'no';
}
add_filter( 'option_woocommerce_shipping_cost_requires_address', 'catakor_original_show_shipping_before_address' );

/** Use customer-friendly labels in the compact checkout totals card. */
function catakor_original_shipping_package_name() {
	return __( 'Delivery', 'catakor-original' );
}
add_filter( 'woocommerce_shipping_package_name', 'catakor_original_shipping_package_name' );

function catakor_original_coupon_label( $label, $coupon ) {
	if ( ! $coupon instanceof WC_Coupon ) {
		return $label;
	}
	return sprintf( __( 'Savings (%s)', 'catakor-original' ), strtoupper( $coupon->get_code() ) );
}
add_filter( 'woocommerce_cart_totals_coupon_label', 'catakor_original_coupon_label', 20, 2 );

/** Invalidate stored package rates when this storefront version is activated. */
function catakor_original_refresh_shipping_rates() {
	update_option( 'woocommerce_shipping_cost_requires_address', 'no' );
	if ( class_exists( 'WC_Cache_Helper' ) ) {
		WC_Cache_Helper::get_transient_version( 'shipping', true );
	}
}
add_action( 'after_switch_theme', 'catakor_original_refresh_shipping_rates' );

/** Use concise product names in the checkout totals card. */
function catakor_original_checkout_item_name( $name, $cart_item ) {
	$is_checkout_context = is_checkout() || ( defined( 'WOOCOMMERCE_CHECKOUT' ) && WOOCOMMERCE_CHECKOUT );
	if ( ! $is_checkout_context || is_wc_endpoint_url( 'order-received' ) || empty( $cart_item['data'] ) ) {
		return $name;
	}
	$product = catakor_original_parent_product( $cart_item['data'] );
	$config  = catakor_original_bundle_config( $product );
	if ( $config ) {
		return esc_html( $config['title'] );
	}
	$names = array(
		'nad'         => __( 'LIPOSOMAL NAD+', 'catakor-original' ),
		'nmn'         => __( 'NMN 4-IN-1 NAD+ SUPPORT', 'catakor-original' ),
		'glutathione' => __( 'LIPOSOMAL GLUTATHIONE', 'catakor-original' ),
	);
	$role = catakor_original_product_role( $product );
	return isset( $names[ $role ] ) ? esc_html( $names[ $role ] ) : $name;
}
add_filter( 'woocommerce_cart_item_name', 'catakor_original_checkout_item_name', 20, 2 );

/**
 * Give the checkout summary an unambiguous customer-facing pack label.
 *
 * WooCommerce normally renders variation attributes in its order table, but
 * the Catakor checkout replaces that table with a visual bag. Keep the
 * selected one-, two-, three- or four-jar tier visible there so the customer
 * can confirm exactly what they are buying before payment.
 */
function catakor_original_checkout_pack_label( $cart_item ) {
	if ( empty( $cart_item['data'] ) || ! $cart_item['data'] instanceof WC_Product ) {
		return '';
	}

	$item_product = $cart_item['data'];
	$product      = catakor_original_parent_product( $item_product );
	$role         = catakor_original_product_role( $product );

	if ( $item_product instanceof WC_Product_Variation ) {
		$jars = catakor_original_flash_jar_count( $item_product );
		if ( 'nmn' === $role && $jars >= 4 ) {
			return __( 'Selected pack: 4 jars (3 + 1 FREE)', 'catakor-original' );
		}
		return sprintf(
			/* translators: %d is the number of supplement jars selected. */
			_n( 'Selected pack: %d jar', 'Selected pack: %d jars', $jars, 'catakor-original' ),
			$jars
		);
	}

	if ( in_array( $role, array( 'nad', 'nmn', 'glutathione' ), true ) ) {
		return __( 'Selected pack: 1 jar', 'catakor-original' );
	}

	$config = catakor_original_bundle_config( $product );
	if ( $config ) {
		$product_count = substr_count( $config['key'], '-' ) + 1;
		return sprintf(
			/* translators: %d is the number of products included in a bundle. */
			_n( 'Selected bundle: %d product', 'Selected bundle: %d products', $product_count, 'catakor-original' ),
			$product_count
		);
	}

	return __( 'Selected option: Standard', 'catakor-original' );
}

/** Short, clear privacy wording for the final payment card. */
function catakor_original_checkout_privacy_text( $text, $type ) {
	if ( 'checkout' !== $type ) {
		return $text;
	}
	$url = get_privacy_policy_url();
	if ( ! $url ) {
		return __( 'Secure checkout. Your information is used only to process and support your order.', 'catakor-original' );
	}
	return sprintf(
		wp_kses_post( __( 'Secure checkout. Your information is used only to process and support your order. See our <a href="%s" target="_blank">privacy policy</a>.', 'catakor-original' ) ),
		esc_url( $url )
	);
}
add_filter( 'woocommerce_get_privacy_policy_text', 'catakor_original_checkout_privacy_text', 20, 2 );

/** Exact NMN check used by the product template. */
function catakor_original_is_nmn_product( $product ) {
	return 'nmn' === catakor_original_product_role( $product );
}

/** Render a product or bundle visual consistently. */
function catakor_original_product_visual( $product, $size = 'woocommerce_single' ) {
	$config = catakor_original_bundle_config( $product );
	if ( $config && '__bundle_composition__' === $config['image'] ) {
		return '<span class="catakor-bundle-composition" role="img" aria-label="' . esc_attr( $config['title'] ) . '"><img class="is-nad" src="https://catakor.com/cdn/shop/files/Main_NAD.png?v=1783679981&amp;width=800" alt=""><img class="is-glutathione" src="https://catakor.com/cdn/shop/files/Main_Glu.png?v=1783680082&amp;width=800" alt=""></span>';
	}
	if ( $config ) {
		return '<img src="' . esc_url( $config['image'] ) . '" alt="' . esc_attr( $config['title'] ) . '" loading="lazy">';
	}
	if ( catakor_original_is_nmn_product( $product ) ) {
		return '<img src="' . esc_url( catakor_original_asset( 'nmn-gallery/01-main.png' ) ) . '" alt="' . esc_attr( $product->get_name() ) . '" loading="lazy">';
	}
	return $product->get_image( $size, array( 'loading' => 'lazy', 'alt' => $product->get_name() ) );
}

/** Return only the intended storefront catalogue in the intended order. */
function catakor_original_sort_catalogue( $products, $best_sellers = false ) {
	$ranked       = array();
	$core_order   = array( 'nad', 'glutathione', 'nmn' );
	$bundle_order = array_keys( catakor_original_bundle_configs() );
	foreach ( $products as $product ) {
		if ( ! $product instanceof WC_Product ) {
			continue;
		}
		$role   = catakor_original_product_role( $product );
		$config = catakor_original_bundle_config( $product );
		if ( in_array( $role, $core_order, true ) ) {
			$ranked[ array_search( $role, $core_order, true ) + 1 ] = $product;
		} elseif ( ! $best_sellers && $config ) {
			$ranked[ 10 + array_search( $config['key'], $bundle_order, true ) ] = $product;
		}
	}
	ksort( $ranked );
	return array_values( $ranked );
}

/** Shared collection card. */
function catakor_original_product_card( $product, $order ) {
	$config      = catakor_original_bundle_config( $product );
	$title       = $config ? $config['title'] : $product->get_name();
	$description = $config ? $config['benefit'] : wp_trim_words( wp_strip_all_tags( $product->get_short_description() ?: $product->get_description() ), 12 );
	?>
	<article class="collection-card<?php echo $product->is_in_stock() ? '' : ' is-sold-out'; ?><?php echo $config ? ' collection-bundle-card' : ''; ?>" data-collection-card data-title="<?php echo esc_attr( $title ); ?>" data-available="<?php echo $product->is_in_stock() ? 'true' : 'false'; ?>" data-original-order="<?php echo esc_attr( $order ); ?>">
		<a class="collection-card-hitbox" href="<?php echo esc_url( $product->get_permalink() ); ?>" aria-label="<?php echo esc_attr( sprintf( __( 'View %s', 'catakor-original' ), $title ) ); ?>"></a>
		<div class="collection-image-wrap"><span class="collection-sale-badge"><?php echo $config ? esc_html__( 'Bundle', 'catakor-original' ) : ( $product->is_on_sale() ? esc_html__( 'Sale', 'catakor-original' ) : esc_html__( 'Cata-Kor', 'catakor-original' ) ); ?></span><?php if ( ! $product->is_in_stock() ) : ?><span class="collection-stock-badge"><?php esc_html_e( 'Sold out', 'catakor-original' ); ?></span><?php endif; ?><?php echo wp_kses_post( catakor_original_product_visual( $product ) ); ?></div>
		<div class="collection-card-copy"><h2><?php echo esc_html( $title ); ?></h2><p><?php echo esc_html( $description ); ?></p><a class="collection-product-button" href="<?php echo esc_url( $product->get_permalink() ); ?>"><?php echo $product->is_in_stock() ? esc_html__( 'View Product', 'catakor-original' ) : esc_html__( 'Out of stock', 'catakor-original' ); ?></a></div>
	</article>
	<?php
}

/** Virtual Best Sellers collection. */
function catakor_original_best_sellers_rewrite() {
	add_rewrite_rule( '^best-sellers/?$', 'index.php?catakor_best_sellers=1', 'top' );
	if ( get_option( 'catakor_rewrite_version' ) !== CATAKOR_ORIGINAL_VERSION ) {
		flush_rewrite_rules( false );
		update_option( 'catakor_rewrite_version', CATAKOR_ORIGINAL_VERSION, false );
	}
}
add_action( 'init', 'catakor_original_best_sellers_rewrite' );
add_filter( 'query_vars', static function ( $vars ) { $vars[] = 'catakor_best_sellers'; return $vars; } );
add_filter( 'template_include', static function ( $template ) { return get_query_var( 'catakor_best_sellers' ) ? get_template_directory() . '/page-best-sellers.php' : $template; } );
add_filter( 'pre_get_document_title', static function ( $title ) { return get_query_var( 'catakor_best_sellers' ) ? __( 'Best Sellers – Cata-Kor', 'catakor-original' ) : $title; } );
add_filter( 'redirect_canonical', static function ( $redirect ) { return get_query_var( 'catakor_best_sellers' ) ? false : $redirect; } );
add_action(
	'template_redirect',
	static function () {
		if ( get_query_var( 'catakor_best_sellers' ) ) {
			global $wp_query;
			$wp_query->is_404 = false;
			status_header( 200 );
		}
	},
	1
);

/** Replace WooCommerce's collapsed coupon prompt with the visible theme field. */
function catakor_original_remove_default_checkout_coupon() {
	remove_action( 'woocommerce_before_checkout_form', 'woocommerce_checkout_coupon_form', 10 );
}
add_action( 'wp', 'catakor_original_remove_default_checkout_coupon' );

/** Modern bag summary displayed before checkout details. */
function catakor_original_checkout_bag() {
	if ( ! function_exists( 'WC' ) || ! WC()->cart || WC()->cart->is_empty() ) {
		return;
	}
	?>
	<section class="catakor-checkout-bag" data-checkout-bag aria-labelledby="catakor-checkout-bag-title">
		<header><div><span><?php esc_html_e( 'Your shopping bag', 'catakor-original' ); ?></span><h2 id="catakor-checkout-bag-title"><?php esc_html_e( 'Review your items', 'catakor-original' ); ?></h2></div><button type="button" data-cart-open><?php esc_html_e( 'Edit bag', 'catakor-original' ); ?></button></header>
		<div class="catakor-checkout-bag-items">
			<?php foreach ( WC()->cart->get_cart() as $cart_item ) : $item_product = $cart_item['data']; if ( ! $item_product || ! $item_product->exists() || $cart_item['quantity'] < 1 ) { continue; } $item_name = catakor_original_checkout_item_name( $item_product->get_name(), $cart_item ); $pack_label = catakor_original_checkout_pack_label( $cart_item ); ?>
				<article>
					<a class="catakor-checkout-bag-image" href="<?php echo esc_url( $item_product->get_permalink() ); ?>"><?php echo wp_kses_post( catakor_original_product_visual( $item_product, 'woocommerce_thumbnail' ) ); ?></a>
					<div><?php if ( ! empty( $cart_item['_catakor_flash_offer'] ) ) : ?><span class="global-flash-label"><?php echo esc_html( sprintf( __( 'FLASH SALE · %d%% OFF', 'catakor-original' ), absint( $cart_item['_catakor_flash_discount'] ?? 0 ) ) ); ?></span><?php endif; ?><h3><?php echo wp_kses_post( $item_name ); ?></h3><div class="catakor-checkout-bag-meta"><strong><?php echo esc_html( $pack_label ); ?></strong><span><?php echo esc_html( sprintf( __( 'Order quantity: %d', 'catakor-original' ), $cart_item['quantity'] ) ); ?></span></div></div>
					<strong><?php echo wp_kses_post( WC()->cart->get_product_subtotal( $item_product, $cart_item['quantity'] ) ); ?></strong>
				</article>
			<?php endforeach; ?>
		</div>
		<form class="checkout_coupon catakor-checkout-promo" method="post">
			<label for="catakor_coupon_code"><?php esc_html_e( 'Promo code', 'catakor-original' ); ?></label>
			<div><input id="catakor_coupon_code" type="text" name="coupon_code" placeholder="<?php esc_attr_e( 'Enter CATA15', 'catakor-original' ); ?>" autocomplete="off"><button type="submit" name="apply_coupon" value="<?php esc_attr_e( 'Apply coupon', 'catakor-original' ); ?>"><?php esc_html_e( 'Apply', 'catakor-original' ); ?></button></div>
		</form>
	</section>
	<?php
}

/** Return the checkout bag as an AJAX-safe fragment. */
function catakor_original_checkout_bag_markup() {
	ob_start();
	catakor_original_checkout_bag();
	return (string) ob_get_clean();
}

/**
 * Human-readable drawer summary matching the original Shopify cart.
 *
 * @return string
 */
function catakor_original_cart_summary() {
	if ( ! function_exists( 'WC' ) || ! WC()->cart || WC()->cart->is_empty() ) {
		return __( 'Your bag is empty', 'catakor-original' );
	}
	$selections = count( WC()->cart->get_cart() );
	return sprintf(
		/* translators: %d is the number of distinct cart selections. */
		_n( '%d product selection', '%d product selections', $selections, 'catakor-original' ),
		$selections
	);
}

/**
 * Render the live cart contents inside the shared drawer.
 *
 * @return string
 */
function catakor_original_cart_content() {
	ob_start();
	if ( ! function_exists( 'WC' ) || ! WC()->cart || WC()->cart->is_empty() ) :
		?>
		<div class="global-empty-cart">
			<span>0</span>
			<h3><?php esc_html_e( 'Your shopping bag is empty', 'catakor-original' ); ?></h3>
			<p><?php esc_html_e( 'Choose a product and build your daily longevity routine.', 'catakor-original' ); ?></p>
			<button type="button" data-cart-close><?php esc_html_e( 'CONTINUE SHOPPING', 'catakor-original' ); ?></button>
		</div>
		<?php
	else :
		$has_flash_offer = ! empty( catakor_original_flash_offers() );
		?>
		<div class="global-cart-items" data-cart-items>
			<?php foreach ( WC()->cart->get_cart() as $cart_item_key => $cart_item ) : ?>
				<?php
				$item_product = $cart_item['data'];
				if ( ! $item_product || ! $item_product->exists() || $cart_item['quantity'] < 1 ) {
					continue;
				}
				$variation_label = wc_get_formatted_cart_item_data( $cart_item, true );
				$is_flash       = ! empty( $cart_item['_catakor_flash_offer'] );
				$flash_discount = absint( $cart_item['_catakor_flash_discount'] ?? 0 );
				$flash_original = (float) ( $cart_item['_catakor_flash_original_price'] ?? 0 ) * $cart_item['quantity'];
				?>
				<article data-line-key="<?php echo esc_attr( $cart_item_key ); ?>">
					<div class="global-cart-visual"><?php echo wp_kses_post( catakor_original_product_visual( $item_product, 'woocommerce_thumbnail' ) ); ?></div>
					<div class="global-cart-item-copy">
						<?php if ( $is_flash ) : ?><span class="global-flash-label"><?php echo esc_html( sprintf( __( 'FLASH SALE · %d%% OFF', 'catakor-original' ), $flash_discount ) ); ?></span><?php endif; ?>
						<h3><?php echo esc_html( $item_product->get_name() ); ?></h3>
						<p><?php echo $variation_label ? wp_kses_post( $variation_label ) . ' · ' : ''; ?><?php esc_html_e( 'One-time purchase', 'catakor-original' ); ?></p>
						<div class="global-cart-price"><?php if ( $is_flash && $flash_original > 0 ) : ?><del><?php echo wp_kses_post( wc_price( $flash_original ) ); ?></del><?php endif; ?><strong><?php echo wp_kses_post( WC()->cart->get_product_subtotal( $item_product, $cart_item['quantity'] ) ); ?></strong></div>
						<div class="global-cart-quantity">
							<span><?php esc_html_e( 'Bundle quantity', 'catakor-original' ); ?></span>
							<div>
								<button type="button" data-cart-key="<?php echo esc_attr( $cart_item_key ); ?>" data-cart-quantity="<?php echo esc_attr( max( 0, $cart_item['quantity'] - 1 ) ); ?>" aria-label="<?php esc_attr_e( 'Decrease quantity', 'catakor-original' ); ?>">−</button>
								<b><?php echo esc_html( $cart_item['quantity'] ); ?></b>
								<button type="button" data-cart-key="<?php echo esc_attr( $cart_item_key ); ?>" data-cart-quantity="<?php echo esc_attr( $cart_item['quantity'] + 1 ); ?>" aria-label="<?php esc_attr_e( 'Increase quantity', 'catakor-original' ); ?>">+</button>
							</div>
						</div>
					</div>
					<button class="global-cart-remove" type="button" data-cart-key="<?php echo esc_attr( $cart_item_key ); ?>" data-cart-remove><?php esc_html_e( 'Remove', 'catakor-original' ); ?></button>
				</article>
			<?php endforeach; ?>
		</div>
		<?php if ( $has_flash_offer ) : ?>
			<div class="global-cart-offer-hint" role="note">
				<span><?php esc_html_e( '⚡ Limited One-Time Offer', 'catakor-original' ); ?></span>
				<strong><?php esc_html_e( 'A Private Flash Deal Is Waiting', 'catakor-original' ); ?></strong>
				<p><?php esc_html_e( 'Use the checkout button below to reveal it. No code required.', 'catakor-original' ); ?></p>
			</div>
		<?php endif; ?>
		<div class="global-cart-summary"><span><?php esc_html_e( 'SUBTOTAL', 'catakor-original' ); ?></span><strong data-cart-total><?php echo wp_kses_post( WC()->cart->get_cart_subtotal() ); ?></strong></div>
		<button class="global-cart-checkout" type="button" data-start-checkout><?php echo $has_flash_offer ? esc_html__( 'CHECKOUT & REVEAL OFFER →', 'catakor-original' ) : esc_html__( 'CHECKOUT', 'catakor-original' ); ?></button>
		<button class="global-cart-continue" type="button" data-cart-close><?php esc_html_e( 'CONTINUE SHOPPING', 'catakor-original' ); ?></button>
		<p class="global-cart-note"><?php esc_html_e( 'CATA15 can be applied to regular items at checkout.', 'catakor-original' ); ?></p>
		<?php
	endif;
	return (string) ob_get_clean();
}

/**
 * Render the global cart drawer on every storefront page.
 */
function catakor_original_cart_drawer() {
	if ( ! class_exists( 'WooCommerce' ) ) {
		return;
	}
	?>
	<div class="global-cart-layer" id="CartDrawer" role="presentation" aria-hidden="true" hidden>
		<aside class="global-cart-drawer" role="dialog" aria-modal="true" aria-labelledby="global-cart-title">
			<div class="global-cart-heading">
				<div><h2 id="global-cart-title"><?php esc_html_e( 'YOUR SHOPPING BAG', 'catakor-original' ); ?></h2><p data-cart-summary><?php echo esc_html( catakor_original_cart_summary() ); ?></p></div>
				<button type="button" data-cart-close aria-label="<?php esc_attr_e( 'Close shopping bag', 'catakor-original' ); ?>">×</button>
			</div>
			<div data-cart-content><?php echo catakor_original_cart_content(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></div>
		</aside>
	</div>
	<div class="global-offer-layer" id="FlashOfferDialog" role="presentation" aria-hidden="true" hidden>
		<section class="global-offer-dialog" role="dialog" aria-modal="true" aria-labelledby="flash-title">
			<span class="global-offer-eyebrow"><?php esc_html_e( 'CHECKOUT-ONLY FLASH SALE', 'catakor-original' ); ?></span>
			<h2 id="flash-title"><?php esc_html_e( 'YOUR PRIVATE BUNDLE OFFERS', 'catakor-original' ); ?></h2>
			<p><?php esc_html_e( 'One limited offer has been prepared for every regular product in your bag.', 'catakor-original' ); ?></p>
			<div class="global-offer-grid" data-flash-offers></div>
			<button class="global-offer-continue" type="button" data-flash-continue><?php esc_html_e( 'NO THANKS, CONTINUE', 'catakor-original' ); ?></button>
		</section>
	</div>
	<?php
}

/**
 * Update or remove a cart line from the drawer without leaving the page.
 */
function catakor_original_ajax_update_cart() {
	check_ajax_referer( 'catakor-cart', 'nonce' );
	if ( ! function_exists( 'WC' ) || ! WC()->cart ) {
		wp_send_json_error( array( 'message' => __( 'The shopping bag is unavailable.', 'catakor-original' ) ), 400 );
	}

	$key      = isset( $_POST['cart_item_key'] ) ? wc_clean( wp_unslash( $_POST['cart_item_key'] ) ) : '';
	$quantity = isset( $_POST['quantity'] ) ? max( 0, absint( $_POST['quantity'] ) ) : 0;
	$cart     = WC()->cart->get_cart();
	if ( ! $key || ! isset( $cart[ $key ] ) ) {
		wp_send_json_error( array( 'message' => __( 'That shopping-bag item could not be found.', 'catakor-original' ) ), 404 );
	}

	if ( 0 === $quantity && empty( $cart[ $key ]['_catakor_flash_offer'] ) ) {
		foreach ( $cart as $child_key => $child_item ) {
			if ( ! empty( $child_item['_catakor_flash_offer'] ) && ( $child_item['_catakor_flash_source_key'] ?? '' ) === $key ) {
				WC()->cart->remove_cart_item( $child_key );
			}
		}
		$accepted = WC()->session ? (array) WC()->session->get( 'catakor_flash_accepted_sources', array() ) : array();
		unset( $accepted[ $key ] );
		if ( WC()->session ) {
			WC()->session->set( 'catakor_flash_accepted_sources', $accepted );
		}
	}

	if ( 0 === $quantity ) {
		WC()->cart->remove_cart_item( $key );
	} else {
		WC()->cart->set_quantity( $key, $quantity, true );
	}
	WC()->cart->calculate_totals();
	WC()->cart->set_session();
	WC()->cart->maybe_set_cart_cookies();
	wp_send_json_success(
		array(
			'content'      => catakor_original_cart_content(),
			'summary'      => catakor_original_cart_summary(),
			'count'        => WC()->cart->get_cart_contents_count(),
			'checkout_bag' => catakor_original_checkout_bag_markup(),
		)
	);
}
add_action( 'wp_ajax_catakor_update_cart', 'catakor_original_ajax_update_cart' );
add_action( 'wp_ajax_nopriv_catakor_update_cart', 'catakor_original_ajax_update_cart' );
