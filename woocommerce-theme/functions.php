<?php
/**
 * Theme bootstrap for the faithful Catakor storefront port.
 *
 * @package Catakor_Original
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'CATAKOR_ORIGINAL_VERSION', '1.3.1' );

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
	<section class="catakor-checkout-bag" aria-labelledby="catakor-checkout-bag-title">
		<header><div><span><?php esc_html_e( 'Your shopping bag', 'catakor-original' ); ?></span><h2 id="catakor-checkout-bag-title"><?php esc_html_e( 'Review your items', 'catakor-original' ); ?></h2></div><button type="button" data-cart-open><?php esc_html_e( 'Edit bag', 'catakor-original' ); ?></button></header>
		<div class="catakor-checkout-bag-items">
			<?php foreach ( WC()->cart->get_cart() as $cart_item ) : $item_product = $cart_item['data']; if ( ! $item_product || ! $item_product->exists() || $cart_item['quantity'] < 1 ) { continue; } ?>
				<article>
					<a class="catakor-checkout-bag-image" href="<?php echo esc_url( $item_product->get_permalink() ); ?>"><?php echo wp_kses_post( catakor_original_product_visual( $item_product, 'woocommerce_thumbnail' ) ); ?></a>
					<div><h3><?php echo esc_html( $item_product->get_name() ); ?></h3><p><?php echo esc_html( sprintf( _n( '%d item', '%d items', $cart_item['quantity'], 'catakor-original' ), $cart_item['quantity'] ) ); ?></p></div>
					<strong><?php echo wp_kses_post( WC()->cart->get_product_subtotal( $item_product, $cart_item['quantity'] ) ); ?></strong>
				</article>
			<?php endforeach; ?>
		</div>
		<form class="checkout_coupon catakor-checkout-promo" method="post">
			<label for="catakor_coupon_code"><?php esc_html_e( 'Promo code', 'catakor-original' ); ?></label>
			<div><input id="catakor_coupon_code" type="text" name="coupon_code" placeholder="<?php esc_attr_e( 'Enter your code', 'catakor-original' ); ?>" autocomplete="off"><button type="submit" name="apply_coupon" value="<?php esc_attr_e( 'Apply coupon', 'catakor-original' ); ?>"><?php esc_html_e( 'Apply', 'catakor-original' ); ?></button></div>
		</form>
	</section>
	<?php
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
		?>
		<div class="global-cart-items" data-cart-items>
			<?php foreach ( WC()->cart->get_cart() as $cart_item_key => $cart_item ) : ?>
				<?php
				$item_product = $cart_item['data'];
				if ( ! $item_product || ! $item_product->exists() || $cart_item['quantity'] < 1 ) {
					continue;
				}
				$variation_label = wc_get_formatted_cart_item_data( $cart_item, true );
				?>
				<article data-line-key="<?php echo esc_attr( $cart_item_key ); ?>">
					<div class="global-cart-visual"><?php echo wp_kses_post( catakor_original_product_visual( $item_product, 'woocommerce_thumbnail' ) ); ?></div>
					<div class="global-cart-item-copy">
						<h3><?php echo esc_html( $item_product->get_name() ); ?></h3>
						<p><?php echo $variation_label ? wp_kses_post( $variation_label ) . ' · ' : ''; ?><?php esc_html_e( 'One-time purchase', 'catakor-original' ); ?></p>
						<div class="global-cart-price"><strong><?php echo wp_kses_post( WC()->cart->get_product_subtotal( $item_product, $cart_item['quantity'] ) ); ?></strong></div>
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
		<div class="global-cart-summary"><span><?php esc_html_e( 'SUBTOTAL', 'catakor-original' ); ?></span><strong data-cart-total><?php echo wp_kses_post( WC()->cart->get_cart_subtotal() ); ?></strong></div>
		<a class="global-cart-checkout" href="<?php echo esc_url( wc_get_checkout_url() ); ?>"><?php esc_html_e( 'CHECKOUT', 'catakor-original' ); ?></a>
		<button class="global-cart-continue" type="button" data-cart-close><?php esc_html_e( 'CONTINUE SHOPPING', 'catakor-original' ); ?></button>
		<p class="global-cart-note"><?php esc_html_e( 'Discount codes can be applied at checkout.', 'catakor-original' ); ?></p>
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

	WC()->cart->set_quantity( $key, $quantity, true );
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
add_action( 'wp_ajax_catakor_update_cart', 'catakor_original_ajax_update_cart' );
add_action( 'wp_ajax_nopriv_catakor_update_cart', 'catakor_original_ajax_update_cart' );
