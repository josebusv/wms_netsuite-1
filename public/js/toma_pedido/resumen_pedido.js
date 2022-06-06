$(window).on('scroll', function () {
    posiciona()
});

function posiciona() {
    let altura_card = $('#card-scroll').outerHeight(true);

    if ($(window).scrollTop() >= altura_card && $(window).scrollTop() >= 20) {
        $('#card-scroll').addClass('fixed-carding');
        $('#varbtns').addClass('fixedvar');

    } else {
        $('#card-scroll').removeClass('fixed-carding');
        $('#varbtns').removeClass('fixedvar');
    }
}
