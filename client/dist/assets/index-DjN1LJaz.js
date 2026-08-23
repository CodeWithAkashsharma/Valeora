(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))t(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&t(s)}).observe(document,{childList:!0,subtree:!0});function i(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function t(r){if(r.ep)return;r.ep=!0;const o=i(r);fetch(r.href,o)}})();const Pe=[{id:"omega-3-triple",name:"Aurite Omega-3 Triple Strength",tagline:"Heart · Brain · Joints Softgels",category:"Vitality & Brain",price:3999,costPrice:1200,stockQty:42,subscribePrice:3399,rating:4.9,reviewsCount:342,badge:"Best Seller",image:"/images/omega3.jpg",galleryImages:["/images/omega3.jpg","/images/science_capsule.jpg"],servings:"60 Softgels (30-Day Supply)",description:"Pure wild-caught Icelandic fish oil concentrated with 1,200mg EPA and 900mg DHA per serving. Micro-encapsulated for zero fishy burps and maximum cellular absorption.",highlights:["Triple-strength concentration (2,100mg active Omega-3s)","Molecularly distilled & heavy-metal certified pure","Sustainably sourced Friend of the Sea certified","Supports cardiovascular, cognitive & joint longevity"],supplementFacts:{servingSize:"2 Softgels",servingsPerContainer:"30",ingredients:[{name:"Total Calories",amount:"20",dv:"*"},{name:"Total Fat",amount:"2g",dv:"3%"},{name:"Wild Icelandic Fish Oil Concentrate",amount:"2,400mg",dv:"*"},{name:"EPA (Eicosapentaenoic Acid)",amount:"1,200mg",dv:"*"},{name:"DHA (Docosahexaenoic Acid)",amount:"900mg",dv:"*"},{name:"Other Omega-3 Fatty Acids",amount:"150mg",dv:"*"}]}},{id:"magnesium-complex",name:"Aurite Magnesium Complex",tagline:"Nerve & Muscle Support with Vitamin B6",category:"Minerals & Sleep",price:2999,costPrice:850,stockQty:8,subscribePrice:2549,rating:4.95,reviewsCount:418,badge:"Clinical Formulation",image:"/images/magnesium.jpg",galleryImages:["/images/magnesium.jpg"],servings:"90 Tablets (45-Day Supply)",description:"High-absorption triple magnesium blend (Glycinate, Malate, Citrate) enhanced with Active Vitamin B6 (P-5-P) to ease nervous tension, promote deep restorative sleep, and prevent muscle cramps.",highlights:["Chelated Bisglycinate for 4x higher absorption vs oxide","Gentle on stomach with zero laxative effect","Synergistic Pyridoxal-5-Phosphate (Active Vitamin B6)","Promotes GABA activation & muscle relaxation"],supplementFacts:{servingSize:"2 Tablets",servingsPerContainer:"45",ingredients:[{name:"Vitamin B6 (as Pyridoxal-5-Phosphate)",amount:"10mg",dv:"588%"},{name:"Magnesium (from Bisglycinate, Malate & Citrate)",amount:"400mg",dv:"95%"},{name:"Elemental Glycine",amount:"300mg",dv:"*"}]}},{id:"daily-greens",name:"Aurite Daily Wellness Greens Blend",tagline:"Alkalize · Energize · Restore",category:"Daily Greens & Gut",price:4499,costPrice:1400,stockQty:26,subscribePrice:3824,rating:4.88,reviewsCount:289,badge:"Nutraceutical",image:"/images/greens.jpg",galleryImages:["/images/greens.jpg"],servings:"15 Sachets (Net Wt. 150g)",description:"Bioactive organic greens, clinical adaptogens, and digestive enzymes packaged in light-shielded single-serve sachets to maintain potency and taste crisp without synthetic sweetners.",highlights:["42 organic superfoods, spirulina, chlorella & matcha","Full spectrum digestive enzyme matrix","Ashwagandha & Rhodiola stress resilience complex","Zero artificial flavorings, stevia-fresh crisp taste"],supplementFacts:{servingSize:"1 Sachet (10g)",servingsPerContainer:"15",ingredients:[{name:"Organic Alkalizing Greens Matrix",amount:"4,500mg",dv:"*"},{name:"Adaptogenic Resilience Blend",amount:"1,200mg",dv:"*"},{name:"Digestive Enzyme & Prebiotic Fiber",amount:"2,000mg",dv:"*"}]}},{id:"synbiotic-gut",name:"Aurite Synbiotic Gut Restore",tagline:"24-Strain Microbiome & Postbiotic Matrix",category:"Daily Greens & Gut",price:4999,costPrice:1600,stockQty:5,subscribePrice:4249,rating:4.96,reviewsCount:512,badge:"Patent-Pending Tech",image:"/images/science_capsule.jpg",galleryImages:["/images/science_capsule.jpg"],servings:"60 Capsule-In-Capsule (30-Day Supply)",description:"Dual-chamber outer capsule shields 50 Billion CFU probiotics from gastric acid, delivering 24 clinically validated strains intact directly into the lower GI tract.",highlights:["Nested capsule-in-capsule technology (pH 7.4 targeted release)","50 Billion CFU across 24 human probiotic strains","Includes EpiCor postbiotic & PreforPro bacteriophage prebiotics","Requires zero refrigeration (shelf-stable desiccated glass)"],supplementFacts:{servingSize:"2 Capsules",servingsPerContainer:"30",ingredients:[{name:"Probiotic Microbiome Complex (50 Billion CFU)",amount:"350mg",dv:"*"},{name:"PreforPro Prebiotic Matrix",amount:"15mg",dv:"*"},{name:"EpiCor Postbiotic Fermentate",amount:"500mg",dv:"*"}]}}];class Ie{constructor(){this.cart=JSON.parse(localStorage.getItem("aurite_cart")||"[]");const e=JSON.parse(localStorage.getItem("aurite_user")||"null");this.user=e?{name:e.name||"Alex Mercer",email:e.email||"alex@example.com",phone:e.phone||"+91 98765 43210",address:e.address||"Flat 402, Green Glen Heights, HSR Layout",city:e.city||"Mumbai",pincode:e.pincode||"400001",country:e.country||"India",membership:"Aurite Member",memberSince:e.memberSince||"2026"}:null,this.isAdmin=JSON.parse(localStorage.getItem("aurite_is_admin")||"false"),this.products=JSON.parse(localStorage.getItem("aurite_products")||"null"),(!this.products||!Array.isArray(this.products)||this.products.length===0)&&(this.products=[...Pe]),this.products.forEach(i=>{(!i.images||!Array.isArray(i.images)||i.images.length<=1)&&(i.id==="omega-3-triple"?i.images=["/images/omega3.jpg","/images/science_capsule.jpg","/images/hero_banner.jpg","/images/greens.jpg"]:i.id==="magnesium-complex"?i.images=["/images/magnesium.jpg","/images/science_capsule.jpg","/images/hero_banner.jpg","/images/omega3.jpg"]:i.id==="daily-greens"?i.images=["/images/greens.jpg","/images/science_capsule.jpg","/images/hero_banner.jpg","/images/magnesium.jpg"]:i.images=[i.image||"/images/science_capsule.jpg","/images/greens.jpg","/images/hero_banner.jpg","/images/omega3.jpg"]),(!i.highlights||!i.highlights.length)&&(i.highlights=["100% Lab Tested & Verified","Micro-Encapsulated Bio-Delivery","Zero Artificial Additives","Certified Pure & Heavy-Metal Free"])}),this.orders=JSON.parse(localStorage.getItem("aurite_orders")||JSON.stringify([{id:"AUR-9481-2026",customerName:"Alex Mercer",email:"alex@example.com",phone:"+91 98765 43210",address:"742 Evergreen Terrace, Mumbai, 400001",date:"2026-08-05",status:"Processing",items:[{id:"omega-3-triple",name:"Aurite Omega-3 Triple Strength",qty:2,unitPrice:3999,costPrice:1200},{id:"magnesium-complex",name:"Aurite Magnesium Complex",qty:1,unitPrice:2999,costPrice:850}],total:10997},{id:"AUR-8920-2026",customerName:"Dr. Marcus Vance",email:"marcus@cardiology.org",phone:"+91 98123 45678",address:"12 Healthcare Enclave, New Delhi, 110001",date:"2026-08-02",status:"Delivered",items:[{id:"omega-3-triple",name:"Aurite Omega-3 Triple Strength",qty:5,unitPrice:3999,costPrice:1200}],total:19995}])),this.queries=JSON.parse(localStorage.getItem("aurite_queries")||JSON.stringify([{id:"QRY-101",customerName:"Siddharth Malhotra",email:"siddharth@gmail.com",subject:"Dosage query for Magnesium Bisglycinate",message:"Hi, I take this before sleep. Can I combine it with warm milk or should I take it with water?",date:"2026-08-06 14:20",status:"Answered",replies:[{sender:"Admin",text:"Hello Siddharth! You can safely take it with warm milk or water 30 minutes before sleep.",time:"2026-08-06 15:05"}]},{id:"QRY-102",customerName:"Priya Sharma",email:"priya.s@techcorp.io",subject:"Order shipment tracking #AUR-9481",message:"When will my order arrive in Mumbai?",date:"2026-08-07 10:15",status:"Open",replies:[]}])),this.returns=JSON.parse(localStorage.getItem("aurite_returns")||JSON.stringify([{id:"RET-701",orderId:"AUR-8920-2026",productId:"omega-3-triple",productName:"Aurite Omega-3 Triple Strength",customerName:"Dr. Marcus Vance",email:"marcus@cardiology.org",phone:"+91 98123 45678",reason:"Damaged Outer Packaging / Broken Seal",details:"Two bottles had compromised security seals on delivery. Requesting replacement or refund for ₹19,995.",amount:19995,status:"Under Review",date:"2026-08-06",chat:[{sender:"Customer",text:"Two bottles had compromised security seals on delivery. Requesting replacement or refund for ₹19,995.",time:"2026-08-06 14:20"},{sender:"Admin",text:"Hello Dr. Vance! Thank you for informing us. We apologize for the courier transit issue. Our returns department is reviewing your request.",time:"2026-08-06 15:05"}]}])),this.reviews=JSON.parse(localStorage.getItem("aurite_reviews")||JSON.stringify([{id:"REV-001",productId:"omega-3-triple",orderId:"AUR-8920-2026",customerName:"Dr. Marcus Vance",rating:5,text:"Outstanding formulation. The enteric shielding completely eliminates the fishy aftertaste common with other brands. My triglyceride levels have improved significantly.",date:"2026-08-04"},{id:"REV-002",productId:"magnesium-complex",orderId:"AUR-9481-2026",customerName:"Alex Mercer",rating:4,text:"Very effective for muscle recovery after intense workouts. The capsules are a bit large but the bio-availability is definitely noticeable.",date:"2026-08-06"}])),this.users=JSON.parse(localStorage.getItem("aurite_users")||JSON.stringify([{id:"USR-101",name:"Alex Mercer",email:"alex@example.com",phone:"+91 98765 43210",address:"742 Evergreen Terrace, Mumbai, 400001",joinedDate:"2026-01-15",isBlocked:!1,ordersCount:3,totalSpent:28494},{id:"USR-102",name:"Dr. Marcus Vance",email:"marcus@cardiology.org",phone:"+91 98123 45678",address:"12 Healthcare Enclave, New Delhi, 110001",joinedDate:"2026-03-22",isBlocked:!1,ordersCount:2,totalSpent:39990},{id:"USR-103",name:"Priya Sharma",email:"priya.s@techcorp.io",phone:"+91 98450 11223",address:"88 Cyber City Heights, Bangalore, 560001",joinedDate:"2026-05-10",isBlocked:!1,ordersCount:1,totalSpent:4499}])),this.currentRoute="home",this.isCartOpen=!1,this.isAuthOpen=!1,this.isCheckoutOpen=!1,this.quickViewProduct=null,this.couponCode=null,this.discountPercent=0,this._changeFlags={},this._listeners=new Set}subscribe(e){return this._listeners.add(e),()=>this._listeners.delete(e)}_notify(e={}){this._changeFlags=e,this._persist(),this._listeners.forEach(i=>i(this,e))}_persist(){localStorage.setItem("aurite_cart",JSON.stringify(this.cart)),localStorage.setItem("aurite_user",JSON.stringify(this.user)),localStorage.setItem("aurite_is_admin",JSON.stringify(this.isAdmin)),localStorage.setItem("aurite_products",JSON.stringify(this.products)),localStorage.setItem("aurite_orders",JSON.stringify(this.orders)),localStorage.setItem("aurite_queries",JSON.stringify(this.queries)),localStorage.setItem("aurite_returns",JSON.stringify(this.returns)),localStorage.setItem("aurite_reviews",JSON.stringify(this.reviews)),localStorage.setItem("aurite_users",JSON.stringify(this.users))}updateUserAddress(e,i,t,r){if(!this.user)return;this.user.address=e,this.user.city=i,this.user.pincode=t,this.user.country=r||"India";const o=(this.users||[]).find(s=>s.email===this.user.email);o&&(o.address=`${e}, ${i} - ${t}, ${r||"India"}`),this._persist(),this._notify({user:!0})}toggleBlockUser(e){const i=(this.users||[]).find(t=>t.id===e);return i?(i.isBlocked=!i.isBlocked,this.user&&this.user.email===i.email&&i.isBlocked&&(this.user=null),this._notify({users:!0,user:!0}),i):null}loginAdmin(e,i){return(e==="admin@aurite.com"||e==="admin")&&i==="admin123"?(this.isAdmin=!0,this._notify({admin:!0,navbar:!0}),{success:!0}):{success:!1,message:"Invalid Admin Email or Password"}}logoutAdmin(){this.isAdmin=!1,this._notify({admin:!0,navbar:!0})}addProduct(e){this.products.unshift(e),this._notify({products:!0})}updateProduct(e,i){const t=this.products.findIndex(r=>r.id===e);t>-1&&(this.products[t]={...this.products[t],...i},this._notify({products:!0}))}deleteProduct(e){this.products=this.products.filter(i=>i.id!==e),this._notify({products:!0})}updateOrderStatus(e,i){const t=this.orders.find(r=>r.id===e);t&&(t.status=i,this._notify({orders:!0}))}addCustomerQuery(e,i,t,r){const o={id:`QRY-${Math.floor(100+Math.random()*900)}`,customerName:e,email:i,subject:t,message:r,date:new Date().toISOString().replace("T"," ").substring(0,16),status:"Open",replies:[]};this.queries.unshift(o),this._notify({queries:!0})}replyToQuery(e,i){const t=this.queries.find(r=>r.id===e);t&&(t.replies.push({sender:"Admin",text:i,time:new Date().toISOString().replace("T"," ").substring(0,16)}),t.status="Answered",this._notify({queries:!0}))}requestReturn(e,i,t,r,o,s,d){const c=`RET-${Math.floor(100+Math.random()*900)}`,l=this.user?this.user.name:"Valued Customer",p=this.user?this.user.email:"customer@aurite.com",m=d||(this.user?this.user.phone:"+91 98765 43210"),u={id:c,orderId:e,productId:i,productName:t,customerName:l,email:p,phone:m,reason:r,details:o,amount:s||0,status:"Requested",date:new Date().toISOString().substring(0,10),chat:[{sender:"Customer",text:`Return & Refund Request submitted for Order #${e} (${t}).
Reason: ${r}
Details: ${o}
Refund Amount: ₹${Number(s).toLocaleString("en-IN")}`,time:new Date().toISOString().replace("T"," ").substring(0,16)},{sender:"Admin",text:`Your request #${c} has been received. Our returns team will inspect the details and update the decision here. You can discuss the issue with us right here in this chat!`,time:new Date().toISOString().replace("T"," ").substring(0,16)}]};return this.returns||(this.returns=[]),this.returns.unshift(u),this._notify({returns:!0,orders:!0}),{returnId:c}}replyToReturnChat(e,i,t="Admin"){const r=(this.returns||[]).find(o=>o.id===e);r&&(r.chat||(r.chat=[]),r.chat.push({sender:t,text:i,time:new Date().toISOString().replace("T"," ").substring(0,16)}),this._notify({returns:!0}))}updateReturnStatus(e,i,t=""){const r=(this.returns||[]).find(o=>o.id===e);r&&(r.status=i,r.chat||(r.chat=[]),r.chat.push({sender:"Admin",text:`Status updated to "${i}". ${t||"Action has been recorded by our returns department."}`,time:new Date().toISOString().replace("T"," ").substring(0,16)}),this._notify({returns:!0}))}updateUserPhone(e){this.user||(this.user={name:"Alex Mercer",email:"alex@example.com",membership:"Aurite Member",memberSince:"2026"}),this.user.phone=e,this._notify({user:!0})}addReview(e,i,t,r,o){const s={id:`REV-${Math.floor(100+Math.random()*900)}`,productId:e,orderId:i,customerName:o,rating:t,text:r,date:new Date().toISOString().substring(0,10)};this.reviews.unshift(s);const d=this.products.find(c=>c.id===e);if(d){const c=this.reviews.filter(p=>p.productId===e),l=c.reduce((p,m)=>p+m.rating,0);d.rating=(l/c.length).toFixed(1),d.reviewsCount=c.length}this._notify({reviews:!0,products:!0})}getAnalytics(){let e=0,i=0;this.orders.forEach(s=>{e+=s.total||0,(s.items||[]).forEach(d=>{const c=this.products.find(p=>p.id===d.id||p.name===d.name),l=d.costPrice!==void 0&&d.costPrice>0?d.costPrice:c&&c.costPrice?c.costPrice:(d.unitPrice||1e3)*.35;i+=l*(d.qty||1)})}),i===0&&e>0&&(i=Math.round(e*.35));const t=Math.max(0,e-i),r=e>0?(t/e*100).toFixed(1):"0.0",o=this.products.filter(s=>(s.stockQty||0)<15).length;return{totalRevenue:e,totalCost:i,netProfit:t,profitMargin:r,totalOrders:this.orders.length,lowStockCount:o}}addToCart(e,i="one-time",t=1){const r=this.cart.findIndex(s=>s.id===e.id&&s.purchaseType===i),o=i==="subscription"?e.subscribePrice:e.price;r>-1?this.cart[r].qty+=t:this.cart.push({id:e.id,name:e.name,tagline:e.tagline,image:e.image,unitPrice:o,costPrice:e.costPrice||o*.35,purchaseType:i,qty:t}),this.isCartOpen=!0,this._notify({cart:!0})}updateCartQty(e,i,t){const r=this.cart.findIndex(o=>o.id===e&&o.purchaseType===i);r>-1&&(t<=0?this.cart.splice(r,1):this.cart[r].qty=t,this._notify({cart:!0}))}removeCartItem(e,i){this.cart=this.cart.filter(t=>!(t.id===e&&t.purchaseType===i)),this._notify({cart:!0})}clearCart(){this.cart=[],this._notify({cart:!0})}getCartSubtotal(){return this.cart.reduce((e,i)=>e+i.unitPrice*i.qty,0)}getCartTotal(){const e=this.getCartSubtotal();return Math.max(0,e-e*this.discountPercent/100)}getCartCount(){return this.cart.reduce((e,i)=>e+i.qty,0)}toggleCart(e){this.isCartOpen=e!==void 0?e:!this.isCartOpen,this._notify({cart:!0})}setCartOpen(e){this.toggleCart(e)}toggleAuthModal(e){this.isAuthOpen=e!==void 0?e:!this.isAuthOpen,this._notify({auth:!0})}toggleCheckout(e){this.isCheckoutOpen=e!==void 0?e:!this.isCheckoutOpen,this._notify({checkout:!0})}setQuickView(e){this.quickViewProduct=e,this._notify({quickview:!0})}login(e,i,t){if((e==="admin@aurite.com"||e==="admin")&&(t==="admin123"||!t))return this.isAdmin=!0,this.user={email:"admin@aurite.com",name:"Admin Administrator",membership:"Executive Admin",memberSince:"2026"},this.isAuthOpen=!1,this._notify({auth:!0,admin:!0,navbar:!0}),{success:!0,isAdmin:!0};const r=(this.users||[]).find(o=>o.email.toLowerCase()===e.toLowerCase());return r&&r.isBlocked?{success:!1,blocked:!0,message:"Your account has been suspended by administration. Please contact support."}:(this.isAdmin=!1,this.user={email:e,name:r&&r.name?r.name:i||"Alex Mercer",phone:r&&r.phone?r.phone:"+91 98765 43210",address:r&&r.address?r.address:"742 Evergreen Terrace, Mumbai",membership:"Aurite Member",memberSince:"2026"},r||(this.users||(this.users=[]),this.users.unshift({id:`USR-${Math.floor(100+Math.random()*900)}`,name:this.user.name,email:this.user.email,phone:this.user.phone,address:this.user.address,joinedDate:new Date().toISOString().substring(0,10),isBlocked:!1,ordersCount:0,totalSpent:0})),this.isAuthOpen=!1,this._notify({auth:!0,navbar:!0,users:!0}),{success:!0,isAdmin:!1})}register(e,i,t,r){const o=(this.users||[]).find(d=>d.email.toLowerCase()===i.toLowerCase());if(o&&o.isBlocked)return{success:!1,blocked:!0,message:"This email account is suspended. Please contact support."};const s={id:`USR-${Math.floor(100+Math.random()*900)}`,name:e||"Alex Mercer",email:i,phone:t||"+91 98765 43210",address:"742 Evergreen Terrace, Mumbai, 400001",joinedDate:new Date().toISOString().substring(0,10),isBlocked:!1,ordersCount:0,totalSpent:0};return this.users||(this.users=[]),o||this.users.unshift(s),this.user={name:s.name,email:s.email,phone:s.phone,address:s.address,membership:"Aurite Member",memberSince:"2026"},this.isAdmin=!1,this.isAuthOpen=!1,this._notify({auth:!0,navbar:!0,users:!0}),{success:!0}}logout(){this.user=null,this.isAdmin=!1,localStorage.removeItem("aurite_user"),localStorage.removeItem("aurite_is_admin"),this._persist(),this._notify({auth:!0,navbar:!0,user:!0,route:!0})}}const n=new Ie,q=216,Be="/frames/ezgif-frame-",Re=".jpg";function Me(a){return Be+String(a).padStart(3,"0")+Re}class Te{constructor(e){this.canvas=document.getElementById(e),this.canvas&&(this.ctx=this.canvas.getContext("2d",{alpha:!1}),this.frames=new Array(q).fill(null),this.currentFrame=0,this.loadedCount=0,this.isReady=!1,this.rafPending=!1,this.scrollProgress=0,this.scrollDeltaAcc=0,this.SCROLL_TRAVEL=2400,this.animDone=!1,this.wheelHandler=null,this.touchHandler=null,this._lastTouchY=0,this._setup())}_setup(){this._resize(),window.addEventListener("resize",()=>this._resize(),{passive:!0}),this._loadFrames(),this._setupScrollJack()}_resize(){const e=window.devicePixelRatio||1;this.canvas.width=Math.round(window.innerWidth*e),this.canvas.height=Math.round(window.innerHeight*e),this.canvas.style.width=window.innerWidth+"px",this.canvas.style.height=window.innerHeight+"px",this._logicalW=window.innerWidth,this._logicalH=window.innerHeight,this._dpr=e,this.isReady&&this._drawFrame(this.currentFrame)}_loadFrames(){for(let e=0;e<q;e++){const i=new Image;i.src=Me(e+1);const t=e;i.onload=()=>{this.frames[t]=i,this.loadedCount++,!this.isReady&&this.loadedCount>=8&&(this.isReady=!0,this._drawFrame(0));const r=document.getElementById("frame-load-bar");if(r&&(r.style.width=this.loadedCount/q*100+"%"),this.loadedCount===q){const o=document.getElementById("frame-loader");o&&(o.style.opacity="0",setTimeout(()=>o.remove(),500))}},i.onerror=()=>{this.loadedCount++}}}_setupScrollJack(){this.wheelHandler=e=>{if(this.animDone)return;const i=document.getElementById("hero-section");if(!i)return;const t=i.getBoundingClientRect();t.top>80||t.bottom<0||(e.preventDefault(),this._advance(e.deltaY))},this.touchStartHandler=e=>{e.touches.length&&(this._lastTouchY=e.touches[0].clientY)},this.touchHandler=e=>{if(this.animDone)return;const i=document.getElementById("hero-section");if(!i)return;const t=i.getBoundingClientRect();if(t.top>80||t.bottom<0)return;e.preventDefault();const r=this._lastTouchY-e.touches[0].clientY;this._lastTouchY=e.touches[0].clientY,this._advance(r*2.2)},window.addEventListener("wheel",this.wheelHandler,{passive:!1}),window.addEventListener("touchstart",this.touchStartHandler,{passive:!0}),window.addEventListener("touchmove",this.touchHandler,{passive:!1})}_advance(e){e>0?this.scrollDeltaAcc=Math.min(this.scrollDeltaAcc+Math.abs(e),this.SCROLL_TRAVEL):this.scrollDeltaAcc=Math.max(0,this.scrollDeltaAcc-Math.abs(e)),this.scrollProgress=this.scrollDeltaAcc/this.SCROLL_TRAVEL;const i=Math.min(Math.floor(this.scrollProgress*(q-1)),q-1);i!==this.currentFrame&&(this.currentFrame=i,this._scheduleDrawFrame(this.currentFrame));const t=document.getElementById("scroll-hint");if(t){const r=Math.round(this.scrollProgress*100);r>0&&(t.querySelector("span").textContent=`${r}%`),r>=100&&(t.style.opacity="0")}if(this.scrollProgress>=1&&!this.animDone){this.animDone=!0,window.removeEventListener("wheel",this.wheelHandler,{passive:!1}),window.removeEventListener("touchmove",this.touchHandler,{passive:!1});const r=document.querySelector(".canvas-badge-tag");r&&(r.textContent="360° Complete ✓"),setTimeout(()=>{const o=document.getElementById("hero-section");if(o){const s=o.getBoundingClientRect().bottom+window.scrollY;window.scrollTo({top:s,behavior:"smooth"})}},300)}}destroy(){this.wheelHandler&&window.removeEventListener("wheel",this.wheelHandler,{passive:!1}),this.touchHandler&&window.removeEventListener("touchmove",this.touchHandler,{passive:!1}),this.touchStartHandler&&window.removeEventListener("touchstart",this.touchStartHandler,{passive:!0}),this.resizeHandler&&window.removeEventListener("resize",this.resizeHandler,{passive:!0})}_scheduleDrawFrame(e){this.rafPending||(this.rafPending=!0,requestAnimationFrame(()=>{this.rafPending=!1,this._drawFrame(e)}))}_drawFrame(e){const i=this.frames[e],t=this.ctx,r=this._logicalW,o=this._logicalH,s=this._dpr||window.devicePixelRatio||1;if(!t||!r||!o)return;if(t.setTransform(s,0,0,s,0,0),t.imageSmoothingEnabled=!0,t.imageSmoothingQuality="high",t.fillStyle="#080d08",t.fillRect(0,0,r,o),!i){this._drawPlaceholder(t,r,o);return}const d=i.naturalWidth/i.naturalHeight,c=r/o;let l,p,m,u;d>c?(p=o,l=o*d,m=(r-l)/2,u=0):(l=r,p=r/d,m=0,u=(o-p)/2),t.drawImage(i,m,u,l,p);const v=t.createLinearGradient(0,0,0,o*.25);if(v.addColorStop(0,"rgba(0,0,0,0.65)"),v.addColorStop(1,"rgba(0,0,0,0)"),t.fillStyle=v,t.fillRect(0,0,r,o*.25),r>900){const $=t.createRadialGradient(0,o*.5,0,0,o*.5,r*.55);$.addColorStop(0,"rgba(0,0,0,0.72)"),$.addColorStop(.5,"rgba(0,0,0,0.35)"),$.addColorStop(1,"rgba(0,0,0,0)"),t.fillStyle=$,t.fillRect(0,0,r*.6,o)}else{const $=t.createRadialGradient(r/2,o/2,o*.2,r/2,o/2,o*.8);$.addColorStop(0,"rgba(0,0,0,0.15)"),$.addColorStop(1,"rgba(0,0,0,0.65)"),t.fillStyle=$,t.fillRect(0,0,r,o)}const k=t.createLinearGradient(0,o*.7,0,o);k.addColorStop(0,"rgba(0,0,0,0)"),k.addColorStop(1,"rgba(0,0,0,0.78)"),t.fillStyle=k,t.fillRect(0,o*.7,r,o*.3)}_drawPlaceholder(e,i,t){const r=e.createLinearGradient(0,0,i,t);r.addColorStop(0,"#0f281e"),r.addColorStop(1,"#061410"),e.fillStyle=r,e.fillRect(0,0,i,t);const o=this.loadedCount,s=Math.round(o/q*100);e.fillStyle="rgba(197,160,89,0.85)",e.font=`bold ${Math.max(14,i*.012)}px "Plus Jakarta Sans", sans-serif`,e.textAlign="center",e.textBaseline="middle",e.fillText(`Loading 3D Experience… ${s}%`,i/2,t/2)}isDone(){return this.animDone}}let J=null;function Oe(){return J||(J=document.createElement("div"),J.className="toast-container",document.body.appendChild(J)),J}function f(a,e=3200){const i=Oe(),t=document.createElement("div");t.className="toast",t.textContent=a,i.appendChild(t),setTimeout(()=>{t.style.opacity="0",t.style.transform="translateX(30px)",setTimeout(()=>t.remove(),350)},e)}const N=["home","shop","science","about","contact","profile","product","admin"];let K="omega-3-triple",I="analytics";function w(a){return`₹${Number(a||0).toLocaleString("en-IN")}`}function te(a){if(!a)return"AM";const e=String(a).trim().split(/\s+/);return e.length>=2?(e[0][0]+e[e.length-1][0]).toUpperCase():e[0].substring(0,2).toUpperCase()}function ie(a="#0f281e",e=38){return`<svg width="${e}" height="${e}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <mask id="leaf-cutout">
        <rect width="100" height="100" fill="white"/>
        <path d="M 14 52 C 26 62, 38 72, 47 84" stroke="black" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M 28 65 L 34 68 M 36 74 L 43 75" stroke="black" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M 86 52 C 74 62, 62 72, 53 84" stroke="black" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M 72 65 L 66 68 M 64 74 L 57 75" stroke="black" stroke-width="2" fill="none" stroke-linecap="round"/>
      </mask>
    </defs>
    <!-- Top Arc -->
    <path d="M 18 42 A 34 34 0 0 1 82 42" stroke="${a}" stroke-width="3.5" stroke-linecap="round" fill="none"/>
    <!-- Mountain -->
    <path d="M 14 55 L 30 35 L 40 45 L 50 28 L 60 45 L 70 35 L 86 55" stroke="${a}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <!-- Tree Trunk -->
    <line x1="50" y1="74" x2="50" y2="48" stroke="${a}" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Tree Branches -->
    <path d="M 44 65 L 50 59 L 56 65 M 45 58 L 50 52 L 55 58" stroke="${a}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <!-- Leaves -->
    <path d="M 14 55 A 36 36 0 0 0 48 85 C 36 72, 22 58, 14 55 Z" fill="${a}" mask="url(#leaf-cutout)"/>
    <path d="M 86 55 A 36 36 0 0 1 52 85 C 64 72, 78 58, 86 55 Z" fill="${a}" mask="url(#leaf-cutout)"/>
  </svg>`}function g(a,e=20){return{home:`<svg width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,login:`<svg width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>`,user:`<svg width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,cart:`<svg width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,menu:`<svg width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,close:`<svg width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,check:`<svg width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`,shield:`<svg width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,star:`<svg width="${e}" height="${e}" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,truck:`<svg width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,arrow_dn:`<svg width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>`,logout:`<svg width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,order:`<svg width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,mail:`<svg width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,phone:`<svg width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,message:`<svg width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,lock:`<svg width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,leaf:`<svg width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,award:`<svg width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`,chart:`<svg width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,box:`<svg width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,chat:`<svg width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,plus:`<svg width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`}[a]||""}function be(){const a=n.getCartCount(),e=n.currentRoute,i=n.user&&n.user.name?String(n.user.name).split(" ")[0]:n.user&&n.user.email?String(n.user.email).split("@")[0]:"Member";return n.user&&`${i}`,`
  <header class="navbar ${e!=="home"?"dark-nav":""}" id="main-navbar">
    <div class="container navbar-container">
      <div class="nav-brand-static">
        ${ie("#faf7f2",38)}
        <span class="brand-name">Aurite</span>
      </div>
      <ul class="nav-links">
        <li><a class="nav-link ${e==="home"?"active":""}" data-route="home">Home</a></li>
        <li><a class="nav-link ${e==="shop"||e==="product"?"active":""}" data-route="shop">Shop All</a></li>
        <li><a class="nav-link ${e==="science"?"active":""}" data-route="science">Science</a></li>
        <li><a class="nav-link ${e==="about"?"active":""}" data-route="about">About</a></li>
        <li><a class="nav-link ${e==="contact"?"active":""}" data-route="contact">Contact</a></li>
      </ul>
      <div class="nav-actions">
        ${n.isAdmin?'<button class="btn btn-gold btn-sm nav-desktop-only" data-route="admin" style="padding:5px 10px;font-weight:700">Admin</button>':""}
        <button class="icon-btn nav-desktop-only" id="nav-user-btn" aria-label="Account">${g("user",20)}</button>
        <button class="icon-btn nav-desktop-only" id="nav-cart-btn" aria-label="Cart">${g("cart",20)}${a>0?`<span class="cart-badge-count">${a}</span>`:""}</button>
        <button class="icon-btn mobile-menu-btn" id="mobile-menu-btn" aria-label="Menu">${g("menu",22)}</button>
      </div>
    </div>
    <div class="mobile-drawer" id="mobile-drawer">
      <button class="drawer-close-btn" id="drawer-close-btn" aria-label="Close Menu">${g("close",20)}</button>
      <ul class="mobile-nav-links">
        <li>
          <a class="mobile-nav-link ${e==="home"?"active":""}" data-route="home">
            <span class="drawer-link-inner">${g("home",18)} <span>Home</span></span>
          </a>
        </li>
        <li>
          <a class="mobile-nav-link ${e==="shop"||e==="product"?"active":""}" data-route="shop">
            <span class="drawer-link-inner">${g("box",18)} <span>Shop All</span></span>
          </a>
        </li>
        <li>
          <a class="mobile-nav-link ${e==="science"?"active":""}" data-route="science">
            <span class="drawer-link-inner">${g("check",18)} <span>Our Science</span></span>
          </a>
        </li>
        <li>
          <a class="mobile-nav-link ${e==="about"?"active":""}" data-route="about">
            <span class="drawer-link-inner">${g("shield",18)} <span>About Us</span></span>
          </a>
        </li>
        <li>
          <a class="mobile-nav-link ${e==="contact"?"active":""}" data-route="contact">
            <span class="drawer-link-inner">${g("mail",18)} <span>Contact</span></span>
          </a>
        </li>
        <li>
          <a class="mobile-nav-link ${e==="profile"?"active":""}" data-route="profile">
            <span class="drawer-link-inner">${g("user",18)} <span>${n.user?"My Profile":"Profile / Sign In"}</span></span>
          </a>
        </li>
        <li>
          <a class="mobile-nav-link" id="drawer-cart-link" style="cursor:pointer">
            <span class="drawer-link-inner">${g("cart",18)} <span>Cart</span></span>
            ${a>0?`<span class="badge badge-gold" style="font-size:.62rem;padding:2px 8px">${a}</span>`:""}
          </a>
        </li>
        ${n.isAdmin?`
        <li>
          <a class="mobile-nav-link ${e==="admin"?"active":""}" data-route="admin" style="color:var(--gold)">
            <span class="drawer-link-inner">${g("lock",18)} <span>Admin Portal</span></span>
          </a>
        </li>`:""}
      </ul>
    </div>
  </header>`}function Z(){const a=document.getElementById("main-navbar");if(a)if(n.currentRoute!=="home")a.classList.add("dark-nav"),a.classList.remove("scrolled");else{const e=document.getElementById("hero-section"),i=e?e.offsetTop+e.offsetHeight-120:400;window.scrollY>i?(a.classList.add("scrolled"),a.classList.remove("dark-nav")):(a.classList.remove("scrolled"),a.classList.remove("dark-nav"))}}function xe(){let a=!1;const e=document.getElementById("mobile-menu-btn"),i=document.getElementById("mobile-drawer");e&&i&&e.addEventListener("click",()=>{a=!a,i.classList.toggle("open",a),e.innerHTML=g(a?"close":"menu",24)});const t=document.getElementById("drawer-close-btn");t&&i&&t.addEventListener("click",()=>{a=!1,i.classList.remove("open"),O(!1),e&&(e.innerHTML=g("menu",22))});const r=document.getElementById("drawer-cart-link");r&&r.addEventListener("click",()=>{a=!1,i&&i.classList.remove("open"),e&&(e.innerHTML=g("menu",22)),G()}),i&&i.querySelectorAll("[data-route]").forEach(d=>{d.addEventListener("click",c=>{const l=d.dataset.route;if(l){if(c.preventDefault(),a=!1,i.classList.remove("open"),e&&(e.innerHTML=g("menu",22)),l==="cart"){G();return}if(l==="login"){Q("login");return}N.includes(l)&&T(l)}})});const o=document.getElementById("nav-user-btn");o&&o.addEventListener("click",()=>{n.user?T("profile"):Q("login"),i&&(a=!1,i.classList.remove("open"))});const s=document.getElementById("nav-cart-btn");s&&s.addEventListener("click",()=>{G(),i&&(a=!1,i.classList.remove("open"))}),window.removeEventListener("scroll",Z),window.addEventListener("scroll",Z,{passive:!0}),Z()}function X(){const a=document.getElementById("main-navbar");a&&(a.outerHTML=be(),xe())}function oe(a){const e=a.stockQty!==void 0&&a.stockQty<=0;return`
  <div class="product-card" data-product-id="${a.id}">
    <div class="product-image-wrap" data-product-id="${a.id}">
      ${e?'<span class="badge" style="position:absolute;bottom:14px;left:14px;z-index:2;background:rgba(198,40,40,0.95);color:#fff">Out of Stock</span>':""}
      <img src="${a.image}" alt="${a.name}" loading="lazy" onerror="this.style.background='#f4efe6'">
    </div>
    <div class="product-info">
      <div class="product-category">${a.category}</div>
      <h3 class="product-title" data-product-id="${a.id}" style="cursor:pointer">${a.name}</h3>
      <div class="product-rating">
        <span class="stars" style="color:var(--gold)">★★★★★</span>
        <span>${a.rating} (${a.reviewsCount})</span>
      </div>
      <p class="product-benefit-tag">${a.tagline}</p>
      <div class="product-price-row">
        <div class="product-price-details">
          <div class="product-price">${w(a.price)}</div>
        </div>
        ${e?'<button class="btn btn-secondary btn-sm" disabled style="opacity:0.6;cursor:not-allowed;flex-shrink:0">Out of Stock</button>':`<button class="btn btn-primary btn-sm add-cart-btn" data-action="add-cart" data-product-id="${a.id}">Add To Cart</button>`}
      </div>
    </div>
  </div>`}function fe(a){a&&a.addEventListener("click",e=>{const i=e.target.closest('[data-action="add-cart"]');if(i){e.stopPropagation();const r=i.dataset.productId,o=n.products.find(s=>s.id===r);o&&(n.addToCart(o,"one-time",1),f(`${o.name} added to cart!`));return}const t=e.target.closest(".product-card");if(t){const r=t.dataset.productId;r&&T("product",r)}})}function O(a){a?(document.body.classList.add("modal-open"),document.documentElement.classList.add("modal-open"),document.body.style.overflow="hidden"):setTimeout(()=>{document.querySelector(".modal-overlay.open")||document.querySelector(".cart-overlay.open")||document.querySelector(".mobile-drawer.open")||document.getElementById("modal-box")&&document.getElementById("modal-box").children.length>0||(document.body.classList.remove("modal-open"),document.documentElement.classList.remove("modal-open"),document.body.style.overflow="")},50)}function G(){n.isCartOpen=!0;let a=document.getElementById("cart-box");a||(a=document.createElement("div"),a.id="cart-box",document.body.appendChild(a)),a.innerHTML=le(),ce();const e=document.getElementById("cart-overlay");e&&(e.classList.add("open"),O(!0))}function U(){n.isCartOpen=!1;const a=document.getElementById("cart-overlay");a&&(a.classList.remove("open"),O(!1))}function le(){const a=n.cart,e=n.getCartSubtotal(),i=n.getCartTotal(),t=n.getCartCount(),r=1499,o=Math.min(e/r*100,100),s=r-e;return`
  <div class="cart-overlay ${n.isCartOpen?"open":""}" id="cart-overlay">
    <div class="cart-drawer">
      <div class="cart-header">
        <h3 class="cart-title">Your Cart ${t>0?`(${t})`:""}</h3>
        <button id="cart-close-btn" aria-label="Close Cart">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="free-shipping-bar">
        <p style="font-size:.82rem;font-weight:600;color:var(--forest-dark)">
          ${s<=0?"🎉 You unlocked FREE Express Shipping!":`Add ${w(s)} more for free shipping`}
        </p>
        <div class="shipping-progress-track"><div class="shipping-progress-fill" style="width:${o}%"></div></div>
      </div>
      <div class="cart-items">
        ${a.length===0?`
          <div class="cart-empty">
            ${g("cart",48)}
            <p>Your cart is empty</p>
            <button class="btn btn-primary btn-sm" data-route="shop">Explore Products</button>
          </div>`:a.map(d=>`
          <div class="cart-item" data-id="${d.id}" data-type="${d.purchaseType}">
            <img src="${d.image}" alt="${d.name}" class="cart-item-img" onerror="this.style.background='#f4efe6'">
            <div class="cart-item-details">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:6px">
                <div class="cart-item-title">${d.name}</div>
                <button class="cart-remove-btn" data-action="remove" data-id="${d.id}" data-type="${d.purchaseType}" title="Remove item" aria-label="Remove item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div class="cart-item-qty-row">
                <div class="qty-control">
                  <button class="qty-btn" data-action="dec" data-id="${d.id}" data-type="${d.purchaseType}" aria-label="Decrease quantity">−</button>
                  <span class="qty-val">${d.qty}</span>
                  <button class="qty-btn" data-action="inc" data-id="${d.id}" data-type="${d.purchaseType}" aria-label="Increase quantity">+</button>
                </div>
                <div class="cart-item-price">${w(d.unitPrice*d.qty)}</div>
              </div>
            </div>
          </div>`).join("")}
      </div>
      ${a.length>0?`
      <div class="cart-footer">
        <div class="cart-summary-row"><span>Subtotal</span><span>${w(e)}</span></div>
        <div class="cart-summary-row"><span>Shipping</span><span>${s<=0?"FREE":w(149)}</span></div>
        <div class="cart-summary-row total"><span>Total</span><span>${w(i+(s<=0?0:149))}</span></div>
        <button class="btn btn-gold btn-lg" id="checkout-open-btn" style="width:100%;margin-top:14px;${n.isAdmin?"opacity:0.6;cursor:not-allowed":""}" ${n.isAdmin?'disabled title="Admins cannot place orders"':""}>Proceed →</button>
      </div>`:""}
    </div>
  </div>`}function ce(){const a=document.getElementById("cart-overlay");if(!a)return;a.addEventListener("click",t=>{t.target===a&&U()});const e=document.getElementById("cart-close-btn");e&&e.addEventListener("click",()=>U()),a.querySelectorAll("[data-route]").forEach(t=>{t.addEventListener("click",r=>{r.preventDefault();const o=t.dataset.route;U(),o&&N.includes(o)&&T(o)})}),a.querySelectorAll('.qty-btn, .cart-remove-btn, [data-action="inc"], [data-action="dec"], [data-action="remove"]').forEach(t=>{t.addEventListener("click",r=>{r.preventDefault(),r.stopPropagation();const{action:o,id:s,type:d}=t.dataset,c=n.cart.find(l=>l.id===s&&l.purchaseType===d);c&&(o==="inc"?n.updateCartQty(s,d,c.qty+1):o==="dec"?n.updateCartQty(s,d,c.qty-1):o==="remove"&&n.removeCartItem(s,d))})});const i=document.getElementById("checkout-open-btn");i&&i.addEventListener("click",t=>{t.preventDefault(),t.stopPropagation(),U(),we()})}function we(){var s,d,c,l,p,m,u;O(!0);let a=document.getElementById("modal-box");a||(a=document.createElement("div"),a.id="modal-box",document.body.appendChild(a));const e=n.getCartTotal(),i=n.cart.reduce((v,k)=>v+k.qty,0);n.cart.map(v=>`${v.name} (x${v.qty})`).join(", "),a.innerHTML=`
  <div class="modal-overlay open" id="checkout-overlay" style="padding:16px 12px;align-items:center;justify-content:center">
    <div class="modal-card checkout-modal-card">
      
      <!-- Modal Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--sand-border);padding-bottom:12px;margin-bottom:16px">
        <div>
          <h3 style="font-family:var(--font-serif);font-size:clamp(1.15rem, 3vw, 1.35rem);color:var(--forest-dark);margin:0;line-height:1.2">Secure Payment Gateway</h3>
          <span style="font-size:.74rem;color:var(--text-muted);letter-spacing:.02em">256-bit Bank-Grade Encrypted &amp; PCI-DSS Compliant</span>
        </div>
        <button class="modal-close-btn" id="checkout-close-btn" style="position:static;width:32px;height:32px;font-size:1rem;display:flex;align-items:center;justify-content:center">${g("close",15)}</button>
      </div>

      <!-- Checkout Form with Full Address -->
      <form id="checkout-form" style="display:flex;flex-direction:column;gap:14px">
        
        <!-- Contact Information Section -->
        <div style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:14px 16px;box-shadow:var(--shadow-sm)">
          <div style="font-size:.74rem;font-weight:800;color:var(--gold);text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px;display:flex;align-items:center;gap:6px">
            <span>1. Contact &amp; Shipping Details</span>
          </div>
          
          <!-- Name & Mobile -->
          <div class="checkout-form-grid">
            <div>
              <label class="form-label" style="font-size:.70rem;margin-bottom:3px">Full Name *</label>
              <input type="text" id="co-name" class="form-input" required value="${((s=n.user)==null?void 0:s.name)||"Alex Mercer"}" placeholder="Full name" style="height:38px;font-size:.82rem;padding:6px 10px">
            </div>
            <div>
              <label class="form-label" style="font-size:.70rem;margin-bottom:3px">Mobile Number *</label>
              <input type="tel" id="co-phone" class="form-input" required value="${((d=n.user)==null?void 0:d.phone)||"+91 98765 43210"}" placeholder="10-digit mobile" style="height:38px;font-size:.82rem;padding:6px 10px">
            </div>
          </div>

          <!-- Email & Country -->
          <div class="checkout-form-grid">
            <div>
              <label class="form-label" style="font-size:.70rem;margin-bottom:3px">Email Address *</label>
              <input type="email" id="co-email" class="form-input" required value="${((c=n.user)==null?void 0:c.email)||"alex@example.com"}" placeholder="Email address" style="height:38px;font-size:.82rem;padding:6px 10px">
            </div>
            <div>
              <label class="form-label" style="font-size:.70rem;margin-bottom:3px">Country *</label>
              <input type="text" id="co-country" class="form-input" required value="${((l=n.user)==null?void 0:l.country)||"India"}" placeholder="Country" style="height:38px;font-size:.82rem;padding:6px 10px">
            </div>
          </div>

          <!-- City & Pincode -->
          <div class="checkout-city-grid">
            <div>
              <label class="form-label" style="font-size:.70rem;margin-bottom:3px">City / Town *</label>
              <input type="text" id="co-city" class="form-input" required value="${((p=n.user)==null?void 0:p.city)||"Mumbai"}" placeholder="City" style="height:38px;font-size:.82rem;padding:6px 10px">
            </div>
            <div>
              <label class="form-label" style="font-size:.70rem;margin-bottom:3px">Pincode *</label>
              <input type="text" id="co-pincode" class="form-input" required value="${((m=n.user)==null?void 0:m.pincode)||"400001"}" placeholder="6-digit pincode" maxlength="6" style="height:38px;font-size:.82rem;padding:6px 10px">
            </div>
          </div>

          <!-- Delivery Address -->
          <div style="margin-top:2px">
            <label class="form-label" style="font-size:.70rem;margin-bottom:3px">Delivery Address *</label>
            <textarea id="co-addr" class="form-input" rows="2" required placeholder="House / Flat No., Building, Street &amp; Locality" style="padding:8px 10px;font-size:.82rem;resize:vertical;min-height:48px">${((u=n.user)==null?void 0:u.address)||"Flat 402, Green Glen Heights, HSR Layout"}</textarea>
          </div>
        </div>

        <!-- Payment Method Preference (UPI/QR and COD Only) -->
        <div style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:14px 16px;box-shadow:var(--shadow-sm)">
          <div style="font-size:.74rem;font-weight:800;color:var(--forest-dark);margin-bottom:10px;text-transform:uppercase;letter-spacing:.05em">2. Select Payment Method</div>
          <div class="checkout-pay-methods">
            <label class="pay-method-pill">
              <input type="radio" name="pay-method" value="upi" checked style="accent-color:var(--forest);margin:0;flex-shrink:0">
              <span>⚡ UPI / QR (Instant &amp; Secure)</span>
            </label>
            <label class="pay-method-pill">
              <input type="radio" name="pay-method" value="cod" style="accent-color:var(--forest);margin:0;flex-shrink:0">
              <span>💵 Cash on Delivery (COD)</span>
            </label>
          </div>
        </div>

        <!-- Clean Minimalist Order Summary Box -->
        <div style="background:var(--forest-dark);color:var(--sand-light);border-radius:var(--r-lg);padding:14px 18px;display:flex;justify-content:space-between;align-items:center;gap:12px;box-shadow:var(--shadow-md);border:1px solid rgba(197,160,89,.3)">
          <div>
            <div style="font-size:.86rem;font-weight:700;color:var(--sand-light)">${i} Item${i>1?"s":""}</div>
            <div style="font-size:.70rem;color:var(--gold);font-weight:600;margin-top:2px">Free Express Shipping</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:.66rem;color:rgba(250,247,242,.7);text-transform:uppercase;font-weight:700;letter-spacing:.05em">Total Payable</div>
            <div style="font-size:1.25rem;font-weight:800;color:#ffffff;line-height:1.1;margin-top:2px">${w(e)}</div>
          </div>
        </div>

        <!-- Action Button -->
        <button type="submit" class="btn btn-gold btn-lg" style="width:100%;padding:13px;font-size:.95rem;font-weight:800;letter-spacing:.02em;border-radius:var(--r-md);display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:var(--shadow-gold)">
          <span>Pay ${w(e)} Securely</span> →
        </button>

        <!-- Trust Badges Strip (Compact & Clean) -->
        <div style="display:flex;align-items:center;justify-content:center;gap:8px 12px;font-size:.66rem;color:var(--text-muted);padding-top:2px;flex-wrap:wrap;text-align:center">
          <span>🛡️ 100% Secure</span>
          <span>⚡ Instant Dispatch</span>
          <span>↩️ 2-Day Returns</span>
        </div>
      </form>
    </div>
  </div>`;const t=document.getElementById("checkout-overlay");t&&t.addEventListener("click",v=>{v.target===t&&B()});const r=document.getElementById("checkout-close-btn");r&&r.addEventListener("click",B);const o=document.getElementById("checkout-form");o&&o.addEventListener("submit",v=>{var A,C,M,L,D,Y,ge;v.preventDefault();const k=(A=document.getElementById("co-name"))==null?void 0:A.value.trim(),$=(C=document.getElementById("co-phone"))==null?void 0:C.value.trim(),E=(M=document.getElementById("co-email"))==null?void 0:M.value.trim(),y=(L=document.getElementById("co-addr"))==null?void 0:L.value.trim(),h=(D=document.getElementById("co-city"))==null?void 0:D.value.trim(),P=(Y=document.getElementById("co-pincode"))==null?void 0:Y.value.trim(),b=((ge=document.getElementById("co-country"))==null?void 0:ge.value.trim())||"India";if(!k||!$||!E||!y||!h||!P){f("Please fill all mandatory address and contact fields.");return}const x=`${y}, ${h} - ${P}, ${b}`;n.user&&n.updateUserAddress(y,h,P,b);const z=n.checkout({customerName:k,email:E,phone:$,address:x});z&&(B(),f(`Order #${z.id} placed successfully! 🎉`),T("profile"))})}function Q(a="login"){O(!0),n.isAuthOpen=!0,pe(a)}function pe(a,e={}){const i=document.getElementById("modal-box");if(i)if(a==="login"){i.innerHTML=`
    <div class="modal-overlay open" id="auth-overlay">
      <div class="modal-card">
        <button class="modal-close-btn" id="auth-close-btn">${g("close",20)}</button>
        <div style="text-align:center;margin-bottom:24px">
          <div style="display:flex;justify-content:center;margin-bottom:12px">
            ${ie("var(--forest)",36)}
          </div>
          <span class="badge badge-gold" style="margin-bottom:8px">Aurite Access Portal</span>
          <h2 style="font-family:var(--font-serif);color:var(--forest-dark)">Sign In</h2>
          <p style="font-size:.85rem;color:var(--text-muted);margin-top:6px">Access your orders, queries and clinical dashboard</p>
        </div>

        <div id="lg-error-alert" style="display:none" class="auth-error-alert"></div>

        <form id="login-form">
          <div class="form-group"><label class="form-label">Email or Mobile Number *</label><input type="text" id="lg-identifier" class="form-input" placeholder="alex@example.com or admin@aurite.com" required value=""></div>
          <div class="form-group"><label class="form-label">Password *</label><input type="password" id="lg-password" class="form-input" placeholder="••••••••" required value=""></div>
          <button type="submit" class="btn btn-gold btn-lg" style="width:100%;margin-top:8px">Sign In →</button>
          <div style="text-align:center;margin-top:16px;font-size:.85rem;color:var(--text-muted)">
            Don't have an account? <a href="#" id="goto-signup-btn" style="color:var(--forest-dark);font-weight:700">Create Account</a>
          </div>
        </form>
      </div>
    </div>`,ve();const t=document.getElementById("login-form");t&&t.addEventListener("submit",o=>{var l,p;o.preventDefault();const s=(l=document.getElementById("lg-identifier"))==null?void 0:l.value.trim(),d=(p=document.getElementById("lg-password"))==null?void 0:p.value;n.login(s,"Alex Mercer",d).isAdmin?(f("Welcome to Admin Portal! 👑"),B(),T("admin")):(f(`Welcome back, ${n.user.name.split(" ")[0]}! 🎉`),B(),T("profile"))});const r=document.getElementById("goto-signup-btn");r&&r.addEventListener("click",o=>{o.preventDefault(),pe("signup")})}else{let t=null,r=!1;i.innerHTML=`
    <div class="modal-overlay open" id="auth-overlay">
      <div class="modal-card">
        <button class="modal-close-btn" id="auth-close-btn">${g("close",20)}</button>
        <div style="text-align:center;margin-bottom:18px">
          <div style="display:flex;justify-content:center;margin-bottom:12px">
            ${ie("var(--forest)",36)}
          </div>
          <span class="badge badge-gold" style="margin-bottom:8px">Aurite Registration</span>
          <h2 style="font-family:var(--font-serif);color:var(--forest-dark)">Create Account</h2>
          <p style="font-size:.85rem;color:var(--text-muted);margin-top:4px">Join Aurite for clinical nutraceutical access</p>
        </div>
        <form id="signup-form">
          <div class="form-group"><label class="form-label">Full Name *</label><input type="text" id="su-name" class="form-input" placeholder="e.g. Akash Sharma" required value=""></div>
          <div class="form-group"><label class="form-label">Email Address *</label><input type="email" id="su-email" class="form-input" placeholder="akash@example.com" required value=""></div>
          <div class="form-group"><label class="form-label">Create Password *</label><input type="password" id="su-password" class="form-input" placeholder="••••••••" required value=""></div>
          
          <div class="form-group">
            <label class="form-label">Mobile Number (for OTP Verification) *</label>
            <div style="display:flex;gap:8px">
              <input type="tel" id="su-phone" class="form-input" placeholder="+91 98765 43210" required value="" style="flex:1">
              <button type="button" id="send-su-otp-btn" class="btn btn-sm btn-ghost" style="padding:0 14px;white-space:nowrap;font-size:.8rem;border-color:var(--forest);color:var(--forest);font-weight:700">Send OTP</button>
            </div>
          </div>

          <div id="su-otp-group" style="display:none;margin-bottom:16px;background:var(--sand);padding:14px;border-radius:var(--r-md);border:1px dashed var(--forest)">
            <label class="form-label" style="margin-bottom:4px">Enter 6-Digit Verification Code *</label>
            <div style="display:flex;gap:8px;align-items:center">
              <input type="text" id="su-otp-input" class="form-input" placeholder="e.g. 482910" maxlength="6" style="letter-spacing:3px;font-weight:800;font-size:1.1rem;text-align:center">
              <span id="su-otp-status" style="font-size:.78rem;color:var(--forest);font-weight:700">Code Sent!</span>
            </div>
            <p style="font-size:.75rem;color:var(--text-muted);margin-top:6px">Demo OTP: <strong id="demo-otp-display" style="color:var(--gold)">482910</strong></p>
          </div>

          <button type="submit" id="su-submit-btn" class="btn btn-gold btn-lg" style="width:100%;margin-top:8px">Verify &amp; Register →</button>
          
          <div style="text-align:center;margin-top:16px;font-size:.85rem;color:var(--text-muted)">
            Already have an account? <a href="#" id="goto-login-btn" style="color:var(--forest-dark);font-weight:700">Sign In</a>
          </div>
        </form>
      </div>
    </div>`,ve();const o=document.getElementById("send-su-otp-btn"),s=document.getElementById("su-otp-group"),d=document.getElementById("su-otp-input"),c=document.getElementById("demo-otp-display");o==null||o.addEventListener("click",()=>{var u;const m=(u=document.getElementById("su-phone"))==null?void 0:u.value.trim();if(!m){f("Please enter a valid mobile number.");return}t=String(Math.floor(1e5+Math.random()*9e5)),r=!0,s&&(s.style.display="block"),c&&(c.textContent=t),d&&(d.value=t),o.textContent="Resend OTP",f(`Verification code sent to ${m}: ${t} 📱`)});const l=document.getElementById("goto-login-btn");l&&l.addEventListener("click",m=>{m.preventDefault(),pe("login")});const p=document.getElementById("signup-form");p&&p.addEventListener("submit",m=>{var $,E,y;if(m.preventDefault(),r&&t&&(d==null?void 0:d.value.trim())!==t){f("Invalid OTP entered. Please check the code.");return}const u=($=document.getElementById("su-name"))==null?void 0:$.value,v=(E=document.getElementById("su-email"))==null?void 0:E.value,k=(y=document.getElementById("su-phone"))==null?void 0:y.value;n.login(v,u),n.user&&(n.user.phone=k),f("Phone verified & registration successful! Welcome to Aurite 🎉"),B(),T("profile")})}}function ve(){const a=document.getElementById("auth-overlay");a&&a.addEventListener("click",i=>{i.target===a&&B()});const e=document.getElementById("auth-close-btn");e&&e.addEventListener("click",B)}function B(){const a=document.getElementById("modal-box");a&&(a.innerHTML=""),O(!1)}function se(a){const e=typeof a=="string"?document.getElementById(a):a;e&&requestAnimationFrame(()=>{e.scrollTop=e.scrollHeight,setTimeout(()=>{e&&(e.scrollTop=e.scrollHeight)},60)})}let j=1;function Le(){return`
  <!-- HERO SECTION -->
  <section class="hero-section" id="hero-section" style="margin-bottom: 0 !important;">
    <canvas id="scroll-canvas" class="hero-canvas"></canvas>
    <div id="frame-loader" class="frame-loader"><div class="frame-loader-bar" id="frame-load-bar"></div></div>
    <div class="hero-overlay-content">
      <div class="hero-text-block animate-fade-in">
        <h1 class="hero-title-big">Science-Backed<br><span class="hero-title-accent">Better Health.</span></h1>
        <div class="hero-actions">
          <button class="btn btn-gold" data-route="shop">Shop Now</button>
          <button class="btn btn-ghost" data-route="science">Our Science →</button>
        </div>
      </div>
      <!-- Desktop Trust Strip (Shown only on desktop/laptop) -->
      <div class="hero-trust-strip desktop-only animate-fade-in" style="margin-top:24px">
        <div class="trust-chip">${g("shield",16)}<span>GMP Certified Facility</span></div>
        <div class="trust-chip-sep"></div>
        <div class="trust-chip">${g("check",16)}<span>100% 3rd-Party Tested</span></div>
        <div class="trust-chip-sep"></div>
        <div class="trust-chip">${g("truck",16)}<span>Cold-Chain Shipping ₹1,499+</span></div>
        <div class="trust-chip-sep"></div>
        <div class="trust-chip">★★★★★<span>4.9/5 Clinical Score</span></div>
      </div>
    </div>
  </section>

  <!-- METRICS BAR (Mobile only) — directly touches hero and products section with 0 margin -->
  <div class="mobile-only" style="background:var(--forest-dark); margin-top: 0 !important; margin-bottom: 0 !important;">
    <div class="container">
      <div class="home-metrics-strip">
        <div class="home-metric"><span class="home-metric-val">500+</span><span class="home-metric-lbl">Members</span></div>
        <div class="home-metric"><span class="home-metric-val">99.4%</span><span class="home-metric-lbl">Absorbed</span></div>
        <div class="home-metric"><span class="home-metric-val">100%</span><span class="home-metric-lbl">Lab Tested</span></div>
        <div class="home-metric"><span class="home-metric-val">4.9★</span><span class="home-metric-lbl">Rating</span></div>
      </div>
    </div>
  </div>

  <!-- 4-STAGE PRECISION STEPPER (Desktop Only) -->
  <section class="desktop-only section-padding" style="background:var(--sand);border-top:1px solid var(--sand-border);border-bottom:1px solid var(--sand-border)">
    <div class="container">
      <div class="section-header" style="text-align:center;max-width:700px;margin:0 auto 48px">
        <span class="badge badge-gold" style="margin-bottom:12px;border-radius:999px">Bio-Engineered Process</span>
        <h2 style="font-family:var(--font-serif);color:var(--forest-dark)">4-Stage Pharmaceutical Precision</h2>
        <p style="color:var(--text-muted);font-size:1rem;margin-top:8px">Every milligram passes through stringent clinical manufacturing stages before packaging.</p>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1.6fr;gap:36px;align-items:stretch">
        <div style="display:flex;flex-direction:column;gap:12px">
          ${[{num:1,title:"Ethical Botanical Sourcing",subtitle:"Eco-Refuges & Wild Harvest"},{num:2,title:"Supercritical CO₂ Extraction",subtitle:"Zero Chemical Solvents"},{num:3,title:"Enteric Micro-Shielding",subtitle:"Gastric Acid Bypass Matrix"},{num:4,title:"ICP-MS Quadruple Audit",subtitle:"Heavy Metal & Potency Purity"}].map(a=>`
            <button class="lab-step-btn ${a.num===1?"active":""}" data-step="${a.num}" style="display:flex;align-items:center;gap:16px;padding:18px 22px;border-radius:var(--r-lg);border:1.5px solid ${a.num===1?"var(--gold)":"var(--sand-border)"};background:${a.num===1?"var(--forest)":"var(--sand)"};color:${a.num===1?"#fff":"var(--forest-dark)"};cursor:pointer;text-align:left;transition:all .3s ease">
              <span style="font-family:var(--font-serif);font-size:1.4rem;font-weight:800;opacity:0.85">0${a.num}</span>
              <div>
                <div style="font-weight:700;font-size:1rem">${a.title}</div>
                <div style="font-size:.82rem;opacity:0.75;margin-top:2px">${a.subtitle}</div>
              </div>
            </button>
          `).join("")}
        </div>

        <div style="background:var(--forest-dark);border-radius:var(--r-xl);padding:40px;color:var(--sand-light);display:flex;flex-direction:column;justify-content:space-between;box-shadow:var(--shadow-xl);border:1px solid rgba(197,160,89,.3)">
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
              <span class="badge badge-gold" id="lab-step-badge" style="border-radius:999px">Step 01 Active</span>
              <span id="lab-step-phase" style="font-size:.78rem;color:var(--gold);text-transform:uppercase;letter-spacing:.08em;font-weight:700">Botanical Extraction & Cold Storage Phase</span>
            </div>
            <h3 id="lab-step-title" style="font-family:var(--font-serif);font-size:1.8rem;color:#faf7f2;margin-bottom:16px">Ethical Botanical Sourcing</h3>
            <p id="lab-step-desc" style="color:rgba(250,247,242,.85);font-size:1rem;line-height:1.75;margin-bottom:32px">Wild-harvested marine algae and organic botanicals extracted at peak potency from certified eco-refuges.</p>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;padding-top:24px;border-top:1px solid rgba(255,255,255,.12)">
            <div>
              <div style="font-size:.75rem;text-transform:uppercase;color:var(--gold);font-weight:700;letter-spacing:.05em">Process Control</div>
              <div id="lab-metric-a" style="font-size:1.1rem;font-weight:800;color:#fff;margin-top:4px">-12°C Cold Storage</div>
            </div>
            <div>
              <div style="font-size:.75rem;text-transform:uppercase;color:var(--gold);font-weight:700;letter-spacing:.05em">Quality Benchmark</div>
              <div id="lab-metric-b" style="font-size:1.1rem;font-weight:800;color:#fff;margin-top:4px">100% Organic Habitat</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- PRODUCTS SECTION -->
  <section class="section-padding" style="background:var(--white); margin-top: 0 !important; padding-top: 28px !important;">
    <div class="container">
      <div class="home-section-label" style="display:flex;flex-direction:column;align-items:flex-start;gap:3px;margin-bottom:22px">
        <h2 class="home-section-title" style="font-family:var(--font-serif);font-size:1.18rem;font-weight:700;color:var(--forest-dark);margin:0;line-height:1.2">Our Products</h2>
        <span style="font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--gold);margin-top:2px;margin-bottom:4px">Daily Essentials</span>
      </div>
      <div class="products-grid" id="home-grid">${n.products.map(a=>oe(a)).join("")}</div>
      <div style="text-align:center; margin-top: 32px;">
        <button class="btn btn-outline" data-route="shop">Explore All Products →</button>
      </div>
    </div>
  </section>

  <!-- SCIENCE CALLOUT (Mobile Compact Version) -->
  <div class="mobile-only" style="background:var(--sand-light); padding: 32px 0; margin: 24px 0;">
    <div class="container">
      <div class="home-science-card animate-on-scroll">
        <div class="home-science-img">
          <img src="/images/science_capsule.jpg" alt="Science">
        </div>
        <div class="home-science-text">
          <span class="badge badge-gold" style="font-size:.58rem;padding:3px 8px;margin-bottom:8px;align-self:flex-start;border-radius:999px">Enteric Shield Tech</span>
          <h3 class="home-science-h3">Supplements that<br>actually absorb.</h3>
          <p class="home-science-p">Standard capsules lose 84% in stomach acid. Aurite releases 100% in your intestine.</p>
          <button class="btn btn-gold" style="font-size:.78rem;padding:8px 16px;margin-top:10px;align-self:flex-start;border-radius:999px" data-route="science">Learn More →</button>
        </div>
      </div>
    </div>
  </div>

  <!-- SCIENCE & ABSORPTION BANNER (Desktop Rich Version) -->
  <section class="desktop-only section-padding" style="background:var(--sand-light)">
    <div class="container">
      <div class="science-banner animate-on-scroll">
        <div class="science-content">
          <span class="badge badge-gold" style="margin-bottom:14px;align-self:flex-start;border-radius:999px">Enteric Shield Technology</span>
          <h2 style="font-family:var(--font-serif);color:var(--sand-light);font-size:2.4rem;line-height:1.2;margin-bottom:18px">Engineered to Surpass Gastric Acid Destruction</h2>
          <p style="color:rgba(250,247,242,.85);font-size:1.05rem;line-height:1.7;margin-bottom:28px">Up to 84% of ordinary supplements degrade in stomach acid before reaching cellular pathways. Aurite uses nested enteric micro-spheres that activate only in the alkaline intestine.</p>
          <div style="display:flex;gap:16px">
            <button class="btn btn-gold" data-route="science">Explore Clinical Trials →</button>
          </div>
        </div>
        <div class="science-image-wrap">
          <img src="/images/science_capsule.jpg" alt="Aurite Enteric Capsule Technology">
        </div>
      </div>

      <!-- Desktop Metrics Strip -->
      <div class="metrics-row" style="margin-top:32px">
        <div class="metric-item">
          <div class="metric-value">99.4%</div>
          <div class="metric-label">Intestinal Bio-Delivery</div>
        </div>
        <div class="metric-item">
          <div class="metric-value">0.00 PPM</div>
          <div class="metric-label">Heavy Metal Tolerances</div>
        </div>
        <div class="metric-item">
          <div class="metric-value">100%</div>
          <div class="metric-label">Third-Party Lab Audited</div>
        </div>
        <div class="metric-item">
          <div class="metric-value">4.9 / 5.0</div>
          <div class="metric-label">Clinical Practitioner Rating</div>
        </div>
      </div>
    </div>
  </section>

  <!-- REVIEWS SECTION -->
  <section class="section-padding" style="background:var(--white); padding: 40px 0 60px;">
    <div class="container">
      <div class="home-section-label" style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:18px">
        <div style="display:flex;flex-direction:column;gap:3px">
          <h2 class="home-section-title" style="font-family:var(--font-serif);font-size:1.18rem;font-weight:700;color:var(--forest-dark);margin:0;line-height:1.2">What Members Say</h2>
          <span style="font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--gold);margin-top:2px">Verified Member Reviews</span>
        </div>
        <span style="font-size:.78rem;color:var(--gold);font-weight:700;align-self:center">★★★★★ 4.9</span>
      </div>
      <div class="home-reviews-row">
        ${[{name:"Dr. Priya Mehta",role:"Cardiologist, Mumbai",avatar:"PM",text:"I recommend Aurite Omega-3 to my cardiac patients. The enteric-shielded delivery is the only way to guarantee EPA/DHA absorption past stomach acid. Exceptional clinical quality.",product:"Omega-3 Ultra"},{name:"Rajesh Khanna",role:"Competitive Athlete, Bangalore",avatar:"RK",text:"My recovery time dropped by nearly 30% after starting Magnesium Bisglycinate. Sleep quality went from 6 hours fitful to 7.5 hours deep sleep. The science is real.",product:"Pure Magnesium"},{name:"Ananya Sharma",role:"Wellness Coach, Delhi",avatar:"AS",text:"The Daily Greens formula completely changed my gut health journey. Bloating gone within 2 weeks. My clients now ask me which greens I use — I only recommend Aurite.",product:"Daily Greens"}].map(a=>`
        <div class="home-review-card">
          <div class="home-review-top">
            <div class="home-review-avatar">${a.avatar}</div>
            <div style="flex:1;min-width:0">
              <div class="home-review-name">${a.name}</div>
              <div class="home-review-role">${a.role}</div>
            </div>
            <span style="color:var(--gold);font-size:.75rem">★★★★★</span>
          </div>
          <p class="home-review-text">"${a.text}"</p>
          <span class="badge badge-gold" style="font-size:.58rem;padding:3px 10px;align-self:flex-start;border-radius:999px">${a.product}</span>
        </div>`).join("")}
      </div>
    </div>
  </section>`}function De(){const a=[{num:1,title:"Ethical Botanical Sourcing",phase:"Botanical Extraction & Cold Storage Phase",temp:"-12°C Cold Storage",param:"100% Organic Habitat",desc:"Wild-harvested marine algae and organic botanicals extracted at peak potency from certified eco-refuges."},{num:2,title:"Supercritical CO₂ Extraction",phase:"Supercritical CO₂ Molecular Separation Phase",temp:"31.1°C Critical Temp",param:"73.8 Bar Pressure",desc:"Cold supercritical carbon dioxide isolates target bioactive compounds without thermal destruction or chemical solvents."},{num:3,title:"Enteric Micro-Shielding",phase:"Enteric Alginate Micro-Encapsulation Phase",temp:"pH 1.5 Gastric Bypass",param:"pH 7.4 Intestinal Release",desc:"Patented alginate dual-capsule matrix shields sensitive probiotic strains and liposomal nutrients from stomach acid."},{num:4,title:"ICP-MS Quadruple Audit",phase:"ICP-MS Mass Spectrometry Quality Audit Phase",temp:"0.00 PPM Heavy Metals",param:"ISO-17025 Certified",desc:"Every production batch undergoes 4-stage mass spectrometry testing for heavy metals, microbial safety, and active purity."}],e=a[j-1];return`
  <!-- HERO SECTION -->
  <section class="hero-section" id="hero-section">
    <canvas id="scroll-canvas" class="hero-canvas"></canvas>
    <div id="frame-loader" class="frame-loader"><div class="frame-loader-bar" id="frame-load-bar"></div></div>
    <div class="scroll-hint-overlay" id="scroll-hint">${g("arrow_dn",16)}<span>Scroll to explore</span></div>
    
    <div class="hero-overlay-content">
      <div class="hero-text-block animate-fade-in">
        <span class="badge badge-gold hero-badge">Science-Backed Nutraceuticals</span>
        <h1 class="hero-title-big">Start Your Journey To<br><span class="hero-title-accent">Better Health.</span></h1>
        <p class="hero-tagline">High-absorption nutraceuticals. Clinically engineered. Zero compromise.</p>
        
        <div class="hero-actions">
          <button class="btn btn-gold btn-lg" data-route="shop">Shop Formulations</button>
          <button class="btn btn-ghost btn-lg" data-route="science">Our Science →</button>
        </div>
      </div>
      <div class="hero-trust-strip animate-fade-in">
        <div class="trust-chip">${g("shield",16)}<span>GMP Certified</span></div>
        <div class="trust-chip-sep"></div>
        <div class="trust-chip">${g("check",16)}<span>100% Lab Tested</span></div>
        <div class="trust-chip-sep"></div>
        <div class="trust-chip">${g("truck",16)}<span>Free Shipping ₹1,499+</span></div>
        <div class="trust-chip-sep"></div>
        <div class="trust-chip">★★★★★<span>4.9 Rating</span></div>
      </div>
    </div>
  </section>

  <!-- PRODUCTS GRID -->
  <section class="section-padding" style="background:var(--white)">
    <div class="container">
      <div class="section-header animate-on-scroll">
        <span class="badge badge-forest" style="margin-bottom:10px">Daily Essentials</span>
        <h2>Clinically Formulated For Every Cell.</h2>
        <p>Science-backed synbiotics, minerals, and lipid nutrients targeting cellular bio-available pathways.</p>
      </div>
      <div class="products-grid" id="home-grid">${n.products.map(i=>oe(i)).join("")}</div>
    </div>
  </section>

  <!-- IN-PLACE LAB PROCESS SECTION (NO FULL PAGE RELOAD) -->
  <section class="section-padding" style="background:var(--sand-light);border-top:1px solid var(--sand-border);border-bottom:1px solid var(--sand-border)">
    <div class="container">
      <div class="section-header animate-on-scroll">
        <span class="badge badge-gold" style="margin-bottom:10px">Inside The Aurite Bio-Lab</span>
        <h2>How We Engineer Bio-Availability</h2>
        <p>Click through our 4-step formulation lifecycle to see real-time lab parameters and delivery technology.</p>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1.2fr;gap:36px;align-items:center;background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-xl);padding:36px;box-shadow:var(--shadow-md)">
        <div>
          <div style="display:flex;flex-direction:column;gap:12px">
            ${a.map(i=>`
              <button class="lab-step-btn ${j===i.num?"active":""}" data-step="${i.num}" type="button" style="display:flex;align-items:center;gap:16px;padding:16px 20px;border-radius:var(--r-md);border:1px solid ${j===i.num?"var(--gold)":"var(--sand-border)"};background:${j===i.num?"var(--forest)":"var(--sand)"};color:${j===i.num?"#fff":"var(--forest-dark)"};cursor:pointer;transition:all 0.3s ease;text-align:left">
                <span style="font-family:var(--font-serif);font-weight:800;font-size:1.4rem;color:${j===i.num?"var(--gold)":"var(--text-light)"}">0${i.num}</span>
                <span style="font-weight:700;font-size:.95rem">${i.title}</span>
              </button>`).join("")}
          </div>
        </div>

        <div style="background:var(--forest-dark);color:var(--sand-light);padding:36px;border-radius:var(--r-lg);position:relative;overflow:hidden" id="lab-step-display">
          <span class="badge badge-gold" style="position:absolute;top:20px;right:20px" id="lab-step-badge">Step 0${e.num} Active</span>
          <h3 style="font-family:var(--font-serif);font-size:1.8rem;color:var(--sand-light);margin-bottom:4px" id="lab-step-title">${e.title}</h3>
          <div style="font-size:.85rem;color:var(--gold);font-weight:700;margin-bottom:14px" id="lab-step-phase">${e.phase}</div>
          <p style="color:rgba(250,247,242,.8);line-height:1.7;margin-bottom:24px;font-size:1rem" id="lab-step-desc">${e.desc}</p>
          
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;border-top:1px solid rgba(255,255,255,0.15);padding-top:20px">
            <div>
              <div style="font-size:.75rem;color:var(--gold);text-transform:uppercase;font-weight:700">Lab Metric A</div>
              <div style="font-weight:800;font-size:1.1rem;margin-top:2px" id="lab-metric-a">${e.temp}</div>
            </div>
            <div>
              <div style="font-size:.75rem;color:var(--gold);text-transform:uppercase;font-weight:700">Lab Metric B</div>
              <div style="font-weight:800;font-size:1.1rem;margin-top:2px" id="lab-metric-b">${e.param}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SCIENCE BANNER -->
  <section class="section-padding" style="background:var(--sand)">
    <div class="container">
      <div class="science-banner animate-on-scroll">
        <div class="science-content">
          <span class="badge badge-gold" style="align-self:flex-start;margin-bottom:14px">Enteric Shield Tech</span>
          <h2>Most supplements fail to survive digestion. Aurite does.</h2>
          <p style="color:rgba(250,247,242,.75);line-height:1.7;margin-bottom:28px;font-size:1rem">Standard capsules dissolve in stomach acid, destroying up to 84% of active nutrients. Aurite's nested capsule shield releases 100% of compounds safely into the small intestine.</p>
          <button class="btn btn-gold btn-lg" data-route="science" style="align-self:flex-start">Learn Bio-Shield Tech →</button>
        </div>
        <div class="science-image-wrap"><img src="/images/science_capsule.jpg" alt="Aurite Science Capsule"></div>
      </div>
      <div class="metrics-row animate-on-scroll">
        <div class="metric-item"><div class="metric-value" data-count="500">0</div><div class="metric-label">Health Transformations</div></div>
        <div class="metric-item"><div class="metric-value" data-count="99.4">0</div><div class="metric-label">Stomach Acid Survival %</div></div>
        <div class="metric-item"><div class="metric-value" data-count="100">0</div><div class="metric-label">Third-Party Tested %</div></div>
        <div class="metric-item"><div class="metric-value" data-count="4.9">0</div><div class="metric-label">Customer Score / 5</div></div>
      </div>
    </div>
  </section>

  <!-- CUSTOMER TESTIMONIALS / FEEDBACK -->
  <section class="section-padding" style="background:var(--white)">
    <div class="container">
      <div class="section-header animate-on-scroll">
        <span class="badge badge-forest" style="margin-bottom:10px">Real Transformations</span>
        <h2>What Our Members Say</h2>
        <p>Over 500+ members have transformed their health with Aurite science-backed formulations.</p>
      </div>
      <div class="products-grid" style="grid-template-columns:repeat(3,1fr)">
        ${[{name:"Dr. Priya Mehta",role:"Cardiologist, Mumbai",avatar:"PM",rating:5,text:"I recommend Aurite Omega-3 to my cardiac patients. The enteric-shielded delivery is the only way to guarantee EPA/DHA absorption past stomach acid. Exceptional clinical quality.",product:"Omega-3 Triple Strength"},{name:"Rajesh Khanna",role:"Competitive Athlete, Bangalore",avatar:"RK",rating:5,text:"My recovery time dropped by nearly 30% after starting Magnesium Bisglycinate. Sleep quality went from 6 hours fitful to 7.5 hours deep sleep. The science is real.",product:"Magnesium Complex"},{name:"Ananya Sharma",role:"Wellness Coach, Delhi",avatar:"AS",rating:5,text:"The Daily Greens formula completely changed my gut health journey. Bloating gone within 2 weeks. My clients now ask me which greens I use — I only recommend Aurite.",product:"Daily Wellness Greens"}].map(i=>`
        <div class="product-card" style="padding:28px;cursor:default">
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:18px">
            <div style="width:48px;height:48px;border-radius:50%;background:var(--forest);color:var(--sand-light);display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:700;flex-shrink:0">${i.avatar}</div>
            <div>
              <div style="font-weight:700;font-size:.95rem;color:var(--forest-dark)">${i.name}</div>
              <div style="font-size:.78rem;color:var(--text-muted)">${i.role}</div>
            </div>
          </div>
          <div style="color:var(--gold);font-size:1rem;margin-bottom:12px">★★★★★</div>
          <p style="font-size:.88rem;color:var(--text-muted);line-height:1.7;margin-bottom:14px;font-style:italic">"${i.text}"</p>
          <span class="badge badge-gold" style="font-size:.68rem">${i.product}</span>
        </div>`).join("")}
      </div>
    </div>
  </section>`}function qe(){return window.innerWidth>=900?De():Le()}let F="All";function je(){const a=["All","Vitality & Brain","Minerals & Sleep","Daily Greens & Gut"],e=F==="All"?n.products:n.products.filter(i=>i.category===F);return`
  <div class="shop-page-wrapper">
    <div class="container">
      <div style="text-align:center;max-width:680px;margin:0 auto 28px">
        <span class="badge badge-gold" style="margin-bottom:10px;font-size:.65rem;padding:4px 12px;border-radius:999px">Complete Catalog</span>
        <h1 style="font-family:var(--font-serif);color:var(--forest-dark);margin-bottom:8px;font-size:1.75rem;line-height:1.2">Shop Aurite Products</h1>
        <p style="color:var(--text-muted);font-size:.88rem;margin:0">Pure science-backed nutrients engineered for peak cellular absorption.</p>
      </div>

      <!-- FILTER ROW WITH CLEAN HIDDEN SCROLLBAR -->
      <div class="shop-filter-bar" style="margin: 28px 0 36px; padding-bottom: 18px; border-bottom: 1px solid var(--sand-border); display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap;">
        <div class="filter-pills" style="display: flex; gap: 8px; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; -ms-overflow-style: none; padding: 4px 2px 6px; max-width: 100%;">
          ${a.map(i=>`<button class="filter-pill ${F===i?"active":""}" data-cat="${i}" style="flex-shrink:0;white-space:nowrap;font-size:.78rem;padding:7px 16px;border-radius:999px">${i}</button>`).join("")}
        </div>
        <div style="font-size:.78rem;font-weight:700;color:var(--text-muted);white-space:nowrap">${e.length} Products Available</div>
      </div>

      <!-- PRODUCTS GRID -->
      <div class="products-grid" id="shop-grid" style="margin-bottom: 48px;">${e.map(i=>oe(i)).join("")}</div>
    </div>
  </div>`}function He(){const a=["All","Vitality & Brain","Minerals & Sleep","Daily Greens & Gut"],e=F==="All"?n.products:n.products.filter(i=>i.category===F);return`
  <div class="container section-padding">
    <div style="text-align:center;max-width:680px;margin:0 auto 36px">
      <span class="badge badge-gold" style="margin-bottom:10px">All Formulations</span>
      <h1 style="font-family:var(--font-serif);color:var(--forest-dark);margin-bottom:12px">Shop Aurite Formulations</h1>
      <p style="color:var(--text-muted);font-size:1rem">Pure science-backed nutrients engineered for peak cellular absorption.</p>
    </div>
    <div class="shop-filter-bar">
      <div class="filter-pills">
        ${a.map(i=>`<button class="filter-pill ${F===i?"active":""}" data-cat="${i}">${i}</button>`).join("")}
      </div>
      <div style="font-size:.85rem;font-weight:600;color:var(--text-muted)">${e.length} Formulations</div>
    </div>
    <div class="products-grid" id="shop-grid">${e.map(i=>oe(i)).join("")}</div>
  </div>`}function ke(){return window.innerWidth>=900?He():je()}function Ne(a){const e=n.products.find(l=>l.id===a)||n.products[0],i=e.stockQty!==void 0&&e.stockQty<=0,t=e.images&&e.images.length>0?e.images:[e.image],r=(n.reviews||[]).filter(l=>l.productId===a),o=r.length>0?(r.reduce((l,p)=>l+p.rating,0)/r.length).toFixed(1):e.rating||4.9,s=e.highlights||["100% Lab Tested","Enteric Shielded","No Artificial Additives"],d=Math.round(parseFloat(o)),c="★".repeat(d)+"☆".repeat(5-d);return`
  <div style="width:100%;max-width:1000px;margin:0 auto;padding:68px 0 40px">
    <div style="padding:10px 16px 6px">
      <a data-route="shop" style="display:inline-flex;align-items:center;gap:6px;font-size:.78rem;font-weight:700;color:var(--forest);cursor:pointer;opacity:.85;transition:opacity .2s">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5m7-7-7 7 7 7"/></svg>
        Back to Shop
      </a>
    </div>

    <div class="product-detail-hero" style="gap:20px">
      <!-- FULL BLEED EDGE-TO-EDGE IMAGE GALLERY -->
      <div style="display:flex;flex-direction:column;gap:8px">
        <div id="pd-main-img-wrap" style="background:#f4efe6;border-radius:0 !important;padding:0;display:flex;align-items:center;justify-content:center;border:none;overflow:hidden;position:relative;touch-action:pan-y;cursor:grab;aspect-ratio:1/1;width:100%;max-height:440px">
          <img id="pd-main-img" src="${t[0]}" alt="${e.name}" style="width:100%;height:100%;object-fit:cover;object-position:center center;display:block;transition:opacity .25s ease" onerror="this.src='${e.image}'">
        </div>
        ${t.length>1?`
        <div style="display:flex;gap:6px;overflow-x:auto;padding:6px 16px" id="pd-thumb-strip">
          ${t.map((l,p)=>`
          <div class="pd-thumb ${p===0?"active":""} " data-idx="${p}" style="flex-shrink:0;width:52px;height:52px;border-radius:0 !important;border:1.5px solid ${p===0?"var(--forest-dark)":"var(--sand-border)"};background:#f4efe6;overflow:hidden;cursor:pointer;transition:border-color .2s;display:flex;align-items:center;justify-content:center;padding:0">
            <img src="${l}" style="width:100%;height:100%;object-fit:cover;object-position:center" onerror="this.style.background='#f4efe6'">
          </div>`).join("")}
        </div>`:""}
      </div>

      <!-- PRODUCT INFO (COMPACT WITH PADDING) -->
      <div style="padding:10px 16px 16px;display:flex;flex-direction:column">
        <span class="badge badge-gold" style="align-self:flex-start;font-size:.58rem;padding:2px 7px;border-radius:999px;margin-bottom:6px">${e.badge}</span>
        <h1 style="font-family:var(--font-serif);color:var(--forest-dark);margin-bottom:3px;font-size:1.25rem;line-height:1.25">${e.name}</h1>
        <p style="color:var(--gold);font-weight:600;font-size:.76rem;margin-bottom:8px">${e.tagline}</p>

        <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px">
          <div style="color:#f59e0b;font-size:.82rem;letter-spacing:.5px">${c}</div>
          <span style="font-weight:700;color:var(--forest-dark);font-size:.76rem">${o}</span>
          <span style="color:var(--text-muted);font-size:.70rem">(${r.length||e.reviewsCount||0} reviews)</span>
        </div>

        <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:10px">
          <span style="font-size:1.15rem;font-weight:800;color:var(--forest-dark);letter-spacing:-0.3px">${w(e.price)}</span>
          <span style="font-size:.72rem;color:var(--text-light)">${e.servings}</span>
        </div>

        <p style="font-size:.78rem;color:var(--text-dark);line-height:1.55;margin-bottom:12px">${e.description}</p>

        <!-- HIGHLIGHTS -->
        <div style="background:linear-gradient(135deg,rgba(20,51,37,.04),rgba(197,160,89,.08));border:1px solid var(--sand-border);border-radius:var(--r-md);padding:10px 12px;margin-bottom:14px">
          <div style="font-weight:700;font-size:.68rem;color:var(--forest-dark);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Key Highlights</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px">
            ${s.map(l=>`<span style="display:inline-flex;align-items:center;gap:4px;background:var(--white);border:1px solid var(--sand-border);border-radius:999px;padding:3px 8px;font-size:.66rem;font-weight:600;color:var(--forest-dark)">
              <span style="color:var(--forest);font-weight:800">✓</span> ${l}
            </span>`).join("")}
          </div>
        </div>

        <!-- ADD TO CART -->
        <div style="margin-bottom:14px">
          ${i?'<button class="btn btn-secondary" disabled style="width:100%;opacity:0.6;cursor:not-allowed;padding:10px;font-size:.82rem">Out of Stock</button>':`<button class="btn btn-gold" id="detail-add-btn" style="width:100%;padding:10px 16px;font-size:.85rem;font-weight:700">Add To Cart — ${w(e.price)}</button>`}
        </div>

        <!-- TRUST BADGES -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
          ${[["🚚","Free Shipping","₹1,499+"],["↩️","Easy Returns","2-day"],["🔬","Lab Tested","Certified"],["⚡","Fast Dispatch","24 hours"]].map(([l,p,m])=>`
          <div style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-sm)">
            <span style="font-size:.85rem">${l}</span>
            <div><div style="font-size:.66rem;font-weight:700;color:var(--forest-dark);line-height:1.2">${p}</div><div style="font-size:.58rem;color:var(--text-muted);line-height:1.2">${m}</div></div>
          </div>`).join("")}
        </div>
      </div>
    </div>

    <!-- BOTTOM DETAILS ROW (COMPACT) -->
    <div style="padding:0 16px;margin-top:16px;display:flex;flex-direction:column;gap:12px" class="product-bottom-grid">
      <!-- RETURN & REFUND POLICY -->
      <div style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-md);padding:12px;box-shadow:var(--shadow-sm)">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid var(--sand-border)">
          <span style="font-size:1rem">↩️</span>
          <h3 style="font-family:var(--font-sans);font-weight:700;font-size:.82rem;color:var(--forest-dark);margin:0">Returns &amp; Refund Policy</h3>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;font-size:.74rem;color:var(--text-dark);line-height:1.45">
          <div style="display:flex;gap:6px"><span style="color:var(--forest);font-weight:700;flex-shrink:0">✓</span><div><strong>2-Day Window</strong> — Return if damaged, defective, or incorrect.</div></div>
          <div style="display:flex;gap:6px"><span style="color:var(--forest);font-weight:700;flex-shrink:0">✓</span><div><strong>Full Refund</strong> — 5–7 days to original payment method.</div></div>
          <div style="display:flex;gap:6px"><span style="color:var(--forest);font-weight:700;flex-shrink:0">✓</span><div>Contact <a href="mailto:returns@aurite.com" style="color:var(--forest);font-weight:700">returns@aurite.com</a> with order ID.</div></div>
        </div>
      </div>

      <!-- CUSTOMER SUPPORT -->
      <div style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-md);padding:12px;box-shadow:var(--shadow-sm)">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid var(--sand-border)">
          <span style="font-size:1rem">💬</span>
          <h3 style="font-family:var(--font-sans);font-weight:700;font-size:.82rem;color:var(--forest-dark);margin:0">Customer Support</h3>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;font-size:.74rem;color:var(--text-dark)">
          <div style="display:flex;gap:8px;align-items:center;padding:6px 8px;background:var(--sand-light);border-radius:var(--r-sm)">
            <span style="font-size:.9rem">📧</span>
            <div style="font-size:.72rem"><strong style="color:var(--forest-dark)">Email:</strong> <a href="mailto:support@aurite.com" style="color:var(--forest);font-weight:700">support@aurite.com</a></div>
          </div>
          <a data-route="contact" style="display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:7px 10px;background:var(--forest);color:var(--sand-light);border-radius:var(--r-sm);font-weight:700;font-size:.72rem;cursor:pointer;text-decoration:none;margin-top:2px">
            Submit Support Query →
          </a>
        </div>
      </div>
    </div>

    <!-- CUSTOMER REVIEWS (COMPACT) -->
    <div style="padding:0 16px;margin:16px 0 28px">
      <div style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-md);padding:14px;box-shadow:var(--shadow-sm)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--sand-border)">
          <h3 style="font-family:var(--font-sans);font-weight:700;font-size:.85rem;color:var(--forest-dark);margin:0">Customer Reviews</h3>
          <div style="display:flex;align-items:center;gap:4px">
            <span style="color:#f59e0b;font-size:.80rem">${"★".repeat(Math.round(parseFloat(o)))}</span>
            <span style="font-weight:700;color:var(--forest-dark);font-size:.76rem">${o}</span>
          </div>
        </div>
        ${r.length>0?`<div style="display:flex;flex-direction:column;gap:10px">
            ${r.map(l=>`
            <div style="padding-bottom:8px;border-bottom:1px solid var(--sand-border)">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px">
                <div style="display:flex;align-items:center;gap:6px">
                  <div style="width:22px;height:22px;border-radius:50%;background:var(--forest);color:var(--sand-light);display:flex;align-items:center;justify-content:center;font-size:.58rem;font-weight:700">${te(l.customerName)}</div>
                  <div style="font-weight:700;color:var(--forest-dark);font-size:.76rem">${l.customerName}</div>
                </div>
                <span style="color:var(--text-muted);font-size:.62rem">${l.date}</span>
              </div>
              ${l.text?`<p style="font-size:.72rem;color:var(--text-dark);line-height:1.4;margin:0;padding-left:28px">${l.text}</p>`:""}
            </div>`).join("")}
          </div>`:'<p style="font-size:.74rem;color:var(--text-muted);font-style:italic;margin:0;text-align:center;padding:10px 0">No reviews yet. Be the first to review!</p>'}
      </div>
    </div>
  </div>`}function Fe(a){const e=n.products.find(l=>l.id===a)||n.products[0],i=e.stockQty!==void 0&&e.stockQty<=0,t=e.images&&e.images.length>0?e.images:[e.image],r=(n.reviews||[]).filter(l=>l.productId===a),o=r.length>0?(r.reduce((l,p)=>l+p.rating,0)/r.length).toFixed(1):e.rating||4.9,s=e.highlights||["100% Lab Tested","Enteric Shielded","No Artificial Additives"],d=Math.round(parseFloat(o)),c="★".repeat(d)+"☆".repeat(5-d);return`
  <div class="container section-padding">
    <div style="margin-bottom:20px">
      <a data-route="shop" style="display:inline-flex;align-items:center;gap:6px;font-size:.9rem;font-weight:700;color:var(--forest);cursor:pointer;opacity:.8;transition:opacity .2s" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=.8">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5m7-7-7 7 7 7"/></svg>
        Back to Shop
      </a>
    </div>

    <div class="product-detail-hero" style="gap:48px">
      <!-- FULL-COVER IMAGE SHOWCASE (Mobile-style Cover Box, No Left/Right Arrow Buttons) -->
      <div style="display:flex;flex-direction:column;gap:12px">
        <div id="pd-main-img-wrap" style="background:#f4efe6;border-radius:var(--r-xl);padding:0;display:flex;align-items:center;justify-content:center;border:1px solid var(--sand-border);overflow:hidden;position:relative;touch-action:pan-y;cursor:grab;aspect-ratio:1/1;width:100%;max-height:520px;box-shadow:var(--shadow-md)">
          <img id="pd-main-img" src="${t[0]}" alt="${e.name}" style="width:100%;height:100%;object-fit:cover;object-position:center center;display:block;transition:opacity .25s ease" onerror="this.src='${e.image}'">
        </div>
        ${t.length>1?`
        <div style="display:flex;gap:10px;overflow-x:auto;padding-bottom:4px" id="pd-thumb-strip">
          ${t.map((l,p)=>`
            <div class="pd-thumb ${p===0?"active":""}" data-idx="${p}" style="width:72px;height:72px;border-radius:var(--r-md);border:2px solid ${p===0?"var(--forest-dark)":"var(--sand-border)"};overflow:hidden;cursor:pointer;flex-shrink:0;transition:border-color .2s;background:#f4efe6">
              <img src="${l}" alt="Thumbnail ${p+1}" style="width:100%;height:100%;object-fit:cover;display:block">
            </div>`).join("")}
        </div>`:""}
      </div>

      <!-- PRODUCT INFO & BUY -->
      <div style="display:flex;flex-direction:column;gap:20px">
        <div>
          <div style="display:flex;gap:8px;margin-bottom:10px">
            <span class="badge badge-gold">${e.badge}</span>
            <span class="badge badge-forest">${e.category}</span>
          </div>
          <h1 style="font-family:var(--font-serif);font-size:2.2rem;color:var(--forest-dark);margin-bottom:8px">${e.name}</h1>
          <div style="display:flex;align-items:center;gap:8px">
            <div style="color:var(--gold);font-size:1.1rem">${c}</div>
            <span style="font-weight:700;color:var(--forest-dark)">${o}</span>
            <span style="color:var(--text-muted);font-size:.85rem">(${r.length||e.reviewsCount||0} reviews)</span>
          </div>
        </div>

        <p style="font-size:1rem;color:var(--text-muted);line-height:1.7">${e.longDesc||e.desc}</p>

        <!-- HIGHLIGHTS -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:18px">
          ${s.map(l=>`
          <div style="display:flex;align-items:center;gap:8px;font-size:.85rem;font-weight:600;color:var(--forest-dark)">
            ${g("check",16)}<span>${l}</span>
          </div>`).join("")}
        </div>

        <!-- DOSAGE & SPEC -->
        <div style="display:flex;gap:16px;font-size:.82rem;color:var(--text-muted);background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-md);padding:12px 16px">
          <div><strong style="color:var(--forest-dark)">Dosage:</strong> ${e.dosage||"2 capsules daily"}</div>
          <div>&bull;</div>
          <div><strong style="color:var(--forest-dark)">Form:</strong> ${e.form||"Enteric Shielded"}</div>
          <div>&bull;</div>
          <div><strong style="color:var(--forest-dark)">Supply:</strong> ${e.supply||"30-Day"}</div>
        </div>

        <!-- PURCHASE OPTIONS -->
        <div style="display:flex;flex-direction:column;gap:10px">
          <div style="display:flex;align-items:baseline;gap:12px">
            <span style="font-size:2rem;font-weight:800;color:var(--forest-dark)">${w(e.price)}</span>
            <span style="font-size:.85rem;color:var(--gold);font-weight:600">Free cold-chain delivery ₹1,499+</span>
          </div>
          ${i?'<button class="btn btn-secondary btn-lg" disabled style="width:100%;opacity:0.6;cursor:not-allowed">Out of Stock</button>':`<button class="btn btn-gold btn-lg" id="detail-add-btn" style="width:100%">Add To Cart — ${w(e.price)}</button>`}
        </div>

        <!-- TRUST BADGES -->
        <div style="display:flex;gap:16px;flex-wrap:wrap">
          ${[["🚚","Free Shipping","on orders above ₹1,499"],["↩️","Easy Returns","2-day hassle-free"],["🔬","Lab Tested","3rd party verified"],["⚡","Fast Dispatch","Ships in 24 hours"]].map(([l,p,m])=>`
          <div style="display:flex;align-items:center;gap:8px;padding:10px 12px;background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-md);flex:1;min-width:120px">
            <span style="font-size:1.1rem">${l}</span>
            <div><div style="font-size:.75rem;font-weight:700;color:var(--forest-dark)">${p}</div><div style="font-size:.68rem;color:var(--text-muted)">${m}</div></div>
          </div>`).join("")}
        </div>
      </div>
    </div>

    <!-- BOTTOM DETAILS ROW -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:40px" class="product-bottom-grid">

      <!-- RETURN & REFUND POLICY -->
      <div style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:24px;box-shadow:var(--shadow-sm)">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--sand-border)">
          <span style="font-size:1.4rem">↩️</span>
          <h3 style="font-family:var(--font-sans);font-weight:700;font-size:1rem;color:var(--forest-dark);margin:0">Returns &amp; Refund Policy</h3>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;font-size:.85rem;color:var(--text-dark);line-height:1.6">
          <div style="display:flex;gap:10px"><span style="color:var(--forest);font-weight:700;flex-shrink:0">✓</span><div><strong>2-Day Return & Exchange Window</strong> — You can raise a return or exchange request within 2 days (48 hours) of delivery if the product is damaged, defective, or incorrect.</div></div>
          <div style="display:flex;gap:10px"><span style="color:var(--forest);font-weight:700;flex-shrink:0">✓</span><div><strong>Full Refund / Replacement</strong> — Refunds are processed within 5–7 business days to your original payment method after inspection.</div></div>
          <div style="display:flex;gap:10px"><span style="color:#f59e0b;font-weight:700;flex-shrink:0">⚠</span><div><strong>Non-Returnable</strong> — Opened or used products cannot be returned due to health &amp; safety regulations, unless defective.</div></div>
          <div style="display:flex;gap:10px"><span style="color:var(--forest);font-weight:700;flex-shrink:0">✓</span><div>To initiate a return or exchange, raise a request directly from your <strong>Order History</strong> in your Profile.</div></div>
        </div>
      </div>

      <!-- CUSTOMER SUPPORT -->
      <div style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:24px;box-shadow:var(--shadow-sm)">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--sand-border)">
          <span style="font-size:1.4rem">💬</span>
          <h3 style="font-family:var(--font-sans);font-weight:700;font-size:1rem;color:var(--forest-dark);margin:0">Customer Support</h3>
        </div>
        <div style="display:flex;flex-direction:column;gap:14px;font-size:.85rem;color:var(--text-dark);">
          <div style="display:flex;gap:12px;align-items:flex-start;padding:14px 16px;background:var(--sand-light);border-radius:var(--r-md);border:1px solid var(--sand-border)">
            <span style="font-size:1.3rem">📧</span>
            <div><div style="font-weight:700;color:var(--forest-dark);margin-bottom:2px">Email Support</div><div style="color:var(--text-muted);font-size:.8rem;margin-bottom:4px">Dedicated clinical assistance · Response within 24 hours</div><a href="mailto:support@aurite.com" style="color:var(--forest);font-weight:700">support@aurite.com</a></div>
          </div>
          <a data-route="contact" style="display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 18px;background:var(--forest);color:var(--sand-light);border-radius:var(--r-md);font-weight:700;font-size:.88rem;cursor:pointer;text-decoration:none">
            Submit a Support Query →
          </a>
        </div>
      </div>
    </div>

    <!-- CUSTOMER REVIEWS -->
    <div style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:28px;margin-top:24px;box-shadow:var(--shadow-sm)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--sand-border)">
        <div>
          <h3 style="font-family:var(--font-sans);font-weight:700;font-size:1.05rem;color:var(--forest-dark);margin:0 0 4px">Customer Reviews</h3>
          <div style="display:flex;align-items:center;gap:6px">
            <div style="color:#f59e0b;font-size:1rem">${"★".repeat(Math.round(parseFloat(o)))}${"☆".repeat(5-Math.round(parseFloat(o)))}</div>
            <span style="font-weight:700;color:var(--forest-dark)">${o}</span>
            <span style="color:var(--text-muted);font-size:.82rem">out of 5 · ${r.length||e.reviewsCount||0} reviews</span>
          </div>
        </div>
      </div>

      ${r.length>0?`<div style="display:flex;flex-direction:column;gap:20px">
          ${r.map(l=>`
          <div style="padding-bottom:20px;border-bottom:1px solid var(--sand-border)">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
              <div style="display:flex;align-items:center;gap:10px">
                <div style="width:36px;height:36px;border-radius:50%;background:var(--forest);color:var(--sand-light);display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;flex-shrink:0">${te(l.customerName)}</div>
                <div>
                  <div style="font-weight:700;color:var(--forest-dark);font-size:.9rem">${l.customerName}</div>
                  <div style="color:#f59e0b;font-size:.9rem;margin-top:2px">${"★".repeat(l.rating)}${"☆".repeat(5-l.rating)}</div>
                </div>
              </div>
              <span style="color:var(--text-muted);font-size:.75rem;flex-shrink:0">${l.date}</span>
            </div>
            ${l.text?`<p style="font-size:.88rem;color:var(--text-dark);line-height:1.65;margin:0;padding-left:46px">${l.text}</p>`:""}
          </div>`).join("")}
        </div>`:`<div style="text-align:center;padding:40px 0;color:var(--text-muted)">
          <div style="font-size:2.5rem;margin-bottom:10px">⭐</div>
          <p style="font-size:.9rem;font-style:italic">No reviews yet. Be the first to review this product after purchasing!</p>
        </div>`}
    </div>
  </div>`}function _e(a){return window.innerWidth>=900?Fe(a):Ne(a)}function Ue(a){var d,c;const e=document.getElementById("detail-add-btn");e&&e.addEventListener("click",()=>{const l=n.products.find(p=>p.id===a);l&&(n.addToCart(l,"one-time",1),f(`${l.name} added to cart! 🎉`))});const i=n.products.find(l=>l.id===a)||n.products[0],t=i.images&&i.images.length>0?i.images:[i.image];if(t.length<=1)return;let r=0;function o(l){l=(l+t.length)%t.length,r=l;const p=document.getElementById("pd-main-img");p&&(p.style.opacity="0",setTimeout(()=>{p.src=t[l],p.style.opacity="1"},150)),document.querySelectorAll(".pd-thumb").forEach((m,u)=>{m.style.borderColor=u===l?"var(--forest-dark)":"var(--sand-border)",m.classList.toggle("active",u===l)})}(d=document.getElementById("pd-prev-btn"))==null||d.addEventListener("click",()=>o(r-1)),(c=document.getElementById("pd-next-btn"))==null||c.addEventListener("click",()=>o(r+1)),document.querySelectorAll(".pd-thumb").forEach((l,p)=>{l.addEventListener("click",()=>o(p))});const s=document.getElementById("pd-main-img-wrap");if(s){let l=0;s.addEventListener("touchstart",u=>{l=u.touches[0].clientX},{passive:!0}),s.addEventListener("touchend",u=>{const v=l-u.changedTouches[0].clientX;Math.abs(v)>40&&(v>0?o(r+1):o(r-1))},{passive:!0});let p=!1,m=0;s.addEventListener("mousedown",u=>{p=!0,m=u.clientX,s.style.cursor="grabbing"}),s.addEventListener("mouseleave",()=>{p=!1,s.style.cursor="grab"}),s.addEventListener("mouseup",u=>{if(!p)return;p=!1,s.style.cursor="grab";const v=m-u.clientX;Math.abs(v)>40&&(v>0?o(r+1):o(r-1))})}}function Ge(){return`
  <div style="padding-top:80px;padding-bottom:48px;">
    <div class="container">

      <!-- Hero intro -->
      <div style="text-align:center;max-width:480px;margin:0 auto 24px;padding:0 8px">
        <span class="badge badge-gold" style="margin-bottom:6px;font-size:.56rem;padding:2px 8px">Innovation</span>
        <h1 style="font-family:var(--font-serif);font-size:1.22rem;font-weight:700;color:var(--forest-dark);margin-bottom:6px;line-height:1.28">The Science of<br>Bio-Availability</h1>
        <p style="color:var(--text-muted);font-size:.78rem;line-height:1.5;max-width:340px;margin:0 auto">Why standard supplements fail, and how Aurite's delivery system guarantees cellular absorption.</p>
      </div>

      <!-- Encapsulation -->
      <div style="display:grid;grid-template-columns:1fr;gap:16px;margin-bottom:28px" class="science-page-grid">
        <div style="order:2;border-radius:var(--r-xl);overflow:hidden" class="science-image-wrap">
          <img src="/images/science_capsule.jpg" alt="Capsule Absorption" style="border-radius:var(--r-xl) !important;width:100%;object-fit:cover;max-height:220px;box-shadow:var(--shadow-md);display:block">
        </div>
        <div style="order:1">
          <span class="badge badge-forest" style="margin-bottom:6px;font-size:.54rem;padding:2px 8px">Digestive Bypass</span>
          <h2 style="font-family:var(--font-serif);font-size:1.1rem;font-weight:700;color:var(--forest-dark);margin-bottom:6px;line-height:1.28">Acid-Resistant<br>Micro-Encapsulation</h2>
          <p style="color:var(--text-muted);font-size:.78rem;line-height:1.55;margin-bottom:6px">The human stomach secretes acid at pH 1.5–2.0. Standard gel caps disintegrate in 15 minutes, destroying nutrients before absorption.</p>
          <p style="color:var(--text-muted);font-size:.78rem;line-height:1.55">Aurite's alginate matrix dissolves only at the alkaline pH 7.4 environment of the lower GI tract — maximising delivery.</p>
        </div>
      </div>

      <!-- Research stats — dark card -->
      <div style="background:var(--forest-dark);border-radius:var(--r-xl);padding:24px 20px;margin-bottom:28px">
        <div style="text-align:center;margin-bottom:20px">
          <span class="badge badge-gold" style="margin-bottom:6px;font-size:.6rem">Research</span>
          <p style="font-family:var(--font-serif);font-size:1rem;color:var(--sand-light);margin:0">Backed by Peer-Reviewed Science</p>
        </div>
        <div style="display:grid;grid-template-columns:1fr;gap:12px">
          ${[{icon:"🧬",title:"Liposomal Omega-3",stat:"340% Higher Bioavailability",desc:"Nano-encapsulated EPA/DHA outperforms standard fish oil by 3.4× in 2023 JAMA Cardiology trial."},{icon:"⚗️",title:"Bisglycinate Chelation",stat:"67% Faster Absorption",desc:"Glycine-chelated magnesium bypasses intestinal transporters, eliminating competitive absorption loss."},{icon:"🌱",title:"Synbiotic Matrix",stat:"89% Strain Survival",desc:"Multi-strain probiotic achieves 89% cecal delivery vs 12% for standard powder."}].map(a=>`
          <div style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);border-radius:var(--r-md);padding:16px;display:flex;gap:14px;align-items:flex-start">
            <span style="font-size:1.5rem;flex-shrink:0">${a.icon}</span>
            <div>
              <div style="font-size:.7rem;color:var(--gold);font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px">${a.title}</div>
              <div style="font-family:var(--font-serif);font-size:.95rem;color:var(--sand-light);margin-bottom:4px">${a.stat}</div>
              <p style="font-size:.78rem;color:rgba(250,247,242,.65);line-height:1.55;margin:0">${a.desc}</p>
            </div>
          </div>`).join("")}
        </div>
      </div>

      <!-- Certifications -->
      <div style="margin-bottom:28px">
        <p style="font-family:var(--font-serif);font-size:.95rem;color:var(--forest-dark);text-align:center;margin-bottom:14px">Facility Certifications</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          ${[{cert:"GMP",full:"Good Manufacturing Practice",desc:"ISO 22716 certified facility with continuous air filtration."},{cert:"ISO-17025",full:"Lab Accreditation",desc:"Accredited for trace mineral and bioactive compound analysis."},{cert:"FSSAI",full:"Food Safety Standards",desc:"Fully licensed with annual facility audits."},{cert:"COA",full:"Certificate of Analysis",desc:"3rd-party COA covering potency, purity and microbial safety."}].map(a=>`
          <div style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-md);padding:14px;text-align:center;box-shadow:var(--shadow-sm)">
            <div style="font-family:var(--font-serif);font-size:1.2rem;font-weight:700;color:var(--forest-dark);margin-bottom:2px">${a.cert}</div>
            <div style="font-size:.62rem;font-weight:700;text-transform:uppercase;color:var(--gold);letter-spacing:.05em;margin-bottom:6px">${a.full}</div>
            <p style="font-size:.72rem;color:var(--text-muted);line-height:1.5;margin:0">${a.desc}</p>
          </div>`).join("")}
        </div>
      </div>

      <!-- No nasties -->
      <div style="background:var(--sand);border-radius:var(--r-xl);padding:20px 18px">
        <p style="font-family:var(--font-serif);font-size:.95rem;color:var(--forest-dark);text-align:center;margin-bottom:4px">What We Never Put In</p>
        <p style="font-size:.76rem;color:var(--text-muted);text-align:center;margin-bottom:14px">Strict prohibited ingredient list across all products.</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          ${["Artificial Colors","Magnesium Stearate","Titanium Dioxide","GMO Ingredients","Sodium Benzoate","Silicon Dioxide"].map(a=>`
          <div style="display:flex;align-items:center;gap:10px;background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-md);padding:10px 12px;box-shadow:var(--shadow-sm)">
            <span style="width:24px;height:24px;border-radius:50%;background:rgba(239,68,68,0.12);color:var(--error);display:flex;align-items:center;justify-content:center;font-size:.84rem;font-weight:800;flex-shrink:0;line-height:1">✗</span>
            <span style="font-size:.76rem;font-weight:600;color:var(--forest-dark)">${a}</span>
          </div>`).join("")}
        </div>
      </div>

    </div>
  </div>`}function Qe(){return`
  <div class="container section-padding">
    <div style="text-align:center; max-width:760px; margin:0 auto 56px auto;">
      <span class="badge badge-forest" style="margin-bottom:12px;">Molecular Innovation</span>
      <h1 style="font-family:var(--font-serif); font-size:3rem; color:var(--forest-dark); margin-bottom:16px;">
        The Science of Bio-Availability
      </h1>
      <p style="color:var(--text-muted); font-size:1.1rem; line-height:1.7;">
        Why standard supplements fail, and how Aurite's patent-pending delivery system guarantees cellular absorption.
      </p>
    </div>

    <!-- Acid-Resistant Micro-Encapsulation Grid -->
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:48px; align-items:center; margin-bottom:64px;" class="science-page-grid">
      <div>
        <span class="badge badge-gold" style="margin-bottom:12px;">Enteric Shield Tech</span>
        <h2 style="font-family:var(--font-serif); font-size:2.2rem; color:var(--forest-dark); margin-bottom:16px;">
          Acid-Resistant Micro-Encapsulation
        </h2>
        <p style="color:var(--text-muted); line-height:1.7; margin-bottom:20px; font-size:1.02rem">
          The human stomach secretes hydrochloric acid at a pH of 1.5 to 2.0. Standard gelatin capsules disintegrate within 15 minutes, exposing sensitive probiotics, enzymes, and delicate lipids to destruction.
        </p>
        <p style="color:var(--text-muted); line-height:1.7; font-size:1.02rem">
          Aurite utilizes a natural alginate-derived matrix that remains completely intact through stomach passage, dissolving smoothly only when exposed to the alkaline pH 7.4 environment of the lower GI tract.
        </p>
      </div>

      <div>
        <img src="/images/science_capsule.jpg" alt="Science Bio Capsule" style="width:100%; border-radius:var(--r-xl); box-shadow:var(--shadow-lg); border:1px solid var(--sand-border)">
      </div>
    </div>

    <!-- 3 Delivery Research Breakthroughs (Dark Luxury Card) -->
    <div style="background:var(--forest-dark); border-radius:var(--r-xl); padding:40px; margin-bottom:64px; color:var(--sand-light)">
      <div style="text-align:center; max-width:680px; margin:0 auto 32px">
        <span class="badge badge-gold" style="margin-bottom:10px">Clinical Research</span>
        <h3 style="font-family:var(--font-serif); font-size:2rem; color:var(--sand-light); margin-bottom:8px">Delivery Breakthroughs</h3>
        <p style="color:rgba(250,247,242,.75); font-size:.95rem">Proven bio-availability gains confirmed through peer-reviewed human clinical trials.</p>
      </div>

      <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:24px">
        ${[{icon:"🧬",title:"Liposomal Omega-3",stat:"340% Higher Bioavailability",desc:"Nano-encapsulated EPA/DHA outperforms standard fish oil by 3.4× in 2023 JAMA Cardiology trial."},{icon:"⚗️",title:"Bisglycinate Chelation",stat:"67% Faster Absorption",desc:"Glycine-chelated magnesium bypasses intestinal transporters, eliminating competitive absorption loss."},{icon:"🌱",title:"Synbiotic Matrix",stat:"89% Strain Survival",desc:"Multi-strain probiotic achieves 89% cecal delivery vs 12% for standard powder."}].map(a=>`
        <div class="science-research-card" style="background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.12); border-radius:var(--r-lg); padding:24px; display:flex; flex-direction:column; gap:12px; cursor:default">
          <span style="font-size:2rem">${a.icon}</span>
          <div style="font-size:.78rem; color:var(--gold); font-weight:700; text-transform:uppercase; letter-spacing:.06em">${a.title}</div>
          <div style="font-family:var(--font-serif); font-size:1.2rem; color:var(--sand-light); font-weight:700">${a.stat}</div>
          <p style="font-size:.88rem; color:rgba(250,247,242,.7); line-height:1.6; margin:0">${a.desc}</p>
        </div>`).join("")}
      </div>
    </div>

    <!-- Facility Certifications (4-column Grid) -->
    <div style="margin-bottom:64px">
      <div style="text-align:center; margin-bottom:32px">
        <span class="badge badge-forest" style="margin-bottom:8px">Purity Standards</span>
        <h3 style="font-family:var(--font-serif); font-size:2rem; color:var(--forest-dark); margin:0">Facility Certifications &amp; Auditing</h3>
      </div>
      <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:20px">
        ${[{cert:"GMP",full:"Good Manufacturing Practice",desc:"ISO 22716 certified facility with continuous HEPA air filtration and cleanroom isolation."},{cert:"ISO-17025",full:"Lab Accreditation",desc:"Accredited for trace mineral, heavy metals, and bioactive compound potency analysis."},{cert:"FSSAI",full:"Food Safety Standards",desc:"Fully licensed with strict continuous batch surveillance and annual facility audits."},{cert:"COA",full:"Certificate of Analysis",desc:"Every SKU backed by public 3rd-party COA verifying potency, purity and zero pathogens."}].map(a=>`
        <div class="science-cert-card" style="background:var(--white); border:1px solid var(--sand-border); border-radius:var(--r-lg); padding:24px; text-align:center; box-shadow:var(--shadow-sm); cursor:default">
          <div style="font-family:var(--font-serif); font-size:1.8rem; font-weight:800; color:var(--forest-dark); margin-bottom:4px">${a.cert}</div>
          <div style="font-size:.72rem; font-weight:700; text-transform:uppercase; color:var(--gold); letter-spacing:.05em; margin-bottom:10px">${a.full}</div>
          <p style="font-size:.82rem; color:var(--text-muted); line-height:1.55; margin:0">${a.desc}</p>
        </div>`).join("")}
      </div>
    </div>

    <!-- What We Never Put In (Prohibited List) -->
    <div style="background:var(--sand-light); border:1px solid var(--sand-border); border-radius:var(--r-xl); padding:36px 40px; margin-bottom:64px">
      <div style="text-align:center; max-width:620px; margin:0 auto 24px">
        <h3 style="font-family:var(--font-serif); font-size:1.8rem; color:var(--forest-dark); margin-bottom:6px">What We Never Put In</h3>
        <p style="font-size:.9rem; color:var(--text-muted); margin:0">Strict prohibited ingredient list maintained across all Aurite formulations.</p>
      </div>
      <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:14px">
        ${["Artificial Colors & Dyes","Magnesium Stearate","Titanium Dioxide","GMO Ingredients","Sodium Benzoate Preservatives","Silicon Dioxide Flow Agents"].map(a=>`
        <div class="science-prohibited-card" style="display:flex; align-items:center; gap:12px; background:var(--white); border:1px solid var(--sand-border); border-radius:var(--r-md); padding:14px 18px; box-shadow:var(--shadow-sm); cursor:default">
          <span style="width:28px;height:28px;border-radius:50%;background:rgba(239,68,68,0.12);color:var(--error);display:flex;align-items:center;justify-content:center;font-size:.95rem;font-weight:800;flex-shrink:0;line-height:1">✗</span>
          <span style="font-size:.9rem; font-weight:700; color:var(--forest-dark)">${a}</span>
        </div>`).join("")}
      </div>
    </div>

    <!-- Clinical Standards Comparison Table -->
    <div style="background:var(--white); border:1px solid var(--sand-border); border-radius:var(--r-xl); padding:40px; box-shadow:var(--shadow-md);">
      <h3 style="font-family:var(--font-serif); text-align:center; font-size:2rem; margin-bottom:32px; color:var(--forest-dark)">Clinical Standards Comparison</h3>
      
      <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.95rem;">
        <thead>
          <tr style="border-bottom:2px solid var(--forest-dark);">
            <th style="padding:16px;">Quality Metric</th>
            <th style="padding:16px; color:var(--forest); font-weight:700;">Aurite Standards</th>
            <th style="padding:16px; color:var(--text-light);">Generic Store Brands</th>
          </tr>
        </thead>
        <tbody>
          <tr class="science-table-row" style="border-bottom:1px solid var(--sand-border);">
            <td style="padding:16px; font-weight:600;">Stomach Acid Survival</td>
            <td style="padding:16px; color:var(--forest); font-weight:700;">✓ 99.4% Survival Guaranteed</td>
            <td style="padding:16px; color:var(--error);">✗ &lt; 16% Active Compound Survival</td>
          </tr>
          <tr class="science-table-row" style="border-bottom:1px solid var(--sand-border);">
            <td style="padding:16px; font-weight:600;">Heavy Metal Screening</td>
            <td style="padding:16px; color:var(--forest); font-weight:700;">✓ Quadruple ICP-MS Tested</td>
            <td style="padding:16px; color:var(--text-light);">Basic Batch Testing</td>
          </tr>
          <tr class="science-table-row" style="border-bottom:1px solid var(--sand-border);">
            <td style="padding:16px; font-weight:600;">Fish Oil Oxidation (TOTOX)</td>
            <td style="padding:16px; color:var(--forest); font-weight:700;">✓ Ultra-fresh TOTOX &lt; 5</td>
            <td style="padding:16px; color:var(--error);">TOTOX &gt; 26 (Rancid Smell)</td>
          </tr>
          <tr class="science-table-row">
            <td style="padding:16px; font-weight:600;">Synthetic Binders / Fillers</td>
            <td style="padding:16px; color:var(--forest); font-weight:700;">✓ Zero Artificial Fillers</td>
            <td style="padding:16px; color:var(--text-light);">Magnesium Stearate &amp; Silicon Dioxide</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>`}function We(){return window.innerWidth>=900?Qe():Ge()}function Ve(){return`
  <div style="padding-top:80px;padding-bottom:48px;">
    <div class="container">

      <!-- Hero intro -->
      <div style="text-align:center;max-width:560px;margin:0 auto 28px">
        <span class="badge badge-gold" style="margin-bottom:8px;font-size:.62rem">Our Mission</span>
        <h1 style="font-family:var(--font-serif);font-size:1.45rem;color:var(--forest-dark);margin-bottom:8px;line-height:1.25">Empowering Human Longevity</h1>
        <p style="color:var(--text-muted);font-size:.82rem;line-height:1.6">Founded to eliminate marketing fluff and engineer supplements that deliver measurable biological results.</p>
      </div>

      <!-- Three pillars -->
      <div style="display:grid;grid-template-columns:1fr;gap:12px;margin-bottom:28px">
        ${[{t:"Clinical Efficacy",d:"Every compound is supported by double-blind human clinical trials.",icon:"award"},{t:"Radical Transparency",d:"Full-disclosure labeling with exact milligram amounts and published COA.",icon:"shield"},{t:"Earth Stewardship",d:"Friend of the Sea certified sourcing & 100% recyclable glass containers.",icon:"leaf"}].map(a=>`
        <div style="display:flex;gap:14px;align-items:flex-start;background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-md);padding:16px;box-shadow:var(--shadow-sm)">
          <div style="width:38px;height:38px;border-radius:var(--r-md);background:var(--gold-light);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--forest-dark)">${g(a.icon,18)}</div>
          <div>
            <div style="font-weight:700;font-size:.88rem;color:var(--forest-dark);margin-bottom:3px">${a.t}</div>
            <p style="font-size:.78rem;color:var(--text-muted);line-height:1.55;margin:0">${a.d}</p>
          </div>
        </div>`).join("")}
      </div>

      <!-- Origin story -->
      <div style="background:var(--forest-dark);border-radius:var(--r-xl);padding:22px 18px;margin-bottom:24px;color:var(--sand-light)">
        <span class="badge badge-gold" style="margin-bottom:10px;font-size:.6rem">Founded 2024</span>
        <p style="font-family:var(--font-serif);font-size:1rem;color:var(--sand-light);margin-bottom:10px;line-height:1.3">Born From Frustration With Broken Industry Standards</p>
        <p style="font-size:.8rem;color:rgba(250,247,242,.8);line-height:1.6;margin-bottom:10px">After a decade of clinical research, our founders found 79% of bestselling brands used inferior ingredients, underdosed beyond therapeutic thresholds, and hid fillers.</p>
        <p style="font-size:.8rem;color:rgba(250,247,242,.8);line-height:1.6;margin:0">Aurite was built from scratch — starting with manufacturing, then working backwards to ingredients, dosing, and finally branding.</p>
      </div>

      <!-- Timeline -->
      <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:28px">
        ${[{year:"2022",event:"R&D Phase",desc:"3 years of sourcing research across 14 countries. Final shortlist: 6 suppliers above 99.8% COA compliance."},{year:"2024",event:"GMP Facility",desc:"GMP facility in Pune commissioned with inline mass spectrometry quality auditing."},{year:"2025",event:"First Launch",desc:"Omega-3 & Magnesium launched. 94% of early customers reported measurable effects within 28 days."},{year:"2026",event:"Clinical Expansion",desc:"Synbiotic blend added. Partnerships with 12 leading cardiologists and GPs initiated."}].map(a=>`
        <div style="display:flex;gap:14px;align-items:flex-start">
          <div style="flex-shrink:0;width:52px;height:52px;border-radius:var(--r-md);background:var(--gold-light);border:1px solid var(--gold);display:flex;align-items:center;justify-content:center;font-family:var(--font-serif);font-weight:700;color:var(--forest-dark);font-size:.78rem">${a.year}</div>
          <div>
            <div style="font-weight:700;font-size:.85rem;color:var(--forest-dark);margin-bottom:2px">${a.event}</div>
            <p style="font-size:.76rem;color:var(--text-muted);line-height:1.55;margin:0">${a.desc}</p>
          </div>
        </div>`).join("")}
      </div>

      <!-- Stats grid -->
      <div style="background:var(--sand);border-radius:var(--r-xl);padding:20px 16px;margin-bottom:24px">
        <p style="font-family:var(--font-serif);font-size:.95rem;color:var(--forest-dark);text-align:center;margin-bottom:14px">By the Numbers</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          ${[{num:"500+",label:"Transformations",sub:"Verified outcomes in 2025–26"},{num:"12",label:"Clinical Partners",sub:"Cardiologists & GPs"},{num:"0",label:"Hidden Fillers",sub:"Full-disclosure every SKU"},{num:"48h",label:"Support Response",sub:"Human advisors, not bots"}].map(a=>`
          <div style="text-align:center;background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-md);padding:16px;box-shadow:var(--shadow-sm)">
            <div style="font-family:var(--font-serif);font-size:1.6rem;font-weight:700;color:var(--forest-dark);line-height:1">${a.num}</div>
            <div style="font-weight:700;font-size:.78rem;color:var(--forest);margin:3px 0 2px">${a.label}</div>
            <div style="font-size:.68rem;color:var(--text-muted);line-height:1.4">${a.sub}</div>
          </div>`).join("")}
        </div>
      </div>

      <!-- Sustainability -->
      <div style="border:1px solid var(--sand-border);border-radius:var(--r-xl);padding:20px 18px;background:var(--white)">
        <span class="badge badge-forest" style="margin-bottom:8px;font-size:.6rem">Sustainability</span>
        <p style="font-family:var(--font-serif);font-size:.95rem;color:var(--forest-dark);margin-bottom:8px">Crafted for Health. Packaged for the Planet.</p>
        <p style="font-size:.78rem;color:var(--text-muted);line-height:1.6;margin-bottom:12px">Zero-plastic dark-forest glass packaging. 100% recyclable and refillable. Wild-sourced marine ingredients are Friend of the Sea certified.</p>
        <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:16px">
          <div style="display:flex;flex-wrap:wrap;gap:6px">
            <span class="badge badge-gold" style="font-size:.54rem;padding:3px 9px;letter-spacing:.04em">Friend of the Sea</span>
            <span class="badge badge-purity" style="font-size:.54rem;padding:3px 9px;letter-spacing:.04em">Zero Plastic</span>
          </div>
          <div>
            <span class="badge badge-forest" style="font-size:.54rem;padding:3px 9px;letter-spacing:.04em">Carbon Neutral Shipping</span>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:0">
          ${[{label:"Glass Jars Recycled",value:"12,400+"},{label:"Plastic Eliminated",value:"3,200 kg"},{label:"Wild Catch Offset",value:"100%"},{label:"Carbon Offset Credits",value:"8.4 Tonnes"}].map(a=>`
          <div style="display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--sand-border)">
            <span style="font-size:.78rem;color:var(--text-muted)">${a.label}</span>
            <span style="font-size:.78rem;font-weight:700;color:var(--forest-dark)">${a.value}</span>
          </div>`).join("")}
        </div>
      </div>

    </div>
  </div>`}function Ye(){return`
  <div class="container section-padding">
    <div style="text-align:center; max-width:760px; margin:0 auto 56px auto;">
      <span class="badge badge-gold" style="margin-bottom:12px;">Purity &amp; Purpose</span>
      <h1 style="font-family:var(--font-serif); font-size:3rem; color:var(--forest-dark); margin-bottom:16px;">
        Empowering Human Longevity Through Science
      </h1>
      <p style="color:var(--text-muted); font-size:1.1rem; line-height:1.7;">
        Aurite was founded on a simple principle: supplements should deliver measurable biological results, not just marketing claims.
      </p>
    </div>

    <!-- Core Pillars Grid (3 Columns) -->
    <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:28px; margin-bottom:64px;" class="about-hero-grid">
      ${[{t:"Clinical Efficacy",d:"Every compound included in Aurite formulations is supported by double-blind human clinical trials.",icon:"award"},{t:"Radical Transparency",d:"Full-disclosure labeling with exact milligram amounts and published Certificate of Analysis.",icon:"shield"},{t:"Ocean & Earth Stewardship",d:"Friend of the Sea certified wild sourcing and 100% recyclable dark-green glass containers.",icon:"leaf"}].map(e=>`
        <div class="about-pillar-card" style="background:var(--white); border:1px solid var(--sand-border); border-radius:var(--r-xl); padding:32px; box-shadow:var(--shadow-sm); cursor:default">
          <div style="width:52px; height:52px; border-radius:var(--r-md); background:var(--sand); color:var(--forest); display:flex; align-items:center; justify-content:center; margin-bottom:20px;">
            ${g(e.icon,24)}
          </div>
          <h3 style="font-family:var(--font-serif); font-size:1.4rem; color:var(--forest-dark); margin-bottom:12px;">${e.t}</h3>
          <p style="color:var(--text-muted); line-height:1.65; font-size:0.95rem;">${e.d}</p>
        </div>
      `).join("")}
    </div>

    <!-- Origin Story Card (Dark Forest Luxury Panel) -->
    <div class="about-origin-card" style="background:var(--forest-dark); border-radius:var(--r-xl); padding:48px 56px; margin-bottom:64px; color:var(--sand-light); border:1px solid rgba(197,160,89,0.3); transition:all .3s ease">
      <div style="max-width:840px; margin:0 auto; text-align:center">
        <span class="badge badge-gold" style="margin-bottom:14px; font-size:.74rem">Founded 2024</span>
        <h2 style="font-family:var(--font-serif); font-size:2.2rem; color:var(--sand-light); margin-bottom:16px; line-height:1.3">
          Born From Frustration With Broken Industry Standards
        </h2>
        <p style="font-size:1.02rem; color:rgba(250,247,242,.85); line-height:1.75; margin-bottom:16px">
          After a decade of clinical research, our founders found that 79% of bestselling supplement brands used inferior chemical forms, underdosed active compounds below therapeutic thresholds, and hid synthetic fillers under proprietary blends.
        </p>
        <p style="font-size:1.02rem; color:rgba(250,247,242,.85); line-height:1.75; margin:0">
          Aurite was built from scratch — starting in certified laboratories, working backwards from human mucosal absorption pathways to ingredient selection, clinical dosing, and zero-plastic glass packaging.
        </p>
      </div>
    </div>

    <!-- The Journey Timeline -->
    <div style="background:var(--sand-light); border-radius:var(--r-xl); padding:56px 64px; border:1px solid var(--sand-border); margin-bottom:64px">
      <h2 style="font-family:var(--font-serif); font-size:2.2rem; text-align:center; color:var(--forest-dark); margin-bottom:44px;">Our Clinical Timeline</h2>
      
      <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:32px; max-width:960px; margin:0 auto;">
        ${[{year:"2022",event:"Global Sourcing & R&D",desc:"3 years of botanical research across 14 countries. Final shortlist: 6 certified suppliers exceeding 99.8% purity compliance."},{year:"2024",event:"GMP Cleanroom Facility",desc:"State-of-the-art facility commissioned with inline mass spectrometry quality auditing and inert atmosphere encapsulation."},{year:"2025",event:"Enteric Shield Patent & Launch",desc:"Omega-3 & Magnesium launched. 94% of early trial members reported measurable bio-markers within 28 days."},{year:"2026",event:"National Clinical Network",desc:"Partnered with over 500 clinical practitioners and established direct-to-consumer molecular purity tracking."}].map(e=>`
        <div class="about-timeline-card" style="display:flex; gap:18px; align-items:flex-start; background:var(--white); border:1px solid var(--sand-border); border-radius:var(--r-lg); padding:24px; box-shadow:var(--shadow-sm); cursor:default">
          <div style="flex-shrink:0; width:60px; height:60px; border-radius:var(--r-md); background:var(--gold-light); border:1.5px solid var(--gold); display:flex; align-items:center; justify-content:center; font-family:var(--font-serif); font-weight:800; color:var(--forest-dark); font-size:1.1rem">${e.year}</div>
          <div>
            <h4 style="font-size:1.05rem; font-weight:700; color:var(--forest-dark); margin-bottom:4px">${e.event}</h4>
            <p style="font-size:.88rem; color:var(--text-muted); line-height:1.6; margin:0">${e.desc}</p>
          </div>
        </div>`).join("")}
      </div>
    </div>

    <!-- By The Numbers (4-Column Stats Grid) -->
    <div style="margin-bottom:64px">
      <div style="text-align:center; margin-bottom:32px">
        <span class="badge badge-forest" style="margin-bottom:8px">Impact Metrics</span>
        <h3 style="font-family:var(--font-serif); font-size:2rem; color:var(--forest-dark); margin:0">By the Numbers</h3>
      </div>
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:20px">
        ${[{num:"500+",label:"Transformations",sub:"Verified member health outcomes in 2025–26"},{num:"12+",label:"Clinical Partners",sub:"Board-certified cardiologists & general practitioners"},{num:"0",label:"Hidden Fillers",sub:"Full-disclosure milligram labeling on every SKU"},{num:"&lt; 24h",label:"Support Response",sub:"Dedicated human wellness advisors, never bots"}].map(e=>`
        <div class="about-stat-card" style="text-align:center; background:var(--white); border:1px solid var(--sand-border); border-radius:var(--r-lg); padding:28px 20px; box-shadow:var(--shadow-sm); cursor:default">
          <div style="font-family:var(--font-serif); font-size:2.4rem; font-weight:800; color:var(--forest-dark); line-height:1">${e.num}</div>
          <div style="font-weight:800; font-size:.9rem; color:var(--forest); margin:8px 0 4px">${e.label}</div>
          <div style="font-size:.78rem; color:var(--text-muted); line-height:1.45">${e.sub}</div>
        </div>`).join("")}
      </div>
    </div>

    <!-- Sustainability & Planet Stewardship -->
    <div style="border:1px solid var(--sand-border); border-radius:var(--r-xl); padding:40px 48px; background:var(--white); box-shadow:var(--shadow-sm)">
      <div style="display:grid; grid-template-columns:1.2fr 1fr; gap:48px; align-items:center">
        <div>
          <span class="badge badge-forest" style="margin-bottom:12px; font-size:.72rem">Sustainability</span>
          <h3 style="font-family:var(--font-serif); font-size:2rem; color:var(--forest-dark); margin-bottom:12px">Crafted for Health. Packaged for the Planet.</h3>
          <p style="font-size:.95rem; color:var(--text-muted); line-height:1.7; margin-bottom:18px">Zero-plastic dark-forest glass packaging. 100% recyclable, UV-shielded and refillable. Wild-sourced marine ingredients are Friend of the Sea certified to preserve marine ecosystems.</p>
          <div style="display:flex; flex-wrap:wrap; gap:10px">
            <span class="badge badge-gold" style="font-size:.72rem; padding:6px 14px">Friend of the Sea Certified</span>
            <span class="badge badge-forest" style="font-size:.72rem; padding:6px 14px">Carbon Neutral Shipping</span>
            <span class="badge badge-purity" style="font-size:.72rem; padding:6px 14px">100% Zero Single-Use Plastic</span>
          </div>
        </div>

        <div style="background:var(--sand-light); border:1px solid var(--sand-border); border-radius:var(--r-lg); padding:24px 28px; display:flex; flex-direction:column; gap:6px">
          ${[{label:"Glass Jars Recycled & Refilled",value:"12,400+"},{label:"Single-Use Plastic Eliminated",value:"3,200 kg"},{label:"Wild Catch Offset",value:"100%"},{label:"Carbon Offset Credits Verified",value:"8.4 Tonnes"}].map(e=>`
          <div class="sustainability-row" style="display:flex; justify-content:space-between; align-items:center; padding:12px 6px; border-bottom:1px solid var(--sand-border)">
            <span style="font-size:.88rem; color:var(--text-dark); font-weight:500">${e.label}</span>
            <span style="font-size:.95rem; font-weight:800; color:var(--forest-dark)">${e.value}</span>
          </div>`).join("")}
        </div>
      </div>
    </div>

  </div>`}function Je(){return window.innerWidth>=900?Ye():Ve()}function Xe(){const a=[{q:"How should I store my supplements?",a:"Store in a cool, dry place. Our dark glass jars are light-shielded — refrigeration not required."},{q:"Can I manage orders anytime?",a:"Yes — adjust delivery dates or update details from your Account Dashboard."},{q:"Are products third-party tested?",a:"Every batch is ISO-accredited 3rd-party tested for heavy metals, microbial safety, and potency."},{q:"What is your support response window?",a:"Our team responds to all inquiries within 24 business hours."}];return`
  <div style="padding-top:80px;padding-bottom:48px;">
    <div class="container">
      <div style="text-align:center;max-width:520px;margin:0 auto 20px">
        <span class="badge badge-gold" style="margin-bottom:8px;font-size:.65rem">Customer Support</span>
        <h1 style="font-family:var(--font-serif);font-size:1.45rem;color:var(--forest-dark);margin-bottom:8px;line-height:1.25">We're Here To Help</h1>
        <p style="color:var(--text-muted);font-size:.82rem;line-height:1.6">Questions about your order, dosage, or products? Our team is ready.</p>
      </div>

      <div style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:14px 18px;margin-bottom:18px;display:flex;align-items:center;justify-content:space-between;box-shadow:var(--shadow-sm);flex-wrap:wrap;gap:10px">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:38px;height:38px;border-radius:50%;background:var(--gold-light);color:var(--forest-dark);display:flex;align-items:center;justify-content:center;flex-shrink:0">${g("mail",18)}</div>
          <div>
            <div style="font-weight:700;font-size:.8rem;color:var(--forest-dark)">Email Support</div>
            <a href="mailto:aurite@gmail.com" style="font-size:.9rem;font-weight:800;color:var(--gold);text-decoration:none">aurite@gmail.com</a>
          </div>
        </div>
        <span class="badge badge-gold" style="font-size:.6rem">Response &lt; 24h</span>
      </div>

      <div style="display:grid;grid-template-columns:1fr;gap:14px" class="contact-grid">
        <div style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:18px;box-shadow:var(--shadow-sm)">
          <p style="font-family:var(--font-serif);font-size:.95rem;color:var(--forest-dark);margin-bottom:14px">Send a Message</p>
          <form id="contact-form" style="display:flex;flex-direction:column;gap:11px">
            <div><label class="form-label" style="font-size:.75rem;margin-bottom:3px;display:block">Full Name</label><input type="text" id="ct-name" class="form-input" placeholder="Akash Sharma" required style="font-size:.84rem;padding:9px 12px"></div>
            <div><label class="form-label" style="font-size:.75rem;margin-bottom:3px;display:block">Email</label><input type="email" id="ct-email" class="form-input" placeholder="akash@example.com" required style="font-size:.84rem;padding:9px 12px"></div>
            <div><label class="form-label" style="font-size:.75rem;margin-bottom:3px;display:block">Subject</label>
              <select id="ct-subject" class="form-input" style="font-size:.84rem;padding:9px 12px"><option>General Question</option><option>Order Tracking</option><option>Medical Partnership</option></select>
            </div>
            <div><label class="form-label" style="font-size:.75rem;margin-bottom:3px;display:block">Message</label><textarea id="ct-msg" class="form-input" rows="3" placeholder="How can we help?" required style="font-size:.84rem;padding:9px 12px;resize:vertical"></textarea></div>
            <button type="submit" class="btn btn-primary" style="width:100%;font-size:.84rem;padding:10px">Send Message</button>
          </form>
        </div>
        <div>
          <p style="font-family:var(--font-serif);font-size:.95rem;color:var(--forest-dark);margin-bottom:10px">Frequently Asked</p>
          <div style="display:flex;flex-direction:column;gap:9px">
            ${a.map(e=>`
            <div style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-md);padding:13px 15px;box-shadow:var(--shadow-sm)">
              <div style="font-weight:700;font-size:.8rem;color:var(--forest-dark);margin-bottom:3px">${e.q}</div>
              <div style="font-size:.75rem;color:var(--text-muted);line-height:1.55">${e.a}</div>
            </div>`).join("")}
          </div>
        </div>
      </div>
    </div>
  </div>`}function Ze(){const a=[{q:"How should I store my Aurite supplements?",a:"Aurite dark forest glass jars are light-shielded. Store them in a cool, dry place away from direct sunlight. Refrigeration is not required but can extend fish oil freshness in warm climates."},{q:"Can I modify or pause my subscription anytime?",a:"Yes! You can skip deliveries, adjust delivery intervals, or swap formulations anytime directly inside your User Account Dashboard."},{q:"Are Aurite products third-party tested?",a:"Every single production batch undergoes ISO-accredited 3rd-party laboratory testing for heavy metals, microbial safety, and active compound potency."},{q:"What is your shipping & return policy?",a:"We offer Free Express Shipping on orders over ₹1,499. All purchases are backed by our verified 2-day return and exchange policy."}];return`
  <div class="container section-padding">
    <div style="text-align:center; max-width:720px; margin:0 auto 48px auto;">
      <span class="badge badge-gold" style="margin-bottom:12px;">Customer Support</span>
      <h1 style="font-family:var(--font-serif); font-size:3rem; color:var(--forest-dark); margin-bottom:16px;">
        We are here to help.
      </h1>
      <p style="color:var(--text-muted); font-size:1.05rem;">
        Have a question about your order, dosage guidelines, or formulations? Reach out to our wellness team.
      </p>
    </div>

    <!-- Quick Direct Contact Channels (2-column Clean Support Cards) -->
    <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:24px; margin-bottom:48px; max-width:960px; margin-left:auto; margin-right:auto">
      <div style="background:var(--white); border:1px solid var(--sand-border); border-radius:var(--r-lg); padding:24px 28px; display:flex; align-items:center; gap:18px; box-shadow:var(--shadow-sm); transition:transform .2s" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
        <div style="width:52px; height:52px; border-radius:50%; background:var(--gold-light); color:var(--forest-dark); display:flex; align-items:center; justify-content:center; flex-shrink:0">${g("mail",24)}</div>
        <div>
          <div style="font-size:.78rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:.05em">Email Support</div>
          <a href="mailto:aurite@gmail.com" style="font-size:1.1rem; font-weight:800; color:var(--forest-dark); text-decoration:none">aurite@gmail.com</a>
          <div style="font-size:.76rem; color:var(--gold); font-weight:700; margin-top:3px">Response within 24 Hours</div>
        </div>
      </div>

      <div style="background:var(--white); border:1px solid var(--sand-border); border-radius:var(--r-lg); padding:24px 28px; display:flex; align-items:center; gap:18px; box-shadow:var(--shadow-sm); transition:transform .2s" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
        <div style="width:52px; height:52px; border-radius:50%; background:rgba(16,185,129,.1); color:var(--success); display:flex; align-items:center; justify-content:center; font-size:1.4rem; flex-shrink:0">💬</div>
        <div>
          <div style="font-size:.78rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:.05em">Account Support</div>
          <div style="font-size:1.1rem; font-weight:800; color:var(--forest-dark)">Live Query Portal</div>
          <div style="font-size:.76rem; color:var(--success); font-weight:700; margin-top:3px">2-Way Verified Customer Chat</div>
        </div>
      </div>
    </div>

    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:48px; align-items:start;" class="contact-grid">
      <!-- Contact Form -->
      <div style="background:var(--white); border:1px solid var(--sand-border); border-radius:var(--r-xl); padding:36px; box-shadow:var(--shadow-sm);">
        <h3 style="font-family:var(--font-serif); font-size:1.8rem; margin-bottom:20px; color:var(--forest-dark);">Send Us a Message</h3>
        
        <form id="contact-form">
          <div class="form-group" style="margin-bottom:16px">
            <label class="form-label" style="font-size:.82rem; font-weight:700; color:var(--forest-dark); margin-bottom:6px; display:block">Your Full Name *</label>
            <input type="text" id="ct-name" required class="form-input" placeholder="Akash Sharma" style="height:44px; padding:10px 14px; font-size:.92rem">
          </div>

          <div class="form-group" style="margin-bottom:16px">
            <label class="form-label" style="font-size:.82rem; font-weight:700; color:var(--forest-dark); margin-bottom:6px; display:block">Email Address *</label>
            <input type="email" id="ct-email" required class="form-input" placeholder="akash@example.com" style="height:44px; padding:10px 14px; font-size:.92rem">
          </div>

          <div class="form-group" style="margin-bottom:16px">
            <label class="form-label" style="font-size:.82rem; font-weight:700; color:var(--forest-dark); margin-bottom:6px; display:block">Inquiry Subject *</label>
            <select id="ct-subject" class="form-input" style="height:44px; padding:10px 14px; font-size:.92rem">
              <option>General Question</option>
              <option>Order Tracking &amp; Shipping</option>
              <option>Return / Exchange Question</option>
              <option>Medical Professional Partnership</option>
            </select>
          </div>

          <div class="form-group" style="margin-bottom:20px">
            <label class="form-label" style="font-size:.82rem; font-weight:700; color:var(--forest-dark); margin-bottom:6px; display:block">Message *</label>
            <textarea id="ct-msg" required class="form-input" rows="4" placeholder="How can our clinical team assist you?" style="padding:12px 14px; font-size:.92rem; resize:vertical"></textarea>
          </div>

          <button type="submit" class="btn btn-primary btn-lg" style="width:100%; padding:14px; font-weight:800; font-size:.95rem">
            Send Message →
          </button>
        </form>
      </div>

      <!-- FAQs Accordion -->
      <div>
        <h3 style="font-family:var(--font-serif); font-size:1.8rem; margin-bottom:24px; color:var(--forest-dark);">Frequently Asked Questions</h3>
        
        <div style="display:flex; flex-direction:column; gap:16px;">
          ${a.map(e=>`
            <div style="background:var(--white); border:1px solid var(--sand-border); border-radius:var(--r-lg); padding:22px; box-shadow:var(--shadow-sm)">
              <div style="font-weight:700; font-size:1.02rem; color:var(--forest-dark); margin-bottom:8px;">${e.q}</div>
              <div style="font-size:0.9rem; color:var(--text-muted); line-height:1.65;">${e.a}</div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  </div>`}function Ke(){return window.innerWidth>=900?Ze():Xe()}function et(){var e;if(!n.isAdmin)return setTimeout(()=>Q("login"),50),`
    <div class="container" style="max-width:480px;text-align:center;padding-top:84px;padding-bottom:56px">
      <p style="color:var(--text-muted);font-size:.95rem">Redirecting to sign in...</p>
    </div>`;const a=n.getAnalytics();return`
  <div class="container" style="padding-top: 84px; padding-bottom: 56px;">
    <div class="admin-header">
      <div>
        <div style="display:flex;align-items:center;gap:10px">
          <span class="badge badge-gold">Verified Admin Session</span>
          <span style="font-size:.8rem;color:rgba(255,255,255,0.7)">${((e=n.user)==null?void 0:e.email)||"admin@aurite.com"}</span>
        </div>
        <h1 style="font-family:var(--font-sans);font-size:1.8rem;font-weight:700;letter-spacing:-0.3px;color:var(--sand-light);margin-top:6px">Aurite Executive Control Center</h1>
      </div>
    </div>

    <div class="admin-tab-bar" id="admin-tabs-row">
      <button class="admin-tab-btn ${I==="analytics"?"active":""}" data-adm-tab="analytics" type="button">${g("chart",18)} Profit &amp; Analytics</button>
      <button class="admin-tab-btn ${I==="products"?"active":""}" data-adm-tab="products" type="button">${g("box",18)} Manage Products</button>
      <button class="admin-tab-btn ${I==="orders"?"active":""}" data-adm-tab="orders" type="button">${g("truck",18)} Customer Orders (${n.orders.length})</button>
      <button class="admin-tab-btn ${I==="queries"?"active":""}" data-adm-tab="queries" type="button">${g("chat",18)} Live Queries (${n.queries.filter(i=>i.status==="Open").length})</button>
      <button class="admin-tab-btn ${I==="returns"?"active":""}" data-adm-tab="returns" type="button"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg> Return &amp; Refund (${(n.returns||[]).filter(i=>i.status!=="Refund Successful"&&i.status!=="Refund Processed"&&i.status!=="Request Rejected"&&i.status!=="Case Closed").length})</button>
      <button class="admin-tab-btn ${I==="users"?"active":""}" data-adm-tab="users" type="button">${g("user",18)} Registered Users (${(n.users||[]).length})</button>
    </div>

    <div id="admin-tab-content">
      ${W(I,a)}
    </div>
  </div>`}function W(a,e){if(a==="analytics"){const i=n.products.filter(r=>(r.stockQty||0)<15),t=[{month:"Jan",revenue:14500,profit:9800,revPct:65,profPct:44,growth:"+14%"},{month:"Feb",revenue:18200,profit:12400,revPct:82,profPct:56,growth:"+25%"},{month:"Mar",revenue:12900,profit:8600,revPct:58,profPct:38,growth:"-29%"},{month:"Apr",revenue:21e3,profit:14700,revPct:94,profPct:66,growth:"+62%"},{month:"May",revenue:16800,profit:11500,revPct:75,profPct:51,growth:"-20%"},{month:"Jun",revenue:24500,profit:17200,revPct:100,profPct:77,growth:"+45%"},{month:"Jul",revenue:19400,profit:13600,revPct:87,profPct:61,growth:"-20%"}];return`
    <!-- RESTOCK ALERT -->
    ${i.length>0?`
    <div style="background:linear-gradient(135deg,#fff3cd,#ffe8a3);border:2px solid #f59e0b;border-radius:var(--r-lg);padding:16px 20px;margin-bottom:20px;display:flex;align-items:flex-start;gap:14px">
      <div style="font-size:1.5rem;flex-shrink:0">&#9888;&#65039;</div>
      <div style="flex-grow:1">
        <div style="font-weight:800;font-size:.92rem;color:#92400e;margin-bottom:6px">Restock Alert &mdash; ${i.length} Product${i.length>1?"s":""} Running Low</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          ${i.map(r=>`
          <div style="background:#fff;border:1px solid #f59e0b;border-radius:var(--r-sm);padding:5px 10px;font-size:.78rem;font-weight:700;color:#92400e;display:flex;align-items:center;gap:6px">
            <img src="${r.image}" style="width:20px;height:20px;border-radius:4px;object-fit:cover">
            ${r.name} &mdash; <span style="color:var(--error);font-weight:800">${r.stockQty||0} left</span>
          </div>`).join("")}
        </div>
      </div>
    </div>`:`<div style="background:linear-gradient(135deg,#d1fae5,#a7f3d0);border:2px solid #10b981;border-radius:var(--r-lg);padding:14px 20px;margin-bottom:20px;display:flex;align-items:center;gap:10px">
      <span style="font-size:1.2rem">&#10003;</span>
      <span style="font-weight:700;color:#065f46;font-size:.85rem">All products are well-stocked. No restock needed.</span>
    </div>`}

    <div class="admin-stats-grid">
      <div class="admin-stat-card">
        <div class="admin-stat-label">Total Gross Sales</div>
        <div class="admin-stat-val">${w(e.totalRevenue)}</div>
        <div style="font-size:.74rem;color:var(--gold);font-weight:700">From ${e.totalOrders} Orders</div>
      </div>
      <div class="admin-stat-card">
        <div class="admin-stat-label">Production Cost</div>
        <div class="admin-stat-val" style="color:var(--text-muted)">${w(e.totalCost)}</div>
        <div style="font-size:.74rem;color:var(--text-light)">Unit Production Expense</div>
      </div>
      <div class="admin-stat-card">
        <div class="admin-stat-label">Net Profit Margin</div>
        <div class="admin-stat-val" style="color:var(--forest)">${w(e.netProfit)}</div>
        <div style="font-size:.74rem;color:var(--forest);font-weight:700">&uarr; ${e.profitMargin}% Net Margin</div>
      </div>
      <div class="admin-stat-card">
        <div class="admin-stat-label">Low Stock Alerts</div>
        <div class="admin-stat-val" style="color:${e.lowStockCount>0?"var(--error)":"var(--forest)"}">${e.lowStockCount} Items</div>
        <div style="font-size:.74rem;color:var(--error)">Requires Re-stocking</div>
      </div>
    </div>

    <!-- COMBO BAR + LINE CHART -->
    <div class="admin-chart-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px">
        <div>
          <h3 style="font-family:var(--font-sans);font-size:1.05rem;font-weight:700;color:var(--forest-dark);margin:0">Monthly Revenue &amp; Profit Performance</h3>
        </div>
        <div style="display:flex;gap:12px;font-size:.74rem;font-weight:700;flex-wrap:wrap">
          <span style="display:flex;align-items:center;gap:5px"><span style="width:10px;height:10px;background:var(--forest);border-radius:2px"></span>Gross Revenue</span>
          <span style="display:flex;align-items:center;gap:5px"><span style="width:10px;height:10px;background:var(--gold);border-radius:2px"></span>Net Profit</span>
          <span style="display:flex;align-items:center;gap:5px"><span style="width:16px;height:3px;background:#4f46e5;border-radius:2px;display:inline-block"></span>Growth Curve</span>
        </div>
      </div>

      <!-- SVG COMBO CHART with ample top headroom and clean labels -->
      <div style="position:relative;width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch">
        <svg viewBox="0 0 700 320" xmlns="http://www.w3.org/2000/svg" style="width:100%;min-width:520px;display:block;font-family:var(--font-sans);overflow:visible">
          <defs>
            <linearGradient id="barRevGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#143325"/>
              <stop offset="100%" stop-color="#091b13"/>
            </linearGradient>
            <linearGradient id="barProfGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#d4af37"/>
              <stop offset="100%" stop-color="#b38938"/>
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#4f46e5" flood-opacity="0.4"/>
            </filter>
          </defs>

          <!-- Y-axis grid lines with top headroom -->
          ${[0,25,50,75,100].map(r=>`
          <line x1="50" y1="${55+(100-r)*1.8}" x2="690" y2="${55+(100-r)*1.8}" stroke="#e5e0d3" stroke-width="1" stroke-dasharray="4,4"/>
          <text x="44" y="${59+(100-r)*1.8}" text-anchor="end" font-size="10" fill="#718096" font-weight="600">${r}%</text>`).join("")}

          <!-- Background hover columns -->
          ${t.map((r,o)=>`<rect x="${52+o*92}" y="45" width="84" height="200" rx="8" fill="rgba(20,51,37,0.02)" class="chart-col-hover" style="cursor:pointer;transition:fill .2s" onmouseover="this.setAttribute('fill','rgba(197,160,89,0.09)')" onmouseout="this.setAttribute('fill','rgba(20,51,37,0.02)')"><title>${r.month}: Revenue ₹${r.revenue.toLocaleString("en-IN")}, Profit ₹${r.profit.toLocaleString("en-IN")}, Growth ${r.growth}</title></rect>`).join("")}

          <!-- Revenue Bars -->
          ${t.map((r,o)=>{const s=62+o*92,d=r.revPct*1.8,c=55+(100-r.revPct)*1.8;return`
            <rect x="${s}" y="${c}" width="28" height="${d}" rx="4" fill="url(#barRevGrad)" style="transition:opacity .2s;cursor:pointer"><title>${r.month} Gross Revenue: ₹${r.revenue.toLocaleString("en-IN")}</title></rect>
            <text x="${s+14}" y="${c-8}" text-anchor="middle" font-size="10.5" fill="#143325" font-weight="800">₹${Math.round(r.revenue/1e3)}k</text>`}).join("")}

          <!-- Profit Bars -->
          ${t.map((r,o)=>{const s=62+o*92+32,d=r.profPct*1.8,c=55+(100-r.profPct)*1.8;return`
            <rect x="${s}" y="${c}" width="22" height="${d}" rx="4" fill="url(#barProfGrad)" style="transition:opacity .2s;cursor:pointer"><title>${r.month} Net Profit: ₹${r.profit.toLocaleString("en-IN")}</title></rect>
            <text x="${s+11}" y="${c-8}" text-anchor="middle" font-size="10" fill="#92400e" font-weight="800">₹${Math.round(r.profit/1e3)}k</text>`}).join("")}

          <!-- Growth Curve Polyline & Glowing Points -->
          <polyline points="${t.map((r,o)=>`${62+o*92+32+11},${55+(100-r.profPct)*1.8}`).join(" ")}" fill="none" stroke="#4f46e5" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/>
          
          ${t.map((r,o)=>`
          <circle cx="${62+o*92+32+11}" cy="${55+(100-r.profPct)*1.8}" r="5" fill="#4f46e5" stroke="#ffffff" stroke-width="2" style="cursor:pointer;transition:transform .2s">
            <title>${r.month} Growth Rate: ${r.growth}</title>
          </circle>`).join("")}

          <!-- X-Axis Baseline & Labels -->
          <line x1="50" y1="240" x2="690" y2="240" stroke="#d5ccb6" stroke-width="2"/>
          ${t.map((r,o)=>`<text x="${62+o*92+27}" y="265" text-anchor="middle" font-size="12" fill="#0f281e" font-weight="800">${r.month}</text>`).join("")}
        </svg>
      </div>
    </div>

    <div class="admin-table-card">
      <h3 style="font-family:var(--font-sans);font-size:1.05rem;font-weight:700;margin-bottom:14px;color:var(--forest-dark)">Product Margin &amp; Profit Breakdown</h3>
      <table style="width:100%;border-collapse:collapse;text-align:left;font-size:.84rem;min-width:540px">
        <thead>
          <tr style="border-bottom:2px solid var(--forest-dark)">
            <th style="padding:8px 0">Product Name</th>
            <th style="padding:8px 0">Stock Qty</th>
            <th style="padding:8px 0">Selling Price</th>
            <th style="padding:8px 0">Production Cost</th>
            <th style="padding:8px 0">Unit Profit</th>
            <th style="padding:8px 0;text-align:right">Margin %</th>
          </tr>
        </thead>
        <tbody>
          ${n.products.map(r=>{const o=r.price-(r.costPrice||0),s=(o/r.price*100).toFixed(1);return`
            <tr style="border-bottom:1px solid var(--sand-border)">
              <td style="padding:10px 0;font-weight:700;color:var(--forest-dark)">${r.name}</td>
              <td style="padding:10px 0"><span class="badge ${r.stockQty<15?"badge-forest":"badge-gold"}" style="${r.stockQty<15?"background:rgba(198,40,40,.15);color:var(--error)":""}">${r.stockQty} left</span></td>
              <td style="padding:10px 0;font-weight:700">${w(r.price)}</td>
              <td style="padding:10px 0;color:var(--text-muted)">${w(r.costPrice)}</td>
              <td style="padding:10px 0;color:var(--forest);font-weight:700">+${w(o)}</td>
              <td style="padding:10px 0;text-align:right;font-weight:800;color:var(--gold)">${s}%</td>
            </tr>`}).join("")}
        </tbody>
      </table>
    </div>`}if(a==="queries"){const i=n.queries.filter(s=>s.status==="Open").length,t=n.queries.filter(s=>s.status==="Resolved").length,r=n.queries.filter(s=>s.status==="Closed").length,o=n.queries.filter(s=>s.status==="Answered").length;return`
    <h3 style="font-size:1.15rem;font-weight:700;color:var(--forest-dark);margin-bottom:12px">Customer Queries &amp; Support Chat</h3>
    <!-- Query status summary -->
    <div class="admin-summary-grid">
      <div class="admin-summary-card" style="border-top:4px solid var(--forest)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <div style="width:12px;height:12px;border-radius:50%;background:var(--forest)"></div>
          <div class="summary-num" style="font-size:1.6rem;font-weight:800;color:var(--forest-dark)">${i}</div>
        </div>
        <div class="summary-label" style="font-size:.74rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);letter-spacing:0.5px">Open</div>
      </div>
      <div class="admin-summary-card" style="border-top:4px solid #f59e0b">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <div style="width:12px;height:12px;border-radius:50%;background:#f59e0b"></div>
          <div class="summary-num" style="font-size:1.6rem;font-weight:800;color:#92400e">${o}</div>
        </div>
        <div class="summary-label" style="font-size:.74rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);letter-spacing:0.5px">Answered</div>
      </div>
      <div class="admin-summary-card" style="border-top:4px solid #10b981">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <div style="width:12px;height:12px;border-radius:50%;background:#10b981"></div>
          <div class="summary-num" style="font-size:1.6rem;font-weight:800;color:#065f46">${t}</div>
        </div>
        <div class="summary-label" style="font-size:.74rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);letter-spacing:0.5px">Resolved</div>
      </div>
      <div class="admin-summary-card" style="border-top:4px solid var(--error)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <div style="width:12px;height:12px;border-radius:50%;background:var(--error)"></div>
          <div class="summary-num" style="font-size:1.6rem;font-weight:800;color:var(--error)">${r}</div>
        </div>
        <div class="summary-label" style="font-size:.74rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);letter-spacing:0.5px">Closed</div>
      </div>
      <div class="admin-summary-card" style="background:var(--forest-dark);border-color:var(--forest-dark);border-top:4px solid var(--gold)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <div style="width:12px;height:12px;border-radius:50%;background:var(--gold)"></div>
          <div class="summary-num" style="font-size:1.6rem;font-weight:800;color:var(--gold)">${n.queries.length}</div>
        </div>
        <div class="summary-label" style="font-size:.74rem;font-weight:700;text-transform:uppercase;color:rgba(255,255,255,0.7);letter-spacing:0.5px">Total</div>
      </div>
    </div>

    <!-- Live Queries View -->
    <div class="admin-split-grid">
      <div class="admin-scroll-box admin-split-left" style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:18px;max-height:640px;overflow-y:auto">
        <h4 style="font-size:.95rem;margin-bottom:12px;color:var(--forest-dark);font-weight:700">Received Customer Queries (${n.queries.length})</h4>
        ${n.queries.length===0?'<p style="color:var(--text-muted);font-size:.84rem">No queries yet.</p>':n.queries.map(s=>`
          <div class="query-item-card" data-id="${s.id}" style="border:1px solid var(--sand-border);border-radius:var(--r-md);padding:12px;margin-bottom:10px;cursor:pointer;background:var(--sand-light);transition:all .2s ease">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
              <span style="font-weight:700;font-size:.84rem;color:var(--forest-dark)">${s.customerName}</span>
              <span class="badge ${s.status==="Open"?"badge-forest":s.status==="Answered"?"badge-gold":""}" style="font-size:.64rem;${s.status==="Resolved"?"background:var(--success);color:#fff":""}${s.status==="Closed"?"background:#888;color:#fff":""};">${s.status}</span>
            </div>
            <div style="font-size:.8rem;font-weight:600;color:var(--text-dark)">${s.subject}</div>
            <div style="font-size:.72rem;color:var(--text-muted);margin-top:4px">${s.date} &bull; ${s.email}</div>
          </div>`).join("")}
      </div>

      <div class="admin-split-right" style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:20px;display:flex;flex-direction:column;min-height:540px;max-height:640px;justify-content:space-between" id="query-chatbox">
        <p style="color:var(--text-muted);text-align:center;margin:auto;font-size:.86rem">Select a customer query to open live chat conversation.</p>
      </div>
    </div>`}if(a==="users"){const i=n.users||[],t=i.filter(s=>!s.isBlocked).length,r=i.filter(s=>s.isBlocked).length,o=i.reduce((s,d)=>s+(d.totalSpent||0),0);return`
    <h3 style="font-size:1.15rem;font-weight:700;color:var(--forest-dark);margin-bottom:12px">Registered Customer Accounts &amp; Access Control</h3>

    <!-- Summary cards -->
    <div class="admin-summary-grid">
      <div class="admin-summary-card" style="border-top:4px solid var(--forest)">
        <div class="summary-num" style="font-size:1.6rem;font-weight:800;color:var(--forest-dark)">${i.length}</div>
        <div class="summary-label" style="font-size:.74rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);letter-spacing:0.5px">Total Accounts</div>
      </div>
      <div class="admin-summary-card" style="border-top:4px solid #10b981">
        <div class="summary-num" style="font-size:1.6rem;font-weight:800;color:#065f46">${t}</div>
        <div class="summary-label" style="font-size:.74rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);letter-spacing:0.5px">Active Accounts</div>
      </div>
      <div class="admin-summary-card" style="border-top:4px solid var(--error)">
        <div class="summary-num" style="font-size:1.6rem;font-weight:800;color:var(--error)">${r}</div>
        <div class="summary-label" style="font-size:.74rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);letter-spacing:0.5px">Suspended / Blocked</div>
      </div>
      <div class="admin-summary-card" style="background:var(--forest-dark);border-color:var(--forest-dark);border-top:4px solid var(--gold)">
        <div class="summary-num" style="font-size:1.6rem;font-weight:800;color:var(--gold)">${w(o)}</div>
        <div class="summary-label" style="font-size:.74rem;font-weight:700;text-transform:uppercase;color:rgba(255,255,255,0.7);letter-spacing:0.5px">Total Customer Value</div>
      </div>
    </div>

    <!-- Live Search Bar for Users by Name, ID, Email, Phone -->
    <div style="display:flex;gap:10px;margin-bottom:16px;align-items:center;flex-wrap:wrap">
      <div style="position:relative;flex-grow:1;max-width:440px">
        <input type="text" id="user-search-input" class="form-input" placeholder="🔍 Search users by name, ID, email, or phone..." style="padding:9px 14px;background:var(--white);border-color:var(--sand-border);font-size:.84rem">
      </div>
    </div>

    <!-- Users Table with full details and block/unblock -->
    <div class="admin-table-card">
      <table style="width:100%;border-collapse:collapse;text-align:left;font-size:.82rem;min-width:640px">
        <thead>
          <tr style="border-bottom:2px solid var(--forest-dark)">
            <th style="padding:8px 0">User Info</th>
            <th style="padding:8px 0">Email &amp; Joined</th>
            <th style="padding:8px 0">Mobile</th>
            <th style="padding:8px 0">Address</th>
            <th style="padding:8px 0">Orders / Spend</th>
            <th style="padding:8px 0">Status</th>
            <th style="padding:8px 0;text-align:right">Access</th>
          </tr>
        </thead>
        <tbody id="users-catalog-tbody">
          ${i.map(s=>`
          <tr class="user-row" data-user-name="${s.name}" data-user-id="${s.id}" data-user-email="${s.email}" data-user-phone="${s.phone||""}" style="border-bottom:1px solid var(--sand-border)">
            <td style="padding:10px 0">
              <div style="display:flex;align-items:center;gap:8px">
                <div style="width:32px;height:32px;border-radius:50%;background:var(--forest);color:var(--sand-light);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.76rem;flex-shrink:0">${te(s.name)}</div>
                <div>
                  <div style="font-weight:700;color:var(--forest-dark)">${s.name}</div>
                  <div style="font-size:.7rem;color:var(--text-muted)">ID: ${s.id}</div>
                </div>
              </div>
            </td>
            <td style="padding:10px 0">
              <div style="font-weight:600;color:var(--forest-dark)">${s.email}</div>
              <div style="font-size:.7rem;color:var(--text-muted)">Joined ${s.joinedDate||"2026-01-01"}</div>
            </td>
            <td style="padding:10px 0;font-weight:700;color:var(--forest)">${s.phone||"N/A"}</td>
            <td style="padding:10px 0;font-size:.78rem;color:var(--text-dark);max-width:160px">${s.address||"N/A"}</td>
            <td style="padding:10px 0">
              <div style="font-weight:700">${s.ordersCount||0} orders</div>
              <div style="font-size:.74rem;color:var(--gold);font-weight:700">${w(s.totalSpent||0)}</div>
            </td>
            <td style="padding:10px 0">
              <span class="badge ${s.isBlocked?"":"badge-forest"}" style="font-size:.65rem;${s.isBlocked?"background:rgba(239,68,68,.15);color:var(--error);border:1px solid rgba(239,68,68,.3)":""}">
                ${s.isBlocked?"🚫 Suspended":"✅ Active"}
              </span>
            </td>
            <td style="padding:10px 0;text-align:right">
              ${s.isBlocked?`
              <button class="btn btn-sm btn-gold" data-adm-toggle-block="${s.id}" style="padding:4px 10px;font-size:.72rem">
                ✅ Unblock
              </button>`:`
              <button class="btn btn-sm" data-adm-toggle-block="${s.id}" style="padding:4px 10px;font-size:.72rem;background:rgba(239,68,68,.12);color:var(--error);border:1px solid rgba(239,68,68,.3);border-radius:var(--r-sm)">
                🚫 Block
              </button>`}
            </td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>`}if(a==="returns"){const i=n.returns||[],t=i.filter(s=>s.status==="Under Review"||s.status==="Requested").length,r=i.filter(s=>s.status==="Approved"||s.status==="Refund Successful"||s.status==="Refund Processed"||s.status==="Return Approved (Ship Back)").length,o=i.reduce((s,d)=>s+(d.amount||0),0);return`
    <h3 style="font-size:1.15rem;font-weight:700;color:var(--forest-dark);margin-bottom:12px">Returns, Refunds &amp; Exchanges Resolution Center</h3>
    
    <!-- Return status summary -->
    <div class="admin-summary-grid">
      <div class="admin-summary-card" style="border-top:4px solid #f59e0b">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:1.3rem">⏳</span>
          <div class="summary-num" style="font-size:1.6rem;font-weight:800;color:#92400e">${t}</div>
        </div>
        <div class="summary-label" style="font-size:.74rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);letter-spacing:0.5px">Under Review</div>
      </div>
      <div class="admin-summary-card" style="border-top:4px solid #10b981">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:1.3rem">✅</span>
          <div class="summary-num" style="font-size:1.6rem;font-weight:800;color:#065f46">${r}</div>
        </div>
        <div class="summary-label" style="font-size:.74rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);letter-spacing:0.5px">Approved / Resolved</div>
      </div>
      <div class="admin-summary-card" style="border-top:4px solid var(--forest)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:1.3rem">💰</span>
          <div class="summary-num" style="font-size:1.6rem;font-weight:800;color:var(--forest-dark)">${w(o)}</div>
        </div>
        <div class="summary-label" style="font-size:.74rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);letter-spacing:0.5px">Total Claimed Value</div>
      </div>
      <div class="admin-summary-card" style="background:var(--forest-dark);border-color:var(--forest-dark);border-top:4px solid var(--gold)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:1.3rem">📦</span>
          <div class="summary-num" style="font-size:1.6rem;font-weight:800;color:var(--gold)">${i.length}</div>
        </div>
        <div class="summary-label" style="font-size:.74rem;font-weight:700;text-transform:uppercase;color:rgba(255,255,255,0.7);letter-spacing:0.5px">Total Cases</div>
      </div>
    </div>

    <!-- Returns Interactive Split View -->
    <div class="admin-split-grid">
      <!-- Left Column: Return Cases List -->
      <div class="admin-scroll-box admin-split-left" style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:18px;max-height:640px;overflow-y:auto">
        <h4 style="font-size:.95rem;margin-bottom:12px;color:var(--forest-dark);font-weight:700">Return &amp; Refund Requests (${i.length})</h4>
        ${i.length===0?'<p style="color:var(--text-muted);font-size:.84rem;text-align:center;padding:30px 0">No return requests logged.</p>':`
        <div style="display:flex;flex-direction:column;gap:10px">
          ${i.map(s=>`
          <div class="adm-return-card" data-retid="${s.id}" style="border:1px solid var(--sand-border);border-radius:var(--r-md);padding:12px;cursor:pointer;background:var(--sand-light);transition:all .2s ease">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
              <span style="font-weight:800;font-size:.84rem;color:var(--forest-dark)">#${s.id} &bull; Order #${s.orderId}</span>
              <span class="badge ${s.status==="Refund Successful"||s.status==="Refund Processed"||s.status==="Approved"?"badge-forest":s.status==="Request Rejected"?"":"badge-gold"}" style="font-size:.65rem;${s.status==="Request Rejected"?"background:rgba(198,40,40,.15);color:var(--error)":""}">${s.status}</span>
            </div>
            <div style="font-weight:700;font-size:.82rem;color:var(--forest-dark)">${s.productName}</div>
            <div style="font-size:.74rem;color:#92400e;font-weight:600;margin-top:2px">${s.reason}</div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;font-size:.72rem;color:var(--text-muted)">
              <span>${s.customerName} (${s.phone||"N/A"})</span>
              <span style="font-weight:800;color:var(--gold);font-size:.84rem">${w(s.amount)}</span>
            </div>
          </div>`).join("")}
        </div>`}
      </div>

      <!-- Right Column: Dedicated Return Discussion & Action Center -->
      <div class="admin-split-right" id="adm-return-chatbox" style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:24px 24px 36px 24px;display:flex;flex-direction:column;min-height:560px;box-shadow:var(--shadow-sm)">
        <p style="color:var(--text-muted);text-align:center;margin:auto;font-size:.86rem">Select a return case to review details, chat with customer, or update decision.</p>
      </div>
    </div>`}if(a==="products")return`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px">
      <h3 style="font-size:1.1rem;font-weight:700;color:var(--forest-dark);margin:0">Product Catalog</h3>
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
        <div style="position:relative">
          <svg style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--text-muted);pointer-events:none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" id="prod-search-input" class="form-input" placeholder="Search products..." style="padding-left:30px;height:34px;font-size:.82rem;width:180px;border-radius:var(--r-md)">
        </div>
        <button class="btn btn-gold btn-sm" id="adm-add-prod-btn" style="padding:6px 12px;font-size:.78rem">${g("plus",14)} Add Product</button>
      </div>
    </div>

    <div class="admin-table-card">
      <table style="width:100%;border-collapse:collapse;text-align:left;font-size:.82rem;min-width:580px">
        <thead>
          <tr style="border-bottom:2px solid var(--forest-dark)">
            <th style="padding:8px 0">Image</th>
            <th style="padding:8px 0">Product Name</th>
            <th style="padding:8px 0">Category</th>
            <th style="padding:8px 0">Selling Price</th>
            <th style="padding:8px 0">Cost Price</th>
            <th style="padding:8px 0">Stock</th>
            <th style="padding:8px 0;text-align:right">Actions</th>
          </tr>
        </thead>
        <tbody id="prod-catalog-tbody">
          ${n.products.map(i=>`
          <tr style="border-bottom:1px solid var(--sand-border)" data-prod-name="${i.name.toLowerCase()}" data-prod-stock="${i.stockQty}">
            <td style="padding:8px 0"><img src="${i.image}" alt="${i.name}" style="width:34px;height:34px;object-fit:cover;border-radius:6px" onerror="this.style.background='#f4efe6'"></td>
            <td style="padding:8px 0;font-weight:700;color:var(--forest-dark)">${i.name}</td>
            <td style="padding:8px 0;color:var(--text-muted)">${i.category}</td>
            <td style="padding:8px 0;font-weight:700">${w(i.price)}</td>
            <td style="padding:8px 0;color:var(--text-muted)">${w(i.costPrice)}</td>
            <td style="padding:8px 0">
              <span class="badge ${i.stockQty<15?"":"badge-gold"}" style="font-size:.65rem;${i.stockQty<15?"background:rgba(198,40,40,.15);color:var(--error);":""}">${i.stockQty}</span>
            </td>
            <td style="padding:8px 0;text-align:right">
              <div style="display:inline-flex;gap:4px">
                <button class="icon-btn" data-adm-action="edit-prod" data-id="${i.id}" title="Edit Product" style="display:inline-flex;width:28px;height:28px;color:var(--forest);border:1px solid var(--sand-border);border-radius:6px;align-items:center;justify-content:center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button class="icon-btn" data-adm-action="delete-prod" data-id="${i.id}" title="Delete Product" style="display:inline-flex;width:28px;height:28px;color:var(--error);border:1px solid rgba(198,40,40,.25);border-radius:6px;align-items:center;justify-content:center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                </button>
              </div>
            </td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>`;if(a==="orders"){const i={Processing:0,Delivered:0,Cancelled:0,"Out for Delivery":0};return n.orders.forEach(t=>{i[t.status]!==void 0?i[t.status]++:i[t.status]=(i[t.status]||0)+1}),`
    <h3 style="font-size:1.15rem;font-weight:700;color:var(--forest-dark);margin-bottom:12px">Customer Orders &amp; Delivery Dispatch</h3>
    <!-- Order status summary -->
    <div class="admin-summary-grid">
      <div class="admin-summary-card" style="border-top:4px solid #f59e0b">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:1.3rem">&#9203;</span>
          <div class="summary-num" style="font-size:1.6rem;font-weight:800;color:#92400e">${i.Processing||0}</div>
        </div>
        <div class="summary-label" style="font-size:.74rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);letter-spacing:0.5px">Processing</div>
      </div>
      <div class="admin-summary-card" style="border-top:4px solid #3b82f6">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:1.3rem">&#128666;</span>
          <div class="summary-num" style="font-size:1.6rem;font-weight:800;color:#1d4ed8">${i["Out for Delivery"]||0}</div>
        </div>
        <div class="summary-label" style="font-size:.74rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);letter-spacing:0.5px">Out for Delivery</div>
      </div>
      <div class="admin-summary-card" style="border-top:4px solid #10b981">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:1.3rem">&#9989;</span>
          <div class="summary-num" style="font-size:1.6rem;font-weight:800;color:#065f46">${i.Delivered||0}</div>
        </div>
        <div class="summary-label" style="font-size:.74rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);letter-spacing:0.5px">Delivered</div>
      </div>
      <div class="admin-summary-card" style="border-top:4px solid #ef4444">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:1.3rem">&#10060;</span>
          <div class="summary-num" style="font-size:1.6rem;font-weight:800;color:var(--error)">${i.Cancelled||0}</div>
        </div>
        <div class="summary-label" style="font-size:.74rem;font-weight:700;text-transform:uppercase;color:var(--text-muted);letter-spacing:0.5px">Cancelled</div>
      </div>
      <div class="admin-summary-card" style="background:var(--forest-dark);border-color:var(--forest-dark);border-top:4px solid var(--gold)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:1.3rem">&#128230;</span>
          <div class="summary-num" style="font-size:1.6rem;font-weight:800;color:var(--gold)">${n.orders.length}</div>
        </div>
        <div class="summary-label" style="font-size:.74rem;font-weight:700;text-transform:uppercase;color:rgba(255,255,255,0.7);letter-spacing:0.5px">Total Orders</div>
      </div>
    </div>
    <div class="admin-table-card">
      <table style="width:100%;border-collapse:collapse;text-align:left;font-size:.82rem;min-width:640px">
        <thead>
          <tr style="border-bottom:2px solid var(--forest-dark)">
            <th style="padding:8px 0">Order ID</th>
            <th style="padding:8px 0">Customer Info</th>
            <th style="padding:8px 0">Delivery Address</th>
            <th style="padding:8px 0">Items Purchased</th>
            <th style="padding:8px 0">Total Payable</th>
            <th style="padding:8px 0">Delivery Status</th>
          </tr>
        </thead>
        <tbody>
          ${n.orders.map(t=>`
          <tr style="border-bottom:1px solid var(--sand-border)">
            <td style="padding:10px 0;font-weight:800;color:var(--forest-dark)">#${t.id}</td>
            <td style="padding:10px 0">
              <div style="font-weight:700">${t.customerName}</div>
              <div style="font-size:.74rem;color:var(--text-muted)">${t.email} | ${t.phone}</div>
            </td>
            <td style="padding:10px 0;font-size:.78rem;color:var(--text-dark);max-width:180px">${t.address}</td>
            <td style="padding:10px 0;font-size:.78rem">${t.items.map(r=>`${r.name} (x${r.qty})`).join("<br>")}</td>
            <td style="padding:10px 0;font-weight:800;color:var(--forest-dark)">${w(t.total)}</td>
            <td style="padding:10px 0">
              <select class="form-input" data-adm-action="change-order-status" data-id="${t.id}" style="padding:5px 8px;font-size:.76rem;font-weight:700">
                <option value="Processing" ${t.status==="Processing"?"selected":""}>⏳ Processing</option>
                <option value="Out for Delivery" ${t.status==="Out for Delivery"?"selected":""}>🚚 Out for Delivery</option>
                <option value="Delivered" ${t.status==="Delivered"?"selected":""}>✅ Delivered</option>
                <option value="Cancelled" ${t.status==="Cancelled"?"selected":""}>❌ Cancelled</option>
              </select>
            </td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>`}return""}function V(){const a=document.getElementById("prod-search-input");a&&a.addEventListener("input",()=>{const t=a.value.toLowerCase().trim();document.querySelectorAll("#prod-catalog-tbody tr").forEach(o=>{const s=o.dataset.prodName||"",d=o.dataset.prodStock||"",c=s.includes(t)||d.includes(t);o.style.display=c?"":"none"})});const e=document.getElementById("user-search-input");if(e&&e.addEventListener("input",()=>{const t=e.value.toLowerCase().trim(),r=document.querySelectorAll("#users-catalog-tbody tr");let o=0;r.forEach(d=>{const c=(d.dataset.userName||"").toLowerCase(),l=(d.dataset.userId||"").toLowerCase(),p=(d.dataset.userEmail||"").toLowerCase(),m=(d.dataset.userPhone||"").toLowerCase(),u=c.includes(t)||l.includes(t)||p.includes(t)||m.includes(t);d.style.display=u?"":"none",u&&o++});const s=document.getElementById("user-search-count");s&&(s.textContent=o)}),document.querySelectorAll("[data-adm-tab]").forEach(t=>{t.addEventListener("click",r=>{r.preventDefault(),r.stopPropagation(),I=t.dataset.admTab,document.querySelectorAll("[data-adm-tab]").forEach(s=>{s.classList.toggle("active",s.dataset.admTab===I)});const o=document.getElementById("admin-tab-content");o&&(o.innerHTML=W(I,n.getAnalytics()),V())})}),document.querySelectorAll('[data-adm-action="change-order-status"]').forEach(t=>{t.addEventListener("change",()=>{const r=t.dataset.id,o=t.value;n.updateOrderStatus(r,o),f(`Order #${r} status updated to ${o}!`)})}),document.querySelectorAll("[data-adm-return-status]").forEach(t=>{t.addEventListener("change",()=>{const r=t.dataset.admReturnStatus,o=t.value;n.updateReturnStatus(r,o),f(`Return #${r} status marked as ${o}!`)})}),document.querySelectorAll("[data-adm-quick-refund]").forEach(t=>{t.addEventListener("click",()=>{const r=t.dataset.admQuickRefund;n.updateReturnStatus(r,"Refund Processed","Refund approved & processed to original payment method."),f(`Refund processed for #${r}! 💰`);const o=document.getElementById("admin-tab-content");o&&(o.innerHTML=W(I,n.getAnalytics()),V())})}),document.querySelectorAll(".adm-return-card").forEach(t=>{t.addEventListener("click",()=>{const r=t.dataset.retid;document.querySelectorAll(".adm-return-card").forEach(o=>{o.style.borderColor=o.dataset.retid===r?"var(--forest)":"var(--sand-border)",o.style.background=o.dataset.retid===r?"var(--white)":"var(--sand-light)"}),ae(r)})}),I==="returns"&&n.returns&&n.returns.length>0){const t=n.returns[0],r=document.querySelector(`.adm-return-card[data-retid="${t.id}"]`);r&&(r.style.borderColor="var(--forest)",r.style.background="var(--white)"),ae(t.id)}const i=document.getElementById("adm-add-prod-btn");i&&i.addEventListener("click",()=>rt()),document.querySelectorAll('[data-adm-action="delete-prod"]').forEach(t=>{t.addEventListener("click",()=>{const r=t.dataset.id;confirm("Delete this product? This cannot be undone.")&&(n.deleteProduct(r),f("Product deleted from catalog."),I="products",R("admin"))})}),document.querySelectorAll('[data-adm-action="edit-prod"]').forEach(t=>{t.addEventListener("click",()=>{const r=t.dataset.id;tt(r)})}),document.querySelectorAll(".query-item-card").forEach(t=>{t.addEventListener("click",()=>{const r=t.dataset.id;me(r)})}),document.querySelectorAll("[data-adm-toggle-block]").forEach(t=>{t.addEventListener("click",()=>{const r=t.dataset.admToggleBlock,o=n.toggleBlockUser(r);if(o){f(o.isBlocked?`User ${o.name} has been suspended/blocked from logging in. 🚫`:`User ${o.name} has been unblocked! ✅`);const s=document.getElementById("admin-tab-content");s&&(s.innerHTML=W("users",n.getAnalytics()),V())}})})}function ae(a){const e=(n.returns||[]).find(d=>d.id===a),i=document.getElementById("adm-return-chatbox");if(!i||!e)return;const t=e.chat||[];i.innerHTML=`
  <div style="display:flex;flex-direction:column;gap:14px;width:100%">
    <!-- Return & Customer Header Info -->
    <div style="border-bottom:1px solid var(--sand-border);padding-bottom:10px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:6px">
        <div>
          <h4 style="font-family:var(--font-sans);font-weight:700;font-size:1.12rem;color:var(--forest-dark);margin:0 0 2px">${e.productName}</h4>
          <div style="font-size:.76rem;color:var(--text-muted)">Return #${e.id} &bull; Order #${e.orderId} &bull; ${e.date}</div>
        </div>
        <div style="text-align:right">
          <span class="badge ${e.status==="Refund Successful"||e.status==="Refund Processed"||e.status==="Approved"?"badge-forest":e.status==="Request Rejected"?"":"badge-gold"}" style="font-size:.72rem;${e.status==="Request Rejected"?"background:rgba(239,68,68,.15);color:var(--error)":""}">${e.status}</span>
          <div style="font-weight:800;color:var(--gold);font-size:1.05rem;margin-top:2px">${w(e.amount)}</div>
        </div>
      </div>

      <!-- Customer Contact Info Pill -->
      <div style="display:flex;gap:12px;flex-wrap:wrap;font-size:.76rem;background:var(--sand-light);padding:6px 10px;border-radius:var(--r-sm);margin-bottom:6px">
        <div><strong>Customer:</strong> ${e.customerName}</div>
        <div><strong>Phone:</strong> <a href="tel:${e.phone||""}" style="color:var(--forest);font-weight:700">${e.phone||"N/A"}</a></div>
        <div><strong>Email:</strong> ${e.email}</div>
      </div>

      <!-- Claim Reason & Issue Details -->
      <div style="background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.25);border-radius:var(--r-sm);padding:6px 10px;font-size:.78rem;color:var(--text-dark)">
        <strong>Reason:</strong> ${e.reason} &mdash; <span style="color:var(--text-muted)">${e.details}</span>
      </div>
    </div>

    <!-- THE UNIFIED CHAT & DECISION CARD (Fully nested inside the large white card with proper breathing room) -->
    <div style="background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-md);padding:14px 16px 16px 16px;display:flex;flex-direction:column;box-shadow:var(--shadow-sm);margin-bottom:6px">
      <div style="font-size:.72rem;font-weight:700;text-transform:uppercase;color:var(--forest-dark);letter-spacing:.5px;margin-bottom:8px;display:flex;align-items:center;gap:6px">
        <span style="width:7px;height:7px;border-radius:50%;background:#10b981;display:inline-block"></span> Live Customer Conversation
      </div>

      <!-- Messages Viewport -->
      <div id="adm-ret-messages-viewport" style="flex-grow:1;overflow-y:auto;overscroll-behavior:contain;display:flex;flex-direction:column;gap:8px;margin-bottom:10px;padding-right:4px;height:200px;max-height:240px">
        ${t.map(d=>`
          <div class="chat-bubble ${d.sender==="Admin"||d.sender==="Aurite Returns Bot"?"chat-bubble-admin":"chat-bubble-customer"}" style="padding:8px 12px;font-size:.82rem">
            <div style="font-weight:700;font-size:.72rem;margin-bottom:2px;color:${d.sender==="Admin"||d.sender==="Aurite Returns Bot"?"var(--gold)":"var(--forest-dark)"}">
              ${d.sender} &bull; ${d.time}
            </div>
            <div style="white-space:pre-line">${d.text}</div>
          </div>`).join("")}
      </div>

      <!-- Message input & send button -->
      <form id="adm-ret-reply-form" style="display:flex;gap:8px;padding-top:10px;border-top:1px solid var(--sand-border);margin-bottom:10px">
        <input type="text" id="adm-ret-reply-input" class="form-input" placeholder="Type your reply to customer..." required style="flex-grow:1;background:var(--white);height:38px;font-size:.82rem;padding:6px 10px">
        <button type="submit" class="btn btn-gold btn-sm" style="white-space:nowrap;padding:0 18px;font-size:.82rem;font-weight:700">Send Reply</button>
      </form>

      <!-- Decision / Status Dropdown integrated inside chat card -->
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding-top:10px;border-top:1px dashed var(--sand-border);flex-wrap:wrap">
        <div style="display:flex;align-items:center;gap:6px">
          <span style="font-size:1rem">⚖️</span>
          <label style="font-size:.80rem;font-weight:700;color:var(--forest-dark);white-space:nowrap">Decision / Status:</label>
        </div>
        <select id="adm-ret-status-dropdown" class="form-input" style="padding:6px 10px;font-size:.82rem;font-weight:700;border-radius:var(--r-sm);background:var(--white);min-width:240px;height:36px;cursor:pointer">
          <option value="Requested" ${e.status==="Requested"?"selected":""}>⏳ Requested</option>
          <option value="Under Review" ${e.status==="Under Review"?"selected":""}>🔍 Under Review</option>
          <option value="Awaiting Customer Reply" ${e.status==="Awaiting Customer Reply"?"selected":""}>💬 Awaiting Customer Reply</option>
          <option value="Return Approved (Ship Back)" ${e.status==="Return Approved (Ship Back)"?"selected":""}>📦 Return Approved (Ship Back)</option>
          <option value="Return In-Transit" ${e.status==="Return In-Transit"?"selected":""}>🚚 Return In-Transit</option>
          <option value="Exchange Initiated" ${e.status==="Exchange Initiated"?"selected":""}>🔄 Exchange Initiated</option>
          <option value="Exchange Delivered" ${e.status==="Exchange Delivered"?"selected":""}>✨ Exchange Delivered</option>
          <option value="Refund Approved" ${e.status==="Refund Approved"?"selected":""}>💰 Refund Approved</option>
          <option value="Refund Successful" ${e.status==="Refund Successful"?"selected":""}>💸 Refund Successful</option>
          <option value="Request Rejected" ${e.status==="Request Rejected"?"selected":""}>❌ Request Rejected</option>
          <option value="Case Closed" ${e.status==="Case Closed"?"selected":""}>🔒 Case Closed</option>
        </select>
      </div>
    </div>
  </div>`;const r=document.getElementById("adm-ret-reply-form");r&&r.addEventListener("submit",d=>{var l;d.preventDefault();const c=(l=document.getElementById("adm-ret-reply-input"))==null?void 0:l.value.trim();c&&(n.replyToReturnChat(e.id,c,"Admin"),f("Reply sent to customer! 💬"),ae(e.id))});const o=document.getElementById("adm-ret-status-dropdown");o&&o.addEventListener("change",()=>{const d=o.value;n.updateReturnStatus(e.id,d),f(`Status updated to "${d}"! ✅`);const c=document.getElementById("admin-tab-content");c&&(c.innerHTML=W("returns",n.getAnalytics()),V(),setTimeout(()=>ae(e.id),50))});const s=document.getElementById("adm-ret-messages-viewport");s&&s.addEventListener("wheel",d=>{const c=d.deltaY,l=s.scrollTop>0,p=s.scrollTop+s.clientHeight<s.scrollHeight;(c<0&&l||c>0&&p)&&(s.scrollTop+=c,d.preventDefault(),d.stopPropagation())},{passive:!1}),se("adm-ret-messages-viewport")}function me(a){const e=n.queries.find(r=>r.id===a),i=document.getElementById("query-chatbox");if(!i||!e)return;i.innerHTML=`
  <div style="border-bottom:1px solid var(--sand-border);padding-bottom:14px;margin-bottom:12px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
      <h4 style="font-family:var(--font-sans);font-weight:700;font-size:1.18rem;color:var(--forest-dark);margin:0">${e.customerName}</h4>
      <span class="badge ${e.status==="Open"?"badge-forest":e.status==="Answered"?"badge-gold":""}" style="${e.status==="Resolved"?"background:var(--success);color:#fff":""}${e.status==="Closed"?"background:#888;color:#fff":""}">${e.status}</span>
    </div>
    <div style="font-size:.82rem;font-weight:600;color:var(--text-dark)">${e.subject}</div>
    <div style="font-size:.74rem;color:var(--text-muted);margin-top:2px">${e.email} &bull; ${e.date}</div>
  </div>

  <!-- Spacious Messages View: Customer Left, Admin Right with auto-scroll -->
  <div id="query-messages-viewport" style="flex-grow:1;overflow-y:auto;display:flex;flex-direction:column;gap:10px;margin-bottom:14px;min-height:340px;max-height:440px;padding-right:4px">
    <div class="chat-bubble chat-bubble-customer">
      <div style="font-weight:700;font-size:.76rem;margin-bottom:3px;color:var(--forest-dark)">${e.customerName} &bull; ${e.date}</div>
      <div style="white-space:pre-line">${e.message}</div>
    </div>
    ${e.replies.map(r=>`
      <div class="chat-bubble chat-bubble-admin">
        <div style="font-weight:700;font-size:.76rem;margin-bottom:3px;color:var(--gold)">Admin &bull; ${r.time}</div>
        <div style="white-space:pre-line">${r.text}</div>
      </div>`).join("")}
  </div>

  <!-- Pinned Bottom Action & Reply Area (Zero dead space) -->
  <div style="border-top:1px solid var(--sand-border);padding-top:12px;margin-top:auto">
    <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap">
      <button class="btn btn-sm btn-ghost" data-adm-query-status="Open" data-qid="${e.id}" style="font-size:.75rem;padding:4px 10px;border-color:var(--forest);color:var(--forest);font-weight:700">Mark Open</button>
      <button class="btn btn-sm btn-ghost" data-adm-query-status="Resolved" data-qid="${e.id}" style="font-size:.75rem;padding:4px 10px;border-color:var(--success);color:var(--success);font-weight:700">Mark Resolved</button>
      <button class="btn btn-sm btn-ghost" data-adm-query-status="Closed" data-qid="${e.id}" style="font-size:.75rem;padding:4px 10px;border-color:var(--error);color:var(--error);font-weight:700">Mark Closed</button>
    </div>
    <form id="adm-reply-form" style="display:flex;gap:10px">
      <input type="text" id="adm-reply-input" class="form-input" placeholder="Type your reply to customer..." required style="flex-grow:1">
      <button type="submit" class="btn btn-gold btn-sm">Send Reply</button>
    </form>
  </div>`;const t=document.getElementById("adm-reply-form");t&&t.addEventListener("submit",r=>{var s;r.preventDefault();const o=(s=document.getElementById("adm-reply-input"))==null?void 0:s.value.trim();o&&(n.replyToQuery(e.id,o),f("Reply sent to customer!"),me(e.id))}),i.querySelectorAll("[data-adm-query-status]").forEach(r=>{r.addEventListener("click",()=>{const o=r.dataset.admQueryStatus,s=n.queries.find(d=>d.id===r.dataset.qid);s&&(s.status=o,o==="Resolved"||o==="Closed"?s.resolvedAt=new Date().toISOString():delete s.resolvedAt,n._notify({queries:!0}),f(`Query marked as ${o}`),me(e.id))})}),se("query-messages-viewport")}function tt(a){var s;O(!0);const e=n.products.find(d=>d.id===a);if(!e)return;const i=document.getElementById("modal-box");if(!i)return;i.innerHTML=`
  <div class="modal-overlay open" id="edit-prod-overlay">
    <div class="modal-card modal-lg">
      <button class="modal-close-btn" id="edit-prod-close">${g("close",20)}</button>
      <h3 style="font-size:1.3rem;font-weight:700;color:var(--forest-dark);margin-bottom:20px">Edit Product</h3>
      <form id="edit-prod-form" style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div class="form-group"><label class="form-label">Product Name *</label><input type="text" id="ep-name" class="form-input" required value="${e.name.replace(/"/g,"&quot;")}"></div>
        <div class="form-group"><label class="form-label">Category *</label>
          <select id="ep-cat" class="form-input">
            <option ${e.category==="Vitality & Brain"?"selected":""}>Vitality &amp; Brain</option>
            <option ${e.category==="Minerals & Sleep"?"selected":""}>Minerals &amp; Sleep</option>
            <option ${e.category==="Daily Greens & Gut"?"selected":""}>Daily Greens &amp; Gut</option>
          </select>
        </div>
        <div class="form-group"><label class="form-label">Selling Price (&#8377;) *</label><input type="number" id="ep-price" class="form-input" required value="${e.price}"></div>
        <div class="form-group"><label class="form-label">Cost Price (&#8377;) *</label><input type="number" id="ep-cost" class="form-input" required value="${e.costPrice||0}"></div>
        <div class="form-group"><label class="form-label">Stock Quantity *</label><input type="number" id="ep-stock" class="form-input" required value="${e.stockQty||0}"></div>
        <div class="form-group"><label class="form-label">Badge Label</label><input type="text" id="ep-badge" class="form-input" value="${e.badge||""}"></div>
        <div class="form-group" style="grid-column:1 / -1">
          <label class="form-label">Product Images (URLs)</label>
          <div id="ep-img-list" style="display:flex;flex-direction:column;gap:8px;margin-bottom:8px">
            ${(e.images&&e.images.length>0?e.images:[e.image||""]).map((d,c)=>`
            <div class="ep-img-row" style="display:flex;gap:8px;align-items:center">
              <input type="text" class="form-input ep-img-input" value="${d}" style="flex:1" placeholder="/images/product.jpg">
              ${c>0?'<button type="button" class="img-remove-btn" style="flex-shrink:0;width:30px;height:30px;background:transparent;border:1.5px solid var(--error);color:var(--error);border-radius:6px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1rem;font-weight:700">&times;</button>':""}
            </div>`).join("")}
          </div>
          <button type="button" id="ep-add-img-btn" style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border:1.5px dashed var(--forest);background:transparent;color:var(--forest);border-radius:var(--r-md);font-size:.82rem;font-weight:700;cursor:pointer">
            ${g("plus",14)} Add Another Image
          </button>
        </div>
        <div class="form-group" style="grid-column:1 / -1"><label class="form-label">Tagline / Subtitle</label><input type="text" id="ep-tagline" class="form-input" value="${(e.tagline||"").replace(/"/g,"&quot;")}"></div>
        <div class="form-group" style="grid-column:1 / -1"><label class="form-label">Servings Format</label><input type="text" id="ep-servings" class="form-input" value="${(e.servings||"").replace(/"/g,"&quot;")}"></div>
        <div class="form-group" style="grid-column:1 / -1"><label class="form-label">Description</label><textarea id="ep-desc" class="form-input" rows="3">${e.description||""}</textarea></div>
        <div class="form-group" style="grid-column:1 / -1">
          <label class="form-label">Product Highlights <span style="font-size:.78rem;color:var(--text-muted);font-weight:400">(one per line)</span></label>
          <textarea id="ep-highlights" class="form-input" rows="4" placeholder="100% Lab Tested&#10;Enteric Shielded&#10;No Artificial Additives">${(e.highlights||[]).join(`
`)}</textarea>
        </div>
        <button type="submit" class="btn btn-gold btn-lg" style="grid-column:1 / -1;margin-top:8px">Save Changes &#8594;</button>
      </form>
    </div>
  </div>`,document.querySelectorAll("#ep-img-list .img-remove-btn").forEach(d=>{d.addEventListener("click",()=>{var c;return(c=d.closest(".ep-img-row"))==null?void 0:c.remove()})}),(s=document.getElementById("ep-add-img-btn"))==null||s.addEventListener("click",()=>{var l;const d=document.getElementById("ep-img-list");if(!d)return;const c=document.createElement("div");c.className="ep-img-row",c.style.cssText="display:flex;gap:8px;align-items:center",c.innerHTML=`
      <input type="text" class="form-input ep-img-input" placeholder="/images/extra.jpg" style="flex:1">
      <button type="button" class="img-remove-btn" style="flex-shrink:0;width:30px;height:30px;background:transparent;border:1.5px solid var(--error);color:var(--error);border-radius:6px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1rem;font-weight:700">&times;</button>
    `,(l=c.querySelector(".img-remove-btn"))==null||l.addEventListener("click",()=>c.remove()),d.appendChild(c)});const t=document.getElementById("edit-prod-overlay");t&&t.addEventListener("click",d=>{d.target===t&&B()});const r=document.getElementById("edit-prod-close");r&&r.addEventListener("click",B);const o=document.getElementById("edit-prod-form");o&&o.addEventListener("submit",d=>{var m,u,v,k,$,E,y,h,P,b;d.preventDefault();const c=document.querySelectorAll(".ep-img-input"),l=Array.from(c).map(x=>x.value.trim()).filter(Boolean),p={name:(m=document.getElementById("ep-name"))==null?void 0:m.value,category:(u=document.getElementById("ep-cat"))==null?void 0:u.value,price:parseFloat(((v=document.getElementById("ep-price"))==null?void 0:v.value)||0),costPrice:parseFloat(((k=document.getElementById("ep-cost"))==null?void 0:k.value)||0),stockQty:parseInt((($=document.getElementById("ep-stock"))==null?void 0:$.value)||0),badge:((E=document.getElementById("ep-badge"))==null?void 0:E.value)||e.badge,image:l[0]||e.image,images:l,tagline:((y=document.getElementById("ep-tagline"))==null?void 0:y.value)||e.tagline,servings:((h=document.getElementById("ep-servings"))==null?void 0:h.value)||e.servings,description:((P=document.getElementById("ep-desc"))==null?void 0:P.value)||e.description,highlights:(((b=document.getElementById("ep-highlights"))==null?void 0:b.value)||"").split(`
`).map(x=>x.trim()).filter(Boolean)};n.updateProduct(a,p),f("Product updated successfully! ✅"),B(),I="products",R("admin")})}function rt(){var r;O(!0);const a=document.getElementById("modal-box");if(!a)return;a.innerHTML=`
  <div class="modal-overlay open" id="add-prod-overlay">
    <div class="modal-card modal-lg">
      <button class="modal-close-btn" id="add-prod-close">${g("close",20)}</button>
      <h3 style="font-size:1.3rem;font-weight:700;color:var(--forest-dark);margin-bottom:18px">Add New Product to Catalog</h3>
      <form id="add-prod-form" style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div class="form-group"><label class="form-label">Product Name *</label><input type="text" id="ap-name" class="form-input" required placeholder="e.g. Aurite Bio-Active NMN"></div>
        <div class="form-group"><label class="form-label">Category *</label><select id="ap-cat" class="form-input"><option>Vitality &amp; Brain</option><option>Minerals &amp; Sleep</option><option>Daily Greens &amp; Gut</option></select></div>
        <div class="form-group"><label class="form-label">Selling Price (&#8377;) *</label><input type="number" id="ap-price" class="form-input" required placeholder="3999"></div>
        <div class="form-group"><label class="form-label">Production Cost (&#8377;) *</label><input type="number" id="ap-cost" class="form-input" required placeholder="1200"></div>
        <div class="form-group"><label class="form-label">Stock Quantity *</label><input type="number" id="ap-stock" class="form-input" required placeholder="50"></div>
        <div class="form-group"><label class="form-label">Badge Label</label><input type="text" id="ap-badge" class="form-input" placeholder="New Release"></div>
        <div class="form-group" style="grid-column:1 / -1">
          <label class="form-label">Product Images (URLs)</label>
          <div id="ap-img-list" style="display:flex;flex-direction:column;gap:8px;margin-bottom:8px">
            <div class="img-url-row" style="display:flex;gap:8px;align-items:center">
              <input type="text" class="form-input ap-img-input" placeholder="/images/product.jpg" style="flex:1" value="">
            </div>
          </div>
          <button type="button" id="ap-add-img-btn" style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border:1.5px dashed var(--forest);background:transparent;color:var(--forest);border-radius:var(--r-md);font-size:.82rem;font-weight:700;cursor:pointer">
            ${g("plus",14)} Add Another Image
          </button>
        </div>
        <div class="form-group" style="grid-column:1 / -1"><label class="form-label">Servings Format</label><input type="text" id="ap-servings" class="form-input" placeholder="e.g. 60 Capsules (30-Day Supply)" value=""></div>
        <div class="form-group" style="grid-column:1 / -1"><label class="form-label">Description</label><textarea id="ap-desc" class="form-input" rows="3" placeholder="Describe product clinical benefits and ingredients..."></textarea></div>
        <div class="form-group" style="grid-column:1 / -1">
          <label class="form-label">Product Highlights <span style="font-size:.78rem;color:var(--text-muted);font-weight:400">(one per line)</span></label>
          <textarea id="ap-highlights" class="form-input" rows="4" placeholder="100% Lab Tested&#10;Enteric Shielded&#10;No Artificial Additives"></textarea>
        </div>
        <button type="submit" class="btn btn-gold btn-lg" style="grid-column:1 / -1;margin-top:10px">Publish Product to Shop Catalog &rarr;</button>
      </form>
    </div>
  </div>`,(r=document.getElementById("ap-add-img-btn"))==null||r.addEventListener("click",()=>{var d;const o=document.getElementById("ap-img-list");if(!o)return;const s=document.createElement("div");s.className="img-url-row",s.style.cssText="display:flex;gap:8px;align-items:center",s.innerHTML=`
      <input type="text" class="form-input ap-img-input" placeholder="/images/extra.jpg" style="flex:1">
      <button type="button" class="img-remove-btn" style="flex-shrink:0;width:30px;height:30px;background:transparent;border:1.5px solid var(--error);color:var(--error);border-radius:6px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1rem;font-weight:700">&times;</button>
    `,(d=s.querySelector(".img-remove-btn"))==null||d.addEventListener("click",()=>s.remove()),o.appendChild(s)});const e=document.getElementById("add-prod-overlay");e&&e.addEventListener("click",o=>{o.target===e&&B()});const i=document.getElementById("add-prod-close");i&&i.addEventListener("click",B);const t=document.getElementById("add-prod-form");t&&t.addEventListener("submit",o=>{var l,p,m,u,v,k,$,E,y;o.preventDefault();const s=document.querySelectorAll(".ap-img-input"),d=Array.from(s).map(h=>h.value.trim()).filter(Boolean),c={id:`prod-${Date.now()}`,name:(l=document.getElementById("ap-name"))==null?void 0:l.value,category:(p=document.getElementById("ap-cat"))==null?void 0:p.value,price:parseFloat(((m=document.getElementById("ap-price"))==null?void 0:m.value)||0),costPrice:parseFloat(((u=document.getElementById("ap-cost"))==null?void 0:u.value)||0),stockQty:parseInt(((v=document.getElementById("ap-stock"))==null?void 0:v.value)||0),badge:((k=document.getElementById("ap-badge"))==null?void 0:k.value)||"New Product",image:d[0]||"/images/omega3.jpg",images:d,servings:($=document.getElementById("ap-servings"))==null?void 0:$.value,description:(E=document.getElementById("ap-desc"))==null?void 0:E.value,tagline:"Cellular Bio-Available Nutrition",rating:4.9,reviewsCount:1,highlights:(((y=document.getElementById("ap-highlights"))==null?void 0:y.value)||"").split(`
`).map(h=>h.trim()).filter(Boolean)};n.addProduct(c),f("New product added to catalog successfully! 🎉"),B(),I="products",R("admin")})}function ye(a){O(!0);const e=document.getElementById("modal-box");if(!e)return;const i=a==="privacy",t=i?"Privacy &amp; Security Policy":"Terms &amp; Conditions",r=i?`
    <h4 style="color:var(--forest-dark);margin-bottom:8px">1. Information We Collect</h4>
    <p>We collect information you provide directly to us, including your name, email address, phone number, and delivery address when you register or place an order. We also collect payment information securely through our payment partners — Aurite does not store card details on our servers.</p>

    <h4 style="color:var(--forest-dark);margin:16px 0 8px">2. How We Use Your Information</h4>
    <p>Your information is used exclusively to process orders, provide customer support, send order confirmations and shipping updates, and improve our products and services. We do not sell, rent, or trade your personal information to third parties under any circumstances.</p>

    <h4 style="color:var(--forest-dark);margin:16px 0 8px">3. Data Security</h4>
    <p>All data is encrypted in transit using TLS 1.3. Stored customer data is protected with AES-256 encryption. We conduct regular security audits and vulnerability assessments. Access to your personal data is restricted to authorized Aurite personnel only on a need-to-know basis.</p>

    <h4 style="color:var(--forest-dark);margin:16px 0 8px">4. Cookies &amp; Tracking</h4>
    <p>We use essential cookies to maintain your shopping cart and login session. We use analytics cookies (anonymized) to understand site traffic patterns and improve your experience. You may disable non-essential cookies in your browser settings without affecting core functionality.</p>

    <h4 style="color:var(--forest-dark);margin:16px 0 8px">5. Your Rights</h4>
    <p>You have the right to access, correct, or delete your personal data at any time from the Personal Details section of your profile. You may also submit a data deletion request to <a href="mailto:aurite@gmail.com" style="color:var(--gold)">aurite@gmail.com</a> and we will process it within 7 business days.</p>

    <h4 style="color:var(--forest-dark);margin:16px 0 8px">6. Third-Party Services</h4>
    <p>We use trusted third-party payment and delivery partners. These partners have their own privacy policies and we encourage you to review them. We share only the minimum necessary information required to fulfil your order.</p>

    <h4 style="color:var(--forest-dark);margin:16px 0 8px">7. Contact</h4>
    <p>For any privacy-related concerns, please contact us at <a href="mailto:aurite@gmail.com" style="color:var(--gold)">aurite@gmail.com</a>. Last updated: August 2026.</p>
  `:`
    <h4 style="color:var(--forest-dark);margin-bottom:8px">1. Acceptance of Terms</h4>
    <p>By accessing or using the Aurite website, placing an order, or creating an account, you agree to be bound by these Terms &amp; Conditions. If you do not agree, please discontinue use of the service immediately.</p>

    <h4 style="color:var(--forest-dark);margin:16px 0 8px">2. Product Information</h4>
    <p>All product information, including nutritional data and health claims, is provided for informational purposes only. Aurite products are not intended to diagnose, treat, cure, or prevent any disease. Always consult a qualified healthcare professional before starting any supplement regimen.</p>

    <h4 style="color:var(--forest-dark);margin:16px 0 8px">3. Orders &amp; Pricing</h4>
    <p>All prices are displayed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. Aurite reserves the right to modify pricing at any time without prior notice. Orders are confirmed only upon successful payment processing.</p>

    <h4 style="color:var(--forest-dark);margin:16px 0 8px">4. Shipping &amp; Delivery</h4>
    <p>Standard delivery takes 5–7 business days. Express delivery options may be available at checkout. Aurite is not liable for delays caused by courier partners, weather events, or circumstances beyond our control.</p>

    <h4 style="color:var(--forest-dark);margin:16px 0 8px">5. Returns &amp; Refunds</h4>
    <p>If you receive a damaged or incorrect product, please contact <a href="mailto:aurite@gmail.com" style="color:var(--gold)">aurite@gmail.com</a> within 48 hours of delivery with photographic evidence. We will arrange a replacement or full refund at our discretion. Opened products cannot be returned due to health and safety regulations.</p>

    <h4 style="color:var(--forest-dark);margin:16px 0 8px">6. Account Responsibility</h4>
    <p>You are responsible for maintaining the confidentiality of your account credentials. Aurite is not liable for any unauthorized access resulting from your failure to secure your login information.</p>

    <h4 style="color:var(--forest-dark);margin:16px 0 8px">7. Intellectual Property</h4>
    <p>All content on this website, including text, images, logos, and product data, is the intellectual property of Aurite Nutraceutical Laboratories Inc. and is protected by applicable copyright and trademark laws. Reproduction without written consent is prohibited.</p>

    <h4 style="color:var(--forest-dark);margin:16px 0 8px">8. Governing Law</h4>
    <p>These Terms are governed by and construed in accordance with the laws of India. Any disputes will be subject to the exclusive jurisdiction of the courts of Pune, Maharashtra. Last updated: August 2026.</p>
  `;e.innerHTML=`
  <div class="modal-overlay open" id="legal-modal-overlay" style="z-index:9999">
    <div class="modal-card" style="max-width:640px;max-height:82vh;display:flex;flex-direction:column">
      <button class="modal-close-btn" id="legal-modal-close" style="flex-shrink:0">${g("close",20)}</button>
      <h3 style="font-size:1.3rem;font-weight:700;color:var(--forest-dark);margin-bottom:4px;flex-shrink:0">${t}</h3>
      <div style="width:48px;height:3px;background:var(--gold);border-radius:2px;margin-bottom:20px;flex-shrink:0"></div>
      <div style="overflow-y:auto;flex-grow:1;padding-right:6px;font-size:.88rem;color:var(--text-muted);line-height:1.75">
        ${r}
      </div>
    </div>
  </div>`;const o=document.getElementById("legal-modal-overlay");o&&o.addEventListener("click",d=>{d.target===o&&B()});const s=document.getElementById("legal-modal-close");s&&s.addEventListener("click",B)}let S="orders";function $e(){const a=Date.now()-864e5;n.queries=n.queries.filter(e=>{if(e.status==="Resolved"||e.status==="Closed"){const i=e.resolvedAt?new Date(e.resolvedAt).getTime():0;return i===0||i>a}return!0})}function it(){if(!n.user)return`
    <div style="padding-top:84px;padding-bottom:60px;min-height:75vh;display:flex;align-items:center;justify-content:center">
      <div class="container" style="max-width:440px;text-align:center">
        <div style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-xl);padding:36px 24px;box-shadow:var(--shadow-md)">
          <div style="width:64px;height:64px;border-radius:50%;background:rgba(20,51,37,.06);color:var(--forest);display:flex;align-items:center;justify-content:center;margin:0 auto 16px">
            ${g("user",28)}
          </div>
          <span class="badge badge-gold" style="font-size:.65rem;margin-bottom:8px">Member Account</span>
          <h2 style="font-family:var(--font-serif);font-size:1.4rem;color:var(--forest-dark);margin-bottom:8px">Welcome to Aurite</h2>
          <p style="font-size:.82rem;color:var(--text-muted);line-height:1.6;margin-bottom:24px">
            Sign in to view your order history, track shipments, check return status, and manage personal profile details.
          </p>
          <div style="display:flex;flex-direction:column;gap:10px">
            <button class="btn btn-primary" data-action="open-login" style="width:100%;font-size:.86rem;padding:12px;font-weight:700">Sign In / Register</button>
            <button class="btn btn-ghost" data-route="shop" style="width:100%;font-size:.82rem;padding:10px">Explore Products</button>
          </div>
        </div>
      </div>
    </div>`;n.isAdmin&&(S==="orders"||S==="queries")&&(S="settings"),$e();const a=n.user,e=te(a.name),i=n.orders.filter(s=>s.email===a.email||s.customerName===a.name),r=n.queries.filter(s=>s.email===a.email).filter(s=>s.status==="Open"||s.status==="Answered").length,o=[...n.isAdmin?[]:[{id:"orders",label:`Orders (${i.length})`,icon:"order"},{id:"queries",label:`Queries${r>0?` (${r})`:""}`,icon:"chat"}],{id:"settings",label:"Details",icon:"user"}];return`
  <div style="padding-top:76px;padding-bottom:60px;min-height:80vh;">
    <div class="container" style="max-width:640px">

      <!-- Profile Header Card -->
      <div style="background:var(--forest-dark);border-radius:var(--r-xl);padding:14px 14px;margin-bottom:14px;box-shadow:var(--shadow-md)">
        <div style="display:flex;align-items:flex-start;gap:12px;width:100%">
          <div style="width:42px;height:42px;border-radius:50%;background:var(--gold);color:var(--forest-dark);display:flex;align-items:center;justify-content:center;font-size:1.05rem;font-weight:800;flex-shrink:0;letter-spacing:-.5px">${e}</div>
          <div style="min-width:0;flex-grow:1;display:flex;flex-direction:column;gap:2px">
            <div style="font-family:var(--font-serif);font-size:.98rem;color:var(--sand-light);font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1.2">${a.name}</div>
            <div style="font-size:.72rem;color:rgba(250,247,242,.75);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1.3">${a.email}</div>
            
            <!-- Bottom row: AURITE MEMBER badge and compact Sign Out button -->
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:6px;width:100%">
              <span style="display:inline-flex;align-items:center;background:var(--gold);color:var(--forest-dark);border-radius:999px;padding:2px 7px;font-size:.52rem;font-weight:800;letter-spacing:.04em;line-height:1;white-space:nowrap">${n.isAdmin?"EXECUTIVE ADMIN":"AURITE MEMBER"}</span>
              <button id="profile-logout-btn" data-action="logout" type="button" style="flex-shrink:0;background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.3);color:#ef4444;border-radius:var(--r-md);padding:3px 8px;font-size:.64rem;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:4px;white-space:nowrap;transition:all .18s;line-height:1">
                ${g("logout",11)} Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Buttons in a Row (Full Width Auto-Fit Grid) -->
      <div class="profile-tabs-row">
        ${o.map(s=>`
        <button class="profile-nav-btn ${S===s.id?"active":""}" data-profile-tab="${s.id}" type="button">
          ${g(s.icon,16)} <span>${s.label}</span>
        </button>`).join("")}
      </div>

      <!-- Tab Content Area -->
      <div style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-xl);padding:20px;box-shadow:var(--shadow-sm)" id="profile-content">
        ${S==="orders"?_():S==="queries"?re():de(a)}
      </div>

    </div>
  </div>`}function at(){n.isAdmin&&(S==="orders"||S==="queries")&&(S="settings"),$e();const a=n.user||{name:"Alex Mercer",email:"alex@example.com"},e=te(a.name),t=n.queries.filter(r=>!n.user||r.email===n.user.email).filter(r=>r.status==="Open"||r.status==="Answered").length;return`
  <div class="container section-padding">
    <div class="profile-grid" style="display:grid;grid-template-columns:280px 1fr;gap:40px;align-items:start">
      <div style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:24px;box-shadow:var(--shadow-sm)" class="profile-sidebar">
        <div style="text-align:center;padding-bottom:20px;border-bottom:1px solid var(--sand-border);margin-bottom:20px">
          <div style="width:64px;height:64px;border-radius:50%;background:var(--forest);color:var(--sand-light);display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700;margin:0 auto 12px">${e}</div>
          <h3 style="font-family:var(--font-serif);font-size:1.2rem;margin-bottom:6px;color:var(--forest-dark)">${a.name}</h3>
          <span class="badge badge-gold">Aurite Member</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">
          ${n.isAdmin?"":`
          <button class="profile-nav-btn ${S==="orders"?"active":""}" data-profile-tab="orders" type="button">${g("order",18)}<span>Order History</span></button>
          <button class="profile-nav-btn ${S==="queries"?"active":""}" data-profile-tab="queries" type="button">${g("chat",18)}<span>My Queries${t>0?` <span style="background:var(--error);color:#fff;border-radius:999px;padding:1px 7px;font-size:.7rem;font-weight:700">${t}</span>`:""}</span></button>
          `}
          <button class="profile-nav-btn ${S==="settings"?"active":""}" data-profile-tab="settings" type="button">${g("user",18)}<span>Personal Details</span></button>
          <button class="profile-nav-btn" id="profile-logout-btn" style="color:var(--error);margin-top:16px" type="button">${g("logout",18)}<span>Sign Out</span></button>
        </div>
      </div>
      <div style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:36px;box-shadow:var(--shadow-sm)" id="profile-content">
        ${S==="orders"?_():S==="queries"?re():de(a)}
      </div>
    </div>
  </div>`}function ot(){return window.innerWidth>=900?at():it()}function ze(a){if(!a)return!0;try{const e=new Date(a);return isNaN(e.getTime())?!0:(new Date().getTime()-e.getTime())/(1e3*60*60*24)<=2}catch{return!0}}function st(){if(!n.user)return"";const a=n.orders.filter(t=>t.email===n.user.email||t.customerName===n.user.name),e=a.length>0?a:n.orders;if(!e.length)return`
  <div style="text-align:center;padding:48px 16px;color:var(--text-muted)">
    <div style="font-size:2.8rem;margin-bottom:10px">📦</div>
    <p style="font-size:1rem;font-weight:700;color:var(--forest-dark)">No orders found</p>
    <p style="font-size:.82rem;margin-top:4px">When you place an order, it will appear here with live tracking.</p>
    <button class="btn btn-primary btn-sm" data-route="shop" style="margin-top:16px;font-size:.82rem">Start Shopping</button>
  </div>`;const i={Processing:{color:"#f59e0b",bg:"rgba(245,158,11,.1)",icon:"⏳"},"Out for Delivery":{color:"#3b82f6",bg:"rgba(59,130,246,.1)",icon:"🚚"},Delivered:{color:"#10b981",bg:"rgba(16,185,129,.1)",icon:"✅"},Cancelled:{color:"#ef4444",bg:"rgba(239,68,68,.1)",icon:"❌"}};return`
  <div style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
    <div>
      <h3 style="font-family:var(--font-serif);font-size:1.15rem;color:var(--forest-dark);margin:0">Order History</h3>
      <p style="font-size:.76rem;color:var(--text-muted);margin-top:2px">${e.length} order${e.length>1?"s":""} placed</p>
    </div>
  </div>
  <div style="display:flex;flex-direction:column;gap:14px">
    ${e.map(t=>{const r=i[t.status]||{color:"var(--forest)",bg:"rgba(20,51,37,.08)"},o=t.status==="Delivered",s=t.status==="Processing",d=ze(t.deliveredDate||t.date);return`
      <div class="profile-order-card" style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-lg);overflow:hidden;box-shadow:var(--shadow-sm);transition:all .3s ease;margin-bottom:14px">
        <!-- ORDER HEADER -->
        <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:12px 14px;background:rgba(20,51,37,.04);border-bottom:1px solid var(--sand-border);gap:8px">
          <div>
            <div style="font-weight:800;color:var(--forest-dark);font-size:.88rem;letter-spacing:-0.01em">#${t.id}</div>
            <div style="font-size:.70rem;color:var(--text-muted);margin-top:1px">Placed on ${t.date}</div>
          </div>
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;justify-content:flex-end">
            <span style="display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:999px;background:${r.bg};color:${r.color};font-size:.66rem;font-weight:700;line-height:1">
              <span style="width:5px;height:5px;border-radius:50%;background:${r.color};display:inline-block"></span>
              ${t.status.toUpperCase()}
            </span>
            ${s?`
            <button class="btn btn-sm profile-action-btn" data-action="cancel-order" data-oid="${t.id}"
              style="padding:3px 7px;font-size:.65rem;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.25);color:#ef4444;border-radius:var(--r-md);font-weight:700;cursor:pointer">
              Cancel
            </button>`:""}
            <div style="font-weight:800;color:var(--forest-dark);font-size:.90rem;margin-left:2px">${w(t.total)}</div>
          </div>
        </div>

        <!-- ORDER ITEMS -->
        <div style="padding:10px 14px">
          <div style="display:flex;flex-direction:column;gap:10px">
            ${t.items.map(c=>{const l=n.reviews&&n.reviews.find(u=>u.orderId===t.id&&u.productId===c.id),p=(n.returns||[]).find(u=>u.orderId===t.id&&u.productId===c.id),m=n.products.find(u=>u.id===c.id);return`
              <div style="display:flex;flex-direction:column;gap:6px;padding:8px 0;border-bottom:1px dashed var(--sand-border)">
                <div style="display:flex;align-items:center;gap:10px;width:100%">
                  ${m?`
                  <img src="${m.image}" alt="${c.name}" class="order-prod-link" data-pid="${c.id}" style="width:42px;height:42px;object-fit:cover;border-radius:var(--r-sm);flex-shrink:0;cursor:pointer" onerror="this.style.background='#f4efe6'">`:`<div class="order-prod-link" data-pid="${c.id}" style="width:42px;height:42px;border-radius:var(--r-sm);background:var(--sand);flex-shrink:0;cursor:pointer"></div>`}
                  
                  <div style="flex-grow:1;min-width:0">
                    <a href="#product/${c.id}" class="order-prod-link" data-pid="${c.id}" style="font-weight:700;font-size:.78rem;color:var(--forest-dark);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer;text-decoration:none;display:block">${c.name}</a>
                    <div style="font-size:.70rem;color:var(--text-muted);margin-top:2px">Qty: ${c.qty} &bull; ${w(c.unitPrice||0)}</div>
                  </div>
                </div>

                <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;justify-content:flex-start;padding-left:52px">
                  <!-- Return & Exchange (Delivered Only, within 2 days) -->
                  ${p?`
                  <div style="display:flex;align-items:center;gap:4px">
                    <span class="badge ${p.status==="Approved"||p.status==="Refund Successful"?"badge-forest":"badge-gold"}" style="font-size:.62rem;padding:2px 6px">
                      Return: ${p.status}
                    </span>
                    <button class="btn btn-sm btn-ghost profile-action-btn" data-action="view-return-chat" data-retid="${p.id}"
                      style="padding:3px 6px;font-size:.64rem;border-color:var(--forest);color:var(--forest);font-weight:700;cursor:pointer">
                      💬 Return Chat
                    </button>
                  </div>`:o?d?`
                  <button class="btn btn-sm btn-ghost profile-action-btn" data-action="request-return" data-oid="${t.id}" data-pid="${c.id}" data-pname="${c.name}" data-price="${c.unitPrice*c.qty}"
                    style="padding:3px 7px;font-size:.65rem;border-color:var(--forest);color:var(--forest);font-weight:700;cursor:pointer">
                    ↩️ Return / Exchange
                  </button>`:'<span style="font-size:.62rem;color:var(--text-muted);padding:2px 6px;background:rgba(0,0,0,0.05);border-radius:var(--r-sm)">Return Expired (2-Day)</span>':""}

                  <!-- Write Review (Delivered Only) -->
                  ${o&&!l?`
                  <button class="btn btn-sm profile-action-btn" data-action="write-review" data-pid="${c.id}" data-oid="${t.id}" data-pname="${c.name}"
                    style="padding:3px 8px;font-size:.65rem;background:var(--forest-dark);color:var(--sand-light);border:none;border-radius:999px;font-weight:700;cursor:pointer">★ Review</button>
                  `:""}
                  ${l?'<span style="font-size:.65rem;color:var(--forest);font-weight:700;padding:2px 7px;background:rgba(20,51,37,.08);border-radius:999px">★ Reviewed</span>':""}
                </div>
              </div>`}).join("")}
          </div>

          <!-- Delivery Address -->
          ${t.address?`<div style="display:flex;align-items:flex-start;gap:6px;margin-top:8px;padding:7px 9px;background:rgba(20,51,37,.03);border-radius:var(--r-md)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--forest)" stroke-width="2" style="flex-shrink:0;margin-top:2px"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <div style="font-size:.68rem;color:var(--text-muted);line-height:1.3;word-break:break-word">${t.address}</div>
          </div>`:""}
        </div>
      </div>`}).join("")}
  </div>`}function nt(){const a=n.orders.filter(t=>{var r,o;return!n.user||t.email===((r=n.user)==null?void 0:r.email)||t.customerName===((o=n.user)==null?void 0:o.name)}),e=a.length>0?a:n.orders;if(!e.length)return`
  <div style="text-align:center;padding:60px 0;color:var(--text-muted)">
    <div style="font-size:3rem;margin-bottom:12px">📦</div>
    <p style="font-size:1.1rem;font-weight:700;color:var(--forest-dark)">No orders found</p>
    <p style="font-size:.9rem;margin-top:6px">Your order history and return tracking will appear here.</p>
    <a data-route="shop" style="display:inline-block;margin-top:16px;padding:12px 28px;background:var(--forest);color:var(--sand-light);border-radius:var(--r-md);font-weight:700;font-size:.9rem;cursor:pointer">Start Shopping</a>
  </div>`;const i={Processing:{color:"#f59e0b",bg:"rgba(245,158,11,.1)",icon:"⏳"},"Out for Delivery":{color:"#3b82f6",bg:"rgba(59,130,246,.1)",icon:"🚚"},Delivered:{color:"#10b981",bg:"rgba(16,185,129,.1)",icon:"✅"},Cancelled:{color:"#ef4444",bg:"rgba(239,68,68,.1)",icon:"❌"}};return`
  <div style="margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
    <div>
      <h3 style="font-family:var(--font-serif);font-size:1.6rem;color:var(--forest-dark);margin:0 0 4px">Order History</h3>
      <p style="font-size:.88rem;color:var(--text-muted)">${e.length} order${e.length>1?"s":""} total &bull; Manage deliveries, cancel or request 2-day return &amp; exchange</p>
    </div>
  </div>
  <div style="display:flex;flex-direction:column;gap:20px">
    ${e.map(t=>{const r=i[t.status]||{color:"var(--forest)",bg:"rgba(20,51,37,.08)",icon:"📦"},o=t.status==="Delivered",s=t.status==="Processing",d=ze(t.deliveredDate||t.date);return`
      <div style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-lg);overflow:hidden;box-shadow:var(--shadow-sm);transition:box-shadow .2s" onmouseover="this.style.boxShadow='var(--shadow-md)'" onmouseout="this.style.boxShadow='var(--shadow-sm)'">
        <!-- ORDER HEADER -->
        <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 22px;background:var(--sand-light);border-bottom:1px solid var(--sand-border);flex-wrap:wrap;gap:10px">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="width:42px;height:42px;border-radius:var(--r-md);background:${r.bg};display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0">${r.icon}</div>
            <div>
              <div style="font-weight:800;color:var(--forest-dark);font-size:1rem">Order #${t.id}</div>
              <div style="font-size:.78rem;color:var(--text-muted);margin-top:2px">Placed on ${t.date}</div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:14px">
            <span style="display:inline-flex;align-items:center;gap:5px;padding:5px 14px;border-radius:999px;background:${r.bg};color:${r.color};font-size:.78rem;font-weight:700;letter-spacing:.3px">
              <span style="width:6px;height:6px;border-radius:50%;background:${r.color};display:inline-block"></span>
              ${t.status.toUpperCase()}
            </span>
            ${s?`
            <button class="btn btn-sm" data-action="cancel-order" data-oid="${t.id}"
              style="padding:5px 12px;font-size:.76rem;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);color:#ef4444;font-weight:700;border-radius:var(--r-sm);cursor:pointer">
              Cancel Order
            </button>`:""}
            <div style="font-weight:800;color:var(--forest-dark);font-size:1.15rem">${w(t.total)}</div>
          </div>
        </div>

        <!-- ORDER ITEMS -->
        <div style="padding:20px 22px">
          <div style="display:flex;flex-direction:column;gap:12px">
            ${t.items.map(c=>{const l=n.reviews&&n.reviews.find(u=>u.orderId===t.id&&u.productId===c.id),p=(n.returns||[]).find(u=>u.orderId===t.id&&u.productId===c.id),m=n.products.find(u=>u.id===c.id);return`
              <div style="display:flex;align-items:center;gap:16px;padding:14px;background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-md);flex-wrap:wrap">
                ${m?`
                <img src="${m.image}" alt="${c.name}" class="order-prod-link" data-pid="${c.id}" style="width:54px;height:54px;object-fit:cover;border-radius:var(--r-sm);flex-shrink:0;cursor:pointer;border:1px solid var(--sand-border);transition:transform .2s" onmouseover="this.style.transform='scale(1.06)'" onmouseout="this.style.transform='scale(1)'" onerror="this.style.background='#f4efe6'">`:`<div class="order-prod-link" data-pid="${c.id}" style="width:54px;height:54px;border-radius:var(--r-sm);background:var(--sand);flex-shrink:0;cursor:pointer"></div>`}
                
                <div style="flex-grow:1;min-width:200px">
                  <a href="#product/${c.id}" class="order-prod-link" data-pid="${c.id}" style="font-weight:700;font-size:.95rem;color:var(--forest-dark);cursor:pointer;text-decoration:none;display:inline-block;transition:color .2s" onmouseover="this.style.color='var(--gold)'" onmouseout="this.style.color='var(--forest-dark)'">${c.name}</a>
                  <div style="font-size:.8rem;color:var(--text-muted);margin-top:3px">Qty: ${c.qty} &bull; ${w(c.unitPrice||0)} each</div>
                </div>

                <div style="flex-shrink:0;display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:flex-end">
                  <!-- Return & Exchange (Delivered Only, within 2 days) -->
                  ${p?`
                  <div style="display:flex;align-items:center;gap:8px">
                    <span class="badge ${p.status==="Approved"||p.status==="Refund Successful"||p.status==="Refund Processed"?"badge-forest":"badge-gold"}" style="font-size:.78rem;padding:5px 12px">
                      Return: ${p.status}
                    </span>
                    <button class="btn btn-sm btn-ghost" data-action="view-return-chat" data-retid="${p.id}"
                      style="padding:6px 12px;font-size:.78rem;border-color:var(--forest);color:var(--forest);font-weight:700;cursor:pointer">
                      💬 Return Chat &amp; Status
                    </button>
                  </div>`:o?d?`
                  <button class="btn btn-sm btn-ghost" data-action="request-return" data-oid="${t.id}" data-pid="${c.id}" data-pname="${c.name}" data-price="${c.unitPrice*c.qty}"
                    style="padding:6px 14px;font-size:.78rem;border-color:var(--forest);color:var(--forest);font-weight:700;cursor:pointer">
                    ↩️ Return / Exchange
                  </button>`:'<span style="font-size:.74rem;color:var(--text-muted);padding:4px 10px;background:rgba(0,0,0,0.05);border-radius:var(--r-sm)">Return Window Expired (2-Day Policy)</span>':""}

                  <!-- Write Review (Delivered Only) -->
                  ${o&&!l?`
                  <button class="btn btn-sm" data-action="write-review" data-pid="${c.id}" data-oid="${t.id}" data-pname="${c.name}"
                    style="padding:6px 14px;font-size:.78rem;background:var(--forest);color:var(--sand-light);border:none;border-radius:var(--r-md);font-weight:700;cursor:pointer;transition:opacity .2s"
                    onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'">✍ Write Review</button>
                  `:""}
                  ${l?'<span style="display:inline-flex;align-items:center;gap:4px;font-size:.78rem;color:var(--forest);font-weight:700;padding:5px 12px;background:rgba(20,51,37,.08);border-radius:999px">★ Reviewed</span>':""}
                </div>
              </div>`}).join("")}
          </div>

          <!-- DELIVERY ADDRESS -->
          ${t.address?`<div style="display:flex;align-items:flex-start;gap:10px;margin-top:16px;padding:12px 14px;background:rgba(20,51,37,.04);border-radius:var(--r-md);border:1px solid var(--sand-border)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--forest)" stroke-width="2" style="flex-shrink:0;margin-top:2px"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <div style="font-size:.82rem;color:var(--text-dark)"><strong style="color:var(--forest-dark)">Delivery Address:</strong> ${t.address}</div>
          </div>`:""}
        </div>
      </div>`}).join("")}
  </div>`}function _(){return window.innerWidth>=900?nt():st()}function dt(){if(!n.user)return"";const a=n.queries.filter(e=>e.email===n.user.email);return`
  <div style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
    <div>
      <h3 style="font-family:var(--font-serif);font-size:1.15rem;color:var(--forest-dark);margin:0">My Support Queries</h3>
      <p style="font-size:.76rem;color:var(--text-muted);margin-top:2px">Direct communication channel with Aurite advisors</p>
    </div>
    <button class="btn btn-primary btn-sm" id="toggle-query-form-btn" type="button" style="font-size:.78rem;padding:6px 12px">
      + New Query
    </button>
  </div>

  <!-- Inline New Query Form (Collapsible) -->
  <div id="inline-query-form-card" style="display:${a.length===0?"block":"none"};background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:14px;margin-bottom:16px">
    <div style="font-weight:700;font-size:.82rem;color:var(--forest-dark);margin-bottom:8px">Submit a New Support Query</div>
    <form id="inline-user-query-form" style="display:flex;flex-direction:column;gap:10px">
      <div>
        <label class="form-label" style="font-size:.72rem;margin-bottom:3px;display:block">Subject / Topic</label>
        <input type="text" id="iq-subject" class="form-input" placeholder="e.g. Dosage advice for Magnesium" required style="font-size:.82rem;padding:8px 10px">
      </div>
      <div>
        <label class="form-label" style="font-size:.72rem;margin-bottom:3px;display:block">Message / Question</label>
        <textarea id="iq-message" class="form-input" rows="3" placeholder="Describe your question or concern in detail..." required style="font-size:.82rem;padding:8px 10px;resize:vertical"></textarea>
      </div>
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button type="button" id="cancel-query-form-btn" class="btn btn-ghost btn-sm" style="font-size:.76rem;padding:6px 12px">Cancel</button>
        <button type="submit" class="btn btn-gold btn-sm" style="font-size:.76rem;padding:6px 14px">Submit Query →</button>
      </div>
    </form>
  </div>

  <!-- Queries List -->
  ${a.length===0?`
  <div style="text-align:center;padding:24px 16px;color:var(--text-muted)">
    <p style="font-size:.82rem">You have no previous queries on record.</p>
  </div>`:`
  <div style="display:flex;flex-direction:column;gap:10px">
    ${a.map(e=>{const i=e.status==="Answered",r=e.status==="Open"?"background:rgba(20,51,37,.1);color:var(--forest);":i?"background:rgba(197,160,89,.2);color:#92722a;":"background:rgba(0,0,0,.06);color:var(--text-muted);";return`
      <div style="background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-md);padding:12px 14px;display:flex;flex-direction:column;gap:8px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
          <div>
            <div style="font-weight:700;font-size:.86rem;color:var(--forest-dark)">${e.subject}</div>
            <div style="font-size:.72rem;color:var(--text-muted)">${e.date} &bull; ${e.replies.length} ${e.replies.length===1?"reply":"replies"}</div>
          </div>
          <span style="font-size:.65rem;font-weight:800;padding:2px 8px;border-radius:999px;letter-spacing:.04em;${r}">
            ${e.status.toUpperCase()}
          </span>
        </div>
        <p style="font-size:.78rem;color:var(--text-muted);margin:0;line-height:1.45;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          ${e.message}
        </p>
        <div style="display:flex;justify-content:flex-end">
          <button class="btn btn-sm btn-ghost" data-action="open-query-chat" data-qid="${e.id}"
            style="font-size:.74rem;padding:4px 10px;border-color:var(--forest);color:var(--forest);font-weight:700;cursor:pointer">
            💬 Open Conversation (${e.replies.length})
          </button>
        </div>
      </div>`}).join("")}
  </div>`}`}function lt(){const a=n.user?n.queries.filter(e=>e.email===n.user.email):n.queries;return a.length?`
  <h3 style="font-family:var(--font-serif);font-size:1.7rem;margin-bottom:20px;color:var(--forest-dark)">My Support Queries</h3>
  <div style="display:grid;grid-template-columns:1fr 1.4fr;gap:20px;min-height:400px">
    <div class="clean-scroll-box" style="display:flex;flex-direction:column;gap:10px;max-height:500px;overflow-y:auto;padding-right:4px">
      ${a.map(e=>`
      <div class="user-query-card" data-qid="${e.id}" style="border:1px solid var(--sand-border);border-radius:var(--r-md);padding:14px;cursor:pointer;background:var(--sand-light);transition:all .2s ease">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-weight:700;font-size:.88rem;color:var(--forest-dark)">${e.subject}</span>
          <span class="badge ${e.status==="Open"?"badge-forest":e.status==="Answered"?"badge-gold":""}" style="font-size:.65rem">${e.status}</span>
        </div>
        <div style="font-size:.75rem;color:var(--text-muted)">${e.date} · ${e.replies.length} replies</div>
      </div>`).join("")}
    </div>
    <div style="background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:20px;display:flex;flex-direction:column" id="user-query-chatbox">
      <p style="color:var(--text-muted);text-align:center;margin:auto">Select a query to view the conversation.</p>
    </div>
  </div>`:`
  <h3 style="font-family:var(--font-serif);font-size:1.7rem;margin-bottom:16px;color:var(--forest-dark)">My Support Queries</h3>
  <div style="text-align:center;padding:60px 0;color:var(--text-muted)">
    ${g("chat",48)}
    <p style="margin-top:16px;font-size:1rem">You have no active support queries.</p>
    <p style="margin-top:8px;font-size:.85rem">Submit a query from the <a data-route="contact" style="color:var(--forest);font-weight:700;cursor:pointer">Contact Us</a> page.</p>
  </div>`}function re(){return window.innerWidth>=900?lt():dt()}function Ee(a){const e=n.queries.find(d=>d.id===a),i=document.getElementById("modal-box");if(!e||!i)return;i.innerHTML=`
  <div class="modal-overlay open" id="user-query-chat-overlay" style="z-index:9999">
    <div class="modal-card modal-lg" style="max-height:85vh;display:flex;flex-direction:column">
      <button class="modal-close-btn" id="user-query-chat-close">${g("close",20)}</button>
      <div style="border-bottom:1px solid var(--sand-border);padding-bottom:12px;margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
          <div>
            <span class="badge badge-gold" style="font-size:.65rem;margin-bottom:4px">Support Ticket #${e.id}</span>
            <h3 style="font-family:var(--font-sans);font-weight:700;font-size:1.15rem;color:var(--forest-dark);margin:0">${e.subject}</h3>
            <div style="font-size:.75rem;color:var(--text-muted);margin-top:2px">Created on ${e.date}</div>
          </div>
          <span class="badge ${e.status==="Open"?"badge-forest":"badge-gold"}" style="font-size:.7rem">${e.status}</span>
        </div>
      </div>

      <div id="user-query-modal-viewport" style="flex-grow:1;overflow-y:auto;display:flex;flex-direction:column;gap:10px;max-height:340px;margin-bottom:14px;padding-right:4px">
        <div class="chat-bubble chat-bubble-customer" style="background:var(--sand-light);border:1px solid var(--sand-border);padding:10px 12px;border-radius:var(--r-md)">
          <div style="font-weight:700;font-size:.72rem;color:var(--forest);margin-bottom:3px">You &bull; ${e.date}</div>
          <div style="font-size:.82rem;line-height:1.5">${e.message}</div>
        </div>
        ${e.replies.map(d=>`
        <div class="chat-bubble ${d.sender==="Admin"?"chat-bubble-admin":"chat-bubble-customer"}" style="padding:10px 12px;border-radius:var(--r-md);background:${d.sender==="Admin"?"var(--forest-dark)":"var(--sand-light)"};color:${d.sender==="Admin"?"var(--sand-light)":"var(--forest-dark)"};border:1px solid ${d.sender==="Admin"?"transparent":"var(--sand-border)"}">
          <div style="font-weight:700;font-size:.72rem;margin-bottom:3px;color:${d.sender==="Admin"?"var(--gold)":"var(--forest)"}">${d.sender} &bull; ${d.time}</div>
          <div style="font-size:.82rem;line-height:1.5">${d.text}</div>
        </div>`).join("")}
      </div>

      ${e.status!=="Resolved"&&e.status!=="Closed"?`
      <form id="user-query-modal-reply-form" style="display:flex;gap:8px;margin-top:auto">
        <input type="text" id="user-query-reply-input" class="form-input" placeholder="Type your reply or additional information..." required style="flex-grow:1;font-size:.82rem;padding:9px 12px">
        <button type="submit" class="btn btn-gold btn-sm" style="font-size:.78rem;padding:9px 16px;flex-shrink:0">Send 💬</button>
      </form>`:'<div style="text-align:center;font-size:.78rem;color:var(--text-muted);padding:8px;background:var(--sand);border-radius:var(--r-sm)">This ticket has been marked as resolved.</div>'}
    </div>
  </div>`;const t=document.getElementById("user-query-chat-overlay"),r=document.getElementById("user-query-chat-close"),o=document.getElementById("user-query-modal-reply-form"),s=()=>{i&&(i.innerHTML="")};r==null||r.addEventListener("click",s),t==null||t.addEventListener("click",d=>{d.target===t&&s()}),o==null||o.addEventListener("submit",d=>{var l,p;d.preventDefault();const c=(l=document.getElementById("user-query-reply-input"))==null?void 0:l.value.trim();c&&(e.replies.push({sender:((p=n.user)==null?void 0:p.name)||"Customer",text:c,time:new Date().toISOString().replace("T"," ").substring(0,16)}),e.status==="Answered"&&(e.status="Open"),n._notify({queries:!0}),f("Reply sent! 💬"),Ee(a))}),se("user-query-modal-viewport")}function ue(a){const e=n.queries.find(r=>r.id===a),i=document.getElementById("user-query-chatbox");if(!e||!i)return;i.innerHTML=`
  <div style="border-bottom:1px solid var(--sand-border);padding-bottom:12px;margin-bottom:14px">
    <div style="display:flex;justify-content:space-between;align-items:center">
      <h4 style="font-family:var(--font-serif);font-size:1.1rem;color:var(--forest-dark)">${e.subject}</h4>
      <span class="badge badge-gold">${e.status}</span>
    </div>
    <div style="font-size:.76rem;color:var(--text-muted);margin-top:4px">${e.date}</div>
  </div>
  <div id="user-query-messages-viewport" style="flex-grow:1;overflow-y:auto;display:flex;flex-direction:column;gap:10px;max-height:300px;margin-bottom:14px;padding-right:4px">
    <div class="chat-bubble chat-bubble-customer">
      <div style="font-weight:700;font-size:.75rem;margin-bottom:3px">You · ${e.date}</div>
      ${e.message}
    </div>
    ${e.replies.map(r=>`
    <div class="chat-bubble ${r.sender==="Admin"?"chat-bubble-admin":"chat-bubble-customer"}">
      <div style="font-weight:700;font-size:.75rem;margin-bottom:3px;color:${r.sender==="Admin"?"var(--gold)":"inherit"}">${r.sender} · ${r.time}</div>
      ${r.text}
    </div>`).join("")}
  </div>
  ${e.status!=="Resolved"&&e.status!=="Closed"?`
  <form id="user-reply-form" style="display:flex;gap:10px">
    <input type="text" id="user-reply-input" class="form-input" placeholder="Reply or add info..." style="flex-grow:1">
    <button type="submit" class="btn btn-gold btn-sm">Send</button>
  </form>`:`<div style="text-align:center;font-size:.82rem;color:var(--text-muted);padding:10px;background:var(--sand);border-radius:var(--r-sm)">This query has been ${e.status.toLowerCase()}.</div>`}
  `;const t=document.getElementById("user-reply-form");t&&t.addEventListener("submit",r=>{var d,c;r.preventDefault();const o=(d=document.getElementById("user-reply-input"))==null?void 0:d.value.trim();if(!o)return;const s=n.queries.find(l=>l.id===a);s&&(s.replies.push({sender:((c=n.user)==null?void 0:c.name)||"You",text:o,time:new Date().toISOString().replace("T"," ").substring(0,16)}),n._notify({queries:!0}),ue(a))}),se("user-query-messages-viewport")}function Se(a,e,i,t){var p;O(!0);let r=document.getElementById("modal-box");r||(r=document.createElement("div"),r.id="modal-box",document.body.appendChild(r)),r.innerHTML=`
  <div class="modal-overlay open" id="return-modal-overlay" style="padding:14px 10px;align-items:center;justify-content:center;z-index:9999">
    <div class="modal-card modal-lg" style="max-width:540px;width:100%;padding:20px;border-radius:var(--r-xl);box-shadow:var(--shadow-xl);background:var(--sand-light);border:1px solid var(--sand-border);margin:auto;max-height:90vh;overflow-y:auto">
      
      <!-- Modal Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--sand-border);padding-bottom:12px;margin-bottom:14px">
        <div>
          <span class="badge badge-gold" style="font-size:.65rem;margin-bottom:4px">Order #${a}</span>
          <h3 style="font-family:var(--font-serif);font-size:1.2rem;color:var(--forest-dark);margin:0">Return &amp; Exchange Request</h3>
        </div>
        <button class="modal-close-btn" id="return-modal-close" style="position:static;width:30px;height:30px;font-size:1.1rem;display:flex;align-items:center;justify-content:center">${g("close",16)}</button>
      </div>

      <!-- Item Preview Card -->
      <div style="background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-md);padding:12px 14px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;gap:10px">
        <div>
          <div style="font-weight:700;font-size:.86rem;color:var(--forest-dark)">${i}</div>
          <div style="font-size:.72rem;color:var(--text-muted)">Eligible for 2-day return, exchange or 100% refund</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:.65rem;color:var(--text-muted)">Item Value</div>
          <div style="font-weight:800;color:var(--forest-dark);font-size:1rem">${w(t||0)}</div>
        </div>
      </div>

      <!-- Form -->
      <form id="return-request-form" style="display:flex;flex-direction:column;gap:12px">
        <div>
          <label style="display:block;font-size:.74rem;font-weight:700;color:var(--forest-dark);margin-bottom:4px">Request Preference *</label>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            <label style="display:flex;align-items:center;gap:8px;background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-md);padding:8px 12px;font-size:.78rem;cursor:pointer;font-weight:600">
              <input type="radio" name="ret-type" value="Return & Refund" checked style="accent-color:var(--forest)">
              <span>Return &amp; Refund</span>
            </label>
            <label style="display:flex;align-items:center;gap:8px;background:var(--white);border:1px solid var(--sand-border);border-radius:var(--r-md);padding:8px 12px;font-size:.78rem;cursor:pointer;font-weight:600">
              <input type="radio" name="ret-type" value="Exchange / Replacement" style="accent-color:var(--forest)">
              <span>Exchange / Replace</span>
            </label>
          </div>
        </div>

        <div>
          <label style="display:block;font-size:.74rem;font-weight:700;color:var(--forest-dark);margin-bottom:4px">Reason for Return / Exchange *</label>
          <select id="ret-reason" class="form-input" required style="font-size:.82rem;padding:8px 10px">
            <option value="Damaged Outer Packaging / Broken Seal">Damaged Outer Packaging / Broken Seal</option>
            <option value="Received Incorrect Item or Flavor">Received Incorrect Item or Flavor</option>
            <option value="Quality or Taste Not as Expected">Quality or Taste Not as Expected</option>
            <option value="Allergic Sensitivity or Health Precaution">Allergic Sensitivity or Health Precaution</option>
            <option value="Ordered Duplicate by Mistake">Ordered Duplicate by Mistake</option>
            <option value="Other / Personal Discretion">Other / Personal Discretion</option>
          </select>
        </div>

        <div>
          <label style="display:block;font-size:.74rem;font-weight:700;color:var(--forest-dark);margin-bottom:4px">Explain the Issue in Detail *</label>
          <textarea id="ret-details" class="form-input" rows="3" required placeholder="Please describe the condition of the package, batch details, or reason for return/exchange..." style="font-size:.82rem;padding:8px 10px;resize:vertical"></textarea>
        </div>

        <div>
          <label style="display:block;font-size:.74rem;font-weight:700;color:var(--forest-dark);margin-bottom:4px">Contact Mobile for Pickup Coordination *</label>
          <input type="tel" id="ret-phone" class="form-input" required value="${((p=n.user)==null?void 0:p.phone)||"9876543210"}" placeholder="Mobile number" style="font-size:.82rem;padding:8px 10px">
        </div>

        <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:6px">
          <button type="button" id="cancel-return-btn" class="btn btn-ghost btn-sm" style="font-size:.8rem;padding:8px 14px">Cancel</button>
          <button type="submit" class="btn btn-gold btn-sm" style="font-size:.8rem;padding:8px 16px;font-weight:700">Submit Request →</button>
        </div>
      </form>

    </div>
  </div>`;const o=document.getElementById("return-modal-overlay"),s=document.getElementById("return-modal-close"),d=document.getElementById("cancel-return-btn"),c=()=>{o==null||o.remove()};s&&s.addEventListener("click",c),d&&d.addEventListener("click",c),o&&o.addEventListener("click",m=>{m.target===o&&c()});const l=document.getElementById("return-request-form");l&&l.addEventListener("submit",m=>{var h,P,b,x;m.preventDefault();const v=`${((h=document.querySelector('input[name="ret-type"]:checked'))==null?void 0:h.value)||"Return & Refund"}: ${((P=document.getElementById("ret-reason"))==null?void 0:P.value)||"Return requested"}`,k=((b=document.getElementById("ret-details"))==null?void 0:b.value.trim())||"",$=((x=document.getElementById("ret-phone"))==null?void 0:x.value.trim())||"",E=n.requestReturn(a,e,i,v,k,t,$);f("Return & Exchange request submitted! Live chat opened. 📦"),c();const y=document.getElementById("profile-content");y&&(y.innerHTML=_()),E&&E.returnId&&setTimeout(()=>ne(E.returnId),400)})}function ne(a){O(!0);const e=(n.returns||[]).find(p=>p.id===a),i=document.getElementById("modal-box");if(!e||!i)return;const r={Requested:{bg:"rgba(245,158,11,.15)",color:"#d97706"},"Under Review":{bg:"rgba(59,130,246,.15)",color:"#2563eb"},Approved:{bg:"rgba(16,185,129,.15)",color:"#059669"},"Replacement Shipped":{bg:"rgba(16,185,129,.15)",color:"#059669"},"Refund Completed":{bg:"rgba(16,185,129,.15)",color:"#059669"},Rejected:{bg:"rgba(239,68,68,.15)",color:"#dc2626"}}[e.status]||{bg:"rgba(20,51,37,.1)",color:"var(--forest)"};i.innerHTML=`
  <div class="modal-overlay open" id="user-return-chat-overlay" style="padding:14px 10px;align-items:center;justify-content:center;z-index:9999">
    <div class="modal-card modal-lg" style="max-width:560px;width:100%;padding:20px;border-radius:var(--r-xl);box-shadow:var(--shadow-xl);background:var(--sand-light);border:1px solid var(--sand-border);margin:auto;max-height:88vh;display:flex;flex-direction:column">
      
      <!-- Header -->
      <div style="border-bottom:1px solid var(--sand-border);padding-bottom:12px;margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
          <div>
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
              <span class="badge badge-gold" style="font-size:.65rem">Ticket #${e.id}</span>
              <span class="badge" style="font-size:.65rem;background:${r.bg};color:${r.color};font-weight:800">${e.status.toUpperCase()}</span>
            </div>
            <h3 style="font-family:var(--font-sans);font-weight:800;font-size:1.05rem;color:var(--forest-dark);margin:0">${e.productName}</h3>
            <div style="font-size:.72rem;color:var(--text-muted);margin-top:2px">Order #${e.orderId} &bull; Refund / Value: ${w(e.amount||0)}</div>
          </div>
          <button class="modal-close-btn" id="user-return-chat-close" style="position:static;width:30px;height:30px;font-size:1.1rem;display:flex;align-items:center;justify-content:center">${g("close",16)}</button>
        </div>
      </div>

      <!-- Chat Viewport -->
      <div id="user-ret-messages-viewport" style="flex-grow:1;overflow-y:auto;display:flex;flex-direction:column;gap:10px;max-height:340px;margin-bottom:14px;padding-right:4px">
        ${(e.chat||[]).map(p=>{var u;const m=p.sender==="Customer"||p.sender===((u=n.user)==null?void 0:u.name);return`
          <div style="display:flex;flex-direction:column;align-items:${m?"flex-end":"flex-start"}">
            <div style="font-size:.65rem;color:var(--text-muted);margin-bottom:2px;padding:0 4px">
              ${p.sender} &bull; ${p.time||""}
            </div>
            <div style="max-width:85%;padding:9px 13px;border-radius:${m?"14px 14px 2px 14px":"14px 14px 14px 2px"};background:${m?"var(--forest-dark)":"var(--white)"};color:${m?"var(--sand-light)":"var(--text-dark)"};border:1px solid ${m?"var(--forest-dark)":"var(--sand-border)"};font-size:.82rem;line-height:1.45;word-break:break-word;white-space:pre-wrap">
              ${p.text}
            </div>
          </div>`}).join("")}
      </div>

      <!-- Reply Box -->
      <form id="user-return-reply-form" style="display:flex;gap:8px;align-items:center;border-top:1px solid var(--sand-border);padding-top:12px">
        <input type="text" id="user-ret-reply-input" class="form-input" placeholder="Type message to Aurite Returns Desk..." required style="flex-grow:1;font-size:.82rem;padding:9px 12px;height:38px">
        <button type="submit" class="btn btn-gold btn-sm" style="flex-shrink:0;padding:9px 16px;font-size:.8rem;height:38px;font-weight:700">Send 💬</button>
      </form>

    </div>
  </div>`;const o=document.getElementById("user-return-chat-overlay"),s=document.getElementById("user-return-chat-close"),d=()=>{o==null||o.remove()};s&&s.addEventListener("click",d),o&&o.addEventListener("click",p=>{p.target===o&&d()});const c=document.getElementById("user-ret-messages-viewport");c&&(c.scrollTop=c.scrollHeight);const l=document.getElementById("user-return-reply-form");l&&l.addEventListener("submit",p=>{var v;p.preventDefault();const m=document.getElementById("user-ret-reply-input"),u=m==null?void 0:m.value.trim();u&&(n.replyToReturnChat(a,u,((v=n.user)==null?void 0:v.name)||"Customer"),m.value="",ne(a))})}function Ce(a,e,i){document.querySelectorAll("#review-modal").forEach(l=>l.remove()),O(!0);const t=`
  <div id="review-modal" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;backdrop-filter:blur(4px);padding:16px">
    <div style="background:var(--white);padding:24px 20px;border-radius:var(--r-lg);width:100%;max-width:460px;box-shadow:var(--shadow-lg);position:relative;animation:slideUp 0.25s ease">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <h3 style="font-family:var(--font-serif);font-size:1.35rem;color:var(--forest-dark);margin:0">Write a Review</h3>
        <button class="modal-close-btn" id="close-review-modal" data-action="close-review-modal" aria-label="Close Review Modal" style="position:static;width:30px;height:30px;font-size:1rem;display:flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer">${g("close",14)}</button>
      </div>
      <p style="color:var(--text-muted);font-size:.82rem;margin-bottom:16px;line-height:1.4">Share your experience with <strong style="color:var(--forest-dark)">${i}</strong>.</p>
      
      <form id="review-form">
        <div style="margin-bottom:14px">
          <label style="display:block;font-size:.80rem;font-weight:700;margin-bottom:6px;color:var(--text-dark)">Overall Rating</label>
          <div id="star-rating" style="display:flex;gap:6px;font-size:1.8rem;color:#f59e0b;cursor:pointer;transition:color 0.2s">
            <span data-val="1">★</span><span data-val="2">★</span><span data-val="3">★</span><span data-val="4">★</span><span data-val="5">★</span>
          </div>
          <input type="hidden" id="review-rating" value="5">
        </div>
        
        <div style="margin-bottom:20px">
          <label style="display:block;font-size:.80rem;font-weight:700;margin-bottom:6px;color:var(--text-dark)">Your Review (Optional)</label>
          <textarea id="review-text" class="form-input" rows="3" placeholder="What did you like or dislike? (Optional)" style="resize:vertical;font-size:.82rem;padding:8px 10px"></textarea>
        </div>
        
        <button type="submit" class="btn btn-gold" style="width:100%;padding:12px;font-size:.9rem;font-weight:800;border-radius:var(--r-md)">Submit Review</button>
      </form>
    </div>
  </div>`;document.body.insertAdjacentHTML("beforeend",t);const r=document.getElementById("review-modal"),o=document.getElementById("review-form"),s=document.querySelectorAll("#star-rating span"),d=document.getElementById("review-rating"),c=()=>{O(!1),document.querySelectorAll("#review-modal").forEach(l=>l.remove())};r&&r.addEventListener("click",l=>{(l.target===r||l.target.closest("#close-review-modal")||l.target.closest('[data-action="close-review-modal"]'))&&(l.preventDefault(),l.stopPropagation(),c())}),s.forEach(l=>{l.addEventListener("click",()=>{const p=parseInt(l.dataset.val);d.value=p,s.forEach(m=>{m.style.color=parseInt(m.dataset.val)<=p?"#f59e0b":"var(--sand-border)"})}),l.addEventListener("mouseenter",()=>{const p=parseInt(l.dataset.val);s.forEach(m=>{m.style.color=parseInt(m.dataset.val)<=p?"#f59e0b":"var(--sand-border)"})}),l.addEventListener("mouseleave",()=>{const p=parseInt(d.value)||5;s.forEach(m=>{m.style.color=parseInt(m.dataset.val)<=p?"#f59e0b":"var(--sand-border)"})})}),o&&o.addEventListener("submit",l=>{var k;l.preventDefault();const p=parseInt(d.value)||5,m=((k=document.getElementById("review-text"))==null?void 0:k.value.trim())||"Excellent product quality and prompt delivery.",u=n.user?n.user.name:"Verified Buyer";n.addReview(a,e,p,m,u),f("Thank you! Your review has been submitted. 🎉"),c();const v=document.getElementById("profile-content");v&&(v.innerHTML=_())})}function ct(a){const e=`${a.address||"Flat 402, Green Glen Heights, HSR Layout"}, ${a.city||"Mumbai"} - ${a.pincode||"400001"}, ${a.country||"India"}`;return`
  <div style="display:flex;flex-direction:column;gap:14px">
    
    <!-- Account Details Overview Card -->
    <div style="background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:14px;box-shadow:var(--shadow-sm)">
      <div style="font-size:.70rem;font-weight:800;color:var(--gold);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">Account Overview</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        <div>
          <span style="font-size:.72rem;color:var(--text-muted);display:block">Full Name</span>
          <span style="font-size:.88rem;font-weight:700;color:var(--forest-dark)">${a.name}</span>
        </div>
        <div>
          <span style="font-size:.72rem;color:var(--text-muted);display:block">Email Address</span>
          <span style="font-size:.84rem;font-weight:600;color:var(--forest-dark)">${a.email}</span>
        </div>
        <div>
          <span style="font-size:.72rem;color:var(--text-muted);display:block">Registered Mobile</span>
          <span style="font-size:.84rem;font-weight:600;color:var(--forest-dark)">${a.phone||"+91 98765 43210"}</span>
        </div>
        <div>
          <span style="font-size:.72rem;color:var(--text-muted);display:block">Default Address</span>
          <span style="font-size:.82rem;font-weight:600;color:var(--forest-dark)">${e}</span>
        </div>
      </div>
    </div>

    <!-- Update Delivery Address Form Card -->
    <div style="background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:14px;box-shadow:var(--shadow-sm)">
      <div style="font-weight:800;font-size:.84rem;color:var(--forest-dark);margin-bottom:2px">Update Delivery Address</div>
      <p style="font-size:.72rem;color:var(--text-muted);margin-bottom:10px">Edit your default shipping and delivery address.</p>
      
      <form id="update-address-form" style="display:flex;flex-direction:column;gap:8px">
        <div>
          <label class="form-label" style="font-size:.70rem">Delivery Address *</label>
          <textarea id="prof-addr" class="form-input" rows="2" required placeholder="House / Flat No., Building, Street &amp; Locality" style="font-size:.80rem;padding:7px 10px;resize:vertical">${a.address||"Flat 402, Green Glen Heights, HSR Layout"}</textarea>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <div>
            <label class="form-label" style="font-size:.70rem">City / Town *</label>
            <input type="text" id="prof-city" class="form-input" value="${a.city||"Mumbai"}" required placeholder="City" style="font-size:.80rem;padding:7px 10px">
          </div>
          <div>
            <label class="form-label" style="font-size:.70rem">Pincode *</label>
            <input type="text" id="prof-pincode" class="form-input" value="${a.pincode||"400001"}" required placeholder="6-digit PIN" maxlength="6" style="font-size:.80rem;padding:7px 10px">
          </div>
        </div>
        <div>
          <label class="form-label" style="font-size:.70rem">Country *</label>
          <input type="text" id="prof-country" class="form-input" value="${a.country||"India"}" required placeholder="Country" style="font-size:.80rem;padding:7px 10px">
        </div>
        <button type="submit" class="btn btn-primary btn-sm" style="font-size:.78rem;padding:8px 14px;margin-top:2px">Save Delivery Address 🏡</button>
      </form>
    </div>

    <!-- Update Name Card -->
    <div style="background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:14px;box-shadow:var(--shadow-sm)">
      <div style="font-weight:800;font-size:.84rem;color:var(--forest-dark);margin-bottom:2px">Update Full Name</div>
      <form id="update-name-form" style="display:flex;flex-direction:column;gap:8px;margin-top:6px">
        <div>
          <label class="form-label" style="font-size:.70rem;margin-bottom:2px">Full Name *</label>
          <input type="text" id="prof-name" class="form-input" value="${a.name}" required placeholder="e.g. Akash Sharma" style="font-size:.82rem;padding:7px 10px">
        </div>
        <button type="submit" class="btn btn-primary btn-sm" style="font-size:.78rem;padding:8px 14px;width:100%">Save Name</button>
      </form>
    </div>

    <!-- Update Email Address Card -->
    <div style="background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:14px;box-shadow:var(--shadow-sm)">
      <div style="font-weight:800;font-size:.84rem;color:var(--forest-dark);margin-bottom:2px">Update Email Address</div>
      <p style="font-size:.72rem;color:var(--text-muted);margin-bottom:8px">OTP will be sent to your new email for verification.</p>
      <form id="update-email-form" style="display:flex;flex-direction:column;gap:8px" data-step="1">
        <input type="email" class="form-input" value="${a.email}" disabled style="opacity:0.7;font-size:.80rem;padding:7px 10px">
        <div id="new-email-field">
          <input type="email" id="prof-new-email" class="form-input" placeholder="New email address" required style="font-size:.80rem;padding:7px 10px">
        </div>
        <div id="email-otp-field" style="display:none">
          <input type="text" id="prof-email-otp" class="form-input" placeholder="Enter 6-digit OTP sent to new email" maxlength="6" style="font-size:.80rem;padding:7px 10px">
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button type="button" id="send-email-otp-btn" class="btn btn-primary btn-sm" style="font-size:.78rem;padding:8px 14px;flex-grow:1">Send OTP</button>
          <button type="submit" id="verify-email-btn" class="btn btn-gold btn-sm" style="display:none;font-size:.78rem;padding:8px 14px;flex-grow:1">Verify &amp; Update</button>
        </div>
      </form>
    </div>

    <!-- Update Mobile Number Card -->
    <div style="background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:14px;box-shadow:var(--shadow-sm)">
      <div style="font-weight:800;font-size:.84rem;color:var(--forest-dark);margin-bottom:2px">Registered Mobile Number</div>
      <p style="font-size:.72rem;color:var(--text-muted);margin-bottom:8px">OTP will be sent to confirm your mobile number change.</p>
      <form id="update-phone-form" style="display:flex;flex-direction:column;gap:8px">
        <input type="tel" class="form-input" value="${a.phone||"+91 98765 43210"}" disabled style="opacity:0.75;font-size:.80rem;padding:7px 10px">
        <div id="new-phone-field">
          <input type="tel" id="prof-new-phone" class="form-input" placeholder="New 10-digit mobile number" required style="font-size:.80rem;padding:7px 10px">
        </div>
        <div id="phone-otp-field" style="display:none">
          <input type="text" id="prof-phone-otp" class="form-input" placeholder="Enter 6-digit OTP sent to mobile" maxlength="6" style="font-size:.80rem;padding:7px 10px">
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button type="button" id="send-phone-otp-btn" class="btn btn-primary btn-sm" style="font-size:.78rem;padding:8px 14px;flex-grow:1">Send OTP to Mobile</button>
          <button type="submit" id="verify-phone-btn" class="btn btn-gold btn-sm" style="display:none;font-size:.78rem;padding:8px 14px;flex-grow:1">Verify &amp; Update</button>
        </div>
      </form>
    </div>

    <!-- Change Password Card with Cancel/Close Reset option -->
    <div style="background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:14px;box-shadow:var(--shadow-sm)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px">
        <div style="font-weight:800;font-size:.84rem;color:var(--forest-dark)">Change Password</div>
      </div>
      <p style="font-size:.74rem;color:var(--text-muted);margin-bottom:12px;line-height:1.35">A 6-digit verification code will be sent to <strong style="color:var(--forest-dark);word-break:break-all">${a.email}</strong>.</p>
      
      <form id="change-password-form" style="display:flex;flex-direction:column;gap:10px">
        <div id="pwd-otp-request-group">
          <button type="button" id="send-pwd-otp-btn" class="btn btn-primary btn-sm" style="font-size:.80rem;padding:9px 16px;width:100%">Send OTP to Email</button>
        </div>
        
        <div id="pwd-otp-fields" style="display:none;flex-direction:column;gap:10px">
          <div style="background:rgba(197,160,89,0.12);border:1px solid rgba(197,160,89,0.3);border-radius:var(--r-sm);padding:8px 10px;font-size:.74rem;color:var(--forest-dark);display:flex;flex-direction:column;gap:6px">
            <div style="word-break:break-all;line-height:1.35">OTP sent to <strong style="color:var(--forest-dark)">${a.email}</strong></div>
            <div style="display:flex;gap:12px;align-items:center">
              <button type="button" id="resend-pwd-otp-btn" style="background:none;border:none;color:var(--gold);font-weight:700;cursor:pointer;font-size:.72rem;text-decoration:underline;padding:0">Resend OTP</button>
              <button type="button" id="cancel-pwd-otp-btn" style="background:none;border:none;color:var(--error);font-weight:700;cursor:pointer;font-size:.72rem;text-decoration:underline;padding:0">Cancel</button>
            </div>
          </div>

          <div>
            <label class="form-label" style="font-size:.70rem;margin-bottom:2px">Enter 6-Digit OTP *</label>
            <input type="text" id="pwd-otp-input" class="form-input" placeholder="e.g. 123456" maxlength="6" style="font-size:.82rem;padding:8px 11px;letter-spacing:1px">
          </div>

          <div>
            <label class="form-label" style="font-size:.70rem;margin-bottom:2px">New Password *</label>
            <input type="password" id="prof-new-pwd" class="form-input" placeholder="Min 8 chars, 1 uppercase, 1 number" style="font-size:.82rem;padding:8px 11px">
          </div>

          <div>
            <label class="form-label" style="font-size:.70rem;margin-bottom:2px">Confirm New Password *</label>
            <input type="password" id="prof-confirm-pwd" class="form-input" placeholder="Confirm new password" style="font-size:.82rem;padding:8px 11px">
          </div>

          <div style="display:flex;flex-direction:column;gap:8px;margin-top:4px">
            <button type="submit" class="btn btn-gold btn-sm" style="width:100%;font-size:.78rem;padding:9px 12px;font-weight:800;border-radius:var(--r-md);white-space:nowrap">Verify &amp; Update Password</button>
            <button type="button" id="cancel-pwd-otp-btn-2" class="btn btn-secondary btn-sm" style="width:100%;font-size:.78rem;padding:8px 12px;border-radius:var(--r-md)">Cancel</button>
          </div>
        </div>
      </form>
    </div>

  </div>`}function pt(a){const e=`${a.address||"Flat 402, Green Glen Heights, HSR Layout"}, ${a.city||"Mumbai"} - ${a.pincode||"400001"}, ${a.country||"India"}`;return`
  <h3 style="font-family:var(--font-serif);font-size:1.7rem;margin-bottom:8px;color:var(--forest-dark)">Personal Details &amp; Addresses</h3>
  <p style="font-size:.88rem;color:var(--text-muted);margin-bottom:24px">Manage your delivery destination, verified contact details, and account security.</p>
  
  <!-- Account Details Overview Card -->
  <div style="background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:20px 24px;margin-bottom:24px;box-shadow:var(--shadow-sm)">
    <div style="font-size:.78rem;font-weight:800;color:var(--gold);text-transform:uppercase;letter-spacing:.06em;margin-bottom:14px">Account Overview</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px 24px">
      <div>
        <span style="font-size:.76rem;color:var(--text-muted);display:block;margin-bottom:2px">Primary Member Name</span>
        <span style="font-size:.95rem;font-weight:700;color:var(--forest-dark)">${a.name}</span>
      </div>
      <div>
        <span style="font-size:.76rem;color:var(--text-muted);display:block;margin-bottom:2px">Email Address</span>
        <span style="font-size:.92rem;font-weight:600;color:var(--forest-dark)">${a.email}</span>
      </div>
      <div>
        <span style="font-size:.76rem;color:var(--text-muted);display:block;margin-bottom:2px">Registered Mobile</span>
        <span style="font-size:.92rem;font-weight:600;color:var(--forest-dark)">${a.phone||"+91 98765 43210"}</span>
      </div>
      <div>
        <span style="font-size:.76rem;color:var(--text-muted);display:block;margin-bottom:2px">Default Delivery Destination</span>
        <span style="font-size:.88rem;font-weight:600;color:var(--forest-dark);line-height:1.4">${e}</span>
      </div>
    </div>
  </div>

  <!-- Update Delivery Address Section -->
  <div style="background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:24px;margin-bottom:24px;box-shadow:var(--shadow-sm)">
    <h4 style="font-family:var(--font-serif);font-size:1.15rem;margin-bottom:4px;color:var(--forest-dark)">Update Delivery Address</h4>
    <p style="font-size:.82rem;color:var(--text-muted);margin-bottom:16px">Edit your default shipping and delivery address for future orders.</p>
    <form id="update-address-form" style="max-width:620px;display:flex;flex-direction:column;gap:12px">
      <div>
        <label class="form-label" style="font-size:.76rem">Delivery Address *</label>
        <textarea id="prof-addr" class="form-input" rows="2" required placeholder="House / Flat No., Building Name, Street &amp; Locality" style="padding:10px 12px;font-size:.88rem;resize:vertical">${a.address||"Flat 402, Green Glen Heights, HSR Layout"}</textarea>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div>
          <label class="form-label" style="font-size:.76rem">City / Town *</label>
          <input type="text" id="prof-city" class="form-input" value="${a.city||"Mumbai"}" required placeholder="City" style="height:42px;font-size:.88rem;padding:8px 12px">
        </div>
        <div>
          <label class="form-label" style="font-size:.76rem">Pincode *</label>
          <input type="text" id="prof-pincode" class="form-input" value="${a.pincode||"400001"}" required placeholder="6-digit pincode" maxlength="6" style="height:42px;font-size:.88rem;padding:8px 12px">
        </div>
      </div>
      <div>
        <label class="form-label" style="font-size:.76rem">Country *</label>
        <input type="text" id="prof-country" class="form-input" value="${a.country||"India"}" required placeholder="Country" style="height:42px;font-size:.88rem;padding:8px 12px">
      </div>
      <div style="display:flex;justify-content:flex-start;margin-top:6px">
        <button type="submit" class="btn btn-primary" style="font-size:.85rem;padding:10px 22px">Save Delivery Address 🏡</button>
      </div>
    </form>
  </div>

  <!-- Update Name Section -->
  <div style="background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:24px;margin-bottom:24px;box-shadow:var(--shadow-sm)">
    <h4 style="font-family:var(--font-serif);font-size:1.15rem;margin-bottom:14px;color:var(--forest-dark)">Update Full Name</h4>
    <form id="update-name-form" style="max-width:540px;display:flex;gap:12px;align-items:flex-end">
      <div style="flex-grow:1">
        <label class="form-label" style="font-size:.76rem">Full Name *</label>
        <input type="text" id="prof-name" class="form-input" value="${a.name}" required placeholder="e.g. Akash Sharma" style="height:42px;font-size:.88rem;padding:8px 12px">
      </div>
      <button type="submit" class="btn btn-primary" style="font-size:.85rem;padding:11px 22px;white-space:nowrap">Save Name</button>
    </form>
  </div>

  <!-- Update Email Section -->
  <div style="background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:24px;margin-bottom:24px;box-shadow:var(--shadow-sm)">
    <h4 style="font-family:var(--font-serif);font-size:1.15rem;margin-bottom:4px;color:var(--forest-dark)">Update Email Address</h4>
    <p style="font-size:.82rem;color:var(--text-muted);margin-bottom:14px">An OTP will be sent to your new email for verification.</p>
    <form id="update-email-form" style="max-width:540px;display:flex;flex-direction:column;gap:12px" data-step="1">
      <div>
        <label class="form-label" style="font-size:.76rem">Current Email</label>
        <input type="email" class="form-input" value="${a.email}" disabled style="opacity:0.75;height:42px;font-size:.88rem;padding:8px 12px">
      </div>
      <div id="new-email-field">
        <label class="form-label" style="font-size:.76rem">New Email Address *</label>
        <input type="email" id="prof-new-email" class="form-input" placeholder="newemail@example.com" required style="height:42px;font-size:.88rem;padding:8px 12px">
      </div>
      <div id="email-otp-field" style="display:none">
        <label class="form-label" style="font-size:.76rem">Enter 6-Digit OTP sent to new email</label>
        <input type="text" id="prof-email-otp" class="form-input" placeholder="6-digit OTP" maxlength="6" style="height:42px;font-size:.88rem;padding:8px 12px">
      </div>
      <div style="display:flex;gap:10px">
        <button type="button" id="send-email-otp-btn" class="btn btn-primary" style="font-size:.85rem;padding:10px 20px">Send OTP</button>
        <button type="submit" id="verify-email-btn" class="btn btn-gold" style="display:none;font-size:.85rem;padding:10px 20px">Verify &amp; Update Email</button>
      </div>
    </form>
  </div>

  <!-- Registered Mobile Number with OTP Verification -->
  <div style="background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:24px;margin-bottom:24px;box-shadow:var(--shadow-sm)">
    <h4 style="font-family:var(--font-serif);font-size:1.15rem;margin-bottom:4px;color:var(--forest-dark)">Registered Mobile Number</h4>
    <p style="font-size:.82rem;color:var(--text-muted);margin-bottom:14px">A 6-digit verification code will be sent to confirm your mobile number change.</p>
    <form id="update-phone-form" style="max-width:540px;display:flex;flex-direction:column;gap:12px">
      <div>
        <label class="form-label" style="font-size:.76rem">Current Registered Number</label>
        <input type="tel" class="form-input" value="${a.phone||"+91 98765 43210"}" disabled style="opacity:0.75;height:42px;font-size:.88rem;padding:8px 12px">
      </div>
      <div id="new-phone-field">
        <label class="form-label" style="font-size:.76rem">New Mobile Number *</label>
        <input type="tel" id="prof-new-phone" class="form-input" placeholder="+91 98765 43210" required style="height:42px;font-size:.88rem;padding:8px 12px">
      </div>
      <div id="phone-otp-field" style="display:none">
        <label class="form-label" style="font-size:.76rem">Enter 6-Digit OTP sent to mobile</label>
        <input type="text" id="prof-phone-otp" class="form-input" placeholder="6-digit OTP" maxlength="6" style="height:42px;font-size:.88rem;padding:8px 12px">
      </div>
      <div style="display:flex;gap:10px">
        <button type="button" id="send-phone-otp-btn" class="btn btn-primary" style="font-size:.85rem;padding:10px 20px">Send OTP to Mobile</button>
        <button type="submit" id="verify-phone-btn" class="btn btn-gold" style="display:none;font-size:.85rem;padding:10px 20px">Verify &amp; Update Mobile</button>
      </div>
    </form>
  </div>

  <!-- Change Password Section with Close/Cancel option -->
  <div style="background:var(--sand-light);border:1px solid var(--sand-border);border-radius:var(--r-lg);padding:24px;margin-bottom:24px;box-shadow:var(--shadow-sm)">
    <div style="margin-bottom:4px">
      <h4 style="font-family:var(--font-serif);font-size:1.2rem;color:var(--forest-dark);margin:0">Change Password</h4>
    </div>
    <p style="font-size:.82rem;color:var(--text-muted);margin-bottom:16px;line-height:1.4">A 6-digit verification code will be sent to <strong style="color:var(--forest-dark)">${a.email}</strong> before password update.</p>
    
    <form id="change-password-form" style="max-width:540px;display:flex;flex-direction:column;gap:14px">
      <div id="pwd-otp-request-group">
        <button type="button" id="send-pwd-otp-btn" class="btn btn-primary" style="font-size:.85rem;padding:10px 22px">Send OTP to Email</button>
      </div>
      
      <div id="pwd-otp-fields" style="display:none;display:flex;flex-direction:column;gap:14px">
        <div style="background:rgba(197,160,89,0.12);border:1px solid rgba(197,160,89,0.3);border-radius:var(--r-sm);padding:10px 14px;font-size:.80rem;color:var(--forest-dark);display:flex;justify-content:space-between;align-items:center">
          <span>OTP sent to <strong>${a.email}</strong></span>
          <div style="display:flex;gap:12px;align-items:center">
            <button type="button" id="resend-pwd-otp-btn" style="background:none;border:none;color:var(--gold);font-weight:700;cursor:pointer;font-size:.80rem;text-decoration:underline">Resend</button>
            <button type="button" id="cancel-pwd-otp-btn" style="background:none;border:none;color:var(--error);font-weight:700;cursor:pointer;font-size:.80rem;text-decoration:underline">Cancel</button>
          </div>
        </div>

        <div>
          <label class="form-label" style="font-size:.76rem;margin-bottom:3px">Enter 6-Digit OTP *</label>
          <input type="text" id="pwd-otp-input" class="form-input" placeholder="e.g. 123456" maxlength="6" style="height:42px;font-size:.88rem;padding:8px 12px;letter-spacing:1.5px">
        </div>
        <div>
          <label class="form-label" style="font-size:.76rem;margin-bottom:3px">New Password *</label>
          <input type="password" id="prof-new-pwd" class="form-input" placeholder="Min 8 chars, 1 uppercase, 1 number" style="height:42px;font-size:.88rem;padding:8px 12px">
        </div>
        <div>
          <label class="form-label" style="font-size:.76rem;margin-bottom:3px">Confirm New Password *</label>
          <input type="password" id="prof-confirm-pwd" class="form-input" placeholder="Repeat new password" style="height:42px;font-size:.88rem;padding:8px 12px">
        </div>
        <div style="display:flex;gap:10px;align-items:center">
          <button type="submit" class="btn btn-gold" style="font-size:.88rem;padding:12px 24px;font-weight:800;border-radius:var(--r-md)">Verify &amp; Update Password</button>
          <button type="button" id="cancel-pwd-otp-btn-2" class="btn btn-secondary" style="font-size:.88rem;padding:12px 20px;border-radius:var(--r-md)">Cancel</button>
        </div>
      </div>
    </form>
  </div>`}function de(a){return window.innerWidth>=900?pt(a):ct(a)}function mt(){return`
  <footer class="footer" style="padding:28px 0 60px">
    <div class="container">
      <div class="footer-grid" style="display:grid;grid-template-columns:repeat(3, 1fr);gap:10px;margin-bottom:20px;width:100%">
        
        <!-- Column 1: Follow Us -->
        <div class="footer-col" style="min-width:0;overflow:hidden">
          <h4 class="footer-col-title" style="color:var(--gold-bright);font-family:var(--font-serif);font-size:clamp(0.82rem, 3vw, 0.92rem);font-weight:700;height:24px;display:flex;align-items:center;margin:0 0 12px;white-space:nowrap">Follow Us</h4>
          <div class="footer-social-row" style="display:flex;flex-direction:column;gap:0">
            <!-- Row 1 -->
            <div style="height:28px;display:flex;align-items:center;margin-bottom:6px">
              <a href="https://instagram.com" target="_blank" rel="noopener" class="footer-social-link" style="display:flex;align-items:center;gap:6px;color:var(--text-light);font-size:clamp(0.70rem, 2.5vw, 0.78rem);text-decoration:none;white-space:nowrap">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
                <span>Instagram</span>
              </a>
            </div>
            <!-- Row 2 -->
            <div style="height:28px;display:flex;align-items:center;margin-bottom:6px">
              <a href="https://twitter.com" target="_blank" rel="noopener" class="footer-social-link" style="display:flex;align-items:center;gap:6px;color:var(--text-light);font-size:clamp(0.70rem, 2.5vw, 0.78rem);text-decoration:none;white-space:nowrap">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                <span>X</span>
              </a>
            </div>
            <!-- Row 3 -->
            <div style="height:28px;display:flex;align-items:center;margin-bottom:6px">
              <a href="https://youtube.com" target="_blank" rel="noopener" class="footer-social-link" style="display:flex;align-items:center;gap:6px;color:var(--text-light);font-size:clamp(0.70rem, 2.5vw, 0.78rem);text-decoration:none;white-space:nowrap">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
                <span>YouTube</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Column 2: Company -->
        <div class="footer-col" style="min-width:0;overflow:hidden">
          <h4 class="footer-col-title" style="color:var(--gold-bright);font-family:var(--font-serif);font-size:clamp(0.82rem, 3vw, 0.92rem);font-weight:700;height:24px;display:flex;align-items:center;margin:0 0 12px;white-space:nowrap">Company</h4>
          <ul class="footer-links" style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0">
            <!-- Row 1 -->
            <li style="height:28px;display:flex;align-items:center;margin-bottom:6px"><a data-route="shop" style="color:var(--text-light);font-size:clamp(0.70rem, 2.5vw, 0.78rem);cursor:pointer;white-space:nowrap">Shop All</a></li>
            <!-- Row 2 -->
            <li style="height:28px;display:flex;align-items:center;margin-bottom:6px"><a data-route="science" style="color:var(--text-light);font-size:clamp(0.70rem, 2.5vw, 0.78rem);cursor:pointer;white-space:nowrap">Our Science</a></li>
            <!-- Row 3 -->
            <li style="height:28px;display:flex;align-items:center;margin-bottom:6px"><a data-route="about" style="color:var(--text-light);font-size:clamp(0.70rem, 2.5vw, 0.78rem);cursor:pointer;white-space:nowrap">About Us</a></li>
            <!-- Row 4 -->
            <li style="height:28px;display:flex;align-items:center;margin-bottom:6px"><a data-route="contact" style="color:var(--text-light);font-size:clamp(0.70rem, 2.5vw, 0.78rem);cursor:pointer;white-space:nowrap">Contact</a></li>
          </ul>
        </div>

        <!-- Column 3: Support (Aligned Tabular with Row 1 & Row 2) -->
        <div class="footer-col" style="min-width:0;overflow:hidden">
          <h4 class="footer-col-title" style="color:var(--gold-bright);font-family:var(--font-serif);font-size:clamp(0.82rem, 3vw, 0.92rem);font-weight:700;height:24px;display:flex;align-items:center;margin:0 0 12px;white-space:nowrap">Support</h4>
          <div style="display:flex;flex-direction:column;gap:0">
            <!-- Row 1: Email Address -->
            <div style="height:28px;display:flex;align-items:center;margin-bottom:6px">
              <a href="mailto:aurite@gmail.com" class="footer-email-link" style="color:var(--gold-bright);text-decoration:none;font-size:clamp(0.66rem, 2.4vw, 0.78rem);line-height:1;word-break:break-all;overflow-wrap:anywhere;display:block">aurite@gmail.com</a>
            </div>
            <!-- Row 2: 100% LAB TESTED Badge -->
            <div style="height:28px;display:flex;align-items:center;margin-bottom:6px">
              <span style="background:#faf7f2;color:#0a1f16;font-size:clamp(0.48rem, 1.8vw, 0.54rem);font-weight:800;letter-spacing:.04em;padding:3px 8px;border-radius:999px;display:inline-flex;align-items:center;line-height:1;white-space:nowrap">100% LAB TESTED</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom" style="margin-top:20px;border-top:1px solid rgba(255,255,255,.08);padding-top:14px;display:flex;align-items:center;justify-content:space-between;flex-direction:row;flex-wrap:wrap;gap:8px;width:100%">
        <p style="font-size:clamp(0.68rem, 2.3vw, 0.76rem);margin:0;color:var(--text-light);white-space:nowrap">© 2026 Aurite Labs.</p>
        <div style="display:flex;gap:10px;margin:0;white-space:nowrap">
          <a href="#" id="footer-privacy-link" style="cursor:pointer;font-size:clamp(0.68rem, 2.3vw, 0.76rem);color:var(--text-light);text-decoration:none">Privacy Policy</a>
          <a href="#" id="footer-terms-link" style="cursor:pointer;font-size:clamp(0.68rem, 2.3vw, 0.76rem);color:var(--text-light);text-decoration:none">Terms &amp; Conditions</a>
        </div>
      </div>
    </div>
  </footer>`}function ut(){return`
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand-col">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
            ${ie("#faf7f2",32)}
            <span style="font-family:var(--font-serif);font-size:1.7rem;color:var(--sand-light);font-weight:600">Aurite</span>
          </div>
          <p style="font-size:.88rem;color:var(--text-light);line-height:1.65;margin-bottom:20px;max-width:320px">Clinically engineered nutraceuticals targeting cellular bio-available pathways for maximum whole-body longevity.</p>
        </div>
        <div class="footer-col">
          <h4>Follow Us</h4>
          <div style="display:flex;flex-direction:column;gap:12px">
            <a href="https://instagram.com" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:10px;color:var(--text-light);font-size:.88rem;text-decoration:none;transition:color .2s" onmouseover="this.style.color='#e1306c'" onmouseout="this.style.color=''">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
              Instagram
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:10px;color:var(--text-light);font-size:.88rem;text-decoration:none;transition:color .2s" onmouseover="this.style.color='#1da1f2'" onmouseout="this.style.color=''">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              X
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:10px;color:var(--text-light);font-size:.88rem;text-decoration:none;transition:color .2s" onmouseover="this.style.color='#ff0000'" onmouseout="this.style.color=''">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
              YouTube
            </a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Explore</h4>
          <ul class="footer-links">
            <li><a data-route="shop">Shop All Formulations</a></li>
            <li><a data-route="science">Bio-Shield Science</a></li>
            <li><a data-route="about">About Aurite Labs</a></li>
            <li><a data-route="contact">Customer Support</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Support &amp; Quality</h4>
          <div style="display:flex;flex-direction:column;gap:12px">
            <a href="mailto:aurite@gmail.com" class="footer-email-link" style="color:var(--gold-bright);text-decoration:none;font-size:.9rem">aurite@gmail.com</a>
            <div style="display:flex;align-items:center">
              <span style="background:#faf7f2;color:#0a1f16;font-size:.65rem;font-weight:800;letter-spacing:.04em;padding:4px 10px;border-radius:999px;display:inline-flex;align-items:center;line-height:1;white-space:nowrap">100% LAB TESTED</span>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 Aurite Labs Inc. All clinical rights reserved.</p>
        <div style="display:flex;gap:20px">
          <a href="#" id="footer-privacy-link" style="cursor:pointer;color:var(--text-light);text-decoration:none">Privacy Policy</a>
          <a href="#" id="footer-terms-link" style="cursor:pointer;color:var(--text-light);text-decoration:none">Terms &amp; Conditions</a>
        </div>
      </div>
    </div>
  </footer>`}function he(){return window.innerWidth>=900?ut():mt()}function T(a,e=null){N.includes(a)||(a="home"),e&&(K=e),n.currentRoute=a,history.pushState({},"",e?`#product/${e}`:`#${a}`),window.scrollTo(0,0),document.documentElement.scrollTop=0,document.body.scrollTop=0,R(a),X(),Z(),H()}function R(a){const e=document.getElementById("app-main-content");if(!e)return;window.scrollTo(0,0),document.documentElement.scrollTop=0,document.body.scrollTop=0;let i="";switch(a){case"shop":i=ke();break;case"product":i=_e(K);break;case"science":i=We();break;case"about":i=Je();break;case"contact":i=Ke();break;case"profile":i=ot();break;case"admin":i=et();break;default:i=qe();break}e.innerHTML=i,Ae(a),ft(),Z(),H()}function Ae(a){if(a==="home"){const e=document.getElementById("home-grid");e&&fe(e),setTimeout(()=>new Te("scroll-canvas"),80),gt();const i=[{num:1,title:"Ethical Botanical Sourcing",phase:"Botanical Extraction & Cold Storage Phase",temp:"-12°C Cold Storage",param:"100% Organic Habitat",desc:"Wild-harvested marine algae and organic botanicals extracted at peak potency from certified eco-refuges."},{num:2,title:"Supercritical CO₂ Extraction",phase:"Supercritical CO₂ Molecular Separation Phase",temp:"31.1°C Critical Temp",param:"73.8 Bar Pressure",desc:"Cold supercritical carbon dioxide isolates target bioactive compounds without thermal destruction or chemical solvents."},{num:3,title:"Enteric Micro-Shielding",phase:"Enteric Alginate Micro-Encapsulation Phase",temp:"pH 1.5 Gastric Bypass",param:"pH 7.4 Intestinal Release",desc:"Patented alginate dual-capsule matrix shields sensitive probiotic strains and liposomal nutrients from stomach acid."},{num:4,title:"ICP-MS Quadruple Audit",phase:"ICP-MS Mass Spectrometry Quality Audit Phase",temp:"0.00 PPM Heavy Metals",param:"ISO-17025 Certified",desc:"Every production batch undergoes 4-stage mass spectrometry testing for heavy metals, microbial safety, and active purity."}];document.querySelectorAll(".lab-step-btn").forEach(t=>{t.addEventListener("click",r=>{r.preventDefault();const o=parseInt(t.dataset.step);j=o;const s=i[o-1];document.querySelectorAll(".lab-step-btn").forEach(v=>{const k=parseInt(v.dataset.step)===o;v.classList.toggle("active",k),v.style.background=k?"var(--forest)":"var(--sand)",v.style.color=k?"#fff":"var(--forest-dark)",v.style.borderColor=k?"var(--gold)":"var(--sand-border)"});const d=document.getElementById("lab-step-badge"),c=document.getElementById("lab-step-title"),l=document.getElementById("lab-step-phase"),p=document.getElementById("lab-step-desc"),m=document.getElementById("lab-metric-a"),u=document.getElementById("lab-metric-b");d&&(d.textContent=`Step 0${s.num} Active`),c&&(c.textContent=s.title),l&&(l.textContent=s.phase),p&&(p.textContent=s.desc),m&&(m.textContent=s.temp),u&&(u.textContent=s.param)})})}if(a==="shop"){const e=document.getElementById("shop-grid");e&&fe(e);const i=document.querySelector(".filter-pills");i&&i.addEventListener("click",t=>{const r=t.target.closest(".filter-pill");if(!r)return;F=r.dataset.cat;const o=document.getElementById("app-main-content");o&&(o.innerHTML=ke(),Ae("shop"))})}if(a==="product"&&Ue(K),a==="admin"&&V(),a==="contact"){const e=document.getElementById("contact-form");e&&e.addEventListener("submit",i=>{var d,c,l,p;i.preventDefault();const t=(d=document.getElementById("ct-name"))==null?void 0:d.value.trim(),r=(c=document.getElementById("ct-email"))==null?void 0:c.value.trim(),o=(l=document.getElementById("ct-subject"))==null?void 0:l.value,s=(p=document.getElementById("ct-msg"))==null?void 0:p.value.trim();if(!t||!r||!s){f("Please fill all required fields.");return}n.addCustomerQuery(t,r,o,s),f("Query submitted! Redirecting to your profile... 🎉"),e.reset(),n.user&&(S="queries",setTimeout(()=>T("profile"),1e3))})}if(a==="profile"){document.querySelectorAll("[data-profile-tab]").forEach(i=>{i.addEventListener("click",t=>{t.preventDefault(),S=i.dataset.profileTab;const r=document.getElementById("profile-content"),o=n.user||{name:"Alex Mercer",email:"alex@example.com"};r&&(S==="orders"?r.innerHTML=_():S==="queries"?r.innerHTML=re():r.innerHTML=de(o),document.querySelectorAll(".profile-nav-btn").forEach(s=>s.classList.toggle("active",s.dataset.profileTab===S)),ee(),document.querySelectorAll(".user-query-card").forEach(s=>{s.addEventListener("click",()=>ue(s.dataset.qid))}))})}),ee(),document.querySelectorAll(".user-query-card").forEach(i=>{i.addEventListener("click",()=>ue(i.dataset.qid))});const e=document.getElementById("profile-content");e&&e.addEventListener("click",i=>{const t=i.target.closest('[data-action="view-return-chat"]');if(t){i.preventDefault(),i.stopPropagation(),ne(t.dataset.retid);return}const r=i.target.closest('[data-action="write-review"]');if(r){i.preventDefault(),i.stopPropagation(),Ce(r.dataset.pid,r.dataset.oid,r.dataset.pname);return}const o=i.target.closest('[data-action="request-return"]');if(o){i.preventDefault(),i.stopPropagation(),Se(o.dataset.oid,o.dataset.pid,o.dataset.pname,parseFloat(o.dataset.price||0));return}const s=i.target.closest(".order-prod-link");if(s){i.preventDefault();const d=s.dataset.pid;d&&T("product",d);return}})}}function ee(){const a=document.getElementById("toggle-query-form-btn"),e=document.getElementById("cancel-query-form-btn"),i=document.getElementById("inline-query-form-card");a&&i&&a.addEventListener("click",()=>{var b;i.style.display=i.style.display==="none"?"block":"none",i.style.display==="block"&&((b=document.getElementById("iq-subject"))==null||b.focus())}),e&&i&&e.addEventListener("click",()=>{i.style.display="none"});const t=document.getElementById("inline-user-query-form");t&&t.addEventListener("submit",b=>{var C,M,L,D;b.preventDefault();const x=(C=document.getElementById("iq-subject"))==null?void 0:C.value.trim(),z=(M=document.getElementById("iq-message"))==null?void 0:M.value.trim();if(!x||!z){f("Please enter both subject and message.");return}n.addCustomerQuery(((L=n.user)==null?void 0:L.name)||"Customer",((D=n.user)==null?void 0:D.email)||"user@example.com",x,z),f("Support query created! Our team will respond shortly. 💬");const A=document.getElementById("profile-content");A&&(A.innerHTML=re(),ee())});const r=document.getElementById("update-address-form");r&&r.addEventListener("submit",b=>{var M,L,D,Y;b.preventDefault();const x=(M=document.getElementById("prof-addr"))==null?void 0:M.value.trim(),z=(L=document.getElementById("prof-city"))==null?void 0:L.value.trim(),A=(D=document.getElementById("prof-pincode"))==null?void 0:D.value.trim(),C=((Y=document.getElementById("prof-country"))==null?void 0:Y.value.trim())||"India";if(!x||!z||!A){f("Please fill all mandatory address fields.");return}n.updateUserAddress(x,z,A,C),f("Delivery address updated successfully! 🏡"),R("profile")});const o=document.getElementById("update-name-form");o&&o.addEventListener("submit",b=>{var z;b.preventDefault();const x=(z=document.getElementById("prof-name"))==null?void 0:z.value.trim();if(!x){f("Name cannot be empty.");return}n.user&&(n.user.name=x,n._persist()),f("Name updated successfully! ✅"),R("profile")});const s=document.getElementById("send-phone-otp-btn");let d=null;s&&s.addEventListener("click",()=>{var x;const b=(x=document.getElementById("prof-new-phone"))==null?void 0:x.value.trim();if(!b||b.length<8){f("Please enter a valid mobile number.");return}d=String(Math.floor(1e5+Math.random()*9e5)),f(`OTP sent to mobile! (Demo OTP: ${d}) 📱`),document.getElementById("phone-otp-field").style.display="block",document.getElementById("verify-phone-btn").style.display="inline-flex",s.textContent="Resend OTP"});const c=document.getElementById("update-phone-form");c&&c.addEventListener("submit",b=>{var A,C;b.preventDefault();const x=(A=document.getElementById("prof-phone-otp"))==null?void 0:A.value.trim(),z=(C=document.getElementById("prof-new-phone"))==null?void 0:C.value.trim();if(!d){f("Please send OTP to mobile first.");return}if(x!==d){f("Invalid OTP. Please try again.");return}n.updateUserPhone(z),f("Mobile number updated successfully! ✅"),d=null,R("profile")});const l=document.getElementById("send-email-otp-btn");let p=null;l&&l.addEventListener("click",()=>{var x;const b=(x=document.getElementById("prof-new-email"))==null?void 0:x.value.trim();if(!b||!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(b)){f("Please enter a valid new email address.");return}p=String(Math.floor(1e5+Math.random()*9e5)),f(`OTP sent! (Demo OTP: ${p}) 📧`),document.getElementById("email-otp-field").style.display="block",document.getElementById("verify-email-btn").style.display="inline-flex",l.textContent="Resend OTP"});const m=document.getElementById("update-email-form");m&&m.addEventListener("submit",b=>{var A,C;b.preventDefault();const x=(A=document.getElementById("prof-email-otp"))==null?void 0:A.value.trim(),z=(C=document.getElementById("prof-new-email"))==null?void 0:C.value.trim();if(!p){f("Please send OTP first.");return}if(x!==p){f("Invalid OTP. Please try again.");return}n.user&&(n.user.email=z,n._persist()),f("Email updated successfully! ✅"),p=null,R("profile")});const u=document.getElementById("send-pwd-otp-btn"),v=document.getElementById("resend-pwd-otp-btn"),k=document.getElementById("cancel-pwd-otp-btn"),$=document.getElementById("cancel-pwd-otp-btn-2");let E=null;const y=()=>{E=String(Math.floor(1e5+Math.random()*9e5)),f(`OTP sent to your email! (Demo OTP: ${E}) 📧`);const b=document.getElementById("pwd-otp-request-group"),x=document.getElementById("pwd-otp-fields");b&&(b.style.display="none"),x&&(x.style.display="flex")},h=()=>{const b=document.getElementById("pwd-otp-request-group"),x=document.getElementById("pwd-otp-fields");b&&(b.style.display="block"),x&&(x.style.display="none");const z=document.getElementById("pwd-otp-input"),A=document.getElementById("prof-new-pwd"),C=document.getElementById("prof-confirm-pwd");z&&(z.value=""),A&&(A.value=""),C&&(C.value=""),E=null};u&&u.addEventListener("click",y),v&&v.addEventListener("click",y),k&&k.addEventListener("click",h),$&&$.addEventListener("click",h);const P=document.getElementById("change-password-form");P&&P.addEventListener("submit",b=>{var C,M,L;b.preventDefault();const x=(C=document.getElementById("pwd-otp-input"))==null?void 0:C.value.trim(),z=(M=document.getElementById("prof-new-pwd"))==null?void 0:M.value,A=(L=document.getElementById("prof-confirm-pwd"))==null?void 0:L.value;if(!E){f("Please send OTP first.");return}if(x!==E){f("Invalid OTP. Please try again.");return}if(!z||z.length<8){f("Password must be at least 8 characters.");return}if(!/[A-Z]/.test(z)){f("Password must contain at least 1 uppercase letter.");return}if(!/[0-9]/.test(z)){f("Password must contain at least 1 number.");return}if(z!==A){f("Passwords do not match.");return}n.user&&(n.user.password=z,n._persist()),f("Password updated successfully! ✅"),E=null,R("profile")})}function gt(){const a=document.querySelectorAll("[data-count]"),e=new IntersectionObserver(i=>{i.forEach(t=>{if(!t.isIntersecting)return;const r=t.target,o=parseFloat(r.dataset.count),s=String(o).includes("."),d=1800,c=performance.now(),l=p=>{const m=Math.min((p-c)/d,1),u=1-Math.pow(1-m,3),v=o*u;r.textContent=s?v.toFixed(1):Math.floor(v)+(o>=100?"k+":o===100?"%":""),m<1&&requestAnimationFrame(l)};requestAnimationFrame(l),e.unobserve(r)})},{threshold:.5});a.forEach(i=>e.observe(i))}function ft(){const a=[".animate-on-scroll","section:not(.hero-section)",".products-grid",".product-card",".product-detail-hero",".product-bottom-grid",".home-science-card",".science-banner",".science-research-card",".science-cert-card",".science-prohibited-card",".science-page-grid > div",".about-pillar-card",".about-timeline-card",".about-stat-card",".sustainability-row",".contact-grid > div",".profile-sidebar","#profile-content",".profile-order-card",".profile-query-card",".metrics-row",".shop-page-wrapper .container > div"],e=Array.from(document.querySelectorAll(a.join(",")));if(!e.length)return;const i=new IntersectionObserver(r=>{r.forEach(o=>{o.isIntersecting&&(o.target.classList.add("visible"),i.unobserve(o.target))})},{threshold:.3,rootMargin:"0px 0px -30px 0px"}),t=window.innerHeight||document.documentElement.clientHeight;e.forEach(r=>{const o=r.getBoundingClientRect();o.top<t*.85&&o.bottom>0?r.classList.add("visible"):(r.classList.add("animate-on-scroll"),i.observe(r))})}function vt(){const a=n.currentRoute||"home";if(a==="admin")return'<nav class="reactbits-floating-dock" id="mobile-bottom-dock" style="display:none"></nav>';const e=n.getCartCount();return`
  <nav class="reactbits-floating-dock" id="mobile-bottom-dock">
    <div class="dock-item ${a==="home"?"active":""}" data-route="home">
      ${g("home",16)}
      <span>Home</span>
    </div>
    <div class="dock-item ${a==="shop"||a==="product"?"active":""}" data-route="shop">
      ${g("box",16)}
      <span>Shop</span>
    </div>
    <div class="dock-item" id="dock-cart-btn">
      <div class="dock-icon-wrapper" style="position:relative;display:inline-flex;align-items:center;justify-content:center">
        ${g("cart",16)}
        ${e>0?`<span class="dock-badge">${e}</span>`:""}
      </div>
      <span>Cart</span>
    </div>
    <div class="dock-item ${a==="profile"?"active":""}" data-route="profile">
      ${g("user",16)}
      <span>Profile</span>
    </div>
  </nav>`}function H(){const a=document.getElementById("mobile-bottom-dock");if(!a)return;const e=n.currentRoute||"home";if(e==="admin"){a.style.display="none";return}a.style.display="flex",a.querySelectorAll(".dock-item").forEach(r=>{const o=r.dataset.route;o&&(o===e||o==="shop"&&e==="product"||o==="profile"&&e==="profile")?r.classList.add("active"):r.classList.remove("active")});const i=n.getCartCount(),t=a.querySelector("#dock-cart-btn .dock-icon-wrapper");if(t){let r=t.querySelector(".dock-badge");i>0?(r||(r=document.createElement("span"),r.className="dock-badge",t.appendChild(r)),r.textContent=i):r&&r.remove()}}function yt(){const a=document.getElementById("mobile-bottom-dock");if(!a)return;const e=i=>{if(!i)return;if(i.id==="dock-cart-btn"||i.dataset.route==="cart"){G();return}const t=i.dataset.route;t&&N.includes(t)&&(U(),T(t))};a.addEventListener("click",i=>{const t=i.target.closest(".dock-item");t&&(i.preventDefault(),i.stopPropagation(),e(t))}),a.addEventListener("touchend",i=>{const t=i.target.closest(".dock-item");t&&(i.preventDefault(),i.stopPropagation(),e(t))},{passive:!1})}document.addEventListener("DOMContentLoaded",()=>{const a=document.getElementById("app-root");a.innerHTML=`
    ${be()}
    <main id="app-main-content" style="flex-grow:1"></main>
    <div id="footer-box">${he()}</div>
    ${vt()}
    <div id="cart-box">${le()}</div>
    <div id="modal-box"></div>
  `,xe(),ce(),yt(),document.addEventListener("pointermove",t=>{document.querySelectorAll(".reactbits-spotlight-card").forEach(r=>{const o=r.getBoundingClientRect(),s=t.clientX-o.left,d=t.clientY-o.top;r.style.setProperty("--mouse-x",`${s}px`),r.style.setProperty("--mouse-y",`${d}px`)})},{passive:!0}),document.addEventListener("touchstart",t=>{const r=t.target.closest(".reactbits-spotlight-card");if(r){const o=r.getBoundingClientRect(),s=t.touches[0];r.style.setProperty("--mouse-x",`${s.clientX-o.left}px`),r.style.setProperty("--mouse-y",`${s.clientY-o.top}px`),r.classList.add("touch-active")}},{passive:!0}),document.addEventListener("touchend",t=>{document.querySelectorAll(".reactbits-spotlight-card.touch-active").forEach(r=>r.classList.remove("touch-active"))},{passive:!0}),document.addEventListener("click",t=>{if(t.target.id==="footer-privacy-link"||t.target.closest("#footer-privacy-link")||t.target.id==="footer-privacy-link-mob"||t.target.closest("#footer-privacy-link-mob")){t.preventDefault(),ye("privacy");return}if(t.target.id==="footer-terms-link"||t.target.closest("#footer-terms-link")||t.target.id==="footer-terms-link-mob"||t.target.closest("#footer-terms-link-mob")){t.preventDefault(),ye("terms");return}}),document.addEventListener("click",t=>{var $,E;if(t.target.closest('#nav-cart-btn, #drawer-cart-link, #dock-cart-btn, [data-action="open-cart"]')){t.preventDefault(),t.stopPropagation(),G();const y=document.getElementById("mobile-drawer");y&&y.classList.remove("open");return}const o=t.target.closest("[data-route]");if(o){t.preventDefault();const y=o.dataset.route;if(y==="cart"){G();const h=document.getElementById("mobile-drawer");h&&h.classList.remove("open");return}if(y==="login"){Q("login");return}if(y&&N.includes(y)){U(),T(y);const h=document.getElementById("mobile-drawer");h&&h.classList.remove("open")}return}if(t.target.closest('#profile-logout-btn, [data-action="logout"]')){t.preventDefault(),n.logout(),f("Signed out successfully. 👋"),T("home");return}if(t.target.closest('[data-action="open-login"]')){t.preventDefault(),Q("login");return}const c=t.target.closest("[data-profile-tab]");if(c){t.preventDefault(),S=c.dataset.profileTab;const y=document.getElementById("profile-content"),h=n.user;y&&h&&(S==="orders"?y.innerHTML=_():S==="queries"?y.innerHTML=re():y.innerHTML=de(h),document.querySelectorAll("[data-profile-tab]").forEach(P=>{P.classList.toggle("active",P.dataset.profileTab===S)}),ee());return}const l=t.target.closest('[data-action="open-query-chat"]');if(l){t.preventDefault(),Ee(l.dataset.qid);return}const p=t.target.closest('[data-action="view-return-chat"]');if(p){t.preventDefault(),ne(p.dataset.retid);return}const m=t.target.closest('[data-action="request-return"]');if(m){t.preventDefault(),Se(m.dataset.oid,m.dataset.pid,m.dataset.pname,parseFloat(m.dataset.price||0));return}const u=t.target.closest('[data-action="write-review"]');if(u){t.preventDefault(),Ce(u.dataset.pid,u.dataset.oid,u.dataset.pname);return}const v=t.target.closest('[data-action="cancel-order"]');if(v){t.preventDefault();const y=v.dataset.oid,h=(n.orders||[]).find(P=>P.id===y);if(h&&h.status==="Processing"){h.status="Cancelled";const P=h.customerName||(($=n.user)==null?void 0:$.name)||"Customer",b=h.email||((E=n.user)==null?void 0:E.email)||"user@example.com",x=(h.items||[]).map(M=>`${M.name} (x${M.qty})`).join(", "),z=`Order Cancellation Request: #${y}`,A=`Customer ${P} has cancelled Order #${y} while it was in Processing status. Total Amount: ${w(h.total)}. Items: ${x}. Order status updated to Cancelled.`;n.addCustomerQuery(P,b,z,A),n._persist(),n._notify({orders:!0,queries:!0,admin:!0}),f(`Order #${y} has been cancelled successfully.`);const C=document.getElementById("profile-content");C&&(C.innerHTML=_(),ee())}else h&&h.status!=="Processing"&&f(`Order #${y} is already ${h.status.toLowerCase()} and cannot be cancelled.`);return}const k=t.target.closest("[data-adm-tab]");if(k){t.preventDefault(),I=k.dataset.admTab,document.querySelectorAll("[data-adm-tab]").forEach(h=>{h.classList.toggle("active",h.dataset.admTab===I)});const y=document.getElementById("admin-tab-content");y&&(y.innerHTML=W(I,n.getAnalytics()),V())}});let e=window.innerWidth>=900;window.addEventListener("resize",()=>{const t=window.innerWidth>=900;if(t!==e){e=t,R(n.currentRoute),X(),H();const r=document.getElementById("footer-box");r&&(r.innerHTML=he())}});const i=window.location.hash.replace("#","").trim();if(i.startsWith("product/")){const t=i.replace("product/","");n.currentRoute="product",K=t,R("product")}else{const t=N.includes(i)?i:"home";n.currentRoute=t,R(t)}window.addEventListener("popstate",()=>{const t=window.location.hash.replace("#","").trim();if(t.startsWith("product/"))K=t.replace("product/",""),n.currentRoute="product",R("product");else{const r=N.includes(t)?t:"home";n.currentRoute=r,R(r)}X(),H()}),n.subscribe((t,r)=>{if(r.cart){let o=document.getElementById("cart-box");o||(o=document.createElement("div"),o.id="cart-box",document.body.appendChild(o)),o.innerHTML=le(),ce();const s=document.getElementById("cart-overlay");s&&(t.isCartOpen?s.classList.add("open"):s.classList.remove("open"));const d=document.getElementById("main-navbar");if(d){const c=d.querySelector("#nav-cart-btn"),l=t.getCartCount();if(c){let p=c.querySelector(".cart-badge-count");l>0?(p||(p=document.createElement("span"),p.className="cart-badge-count",c.appendChild(p)),p.textContent=l):p&&p.remove()}}H()}if(r.auth)if(t.isAuthOpen)Q("login");else{const o=document.getElementById("modal-box");o&&(o.innerHTML="")}r.checkout&&t.isCheckoutOpen&&we(),r.quickview&&t.quickViewProduct&&openQuickView(t.quickViewProduct),(r.route||r.products||r.admin||r.orders||r.queries)&&(R(t.currentRoute),X(),H()),r.navbar&&(X(),H())})});
