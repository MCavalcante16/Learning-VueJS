Vue.component('productDetails', {
    props: {
        new: {
            type: Boolean,
            required: true
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
                <p>Sizes</p>
                <ul>
                    <li v-for="size in sizes">{{ size }}</li>
                </ul>
            </div>

            <div id="buyDiv">
                <button id="addButton" v-on:click="addToCart" :disabled="!inStock" > <strong> Add to Cart </strong> </button>
                <button id="removeButton"  v-on:click="removeFromCart" :disabled="!inCart" ><strong> Remove one from cart </strong></button>
            </div>
        </div>
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
            sizes: ["P", "M", "G"],
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
        }
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