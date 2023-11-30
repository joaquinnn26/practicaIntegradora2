import { cartsModel } from "../db/models/carts.model.js";
class CartsManager {
    async createCart() {
        const result = await cartsModel.create({products: []});
        return result;
    }


    async getCartProducts(cid) {
        const result = await cartsModel.findById(cid).populate("products.product");
        return result;                    
    }


    async addProductToCart(cid, pid){
        const selectedCart = await cartsModel.findById(cid);        
        const productIndex = selectedCart.products.findIndex(p => p.product.equals(pid));
    
            if (productIndex === -1) {

                selectedCart.products.push({
                    product:pid,
                    quantity: 1,
                });
                
            } else {
                selectedCart.products[productIndex].quantity++;
            }
            await selectedCart.save()
            return selectedCart

        }
        async deleteProduct(cid,pid){
            const selectedCart = await cartsModel.findById(cid);
            const productIndex = selectedCart.products.findIndex(p => p.product.equals(pid));
            if (productIndex !== -1) {
                // Si se encontró el producto en el carrito, elimínalo del array de items
                selectedCart.products.splice(productIndex, 1);
            } else {
                console.log('El producto no se encontró en el carrito.');
            }
            await selectedCart.save()
            return selectedCart;
        }
        async updateAllProducts(cid, arr){
            const selectedCart = await cartsModel.findById(cid)
            const newProducts = arr
            selectedCart.products = newProducts
            await selectedCart.save()
            return selectedCart
        }
        async updateProductQuantity(cid, pid, quant){
            const selectedCart = await cartsModel.findById(cid)
            const productIndex = selectedCart.products.findIndex(p => p.product.equals(pid));
            const newQuantity = quant
            if (productIndex !== -1) {
                selectedCart.products[productIndex].quantity = newQuantity
            }        
            await selectedCart.save()
            return selectedCart
        }

        async deleteAllProducts(cid){
            const selectedCart = await cartsModel.findById(cid)        
            selectedCart.products = []        
            await selectedCart.save()
            return selectedCart
        }

    }    


export const cManager = new CartsManager();