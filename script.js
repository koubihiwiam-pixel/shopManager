const API_BASE = "http://localhost:3000/api"

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
                <img src="http://localhost:3000${element.image}" class="rounded-[5%] ">
                <h2 class="font-bold">${element.name}</h2>
                <p class="text-xs">${element.description}</p>
                <h3 class="text-xl font-bold">${element.price} $</h3>
                <span class="bg-green-200 text-green-700 pl-2 pr-2 rounded-full">In stock ${element.stock}</span>
            </div>
        </article>`

    });

}
// async function searchProduct() {
//     const data = await getData();
//     const search = document.getElementById('recherche');
//     afficherProduct(data);
//     search.addEventListener('input', function () {

//         let searchInput = search.value.toLowerCase().trim();

//         let filtreProduct = data.filter(function(item) {
//             let nom = item.name.toLowerCase();
//             let description = item.description.toLowerCase();
//             return nom.includes(searchInput) || description.includes(searchInput);
//         });
//         afficherProduct(filtreProduct);
//     });
// };
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
        const reponse = await fetch(API_BASE + `/products?categoryId=${select}`)
        const productByCategory = await reponse.json();
        afficherProduct(productByCategory);
    })
}


async function filterByPrice(priceValue) {
    try {
        const res = await fetch(API_BASE + `/products?maxPrice=${priceValue}`)
        const productByPrice = await res.json();
        if (productByPrice != 0) {
            afficherProduct(productByPrice);
        } else {
            catalog.textContent = "Aucun product touvé !"
        }
    } catch (err) {
        console.log(err.message);
    }
}


async function filterByStock(){
    try{
        const response = await fetch(API_BASE +'/products?inStock=true');
    const productInStock = await response.json();
    if(productInStock.length === 0){
        catalog.textContent = "Aucun product in stock !"
        return;
    }
    
    if(inStock.checked){
        // console.log(productInStock)
        afficherProduct(productInStock);
    }else{
        return;
    }
    }catch(err){
        console.log(err.message);
        
    }
    
   
}




price.addEventListener('input', function () {
    filterByPrice(price.value)
})

search.addEventListener('input', function () {
    searchProduct(search.value)
})

inStock.addEventListener('input', function(){
    filterByStock();

})

//on init hadu khass ikhdmu
getCategory();
display();

