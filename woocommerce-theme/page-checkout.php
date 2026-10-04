<?php
/**
 * Focused checkout template.
 *
 * @package Catakor_Original
 */

get_header();

$is_confirmation = function_exists( 'is_wc_endpoint_url' ) && is_wc_endpoint_url( 'order-received' );
?>
<main id="MainContent" class="catakor-checkout-shell content-for-layout focus-none" role="main">
	<section class="catakor-checkout-hero" aria-labelledby="catakor-checkout-title">
		<div class="catakor-checkout-heading">
			<span class="catakor-checkout-eyebrow">
				<?php echo $is_confirmation ? esc_html__( 'Payment confirmed', 'catakor-original' ) : esc_html__( 'Secure checkout', 'catakor-original' ); ?>
			</span>
			<h1 id="catakor-checkout-title">
				<?php echo $is_confirmation ? esc_html__( 'You’re all set.', 'catakor-original' ) : esc_html__( 'Complete your order.', 'catakor-original' ); ?>
			</h1>
			<p>
				<?php echo $is_confirmation ? esc_html__( 'Your order is confirmed. We’ll send updates as it makes its way to you.', 'catakor-original' ) : esc_html__( 'Fast, secure payment. Your information is encrypted and never stored by Catakor.', 'catakor-original' ); ?>
			</p>
		</div>

		<ol class="catakor-checkout-steps" aria-label="<?php esc_attr_e( 'Checkout progress', 'catakor-original' ); ?>">
			<li class="is-complete"><span>1</span><b><?php esc_html_e( 'Bag', 'catakor-original' ); ?></b></li>
			<li class="<?php echo $is_confirmation ? 'is-complete' : 'is-current'; ?>"><span>2</span><b><?php esc_html_e( 'Details', 'catakor-original' ); ?></b></li>
			<li class="<?php echo $is_confirmation ? 'is-complete' : ''; ?>"><span>3</span><b><?php esc_html_e( 'Payment', 'catakor-original' ); ?></b></li>
		</ol>
	</section>

	<div class="catakor-checkout-assurance" aria-label="<?php esc_attr_e( 'Checkout assurances', 'catakor-original' ); ?>">
		<span><i aria-hidden="true">✓</i><?php esc_html_e( 'Encrypted checkout', 'catakor-original' ); ?></span>
		<span><i aria-hidden="true">↗</i><?php esc_html_e( 'Tracked US delivery', 'catakor-original' ); ?></span>
		<span><i aria-hidden="true">30</i><?php esc_html_e( '30-day guarantee', 'catakor-original' ); ?></span>
	</div>

	<?php while ( have_posts() ) : the_post(); ?>
		<article <?php post_class( 'catakor-checkout-page' ); ?>>
			<div class="catakor-checkout-content">
				<?php the_content(); ?>
			</div>
		</article>
	<?php endwhile; ?>
</main>
<?php get_footer(); ?>
