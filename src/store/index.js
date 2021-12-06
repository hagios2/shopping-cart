import Vuex from 'vuex'
import Vue from 'vue'
import shop from '@/api/api'


Vue.use(Vuex)

export default new Vuex.Store({
    state: { // data
        products: [],
        
        cart: []
    },
    getters: { // computed 
        availableProducts(state, getters) {
            return state.products.filter(product => product.inventory > 0)
        },

        cartProducts (state, getters) {
            return state.cart.map(cartItem => {
                const product = state.products.find(product => product.id === cartItem.id)

                return {
                    title: product.title,
                    price: product.price,
                    quantity: cartItem.quantity,
                    id: product.id
                }
            })
        },

        cartTotal (state, getters) {

            return getters.cartProducts.reduce((total, product) => total + product.price * product.quantity, 0)
        }
    },
    actions: { //methods

        fetchProducts ({commit}) {

            return new Promise((resolve, reject) => {

                shop.getProducts(products => {

                    commit('setProducts', products)
                    
                    resolve()
                })  
            })
        },

        addProductToCart(context, product) {

            if (product.inventory > 0) {

                const cartItem = context.state.cart.find(item => item.id === product.id)

                if (!cartItem) {
                    context.commit('pushProductToCart', product.id)
                } else {
                    context.commit('incrementCartItem', cartItem)
                }
                
                context.commit('decrementProductInventory', product)
            }
        }
    },

    mutations: { // seting or updating state  
        setProducts (state, products) {
            state.products = products
        },

        pushProductToCart (state, productId) {

            state.cart.push({
                id: productId,
                quantity: 1 

            })
        },

        incrementCartItem (state, cartItem) {
            cartItem.quantity++
        },

        decrementProductInventory (state, product) {
            product.inventory--
        }
    }
})