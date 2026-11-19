const API_BASE = "http://localhost:3000/api"
let panier = JSON.parse(localStorage.getItem('panier')) || [];

const price = document.getElementById('price');
const catalog = document.getElementById('catalog');
const category = document.getElementById('category');
const search = document.getElementById('recherche');
const inStock = document.getElementById('in-stock');

async function getData() {
    try {
        const response = await fetch(API_BASE + "/products");
        return await response.json();
    } catch (error) {
        console.error("Une erreur est :", error);
    }
}


function afficherProduct(data) {

    if (!data) {
        catalog.textContent = 'Aucun produit trouvé !';
        return;
    }
    catalog.innerHTML = "";
    data.forEach(function (element) {
        catalog.innerHTML += `<article class="w-[30%] max-[500px]:w-[90%] bg-gray-100 p-4 rounded-[5%] gap">
            <div>
                <img src="http://localhost:3000${element.image}" class="rounded-[5%] mb-5">
                <h2 class="font-bold mb-1">${element.name}</h2>
                <p class="text-xs mb-4">${element.description}</p>
                <h3 class="text-xl font-bold mb-2">$${element.price}</h3>
                <div class="flex justify-between">
                <span class="bg-green-200 text-green-700 pl-2 pr-2 rounded-lg h-[30px]">In stock : ${element.stock}</span>
                <input type="number" min=1 max=${element.stock} value="1" class="border-gray rounded w-[50px] bg-gray-200 pl-4" data-id=${element.id}>
                </div>
                <button class="panier bg-black text-white p-2 rounded-lg cursor-pointer mt-2.5 w-full" data-id=${element.id}><i class="fa-solid fa-cart-shopping"></i> Add to cart</button>
            </div>
        </article>`
    });

    addProductToCart(data)
}

async function display() {
    const data = await getData();
    afficherProduct(data);
}


async function searchProduct(serchValue) {

    const response = await fetch(API_BASE + `/products?search=${serchValue}`);
    // console.log(response.status);
    const product = await response.json();
    if (product.length > 0) {
        afficherProduct(product);
    } else {
        catalog.textContent = `aucun produit trouvé`
    }

}

async function getCategory() {
    const response = await fetch(API_BASE + "/categories");
    // console.log(response.status);
    let res = await response.json();
    category.innerHTML = `<option value="">All categories</option>`;
    let option;
    res.forEach(function (item) {
        option = document.createElement('option');
        // console.log(item.name)
        option.textContent = item.name;
        option.value = item.id;
        category.appendChild(option);
        // console.log(option.value)


    })
    category.addEventListener('change', async function () {
        let select = this.value;
        if (select == '') {
            display();
        } else {
            const reponse = await fetch(API_BASE + `/products?categoryId=${select}`)
            const productByCategory = await reponse.json();
            afficherProduct(productByCategory);
        }

    })
}


async function filterByPrice(priceValue) {
    try {
        if (priceValue === "") {
            display();
            return;
        }
        const res = await fetch(API_BASE + `/products?maxPrice=${priceValue}`)
        const productByPrice = await res.json();
        if (productByPrice.length != 0) {
            afficherProduct(productByPrice);
        }
        else {
            catalog.textContent = "Aucun product touvé !"
        }
    } catch (err) {
        console.log(err.message);
    }
}


async function filterByStock() {
    try {
        const response = await fetch(API_BASE + '/products?inStock=true');
        const productInStock = await response.json();
        if (productInStock.length === 0) {
            catalog.textContent = "Aucun product in stock !"
            return;
        }

        if (inStock.checked) {
            afficherProduct(productInStock);
        } else {
            display();
            return;
        }
    } catch (err) {
        console.log(err.message);

    }
}
async function filterByAll() {
    try {
        const categories = category.value;
        const prix = price.value;
        const stock = inStock.checked;

        let url = `${API_BASE}/products?`;

        if (categories !== "") {
            url += `categoryId=${categories}&`;
        }

        if (prix !== "") {
            url += `maxPrice=${prix}&`;
        }

        if (stock) {
            url += `inStock=true`;
        }

        const response = await fetch(url);
        const products = await response.json();


        if (products.length === 0) {
            if (stock) {
                catalog.textContent = "Aucun produit en stock !";
            }
            else if (categories !== "") {
                catalog.textContent = "Aucun produit dans cette catégorie !";
            }
            else if (prix !== "") {
                catalog.textContent = "Aucun produit trouvé pour ce prix !";
            }
            return;
        }

        afficherProduct(products);

    } catch (err) {
        console.log(err.message);
    }
}
const cart = document.getElementById('cartShopping');
const background = document.getElementById('background')
function hide() {
    cart.classList.remove('hidden');
    background.classList.remove('hidden');
}
function closePanier() {
    cart.classList.add('hidden');
    background.classList.add('hidden')
}


function changeQty(button, value) {
    const article = button.closest("article");
    const quantite = article.querySelector(".quantite");
    let qty = Number(quantite.textContent);
    const id = article.dataset.id;
    let productExist = panier.find(item => item.id == id);
    
    qty = qty + value;

    if (qty < 1) {
        qty = 1;
    }
    if (qty > productExist.stock) {
        qty = productExist.stock;
    }
    productExist.quantite = qty;
    quantite.textContent = qty;
    localStorage.setItem("panier", JSON.stringify(panier));
    afficherProductInCart();
}


function addProductToCart(data) {

    let cartShop = catalog.querySelectorAll('.panier');
    cartShop.forEach((btn) => {
        btn.addEventListener('click', function (e) {
            let idCarte = e.currentTarget.dataset.id;
            let product = data.find(element => element.id == idCarte);
            let input = catalog.querySelector(`input[data-id="${idCarte}"]`);
            let quantite = Number(input.value);
            let quantiteTotal = quantite;
            let productExist = panier.find(element => element.id == product.id);
            if (productExist) {
                quantiteTotal += productExist.quantite;
            }
            if (quantite < 1 || quantiteTotal > product.stock) {
                Swal.fire({
                    title: 'Insufficient Stock!',
                    text: `Only ${product.stock} products are available in stock.`,
                    icon: 'error',
                    confirmButtonText: 'Ok'
                })
                return;

            }
            console.log(product);
            
            if (productExist) {
                productExist.quantite += quantite;
            } else {
                let objCart = {
                    id: product.id,
                    titre: product.name,
                    prix: product.price,
                    quantite: quantite,
                    stock: product.stock,
                    description: product.description,
                    image: product.image
                };
                panier.push(objCart)
            }
            localStorage.setItem('panier', JSON.stringify(panier));
            afficherProductInCart();
            Swal.fire({
                title: "Added successfully!",
                icon: "success",
                draggable: true
            });
        })
    })
}
const displayCart = document.getElementById('display-cart');
function afficherProductInCart() {
    let totalPrice = 0;
    
    total.innerHTML="";
    if (panier.length > 0) {
        displayCart.innerHTML = "";
        panier.forEach(function (item) {
            displayCart.innerHTML += `
        <article data-id="${item.id}" class="flex justify-between border m-4 rounded-lg mt-10">
            <img src="http://localhost:3000${item.image}" class="w-[100px] rounded-lg">
            <div>
                <h2 class="font-bold mb-4">${item.titre}</h2>
                <p>${item.description}</p>
            </div>
            <div>
                <h2 class="font-bold text-blue-500 mb-4">$${item.prix} </h2>
                <button onclick="changeQty(this,-1)" class="font-bold cursor-pointer mb-3 rounded pl-2.5  pr-2.5 pb-0.5 bg-gray-100">-</button>
                <span class="quantite bg-gray-300 pt-2 pb-2 pr-4 pl-4 rounded-full" >${item.quantite}</span>
                <button onclick="changeQty(this,1)" class="font-bold cursor-pointer mr-5 rounded pl-2  pr-2 pb-0.5 bg-gray-100">+</button>
                <button class="supprimer text-red-500 mr-3 cursor-pointer"><i class="fa-solid fa-trash-can" data-id="${item.id}"></i></button>
            </div>
        </article>`
            totalPrice += item.prix * item.quantite;
        })
    } else {
        displayCart.textContent = "Your cart is empty"
    }
    total.innerHTML += `<span class="font-bold ml-8">Total : </span> 
                        <span class="text-red-500 font-bold mr-8">$${totalPrice}</span>`;
                        supprimerCart()
}

function supprimerCart(){
    const supprimerCart = displayCart.querySelectorAll('.supprimer');
    supprimerCart.forEach((btn)=>{
        btn.addEventListener('click', function(e){
            let idCart = e.target.dataset.id;
            panier = panier.filter(function (carte) {
                    return carte.id != idCart;
                });
            localStorage.setItem("panier", JSON.stringify(panier));
            afficherProductInCart()
        })
    })
}

// price.addEventListener('input', function () {
//     filterByPrice(price.value)
// })

search.addEventListener('input', function () {
    searchProduct(search.value)
})

// inStock.addEventListener('input', function () {
//     filterByStock();

// })

price.addEventListener('input', filterByAll);
category.addEventListener('change', filterByAll);
inStock.addEventListener('change', filterByAll);


//on init hadu khass ikhdmu
getCategory();
display();
afficherProductInCart()
supprimerCart();