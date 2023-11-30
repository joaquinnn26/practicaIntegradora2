import { Router } from "express";
import { cManager } from "../managers/cartManagerMongo.js";
import { manager } from "../managers/productManagerMongo.js";
const router = Router();

// router.get("/", (req, res) => {
//   res.render("cookies");
// });
router.get("/api/views/products", async (req, res) => {  
  try {
    if (!req.session.passport) {
      res.redirect("/login")
    }
      const products = await manager.findAll(req.query)
      const {payload, info, page, limit, order, query} = products
      const { nextPage, prevPage } = info
      const {category} = query
      /* res.render("catalogue", {payload}); */
      const productObject = payload.map(doc => doc.toObject()); 
      
      res.render('catalogue', { productList: productObject, category, page: page, limit: limit, order: order, nextPage: nextPage, prevPage:prevPage, style: "style" });
      console.log(payload)     
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

router.get('/api/views/products/:id', async (req, res) => {  
  try {
      const { id } = req.params
      const product = await manager.findById(id)              
      res.render('product', { product: product.toObject(), style: "productDetail" });           
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});



router.get('/api/views/cart/:cid', async (req, res) => {  
  try {
    const { cid } = req.params
    const response = await cManager.getCartProducts(cid)
    const array = response.products.map(doc => doc.toObject());    
    res.render('cart', {cartProductList: array,  style: "cart" })
}
catch (error){
    res.status(500).json({ message: error.message });
}
})




//login
router.get("/login", (req, res) => {
  if (req.session.passport) {
    return res.redirect("/api/views/products");
  }
  res.render("login",{style: "login"});
});

router.get("/signup", (req, res) => {
  if (req.session.passport) {
    return res.redirect("/catalogue");
  }
  res.render("signup");
});

router.get("/catalogue",async (req, res) => {
  if (!req.session.passport) {
    return res.redirect("/login");
  }
  try {
      const products = await manager.findAll(req.query)
      const {payload, info, page, limit, order, query} = products
      const { nextPage, prevPage } = info
      const {category} = query
      /* res.render("catalogue", {payload}); */
      const productObject = payload.map(doc => doc.toObject());
  const { first_name, email } = req.user;
  
  res.render("catalogue", {  productList: productObject, category, page: page, limit: limit, order: order, nextPage: nextPage, prevPage:prevPage, style: "style"  ,user: { first_name, email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

});

router.get("/restaurar", (req, res) => {
  res.render("restaurar");
});

router.get("/error", (req, res) => {
  res.render("error");
});


export default router;
