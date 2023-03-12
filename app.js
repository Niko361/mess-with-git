console.log('hello, vue')

const app = Vue.createApp({
    // data, functions
    //template: '<h2>I am the template</h2>'
    data() {
        return {
            url: 'http://www.thenetninja.co.uk',
            showBooks: true,
            // title: 'The Final Empire',
            // author: 'Brandon Sanderson',
            age: 84,
            x: 0,
            y: 0,
            books: [
                {title: 'name of the wind', author: 'blah'},
                {title: 'shadows', author: 'ayo'},
                {title: 'helllooo', author: 'me'}

            ]
        }
    },
    methods: {
        changeDaniAge(age) {
            // must use "this" to access data
            // this.title = 'Words of Radiance'
            this.age = age
        },
        toggleShowBooks() {
            this.showBooks = !this.showBooks
        },
        handleEvent(event, data) {
            console.log(event, event.type)
            if (data) {
                console.log(data)
            }
        },
        handleMousemove(event) {
            this.x = event.offsetX
            this.y = event.offsetY
        }
    }

})

app.mount('#app')

