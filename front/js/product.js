function fetchProduct(id){
    return fetch(`http://localhost:3000/api/products/${id}`)
        .then(res => res.json())
}

//pas stocker le produit en entier dans le localStorage

function displayProduct(product){
    const value = product;
    document.querySelector("#title").innerText = value.name;
    document.getElementById("description").innerText = value.description;
    document.getElementById("price").innerText = value.price;
    let img = document.createElement("img");
    document.querySelector(".item__img").appendChild(img);
    img.src = value.imageUrl;
    img.alt = value.altTxt;
    for (let index = 0; index < value.colors.length; index++) {
        document.getElementById("colors").innerHTML +=
            `<option value="${value.colors[index]}">${value.colors[index]}</option>`;
    }
}

function addToCart(product){
    let quantity = document.querySelector("#quantity").value;
    let color = document.querySelector("#colors").value;
    let id = product._id;
    let item = {id, quantity, color};
    let items = JSON.parse(localStorage.getItem("cart")) || [];
    let sameItem = items.find(item => item.id === id && item.color === color);
    
    if (quantity < 1 && color < 1) {
        alert("Veuillez selectionner une couleur et une quantité !");
        return
    }
    items.push(item);
    if (sameItem) {
        item.quantity = +sameItem.quantity + +item.quantity;
        items.splice(items.indexOf(sameItem), 1);
    }
    localStorage.setItem('cart', JSON.stringify(items)) // On stock une chaine
}

function addToCartMessage () {     
        let confirmationMessage = document.createElement("div");
        confirmationMessage.style.minWidth = "300px";
        confirmationMessage.style.minHeight = "40px";
        confirmationMessage.style.backgroundColor = "white";
        confirmationMessage.style.marginTop = "110px";
        confirmationMessage.style.paddingTop = "16px";
        confirmationMessage.style.textAlign = "center";
        confirmationMessage.style.color = "black";
        confirmationMessage.style.fontSize = "20px";
        confirmationMessage.style.position = "absolute";
        confirmationMessage.style.borderRadius = "40px";
        confirmationMessage.textContent = "Article ajouté au panier !";
        document.querySelector(".item__content__addButton").appendChild(confirmationMessage);
        setTimeout(function () {
            confirmationMessage.remove();
        }, 3000);   
}

function initEvents(product){
    const buttonCart = document.querySelector("#addToCart");
    buttonCart.addEventListener("click", () => addToCart(product));
    buttonCart.addEventListener("click", () => addToCartMessage());
}

async function init(){
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const product = await fetchProduct(id)
    displayProduct(product)
    initEvents(product)
}

init();