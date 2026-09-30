<?php
/**
 * Fallback template.
 *
 * @package Catakor_Original
 */
get_header();
?>
<main id="MainContent" class="catakor-wc-shell content-for-layout focus-none" role="main">
	<?php if ( have_posts() ) : ?>
		<?php while ( have_posts() ) : the_post(); ?>
			<article <?php post_class( 'catakor-page' ); ?>>
				<h1 class="catakor-page__title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h1>
				<div class="catakor-page__content"><?php the_content(); ?></div>
			</article>
		<?php endwhile; ?>
	<?php else : ?>
		<p><?php esc_html_e( 'Nothing was found.', 'catakor-original' ); ?></p>
	<?php endif; ?>
</main>
<?php get_footer(); ?>
