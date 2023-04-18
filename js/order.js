async function uploadImage(image) {
  const clientId = 'd71a53405a310f0';
  const data = new FormData();
  data.append('image', image);

  const response = await fetch('https://api.imgur.com/3/image', {
    method: 'POST',
    headers: {
      Authorization: `Client-ID ${clientId}`
    },
    body: data
  });

  const result = await response.json();
  return result.data.link;
}

// Get DOM elements
const itemList = document.querySelector(".item-list");
const createNewItemButton = document.querySelector('.header__create-page-modal')
const searchInput = document.querySelector('.header__search-input')
const searchButton = document.querySelector('.header__search-btn')
const cancelButton = document.querySelector('.header__search-cancel-btn')
const countVolumeButton = document.querySelector('.manage-count-btn')
const createItem = document.getElementById('create-modal');
const createItemForm = document.getElementById('create-modal');


// DOM 
const itemPriceInput = document.getElementById("price-input")
const itemNameInput = document.getElementById("name-input")
const itemVolumeInput = document.getElementById("volume-input")
const itemMaterialInput = document.getElementById("material-input")
const itemColorInput = document.getElementById("color-input")
// DOM MODAL
const closeModalButton = document.querySelector('.modal__close-btn')

createNewItemButton.addEventListener('click', (event) => {
  event.preventDefault();
  createItem.style.display = 'block';
});

closeModalButton.addEventListener('click', () => {
  createItem.style.display = 'none';
});

document.addEventListener('mousedown', (event) => {
  if (event.target === createItem) {
    createItem.style.display = 'none';
  }
});


createItemForm.addEventListener('submit', addItem)


let items = []
loadItems();
renderItems();


async function addItem(event) {
  event.preventDefault();
  // Get item values from form inputs
  const itemPrice = parseFloat(itemPriceInput.value);
  const itemName = itemNameInput.value;
  const itemVolume = itemVolumeInput.value;
  const itemMaterial = itemMaterialInput.value;
  const itemColor = itemColorInput.value;

  // Validate item name and price
  if (!itemName || isNaN(itemPrice) || itemPrice <= 0) {
    alert("Please enter a valid name and price for the item.");
    return;
  }

  // Add image upload here
  const imageInput = document.getElementById("image-input");
  const image = imageInput.files[0];
  const imageUrl = await uploadImage(image);

  // Create new item object
  const newItem = { name: itemName, material: itemMaterial, volume: itemVolume, price: itemPrice, color: itemColor, imageUrl: imageUrl };

  // Add new item to items array
  items.push(newItem);

  // Save items to localStorage
  saveItems();



  // Clear form inputs
  itemNameInput.value = "";
  itemPriceInput.value = "";
  itemVolumeInput.value = ""
  itemMaterialInput.value = ""
  itemColorInput.value = ""
  imageInput.value = "";

  // Render updated items list
  renderItems();

}

function renderItems(filteredItems = items) {
  // Clear items list
  itemList.innerHTML = "";

  // Render each item as a card
  filteredItems.forEach(item => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");

    const imageElement = document.createElement("img");
    imageElement.src = item.imageUrl;
    cardElement.appendChild(imageElement);

    const nameElement = document.createElement("h3");
    nameElement.innerText = item.name;
    cardElement.appendChild(nameElement);


    const materialElement = document.createElement('p')
    materialElement.innerText = `Material: ${item.material}`
    cardElement.appendChild(materialElement);

    const colorElement = document.createElement('p')
    colorElement.innerText = `Color: ${item.color}`
    cardElement.appendChild(colorElement)

    const volumeElement = document.createElement('p')
    volumeElement.innerText = `Volume: ${item.volume}ml`
    cardElement.appendChild(volumeElement)

    const priceElement = document.createElement("p");
    priceElement.innerText = `Price: $${item.price}`;
    cardElement.appendChild(priceElement);

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", () => deleteItem(item));
    cardElement.appendChild(deleteButton);

    const editButton = document.createElement("button");
    editButton.setAttribute('id', 'edit-button')
    editButton.innerText = "Edit"
    editButton.addEventListener('click', () => editItem(item))
    cardElement.appendChild(editButton)

    editButton.addEventListener('click', () => {
      const editModal = document.getElementById('edit-modal');
      editModal.style.display = 'block';
    });

    itemList.appendChild(cardElement);
  });



}

function saveItems() {
  localStorage.setItem("items", JSON.stringify(items));
}

function loadItems() {
  const storedItems = localStorage.getItem("items");
  if (storedItems) {
    items = JSON.parse(storedItems);
  } else {
    items = []; // Initialize items array to an empty array if there is no data in localStorage
  }
}


function deleteItem(item) {
  const index = items.indexOf(item);
  if (index > -1) {
    items.splice(index, 1);
    saveItems();

    renderItems();

  }
}

function editItem(item) {
  // Here you can add the code to display a form to edit the item's properties
  // Once the user submits the form, you can update the item object and save it using saveItems() function
  // After that, call the renderItems() function to update the view
}

