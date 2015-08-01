$(function() {
    console.log('user.js');

    // Keywords submission

    $('form').submit(function(e) {
        e.preventDefault()
        var $this = $(this)
        $.post($this.attr('action'), $this.serialize(), function(data) {
            location.reload();
        }).fail(function() {
            alert('fail');
        });
    });

    // Start / Stop bot
    $('#botStartStop').on('click', function() {
        // show ajax spinner
        $('.spinner').show()
        $.post('/user/bot', {
            status: $(this).attr('data-bot')
        })
            .done(function(result) {
                console.log(result)
            })
            .error(function() {

            })
            .always(function() {
                location.reload();
            })
    });

    // Refresh page every 5 seconds
    // setInterval(function() {
    //     location.reload()
    // }, 10 * 1000)    
});