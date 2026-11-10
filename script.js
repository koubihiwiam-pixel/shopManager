async function getData() {
    const response = await fetch("http://localhost:3000/api/products");
    console.log(response.status);
    return await response.json();
}


async function afficherProduct(){
    const data = await getData();
    console.log(data)
    const catalog = document.getElementById('catalog');
    catalog.innerHTML = "";
    data.forEach(function(element){
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
afficherProduct()