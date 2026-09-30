<?php
/**
 * Original Catakor Science and Quality page.
 *
 * @package Catakor_Original
 */
get_header();
$reviews = array(
	array( 'science-review-stefano.jpg', 'Stefano Barberi', 'Professional Mountain Bike and Gravel Racer', 'In the two weeks since I started using it, I’ve noticed my recovery feels smoother.*' ),
	array( 'science-review-zach.png', 'Zach Calls', 'Doctor of Physical Therapy', 'Cata-Kor NAD+ has become one of my go-to supplements for supporting overall energy, recovery, and longevity.*' ),
	array( 'science-review-stephania.jpg', 'Stephania Rene', 'Personal Trainer', 'I’m so thankful I found such a high quality company to trust with their third party testing efforts!*' ),
	array( 'science-review-katie.png', 'Katie Blank', 'Orthopedic Physical Therapist', 'I recommend Cata-Kor NAD+ due to the high quality ingredients and concentration of NAD+.*' ),
	array( 'science-review-maria.jpg', 'Dr. Maria Sophocles', 'Gynecologist and Women’s Health Advocate', 'Cata-Kor’s liposomal NAD+ formulation is an important distinction when considering an NAD+ formulation.*' ),
	array( 'science-review-nicole.jpg', 'Dr. Nicole Avena', 'Nutrition Expert and Author, Cata-Kor Partner', 'I recognize the importance of NAD+ in the human body. NAD+ plays an essential role in the process of energy production.*' ),
	array( 'science-review-cyntia.png', 'Dr. Cyntia Brown', 'Clinical Pharmacologist and Women’s Health Expert', 'What really stands out to me about Cata-Kor NAD+ is its dedication to science and transparency.*' ),
	array( 'science-review-sidney.png', 'Sidney Outlaw', 'Professional Fighter', 'It helps you calm everything down. This is a great product. Don’t waste your time. Give it a try.*' ),
	array( 'science-review-chelsea.png', 'Dr. Chelsea Azarcon', 'Naturopathic Medical Doctor', 'Cata-Kor NAD was the first NAD that I felt a significant improvement from taking, within a matter of weeks.*' ),
	array( 'science-review-shayna.png', 'Shayna Powless', 'Professional Cyclist', 'I’ve been choosing to supplement with NAD+ due to its role in efficient cellular energy production and overall cellular wellness.*' ),
);
$science_questions = array(
	'How long does it take to see results from dietary supplements?',
	'Are there potential side effects of dietary supplements?',
	'What makes this supplement unique?',
	'Are your products gluten-free?',
	'Are your products non-GMO/organic?',
	'Are your products safe to take with medications?',
	'Do you have samples?',
);
?>
<main id="MainContent" class="content-for-layout focus-none science-page" role="main">
	<section class="science-coa-section" id="coa"><div class="science-page-container science-coa-grid">
		<div class="science-coa-copy"><span class="science-kicker">COA</span><h1>Certificate of Analysis (COA)</h1><p>As part of our commitment to quality and transparency, we provide official Certificates of Analysis issued by independent third-party laboratories to verify purity, potency, and safety.</p></div>
		<div class="science-product-grid">
			<article class="science-product-card"><a class="science-product-image" href="<?php echo esc_url( wc_get_page_permalink( 'shop' ) ); ?>"><img src="<?php echo esc_url( catakor_original_asset( 'science-nad-core.png' ) ); ?>" alt="NAD+ Core LipoNAD 250mg" width="900" height="900"></a><a class="science-product-name" href="<?php echo esc_url( wc_get_page_permalink( 'shop' ) ); ?>">NAD⁺ Core LipoNAD™ 250mg</a><a class="science-pill-button" href="<?php echo esc_url( catakor_original_asset( 'science-coa-nad-core.jpg' ) ); ?>" target="_blank" rel="noopener">COA CERTIFICATE</a></article>
			<article class="science-product-card"><a class="science-product-image" href="<?php echo esc_url( home_url( '/product/liposomal-nad%e2%81%ba/' ) ); ?>"><img src="<?php echo esc_url( catakor_original_asset( 'product-nad-hq.png' ) ); ?>" alt="NAD+ Advanced LipoNAD 500mg" width="900" height="900"><span>Sale</span></a><a class="science-product-name" href="<?php echo esc_url( home_url( '/product/liposomal-nad%e2%81%ba/' ) ); ?>">NAD⁺ Advanced LipoNAD™ 500mg</a><p>Daily cellular energy*</p><a class="science-pill-button" href="<?php echo esc_url( catakor_original_asset( 'science-coa-nad-advanced.jpg' ) ); ?>" target="_blank" rel="noopener">COA CERTIFICATE</a></article>
		</div>
	</div></section>

	<section class="science-feature science-feature-nmn"><div class="science-page-container science-feature-grid"><div class="science-feature-art"><img src="<?php echo esc_url( catakor_original_asset( 'science-nmn.png' ) ); ?>" alt="Cata-Kor NMN Supplement" width="1200" height="1200"></div><div class="science-feature-copy"><h2>Cata-Kor NMN Supplement</h2><p>Cata-Kor’s NMN Supplement with Resveratrol, TMG and Quercetin is a high-purity NAD+ supplement designed to support cellular energy and healthy aging.</p><a class="science-pill-button" href="<?php echo esc_url( catakor_original_asset( 'science-coa-nmn.png' ) ); ?>" target="_blank" rel="noopener">COA CERTIFICATE</a></div></div></section>
	<section class="science-feature science-feature-akg"><div class="science-page-container science-feature-grid"><div class="science-feature-copy"><h2>CA AKG</h2><p>AKG supports lasting energy, biotin supports hair, skin, and nails, and MSM supports comfortable movement—designed as a thoughtful daily nudge toward feeling strong and balanced.</p><a class="science-pill-button" href="<?php echo esc_url( catakor_original_asset( 'science-coa-ca-akg.png' ) ); ?>" target="_blank" rel="noopener">COA CERTIFICATE</a></div><div class="science-feature-art"><img src="<?php echo esc_url( catakor_original_asset( 'science-ca-akg.png' ) ); ?>" alt="Cata-Kor CA AKG supplement" width="1200" height="1200"></div></div></section>
	<section class="science-quality-section" id="quality"><div class="science-page-container science-quality-grid"><div class="science-quality-copy"><span class="science-kicker">Liposomal</span><h2>Science and Quality</h2><p>In a preclinical animal study, our LipoNAD™ preserved NAD+ levels in the liver at 9.31x higher than regular NAD+.**</p><a class="science-pill-button" href="<?php echo esc_url( catakor_original_asset( 'science-liponad-study.pdf' ) ); ?>" target="_blank" rel="noopener">READ THE SCIENTIFIC STUDY</a></div><img class="science-quality-chart" src="<?php echo esc_url( catakor_original_asset( 'science-bioavailability.png' ) ); ?>" alt="Liposomal NAD+ test results" width="1000" height="700"></div></section>

	<section class="science-reviews-section" data-science-reviews>
		<div class="science-review-track" data-review-track><?php foreach ( $reviews as $index => $review ) : ?><article class="science-review-card" data-science-review-card><img src="<?php echo esc_url( catakor_original_asset( $review[0] ) ); ?>" alt="<?php echo esc_attr( $review[1] ); ?>" width="900" height="900"><h3><?php echo esc_html( $review[1] ); ?></h3><span><?php echo esc_html( $review[2] ); ?></span><p>&ldquo;<?php echo esc_html( $review[3] ); ?>&rdquo;</p><small><?php echo esc_html( ( $index + 1 ) . ' / ' . count( $reviews ) ); ?></small></article><?php endforeach; ?></div>
		<div class="science-review-controls"><button type="button" data-review-scroll="-1" aria-label="Previous reviews">&larr;</button><div class="science-review-dots" aria-label="Choose a review"><?php foreach ( $reviews as $index => $review ) : ?><button type="button" class="<?php echo 0 === $index ? 'is-active' : ''; ?>" data-science-review-go="<?php echo esc_attr( $index ); ?>" aria-label="Go to <?php echo esc_attr( $review[1] ); ?> review"></button><?php endforeach; ?></div><button type="button" data-review-scroll="1" aria-label="Next reviews">&rarr;</button></div>
		<p class="science-review-disclosure">*These individuals partner with Cata-Kor as compensated endorsers, sharing their personal opinions and experiences.</p>
	</section>
	<section class="science-video-section"><video controls playsinline poster="<?php echo esc_url( catakor_original_asset( 'science-video-poster.jpg' ) ); ?>" preload="metadata"><source src="<?php echo esc_url( catakor_original_asset( 'science-nad-story.mp4' ) ); ?>" type="video/mp4">Your browser does not support HTML video.</video></section>
	<section class="science-faq-section" id="science-faq"><div class="science-faq-heading"><span class="science-kicker">FAQs</span><h2>Questions We Receive Often</h2><a class="science-pill-button" href="#science-faq-list">VIEW ALL</a></div><div class="science-faq-list" id="science-faq-list"><?php foreach ( $science_questions as $index => $question ) : ?><details class="science-faq-item"><summary><span><?php echo esc_html( sprintf( '%02d.', $index + 1 ) ); ?></span><b><?php echo esc_html( $question ); ?></b><i>⌄</i></summary><p>Individual results and circumstances vary. Follow the product label and consult a qualified healthcare professional when appropriate.</p></details><?php endforeach; ?></div></section>
</main>
<?php get_footer(); ?>
