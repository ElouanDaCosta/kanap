var myRequest = new Request("http://localhost:3000/api/products");
let ul = document.createElement("ul");

listOfProducts = '<li>${value[index].name}</li>'

document.getElementById("items").appendChild(ul);
ul.classList.add("items__list");

fetch(myRequest)
    .then(function(response) {
        if(response.ok) {
            return response.json();
        }
        else {
            console.log('Mauvaise réponse du serveur !');
        }
    })
.then(function(value) {
    console.log(value);
    for (let index = 0; index < value.length; index++) {
            const element = value[index];
            let li = document.createElement("li");
            ul.appendChild(li);
            li.classList.add("items__item");
            li.innerHTML = value[index].name;
            console.log(element);
            console.log(index);
    }
})
.catch(function(error) {
    // Une erreur est survenue
});

