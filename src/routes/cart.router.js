import { Router } from "express";
import { cManager } from "../managers/cartManagerMongo.js";

const router = Router();

/* CREATE CART */
router.post('/', async (req, res)=>{
    try {        
        const response = await cManager.createCart()
        res.status(200).json({message: 'Cart created', cart: response })
    }
    catch (error){
        res.status(500).json({ message: error.message });
    }
})



/* ADD PRODUCT TO CART */
router.post('/:cid/products/:pid', async (req, res) =>{    
    try{
        const {cid, pid} = req.params        
        const response = await cManager.addProductToCart(cid, pid)        
        res.status(200).json({message: "Product added to cart", productAdded: response})        
    console.log(response)
    }

    catch(error){
        res.status(500).json({ message: error.message });
    }
})




/* GET CART */
router.get('/:cid', async (req, res)=>{
    try {
        const { cid } = req.params
        const response = await cManager.getCartProducts(cid)      
        res.status(200).json({message: 'Cart founded', cartProducts: response.products });
    }
    catch (error){
        res.status(500).json({ message: error.message });
    }
})

/*DELETE PRODUCT */

router.delete('/:cid/products/:pid',async (req,res)=>{
    try {
        const { cid , pid } = req.params
        const cart = await cManager.deleteProduct(cid,pid)
        res.status(200).json({message: 'product deleted', cart  })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

//UPDATE CART PRODUCTS ARRAY
router.put('/:cid', async (req, res)=>{
    try {
        const { cid } = req.params
        const { products } = req.body
        const response = await cManager.updateAllProducts(cid, products)        
        res.status(200).json({ message: 'Products updated', cart: response })
    }
    catch (error){
        res.status(500).json({ message: error.message });
    }
})


//DELETE ALL PRODUCTS
router.delete('/:cid', async (req, res) =>{    
    try{
        const { cid } = req.params        
        const response = await cManager.deleteAllProducts(cid)        
        res.status(200).json({message: "Products deleted", cart: response})             
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
})



export default router