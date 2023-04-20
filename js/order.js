// Get DOM elements
const itemList = document.querySelector(".item-list");
const createNewItemButton = document.querySelector('.header__create-page-modal')
const searchInput = document.querySelector('.header__search-input')
const searchButton = document.querySelector('.header__search-btn')
const cancelButton = document.querySelector('.header__search-cancel-btn')
const countVolumeButton = document.querySelector('.manage-count-btn')
const createItem = document.getElementById('create-modal');
const createItemForm = document.getElementById('create-modal');


// DOM INPUT
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
  createNewItemButton.classList.add("modal-active");
});

closeModalButton.addEventListener('click', () => {
  createItem.style.display = 'none';
  createNewItemButton.classList.remove("modal-active");
});

document.addEventListener('mousedown', (event) => {
  if (event.target === createItem) {
    createItem.style.display = 'none';
    createNewItemButton.classList.remove("modal-active");
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
  if (!itemName || isNaN(itemPrice) || isNaN(itemVolume) || itemPrice <= 0) {
    alert("Please enter a valid name and price for the item.");
    return;
  }

  // Add image upload 
  const imageInput = document.getElementById("image-input");
  const image = imageInput.files[0];
  const imageUrl = await uploadImage(image);

  // Create new item object
  const newItem = { id: Date.now(), name: itemName, material: itemMaterial, volume: itemVolume, price: itemPrice, color: itemColor, imageUrl: imageUrl };

  // Add new item to items array
  items.push(newItem);
  console.log(newItem)

  // Save  to localStorage
  saveItems();



  // Clear form inputs
  itemNameInput.value = "";
  itemPriceInput.value = "";
  itemVolumeInput.value = ""
  itemMaterialInput.value = ""
  itemColorInput.value = ""
  imageInput.value = "";

  // Render updated
  renderItems();

}

// SEARCH
searchButton.addEventListener('click', () => {
  const searchValue = searchInput.value.toLowerCase().trim();
  const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchValue));
  renderItems(filteredItems);
});

cancelButton.addEventListener('click', () => {
  searchInput.value = "";
  renderItems();
});

searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase().trim();
  const filteredItems = items.filter(item => item.name.toLowerCase().includes(query));
  renderItems(filteredItems);
});


// RENDER ITEM

function renderItems(filteredItems = items) {

  document.getElementById("sort-checkbox").addEventListener("change", () => {
    if (document.getElementById("sort-checkbox").checked) {
      items.sort((a, b) => b.volume - a.volume);
    } else {
      items = JSON.parse(localStorage.getItem("items"));
    }
    renderItems(items);
  });

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
    editButton.setAttribute("data-itemid", item.id);
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

// LOAD AND SAVE ITEM TO LOCALSTORAGE
function saveItems() {
  localStorage.setItem("items", JSON.stringify(items));
}

function loadItems() {
  const storedItems = localStorage.getItem("items");
  if (storedItems) {
    items = JSON.parse(storedItems);
  } else {
    items = []; // empty array if  no data in localStorage
  }
}

// DELETE ITEM
function deleteItem(item) {
  const index = items.indexOf(item);
  if (index > -1) {
    items.splice(index, 1);
    saveItems();
    renderItems();
  }
}
// EDIT ITEM



// COUNT VOLUME
function countTotalVolume() {
  let totalVolume = 0;
  for (let i = 0; i < items.length; i++) {
    totalVolume += parseInt(items[i].volume);
  }
  return totalVolume;
}

countVolumeButton.addEventListener('click', () => {
  const totalVolumeElement = document.querySelector('.manage__volume');
  const totalVolume = countTotalVolume();
  totalVolumeElement.innerText = `${totalVolume}ml`;
});


// IMAGE UPLOAD API

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

function editItem(item) {
  const editModal = document.getElementById('edit-modal');
  editModal.style.display = 'block';

  // Get input elements from modal
  const itemPriceInput = document.getElementById('edit-price-input');
  const itemNameInput = document.getElementById('edit-name-input');
  const itemVolumeInput = document.getElementById('edit-volume-input');
  const itemMaterialInput = document.getElementById('edit-material-input');
  const itemColorInput = document.getElementById('edit-color-input');
  const saveButton = document.getElementById('modal__btn-edit');

  // Set input values to current item values
  itemPriceInput.value = item.price;
  itemNameInput.value = item.name;
  itemVolumeInput.value = item.volume;
  itemMaterialInput.value = item.material;
  itemColorInput.value = item.color;

  // Save changes to item when save button is clicked
  saveButton.addEventListener('click', () => {
    // Get new item values from form inputs
    const newItemPrice = parseFloat(itemPriceInput.value);
    const newItemName = itemNameInput.value;
    const newItemVolume = itemVolumeInput.value;
    const newItemMaterial = itemMaterialInput.value;
    const newItemColor = itemColorInput.value;

    // Validate new item name and price
    if (!newItemName || isNaN(newItemPrice) || isNaN(newItemVolume) || newItemPrice <= 0) {
      alert('Please enter a valid name and price for the item.');
      return;
    }

    // Update item in items array
    const index = items.findIndex(i => i.id === item.id);
    items[index].name = newItemName;
    items[index].material = newItemMaterial;
    items[index].volume = newItemVolume;
    items[index].color = newItemColor;
    items[index].price = newItemPrice;

    // Save updated items array to localStorage
    saveItems();

    // Clear form inputs and close modal
    itemPriceInput.value = '';
    itemNameInput.value = '';
    itemVolumeInput.value = '';
    itemMaterialInput.value = '';
    itemColorInput.value = '';
    editModal.style.display = 'none';

    // Render updated items
    renderItems();
  });
}