<?php
/**
 * Original Catakor FAQ page.
 *
 * @package Catakor_Original
 */
get_header();
$questions = array(
	'How long does it take to see results from dietary supplements?' => 'The time to experience results varies based on the supplement and individual factors. Consistency in usage is key. Some may notice changes quickly, while others may require more time.',
	'Are there potential side effects of dietary supplements?' => 'While most people tolerate supplements well, side effects can occur, especially when exceeding recommended dosages. Common side effects are usually mild, but it is essential to report any adverse reactions to a healthcare provider.',
	'How does Cata-Kor ensure the quality of its ingredients?' => 'We source our ingredients meticulously, prioritizing quality, purity, and sustainability. Our commitment to excellence extends to rigorous testing and adherence to industry-leading standards.',
	'Are your products gluten-free?' => 'Yes.',
	'Are your products non-GMO/organic?' => 'Yes.',
	'Are your products safe to take with medications?' => 'Please consult with a certified healthcare professional before trying any supplement if you are currently taking a medication or have a known medical condition.',
	'Do you have samples?' => 'Not at this time.',
);
?>
<main id="MainContent" class="content-for-layout focus-none about-page" role="main">
	<section class="about-faqs catakor-faq-page" aria-labelledby="faq-page-title">
		<div class="about-faq-heading"><span class="about-kicker">FAQs</span><h1 id="faq-page-title">Frequently Asked Questions</h1><span class="about-faq-arrow" aria-hidden="true">↳</span><button type="button" data-toggle-all-faqs>View All</button></div>
		<div class="about-faq-list" data-about-faqs><?php $number = 0; foreach ( $questions as $question => $answer ) : $number++; ?><details><summary><span><?php echo esc_html( sprintf( '%02d.', $number ) ); ?></span><b><?php echo esc_html( $question ); ?></b><i aria-hidden="true">⌄</i></summary><p><?php echo esc_html( $answer ); ?></p></details><?php endforeach; ?></div>
	</section>
</main>
<?php get_footer(); ?>
