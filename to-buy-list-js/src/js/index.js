const alert = document.querySelector(".alert");
const form = document.querySelector(".to-buy-form");
const item = document.getElementById("item");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".to-buy-container");
const list = document.querySelector(".to-buy-list");
const clearBtn = document.querySelector(".clear-btn");


let editElement;
let editFlag = false;
let editID = "";


form.addEventListener("submit", addItem);
window.addEventListener("DOMContentLoaded", setupItems);
clearBtn.addEventListener("click", () => {
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this list!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                swal({
                    title: "List Deleted!",
                    text: "What if we create another? ...",
                    icon: "success",
                    button: "Hell Yeah!",
                });
                clearItems();
            } else {
                swal("Your list is safe!");
            }
        });
})

function addItem(e) {
    e.preventDefault();
    const value = item.value;
    const id = new Date().getTime().toString();
    if (value && !editFlag) {
        createListItem(id, value);

        displayAlert("item add to the list", "success");
        container.classList.add("show-container");
        addToLocalStorage(id, value);
        setToDefault();
    }
    else if (value && editFlag) {
        editElement.innerHTML = value;
        editLocalStorage(editID, value);
        editElement.classList.remove("title-edit")
        setToDefault();
    }
    else {
        displayAlert("please enter a value", "danger")
    }
}

function clearItems() {
    const items = document.querySelectorAll(".to-buy-item");

    if (items.length > 0) {
        items.forEach(function (item) {
            list.removeChild(item);
        });
    }
    localStorage.removeItem("list")
    container.classList.remove("show-container")
    setToDefault();
}

function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    console.log(id)
    list.removeChild(element);
    if (list.children.length === 0) {
        container.classList.remove("show-container")
    }
    displayAlert("item removed", "danger");
    removeFromLocalStorage(id);
    setToDefault();
}

function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement;

    editElement = e.currentTarget.parentElement.previousElementSibling;
    item.value = editElement.innerHTML;
    if (editFlag === true) {
        displayAlert("cannot edit more than one item", "danger");
        return;
    }
    else {
        editElement.classList.add("title-edit")
        editFlag = true;
    }
    editID = element.dataset.id;
    submitBtn.textContent = "edit";
}

function displayAlert(text, action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`)

    setTimeout(function () {
        alert.classList.remove(`alert-${action}`);
        alert.textContent = "";
    }, 1000);
}

function addToLocalStorage(id, value) {
    const item = { id, value };
    let items = localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : [];
    console.log(items);
    items.push(item);
    localStorage.setItem("list", JSON.stringify(items));
}

function removeFromLocalStorage(id) {
    let items = getLocalStorage();

    items = items.filter((item) => {
        if (item.id !== id) {
            return item;
        }
    });
    localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value) {
    let items = getLocalStorage();
    items = items.map((item) => {
        if (item.id === id) {
            item.value = value;
        }
        return item;
    })
    localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
    return localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : [];
}

function setToDefault() {
    item.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "Submit"
}

function setupItems() {
    let items = getLocalStorage();
    if (items.length > 0) {
        items.forEach(function(item){
            createListItem(item.id, item.value)
        })
    container.classList.add("show-container")
    }
}

function createListItem(id, value) {
    const element = document.createElement("article");

    element.classList.add("to-buy-item");

    const attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML =
        `<p class="title">${value}</p>
        <div class="btn-container">
            <button type="submit" class="edit-btn">
                <i class="btn-text text-edit"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.5 8L16.5 5.5L13.5 10.5L12.5 15.5L11 17.5L5.5 16.5L6 14.5L9.5 8Z"
                            fill="#5add97" />
                        <path
                            d="M6 21L5.81092 17.9747C5.37149 10.9438 10.9554 5 18 5V5L16.7827 5.97387C14.3918 7.88656 13 10.7824 13 13.8442V13.8442C13 15.9831 11.0278 17.5774 8.93642 17.1292L6 16.5"
                            stroke="#5add97" stroke-width="2" />
                    </svg>
                </i>
            </button>
            <button type="submit text-delete" class="delete-btn">
                <i class="btn-text text-delete"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M21.0001 6H3.00006V9C4.10463 9 5.00006 9.89543 5.00006 11V15C5.00006 17.8284 5.00006 19.2426 5.87874 20.1213C6.75742 21 8.17163 21 11.0001 21H13.0001C15.8285 21 17.2427 21 18.1214 20.1213C19.0001 19.2426 19.0001 17.8284 19.0001 15V11C19.0001 9.89543 19.8955 9 21.0001 9V6ZM10.5001 11C10.5001 10.4477 10.0523 10 9.50006 10C8.94778 10 8.50006 10.4477 8.50006 11V16C8.50006 16.5523 8.94778 17 9.50006 17C10.0523 17 10.5001 16.5523 10.5001 16V11ZM15.5001 11C15.5001 10.4477 15.0523 10 14.5001 10C13.9478 10 13.5001 10.4477 13.5001 11V16C13.5001 16.5523 13.9478 17 14.5001 17C15.0523 17 15.5001 16.5523 15.5001 16V11Z"
                            fill="#FF0000" />
                        <path
                            d="M10.0681 3.37059C10.1821 3.26427 10.4332 3.17033 10.7825 3.10332C11.1318 3.03632 11.5597 3 12 3C12.4403 3 12.8682 3.03632 13.2175 3.10332C13.5668 3.17033 13.8179 3.26427 13.9319 3.37059"
                            stroke="#FF0000" stroke-width="2" stroke-linecap="round" />
                    </svg>
                </i>
            </button>
        </div>`
    const deleteBtn = element.querySelector(".delete-btn");
    const editBtn = element.querySelector(".edit-btn");

    deleteBtn.addEventListener("click", deleteItem);
    editBtn.addEventListener("click", editItem);

    list.appendChild(element);
}

