$('.year').text((new Date()).getFullYear());

$('.menu a').on('click', function(e){
  e.preventDefault();
  console.log('click');
  $(this).parents('ul.nav').toggleClass('show');
});

$(window).on('resize', function(e) {
  if($(window).width() > 767) {
    $('ul.nav').removeClass('show');
  }
});

$('header').on('affix.bs.affix', function() {
  $('.wrapper').addClass('affixed');
});

$('header').on('affix-top.bs.affix', function() {
  $('.wrapper').removeClass('affixed');
});

$('.equal-heights').matchHeight();

// $('.description').each(function() {
//   $(this).css('height', $(this).children('p').height());
//   $(this).css('width', $(this).children('p').width());
// });

$('.detail-title-control').on('click', function(e) {
  e.preventDefault();
  var slug = $(e.target).data('control');
  console.log(slug);
  $(this).parents('.offering-wrapper').find('.detail-title').removeClass('open');
  current = $('[data-parent="'+slug+'"]').addClass('open');
  $(current).parent().css('height', $(current).height());
  $(this).parents('.offering-wrapper').find('.description').addClass('hidden');
});
