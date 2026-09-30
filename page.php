<?php
/**
 * Standard content page.
 *
 * @package Catakor_Original
 */
get_header();
?>
<main id="MainContent" class="catakor-wc-shell content-for-layout focus-none" role="main">
	<?php while ( have_posts() ) : the_post(); ?>
		<article <?php post_class( 'catakor-page' ); ?>>
			<h1 class="catakor-page__title"><?php the_title(); ?></h1>
			<div class="catakor-page__content"><?php the_content(); ?></div>
		</article>
	<?php endwhile; ?>
</main>
<?php get_footer(); ?>
