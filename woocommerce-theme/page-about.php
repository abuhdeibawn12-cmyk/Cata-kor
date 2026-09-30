<?php
/**
 * Original Catakor About page.
 *
 * @package Catakor_Original
 */
get_header();
$questions = array(
	'How long does it take to see results from dietary supplements?' => 'The time to experience results varies based on the supplement and individual factors. Consistency in usage is key. Some may notice changes quickly, while others may require more time.',
	'Are there potential side effects of dietary supplements?' => 'While most people tolerate supplements well, side effects can occur. Report any adverse reactions to a healthcare provider.',
	'How does Cata-Kor ensure the quality of its ingredients?' => 'We source ingredients carefully and use rigorous testing and industry-leading quality standards.',
	'Are your products gluten-free?' => 'Yes.',
	'Are your products non-GMO/organic?' => 'Yes.',
	'Are your products safe to take with medications?' => 'Please consult a certified healthcare professional before use if you take medication or have a known medical condition.',
	'Do you have samples?' => 'Not at this time.',
);
?>
<main id="MainContent" class="content-for-layout focus-none about-page" role="main">
	<section class="about-hero" aria-labelledby="about-hero-title">
		<div class="about-hero-copy"><div>
			<h1 id="about-hero-title">Take Charge of Your Aging History!</h1>
			<p>Experience high-quality ingredients that fuel your body and mind, support your health and fitness goals, and help you to surpass your limits.</p>
			<a href="<?php echo esc_url( wc_get_page_permalink( 'shop' ) ); ?>">SHOP NOW</a>
		</div></div>
		<div class="about-hero-image"><img src="<?php echo esc_url( catakor_original_asset( 'about-hero.jpg' ) ); ?>" alt="An active woman standing confidently on a beach" width="1200" height="800"></div>
	</section>

	<section class="about-story" aria-labelledby="about-story-title">
		<div class="about-story-inner">
			<span class="about-kicker">Liposomal</span>
			<h2 id="about-story-title">The Genesis of Cata-Kor: A Journey to Transform Lives</h2>
			<p>Meet Cata-Kor, a brand of dietary supplements on a mission to make a genuine impact.</p>
			<p>More than a brand, Cata-Kor is a community—a community committed to healthier, vibrant lives. From groundbreaking formulations in our lab, to positive impacts in households, our brand embodies the transformative power of scientific precision at a cellular level. With the customer’s health and well-being at the forefront of our approach, each of our products undergo rigorous third-party testing to ensure the highest standards of quality, safety, and effectiveness are met.</p>
			<p>Today, Cata-Kor is a catalyst for change, inspiring individuals to embrace a healthier life through the marriage of science and wellness.</p>
		</div>
	</section>

	<section class="about-faqs" aria-labelledby="about-faq-title">
		<div class="about-faq-heading">
			<span class="about-kicker">FAQs</span>
			<h2 id="about-faq-title">Frequently Asked Questions</h2>
			<span class="about-faq-arrow" aria-hidden="true">↳</span>
			<button type="button" data-toggle-all-faqs>View All</button>
		</div>
		<div class="about-faq-list" data-about-faqs>
			<?php $number = 0; foreach ( $questions as $question => $answer ) : $number++; ?>
				<details>
					<summary><span><?php echo esc_html( sprintf( '%02d.', $number ) ); ?></span><b><?php echo esc_html( $question ); ?></b><i aria-hidden="true">⌄</i></summary>
					<p><?php echo esc_html( $answer ); ?></p>
				</details>
			<?php endforeach; ?>
		</div>
	</section>
</main>
<?php get_footer(); ?>
