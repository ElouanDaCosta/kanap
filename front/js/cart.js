async function FetchProduct(Cart) {
    for (let j = 0; j < Cart.length; j++) {
        await fetch(`http://localhost:3000/api/products/${Object.values(Cart)[j].id}`)
            .then(response => response.json())
            .then(product => {
                
                document
                    .querySelector('#cart__items')
                    .innerHTML += `
            <article class="cart__item" data-id="${Object.values(Cart)[j].id}" data-color="${Object.values(Cart)[j].color}">
            <div class="cart__item__img">
                <img src="${product.imageUrl}" alt="${product.name}">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${Object.values(Cart)[j].color}</p>
                    <p>${product.price}</p>
                </div>
                <div class="cart__item__content__setting">
                    <div class="cart__item__content__setting__quantity">
                        <p>Qté : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${Object.values(Cart)[j].quantity}"
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

function ChangeQuantity() {
    let itemQuantities = document.querySelectorAll('.itemQuantity')
    itemQuantities.forEach((itemQuantity) => {
        itemQuantity.addEventListener('change', function (e) {
            e.preventDefault();
            const retrievedCart = localStorage.getItem('cart');
            let cart = JSON.parse(retrievedCart) || [];
            const quantity = itemQuantity.closest('.cart__item');
            const id = quantity.dataset.id;
            const color = quantity.dataset.color;
            const product = cart.find(item => item.id === id && item.color === color);
            product.quantity = e.target.value;
            localStorage.setItem('cart', JSON.stringify(cart));
            TotalPrice()
        })
    })
}

function DeleteButton() {
    let supprButtons = document.querySelectorAll('.deleteItem')
    supprButtons.forEach((supprButton) => {
        supprButton.addEventListener('click', function (e) {
            e.preventDefault();
            const retrievedCart = localStorage.getItem('cart');
            let cart = JSON.parse(retrievedCart) || [];
            const suppr = supprButton.closest('.cart__item');
            const id = suppr.dataset.id;
            const color = suppr.dataset.color;
            cart = cart.filter(item => !(item.id === id && item.color === color));
            localStorage.setItem('cart', JSON.stringify(cart));
            suppr.remove();
            TotalPrice();
        })
    })
}

function DeleteButtonMessage() {
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

function TotalPrice() {
    let cart = localStorage.getItem('cart');
    let Cart = JSON.parse(cart);
    let totalPrice = 0;
    let totalQuantity = 0;
    for (let i = 0; i < Cart.length; i++) {
        fetch(`http://localhost:3000/api/products/${Object.values(Cart)[i].id}`)
            .then(response => response.json())
            .then(product => {
                totalPrice += product.price * Object.values(Cart)[i].quantity;
                totalQuantity += +Object.values(Cart)[i].quantity;
                document.querySelector('#totalPrice').innerText = totalPrice;
                document.querySelector('#totalQuantity').innerText = totalQuantity;
            })
    }
}

function PostCart(e) {
    e.preventDefault()
    if(!ValidateForm()){
        alert('Veuillez entrer des informations valides');
        return
    }
    let productsId = GetProductsId();
    let order = {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            contact: {
                firstName: document.querySelector('#firstName').value,
                lastName: document.querySelector('#lastName').value,
                address: document.querySelector('#address').value,
                city: document.querySelector('#city').value,
                email: document.querySelector('#email').value,
            },
            products: productsId,
        })
    }
    fetch('http://localhost:3000/api/products/order', order)
        .then(response => response.json())
        .then(function (data) {
            localStorage.setItem('cart', '[]');
            window.location.href = 'confirmation.html?OrderId=' + data.orderId;
        });
}

function ValidateForm() {
    let firstName = document.querySelector('#firstName').value;
    let lastName = document.querySelector('#lastName').value;
    let address = document.querySelector('#address').value;
    let city = document.querySelector('#city').value;
    let email = document.querySelector('#email').value;
    let nameRegex = /^[a-zA-Z ]{2,30}$/;
    let adressRegex = /^[a-zA-Z0-9\s,.'-]{3,}$/;
    let emailRegex = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/;
    return (nameRegex.test(firstName) && nameRegex.test(lastName) && adressRegex.test(address) && nameRegex.test(city) && emailRegex.test(email));
}

function GetProductsId() {
    let productsId = [];
    let cart = localStorage.getItem('cart');
    let Cart = JSON.parse(cart);
    for (let i = 0; i < Cart.length; i++) {
        productsId.push(Cart[i].id);
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
    let postCart = document.querySelector('#order');
    postCart.addEventListener('click', PostCart);
}

init();