<?php
/**
 * Theme bootstrap for the faithful Catakor storefront port.
 *
 * @package Catakor_Original
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'CATAKOR_ORIGINAL_VERSION', '1.1.0' );

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

function catakor_original_asset( $file ) {
	return get_template_directory_uri() . '/assets/original/' . ltrim( $file, '/' );
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
					<?php echo wp_kses_post( $item_product->get_image( 'woocommerce_thumbnail', array( 'alt' => '' ) ) ); ?>
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
