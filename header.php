<?php
/**
 * Global header.
 *
 * @package Catakor_Original
 */
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-to-content-link button visually-hidden" href="#MainContent"><?php esc_html_e( 'Skip to content', 'catakor-original' ); ?></a>
<?php catakor_original_fragment( 'header' ); ?>
