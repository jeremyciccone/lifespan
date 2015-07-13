<?php
/**
 * The main template file.
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 * Learn more: http://codex.wordpress.org/Template_Hierarchy
 *
 * @package LifeSpan
 */

 get_template_part('partials/head'); ?>

 <?php get_template_part('partials/header'); ?>

  <div id="primary" class="content-area">
    <main id="main" class="site-main" role="main">
      <div style="display:block;min-height:3000px;  background: linear-gradient(red, blue);">
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

      <?php if ( have_posts() ) : ?>

              <?php /* Start the Loop */ ?>
              <?php while ( have_posts() ) : the_post(); ?>
                <?php
                  /* Include the Post-Format-specific template for the content.
                   * If you want to override this in a child theme, then include a file
                   * called content-___.php (where ___ is the Post Format name) and that will be used instead.
                   */
                  get_template_part( 'content', get_post_format() );
                ?>
              <?php endwhile; ?>

      <?php else : ?>
        <?php get_template_part( 'content', 'none' ); ?>
      <?php endif; ?>

    </main><!-- #main -->
  </div><!-- #primary -->

<?php get_template_part('partials/footer'); ?>
</body>
</html
