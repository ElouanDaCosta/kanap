async function FetchProduct (Cart) {
    for (let j = 0; j < Cart.length; j++) {
        await fetch(`http://localhost:3000/api/products/${Cart[j].product._id}`)
        .then(response => response.json())
        .then(product => {
            document
            .querySelector('#cart__items')
            .innerHTML += `
            <article class="cart__item" data-id="${product._id}" data-color="${Object.values(Cart)[j].itemColor}">
            <div class="cart__item__img">
                <img src="${product.imageUrl}" alt="${product.name}">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${Object.values(Cart)[j].itemColor}</p>
                    <p>${product.price}</p>
                </div>
                <div class="cart__item__content__setting">
                    <div class="cart__item__content__setting__quantity">
                        <p>Qté : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${Object.values(Cart)[j].itemNumber}"
                    </div>
                    <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
            </div>
            </article>`;
        })
}
}

function ChangeQuantity () {
    let itemQuantities = document.querySelectorAll('.itemQuantity')
    itemQuantities.forEach((itemQuantity) => {
        itemQuantity.addEventListener('change', function (e) {
            e.preventDefault();
            const retrievedCart = localStorage.getItem('cart');
            let cart = JSON.parse(retrievedCart) || [];
            const quantity = itemQuantity.closest('.cart__item');
            let id = quantity.dataset.id;
            id = cart.find(item => item.product._id === id);
            productQuantity = id.itemNumber;
            productQuantity = e.target.value;
            id.itemNumber = productQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            location.reload();
        })
    })
}

function DeleteButton () {
    let supprButtons = document.querySelectorAll('.deleteItem')
    supprButtons.forEach((supprButton) => {
        supprButton.addEventListener('click', function (e) {
            e.preventDefault();
            const retrievedCart = localStorage.getItem('cart');
            let cart = JSON.parse(retrievedCart) || [];
            const suppr = supprButton.closest('.cart__item');
            let id = suppr.dataset.id;
            id = cart.find(item => item.product._id === id);
            cart.splice(cart.indexOf(id), 1);
            console.log(id);
            localStorage.setItem('cart', JSON.stringify(cart));
            location.reload();
    })
})
}

function DeleteButtonMessage () {
    let supprButtons = document.querySelectorAll('.deleteItem')
    supprButtons.forEach((supprButton) => {
        supprButton.addEventListener('click', function (e) {
            e.preventDefault();
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
            confirmationMessage.style.left = "40%";
            confirmationMessage.textContent = "Article supprimé au panier !";
            document.querySelector('#cart__items').appendChild(confirmationMessage);
            setTimeout(function () {
                confirmationMessage.remove();
            }, 3000);  
    })
})
}

function TotalPrice () {
    let cart = localStorage.getItem('cart');
    let Cart = JSON.parse(cart);
    let totalPrice = 0;
    let totalQuantity = 0;
    for (let i = 0; i < Cart.length; i++) {
        totalPrice += Cart[i].product.price * Cart[i].itemNumber;
        totalQuantity += +Cart[i].itemNumber;
    }
    let totalPriceSpan = document.querySelector('#totalPrice').innerText = totalPrice;
    let totalQuantitySpan = document.querySelector('#totalQuantity').innerText = totalQuantity;
}

let postCart = document.querySelector('#order');
postCart.addEventListener('click', PostCart);

function PostCart () {
    let productsId = GetProductsId();
    let order = {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            contact: {
                firstName: "document.querySelector('#firstName').value",
                lastName: "document.querySelector('#lastName').value",
                address: "document.querySelector('#address').value",
                city: "document.querySelector('#city').value",
                email: "document.querySelector('#email').value",
            },
            products: productsId,
        })
    }
    fetch ('http://localhost:3000/api/products/order', order)
    .then(response => response.json())
    .then(function (data) {
        ValidateForm(data);
    });
}

function ValidateForm(data) {
    let form = document.querySelector('.cart__order__form');
        form.addEventListener('submit', function (e) {
        e.preventDefault();
        let firstName = document.querySelector('#firstName').value;
        let lastName = document.querySelector('#lastName').value;
        let address = document.querySelector('#address').value;
        let city = document.querySelector('#city').value;
        let email = document.querySelector('#email').value;
        let nameRegex = /^[a-zA-Z ]{2,30}$/;
        let adressRegex = /^[a-zA-Z0-9\s,.'-]{3,}$/;
        if (nameRegex.test(firstName) && nameRegex.test(lastName) && adressRegex.test(address) && nameRegex.test(city)) {
            window.location.href = 'confirmation.html?OrderId=' + data.orderId;
            return true;
        }
        else {
            alert('Veuillez entrer un nom valide');
            return false;
        }
    })
}

function GetProductsId () {
    let productsId = [];
    let cart = localStorage.getItem('cart');
    let Cart = JSON.parse(cart);
    for (let i = 0; i < Cart.length; i++) {
        productsId.push(Cart[i].product._id);
    }
    return productsId;
}

async function init() {
    let cart = localStorage.getItem('cart');
    let Cart = JSON.parse(cart);
    let fetch = await FetchProduct(Cart);
    ChangeQuantity();
    DeleteButton();
    DeleteButtonMessage();
    TotalPrice();
    PostCart();
}

init();