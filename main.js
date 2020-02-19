Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">
        <h3> Make Your Review </h3>

        <p v-if="errors.length">
            <b> Please Correct the following error(s): </b>
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </p>


        <p>
            <label for="name">Name: </label>
            <input id="name" v-model="name">
        </p>

        <p>
            <label for="review">Review: </label>
            <textarea id="review" v-model="review"></textarea>
        </p>
        
        <p>
            <label for="rating">Rating: </label>
            <select id="rating" v-model.number="rating" >
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
            </select>
        </p>

        <p>
            <input type="submit" value="Submit" id="submit" href="#">
        </p>
    </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if(this.name != null && this.review != null && this.rating != null){
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                }
                this.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                while(errors.length) {
                    errors.pop();
                }
            }
            else {
                if(this.name == null){
                    this.errors.push("Name Required.")
                }
                if(this.review == null){
                    this.errors.push("Review Required.")
                }
                if(this.Rating == null){
                    this.errors.push("Rating Required.")
                }
            }
            
        }
    }
})

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true,
        },
    },

    template: `
    <div>
      <div class="product">
        <div class="product-image">
            <a v-bind:href="url">
                <img v-bind:src="image">
            </a>
        </div>

        <div class="product-options">
            <div class="product-info">
                <h1>{{ title }}</h1>
                <p v-if="inStock"> In Stock </p>
                <p v-else-if="almost"> Almost sold out!</p>
                <p v-else> Out of Stock </p>
                
                <p>Frete: {{ Shipping }}</p>

                <ul>
                    <li v-for="detail in details">{{ detail }}</li>
                </ul>

                <div v-for="(variant, index) in variants" 
                    :key="variant.variantId"
                    class="color-box"
                    :style="{ backgroundColor: variant.variantColor }"
                    @mouseover="updateProduct(index)">
                </div>

                <br>
            </div>

            <div id="buyDiv">
                <button id="addButton" v-on:click="addToCart" :disabled="!inStock" > <strong> Add to Cart </strong> </button>
                <button id="removeButton"  v-on:click="removeFromCart" :disabled="!inCart" ><strong> Remove one from cart </strong></button>
            </div>
        </div>

        </div>

      <div id="reviews">
        <h2> Reviews </h2>
        <p v-if="!reviews.length">There are no reviews yet.</p>
        <ul id="review-item" v-for="review in reviews">
            <h4 id="nameReview"> {{ review.name }} </h4>
            <p>Review: {{ review.review }}</p>
            <p>Rating: {{ review.rating }}</p>
        </ul>
      </div>
      

      <product-review @review-submitted="addReview"></product-review>
    </div>

    `,

    data() {
        return {
            brand: "Vue Mastery",
            product: 'Socks',
            selectedVariant: 0,
            onSale: true,
            url: 'https://www.cuecastore.com.br/kit-3-meias-cano-medio-lupo-03245-089-sport-algodao-preta-cinza-chumb-n.html',
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
            variants: [
                {
                    variantId: 2234,
                    variantColor: "green",
                    variantImage: 'https://www.vuemastery.com/images/challenges/vmSocks-green-onWhite.jpg',
                    variantQtd: 11,
                    variantInitQtd: 11
                },
                {
                    variantId: 2235,
                    variantColor: "blue",
                    variantImage: 'https://www.vuemastery.com/images/challenges/vmSocks-blue-onWhite.jpg',
                    variantQtd: 0,
                    variantInitQtd: 0
                }
            ],
            reviews: [],
        }
    },

    methods: {
        addToCart: function () {
            if(this.variants[this.selectedVariant].variantQtd > 0){
                this.variants[this.selectedVariant].variantQtd -= 1
                this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
            }  
        },
        removeFromCart: function () {
            this.variants[this.selectedVariant].variantQtd += 1
            this.$emit('remove-to-cart', this.variants[this.selectedVariant].variantId)
        },
        updateProduct: function (index) {
            this.selectedVariant = index
        },
        addReview: function (productReview) {
            this.reviews.push(productReview)
        },
    },

    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQtd > 0
        },
        inCart() {
            return this.variants[this.selectedVariant].variantQtd < this.variants[this.selectedVariant].variantInitQtd
        },
        Shipping() {
            if(this.premium) {
                return "free"
            }
            return "R$ 2.99"
        }
    }
})

var app = new Vue({
    el: '#app',
    data: {
        premium: false,
        cart: []
    },
    methods: {
        upCart: function(id) {
            this.cart.push(id)
        },
        downCart: function(id) {
            if(this.cart.indexOf(id) != -1) {
                this.cart.splice(this.cart.indexOf(id), 1)
            }
        }
    }
})