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
	wp_register_style( 'fonts', '//fonts.googleapis.com/css?family=Merriweather%3A400%2C900italic%2C900%2C700italic%2C700%2C400italic%2C300italic%2C300%7CDomine%3A400%2C700%7CNoto+Serif%3A400%2C700%2C400italic%2C700italic%7COpen+Sans%3A300italic%2C400italic%2C600italic%2C700italic%2C800italic%2C400%2C300%2C600%2C700%2C800', array(), '', 'all');
	wp_register_style( 'sitecss', get_template_directory_uri() . '/css/site/site.min.css', array('bootstrap') );

	wp_register_script( 'ls-jquery-js', get_template_directory_uri() . '/js/vendor/jquery/jquery-1.11.3.min.js' );
	wp_register_script( 'ls-bootstrap-js', get_template_directory_uri() . '/js/vendor/bootstrap/bootstrap.min.js', array('ls-jquery-js'), '20150610', true );
	wp_register_script( 'ls-jquery-matchHeight-js', get_template_directory_uri() . '/js/vendor/jquery.matchHeight/jquery.matchHeight.js', array('ls-jquery-js'), '20150718', true);
	wp_register_script( 'ls-site-js', get_template_directory_uri() . '/js/lib/site.min.js', array('ls-jquery-js', 'ls-jquery-matchHeight-js'), '20150610', true );

	wp_enqueue_script( 'ls-jquery-js' );
	wp_enqueue_script( 'ls-bootstrap-js' );
	wp_enqueue_script( 'ls-site-js' );

	wp_enqueue_style( 'bootstrap' );
	wp_enqueue_style( 'fonts' );
	wp_enqueue_style( 'sitecss' );
}

add_action( 'wp_enqueue_scripts', 'lifespan_scripts' );


// Register Custom Post Type
function custom_post_offering() {

	$labels = array(
		'name'                => _x( 'Offerings', 'Post Type General Name', 'offering' ),
		'singular_name'       => _x( 'Offering', 'Post Type Singular Name', 'offering' ),
		'menu_name'           => __( 'Offerings', 'offering' ),
		'name_admin_bar'      => __( 'Offerings', 'offering' ),
		'parent_item_colon'   => __( 'What We Do', 'offering' ),
		'all_items'           => __( 'All Offerings', 'offering' ),
		'add_new_item'        => __( 'Add New Offering', 'offering' ),
		'add_new'             => __( 'Add New', 'offering' ),
		'new_item'            => __( 'New Offering', 'offering' ),
		'edit_item'           => __( 'Edit Offering', 'offering' ),
		'update_item'         => __( 'Update Offering', 'offering' ),
		'view_item'           => __( 'View Offering', 'offering' ),
		'search_items'        => __( 'Search Offerings', 'offering' ),
		'not_found'           => __( 'Not found', 'offering' ),
		'not_found_in_trash'  => __( 'Not found in Trash', 'offering' ),
	);
	$rewrite = array(
		'slug'                => 'what-we-offer',
		'with_front'          => false,
		'pages'               => true,
		'feeds'               => true,
	);
	$args = array(
		'label'               => __( 'offering', 'offering' ),
		'description'         => __( 'Lifespan Offerings', 'offering' ),
		'labels'              => $labels,
		'supports'            => array( 'title', 'page-attributes', 'post-formats', ),
		'hierarchical'        => false,
		'public'              => true,
		'show_ui'             => true,
		'show_in_menu'        => true,
		'menu_position'       => 5,
		'show_in_admin_bar'   => true,
		'show_in_nav_menus'   => true,
		'can_export'          => true,
		'has_archive'         => false,
		'exclude_from_search' => false,
		'publicly_queryable'  => true,
		'rewrite'             => $rewrite,
		'capability_type'     => 'page',
	);
	register_post_type( 'offering', $args );

}

// Hook into the 'init' action
add_action( 'init', 'custom_post_offering', 0 );

// add_filter('post_link', 'rating_permalink', 10, 3);
// add_filter('post_type_link', 'rating_permalink', 10, 3);

function offering_permalink($permalink, $post_id, $leavename) {
    if (strpos($permalink, '%what-we-offer%') === FALSE) return $permalink;

        // Get post
        $post = get_post($post_id);
        if (!$post) return $permalink;

        // Get taxonomy terms
        $terms = wp_get_object_terms($post->ID, 'offering');
        if (!is_wp_error($terms) && !empty($terms) && is_object($terms[0])) $taxonomy_slug = $terms[0]->slug;
        else $taxonomy_slug = 'not-rated';

    return str_replace('%what-we-offer%', $taxonomy_slug, $permalink);
}

add_action('nav_menu_css_class', 'add_current_nav_class', 10, 2 );

function add_current_nav_class($classes, $item) {

	// Getting the current post details
	global $post;

	// Getting the post type of the current post
	$current_post_type = get_post_type_object(get_post_type($post->ID));
	$current_post_type_slug = $current_post_type->rewrite[slug];

	// Getting the URL of the menu item
	$menu_slug = strtolower(trim($item->url));

	// If the menu item URL contains the current post types slug add the current-menu-item class
	if (strpos($menu_slug,$current_post_type_slug) !== false) {

		 $classes[] = 'current-menu-item';

	}

	// Return the corrected set of classes to be added to the menu item
	return $classes;

}

add_theme_support( 'menus' );
if ( function_exists( 'register_nav_menus' ) ) {
  	register_nav_menus(
  		array(
  		  'menu_slug' => 'ls-main',
  		)
  	);
}



function createAnchor($str) {
    $str = iconv('UTF-8', 'ASCII//TRANSLIT', $str); // Remove Non-Latin chars.
    $str = preg_replace('/[^A-Za-z0-9\-]/', '', $str); // Removes special chars.
    $str = strtolower($str);
    return $str;
}


?>
