function fetchProducts() {
    return fetch("http://localhost:3000/api/products")
        .then((response) => response.json())
}

function displayProducts(products){
    const value = products
    for (let index = 0; index < value.length; index++) {
        const element = value[index];
        let a = document.createElement("a");
        a.href = "product.html?id=" + element._id;
        document.querySelector("#items").appendChild(a);
        let article = document.createElement("article");
        a.appendChild(article);
        article.innerHTML = `
            <img src="${element.imageUrl}" alt="${element.altTxt}"/>
            <h3>${element.name}</h3>
            <p>${element.description}</p>`;
    }
}

async function init(){
    const products = await fetchProducts()
    displayProducts(products)
}

init()