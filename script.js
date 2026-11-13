async function getData() {
    try {
        const response = await fetch("http://localhost:3000/api/products");
        //  console.log(response.status);
        return await response.json();
    } catch (error) {
        console.error("Une erreur est :", error);
    }
}


function afficherProduct(data) {
    const catalog = document.getElementById('catalog');
    if (data) {
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
    } else {
        catalog.textContent = 'Aucun produit trouvé !'
    }



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

const catalog = document.getElementById('catalog');
async function searchProduct() {
    
    const search = document.getElementById('recherche');
    search.addEventListener('input', async function () {
        const response = await fetch(`http://localhost:3000/api/products?search=${search.value}`);
        // console.log(response.status);
        const product = await response.json();
        if (product.length > 0) {
            afficherProduct(product);
        } else {
            catalog.textContent = `aucun produit trouvé`
        }
    })
}

async function getCategory() {
    const response = await fetch("http://localhost:3000/api/categories");
    const category = document.getElementById('category');
    // console.log(response.status);
    let res = await response.json();
    category.innerHTML = `<option value="">All categories</option>`;
    let option;
    res.forEach(function (item) {
        option = document.createElement('option');
        console.log(item.name)
        option.innerHTML = item.name;
        option.value = item.id;
        category.appendChild(option);
        console.log(option.value)


    })
    category.addEventListener('change', async function () {
        let select = this.value;
        const reponse = await fetch(`http://localhost:3000/api/products?categoryId=${select}`)
        const productByCategory = await reponse.json();
        afficherProduct(productByCategory);
    })
}


async function filterByPrice() {
    const price = document.getElementById('price');
    price.addEventListener('input', async function () {
        const res = await fetch(`http://localhost:3000/api/products?maxPrice=${price.value}`)
        const productByPrice = await res.json();
        if(productByPrice != 0){
            afficherProduct(productByPrice);
        }else{
            catalog.textContent = "Aucun product touvé !"
        }
    })
}


filterByPrice();
getCategory();
display();
searchProduct();

