<?

/**
 * Adds Global Options Page to Left Nav of Admin
 */
if( function_exists('acf_add_options_page') ) {
	acf_add_options_page(array(
		'page_title' 	=> 'Global Settings',
		'menu_title'	=> 'Global Settings',
		'menu_slug' 	=> 'global-settings',
		'capability'	=> 'edit_posts',
		'redirect'		=> false
	));
}


/**
 * Add Styles and Scripts
 */
function lifespan_scripts() {
	wp_register_style( 'bootstrap', get_template_directory_uri() . '/css/vendor/bootstrap/bootstrap.min.css', array(), '', 'all' );
	wp_register_style( 'sitecss', get_template_directory_uri() . '/css/site/site.min.css', array('bootstrap') );

	wp_register_script( 'ls-jquery-js', get_template_directory_uri() . '/js/vendor/jquery/jquery-1.11.3.min.js' );
	wp_register_script( 'ls-bootstrap-js', get_template_directory_uri() . '/js/vendor/bootstrap/bootstrap.min.js', array('ls-jquery-js'), '20150610', true );
	wp_register_script( 'ls-site-js', get_template_directory_uri() . '/js/lib/site.min.js', array('ls-jquery-js'), '20150610', true );


	wp_enqueue_script( 'ls-jquery-js' );
	wp_enqueue_script( 'ls-bootstrap-js' );
	wp_enqueue_script( 'ls-site-js' );

	wp_enqueue_style( 'bootstrap' );
	wp_enqueue_style( 'sitecss' );
}

add_action( 'wp_enqueue_scripts', 'lifespan_scripts' );

?>
