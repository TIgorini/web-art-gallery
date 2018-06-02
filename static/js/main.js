var gallery = new Vue({
    el: '#primary',
    data: {
        images: [],
        edit: false,
        upload_form: false,
    },
    created () {
        fetch('../images.json')
            .then(response => response.json())
            .then(json => {
                this.images = json.data
            })
    },
    methods:{
        remove: function(event){
            var index
            var src
            var id = event.target.id.substr(2)
            this.images.forEach(function(img, indx){
                if (id == img.id){
                    index = indx
                    src = img.src
                    return
                }
            })
            this.images.splice(index, 1)
            $.post('remove', {
                'data':JSON.stringify({"data":this.images}, null, 4),
                'id':id,
                'src':src
            })
        },
        add: function(event){
            event.preventDefault()
            form = document.getElementById('upload_form')
            var formData = new FormData(form)
            $.ajax({
                url: 'upload',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(data){
                    updateVue(data)
                }
            })
        }
    }
})


function updateVue(data){
    gallery.edit = false
    gallery.upload_form = false
    gallery.images.push(data)
}
