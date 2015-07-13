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

$('nav').on('affix.bs.affix', function() {
  $('#primary').toggleClass('affixed');
});

$('nav').on('affix-top.bs.affix', function() {
  if($(this).hasClass('affixed')) {
    $('#primary').removeClass('affixed');
  }
});
