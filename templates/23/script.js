//Animation Config
jQuery(document).ready(function($){

    // Define a blank array for the effect positions. This will be populated based on width of the title.
    var emptyArr = [];
    // Define a size array, this will be used to vary bubble sizes
    var bubbleSizeArr = [4,6,8,10];
    //Animation delay.
    var delay = 3000;
    //Bubbles length. How high bubbles should go. More percentage means more height
    var bLength = '100%';

    // Push the header width values to emptyArr
    for (var i = 0; i < $('#bubbly_text').width(); i++) {
        emptyArr.push(i);
    }

    // Function to select random array element
    // Used within the setInterval a few times
    function randomValue(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // setInterval function used to create new bubble every 350 milliseconds
    setInterval(function(){

        // Get a random size, defined as variable so it can be used for both width and height
        var size = randomValue(bubbleSizeArr);
        // New bubble appended to div with it's size and left position being set inline
        // Left value is set through getting a random value from emptyArr
        $('#bubbly_text').append('<div class="bubble" style="left: ' + randomValue(emptyArr) + 'px; width: ' + size + 'px; height:' + size + 'px;"></div>');

        // Animate each bubble to the top (bottom 100%) and reduce opacity as it moves
        // Callback function used to remove finished animations from the page
        $('.bubble').animate({
                'bottom': bLength,
                'opacity' : '-=0.7'
            }, delay, function(){
                $(this).remove()
            }
        );
    }, 350);

});