var show = new Vue({
    el: '#show',
    data: {
        images: [],
        picIndex: 0,
        repeat: false,
        delay: 1000
    },
    created () {
        fetch('../images.json')
            .then(response => response.json())
            .then(json => {
                this.images = json.data
            })
            .then(() => {
                this.nextPicture(0)
            })
    },
    methods: {
        nextPicture: function(step) {
            this.showPicture(this.picIndex += step)
        },

        showPicture: function(n){
            len = this.images.length
            if (this.repeat){
                if (n > len - 1) {this.picIndex = 0}
                if (n < 0) {this.picIndex = len - 1}
            } else {
                if (n >= len - 1) {
                    this.slideshow(false)
                    this.picIndex = len - 1
                }
                if (n < 0) {this.picIndex = 0}
            }
            $('img').hide()
            $('#img' + this.images[this.picIndex].id).show()
        },

        slideshow: function (){
            var inter
            return function (play){
                if (play) {
                    if (this.delay < 1000) {
                        this.delay = 1000
                    }
                    inter = setInterval(this.nextPicture, this.delay, 1)
                    $('#play').hide()
                    $('#pause').show()
                } else {
                    clearInterval(inter)
                    $('#play').show()
                    $('#pause').hide()
                }
            }
        }(),

        setRepeat: function(){
            $('#repeat-icon').toggleClass('no-repeat-icon')
            $('#repeat-icon').toggleClass('repeat-icon')
            this.repeat = !this.repeat
        }
    }
})

$('#img0').ready(function(){
    $(this).css('display', 'block')
})