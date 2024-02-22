// //Variables globales
// const url = "http://localhost:5678/api/";
// const token = localStorage.getItem("token");
// // export { url };

// // Fetches works data from the API
// const fetchData = async (param) => {
//   try {
//     const response = await fetch(url + param);
//     return await response.json();
//   } catch (error) {
//     console.error(error);
//   }
// };
// const arrayAllWorks = fetchData("works").then((result) => result);
// const arrayAllCategories = fetchData("categories").then((result) => result);

// const arrayawait = async () => {
//   console.log(await arrayAllWorks);
// }
// arrayawait()
// console.log(arrayAllWorks);

//---------------------

// Variables globales
const url = "http://localhost:5678/api/";
const token = localStorage.getItem("token");
let arrayAllWorks = JSON.parse(sessionStorage.getItem("arrayAllWorks"));
let arrayAllCategories = JSON.parse(
  sessionStorage.getItem("arrayAllCategories")
);

const fetchData = async (URI, init) => {
  try {
    const response = await fetch(url + URI, init);
    console.log(response); // Ajoutez cette ligne pour vérifier la réponse
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

// Fetch and store data in sessionStorage
const fetchAndStoreData = async (URI, key) => {
  try {
    const value = await fetchData(URI);
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(error);
  }
};
fetchAndStoreData("works", "arrayAllWorks");
fetchAndStoreData("categories", "arrayAllCategories");

// Log the retrieved data
console.log(arrayAllWorks);
console.log(arrayAllCategories);

//Inserts works into the HTML gallery
const insertWorkInHtml = async (array) => {
  document.getElementById("gallery").innerHTML = array
    .map(
      (e) =>
        `<figure>
          <img src="${e.imageUrl}" alt="${e.title}"/>
          <figcaption>${e.title}</figcaption>
        </figure>`
    )
    .join("");
};

// Displays all works in the HTML gallery
insertWorkInHtml(arrayAllWorks);

// Displays category buttons and adds "Tous" as the first option
const DisplayBtnCategories = async () => {
  const array = arrayAllCategories.slice();
  array.unshift({ id: 0, name: "Tous" });

  document.getElementById("filter").innerHTML = array
    .map((e) => `<button class="button" id="${e.id}">${e.name}</button>`)
    .join("");
};

// filters works based on buttons
function filterWorks() {
  DisplayBtnCategories();
  const arrayBtn = Array.from(document.querySelectorAll("#filter button"));
  arrayBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      const btnId = +btn.id;
      btn.classList.add("btn-selected");
      arrayBtn
        .filter((otherBtn) => otherBtn !== btn)
        .forEach((otherBtn) => otherBtn.classList.remove("btn-selected"));

      const worksFiltered =
        btnId === 0
          ? arrayAllWorks
          : arrayAllWorks.filter((e) => btnId === e.categoryId);
      insertWorkInHtml(worksFiltered);
    });
  });
}
filterWorks();

// ---------- ----------

// --IF USER IS LOGGED : (2.2)
const ifLogged = () => {
  const loginElement = document.getElementById("login");

  if (localStorage.getItem("logged") === "true") {
    loginElement.textContent = "Logout";

    // Add mode édition
    document
      .querySelector("header")
      .insertAdjacentHTML(
        "beforebegin",
        '<div id="edition-mode"><div><a href="#"><i class="fa-regular fa-pen-to-square" style="color: #ffffff;"></i> Mode édition</a></div></div>'
      );

    // Add Modifier
    document
      .querySelector("#portfolio h2")
      .insertAdjacentHTML(
        "beforeend",
        '<a><i class="fa-regular fa-pen-to-square" style="color: black"></i> Modifier</a>'
      );

    // Disconnect: Clicking logout
    loginElement.addEventListener("click", () => {
      localStorage.setItem("logged", "false");
      localStorage.removeItem("token");
    });
  }
};
ifLogged();

// ---------- ----------

// MODAL
const setModalDisplay = (trigger, target, displayValue) => {
  // short-circuit evaluation
  trigger &&
    trigger.addEventListener(
      "click",
      () => (target.style.display = displayValue)
    );
};

const displayModal = () => {
  const containerModalElement = document.getElementById("containerModal");
  const modeEditionElement = document.querySelector("#edition-mode a");
  const modifierElement = document.querySelector("#portfolio a");
  const modalGalleryElement = document.getElementById("modalGallery");
  const modalNewWorkElement = document.getElementById("modalNewWork");
  const x = document.getElementById("x");
  const x2 = document.getElementById("x2");
  const btnModalGallery = document.getElementById("modalGallery-btn");
  const leftArrowElement = document.querySelector(".fa-arrow-left");
  // DisplayValue
  const flex = "flex";
  const none = "none";

  // Mode édition
  setModalDisplay(modeEditionElement, containerModalElement, flex);
  // Modifier
  setModalDisplay(modifierElement, containerModalElement, flex);

  // Leave when clicked on X
  setModalDisplay(x, containerModalElement, none);
  setModalDisplay(x2, containerModalElement, none);

  // Leave when clicked on container
  containerModalElement.addEventListener(
    "click",
    (e) =>
      e.target.id === "containerModal" &&
      (containerModalElement.style.display = none)
  );

  // Go to modalAddWork
  setModalDisplay(btnModalGallery, modalGalleryElement, none);
  setModalDisplay(btnModalGallery, modalNewWorkElement, flex);
  setModalDisplay(btnModalGallery, leftArrowElement, flex);

  // Left Arrow (back to modalGallery)
  setModalDisplay(leftArrowElement, modalGalleryElement, flex);
  setModalDisplay(leftArrowElement, modalNewWorkElement, none);
  setModalDisplay(leftArrowElement, leftArrowElement, none);
};
displayModal();

// ---------- 3.1 ----------

// Inserts works into the HTML MODAL
const insertWorkInHtmlModal = (array) => {
  const modalWorkElement = document.getElementById("modal-work");

  if (modalWorkElement) {
    modalWorkElement.innerHTML = array
      .filter((e) => e.imageUrl && e.title && e.id)
      .map(
        (e) => `<figure>
                  <span>
                    <i class="fa-solid fa-trash-can" id="${e.id}"></i>
                  </span>
                  <img src="${e.imageUrl}" alt="${e.title}">
                </figure>`
      )
      .join("");
  }
};
insertWorkInHtmlModal(arrayAllWorks);

// ---------- 3.2 ----------

// Supprimer un work
async function deleteWork(id) {
  const init = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const response = await fetch(url + "works/" + id, init);
    response.status !== 204
      ? console.log("DELETE -> error", response.status)
      : console.log(response);
  } catch (error) {
    console.error(error);
  }
}

// Supprime un work au click sur trash
const setupDeleteButtons = () => {
  const allTrash = document.querySelectorAll(".fa-trash-can");

  allTrash.forEach((e) => {
    e.addEventListener("click", async (trash) => {
      const id = +trash.target.id;
      console.log(id);
      deleteWork(id);
      array = arrayAllWorks.filter((work) => work.id !== id);
      console.log("arrayAllWorks : ", arrayAllWorks);
      console.log("array : ", array);
      insertWorkInHtmlModal(array);
    });
  });
};
setupDeleteButtons();

// ---------- 3.3 ----------

// Affiche les catégories de #catégorie
const DisplayOptionsCategory = async () => {
  const array = arrayAllCategories.slice();
  const defaultOption =
    '<option value="0" disabled selected hidden>Choisissez une catégorie</option>';
  const htmlContent =
    defaultOption +
    array.map((e) => `<option value="${e.id}">${e.name}</option>`).join("");

  document.getElementById("categorie").innerHTML = htmlContent;
};

// au clic sur #modalGallery-btn
document.getElementById("modalGallery-btn").addEventListener("click", () => {
  DisplayOptionsCategory();
});

// Désactiver ou activer #modalNewWork-btn
document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("file");
  const titleInput = document.getElementById("title");
  const categoryInput = document.getElementById("categorie");
  const submitButton = document.getElementById("modalNewWork-btn");

  const updateSubmitButton = () => {
    const isButtonDisabled =
      !fileInput.value ||
      !titleInput.value.trim() ||
      categoryInput.value === "0"; // Option par défaut

    submitButton.disabled = isButtonDisabled;
    submitButton.classList.toggle(
      "modalNewWork-btn-activate",
      !isButtonDisabled
    );
    submitButton.classList.toggle(
      "modalNewWork-btn-disabled",
      isButtonDisabled
    );
  };

  fileInput.addEventListener("input", updateSubmitButton);
  titleInput.addEventListener("input", updateSubmitButton);
  categoryInput.addEventListener("change", updateSubmitButton);

  // Initial update
  updateSubmitButton();
});

// ModalNewWork
const submitWorkForm = async () => {
  const modalErrorElement = document.getElementById("modalError");
  const form = document.getElementById("modalNewWork-form");
  const titleElement = document.getElementById("title");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // GESTION d'ERREUR

    // Vérification du fichier
    const file = document.getElementById("file").files[0];
    const containerPhotoElement = document.getElementById("containerPhoto");
    const fileError =
      !file ||
      (file.type !== "image/jpeg" && file.type !== "image/png") ||
      file.size > 4 * 1024 * 1024;

    fileError
      ? addError(
          containerPhotoElement,
          "Erreur : Veuillez sélectionner une image JPEG ou PNG de taille inférieure à 4 Mo."
        )
      : containerPhotoElement.classList.remove("form-error");

    // Vérification du titre
    const title = titleElement.value;
    const titleError = !title || typeof title !== "string";

    titleError
      ? addError(titleElement, "Erreur : Veuillez entrer un titre valide.")
      : titleElement.classList.remove("form-error");

    //   categoryError
    //   ? addError(categoryInput, "Erreur : Veuillez choisir une catégorie.")
    //   : categoryInput.classList.remove("form-error");

    // // arrête le code si une erreur est trouvée
    // if (fileError || titleError || categoryError) return;

    // arrête le code si une erreur est trouvée
    if (fileError || titleError) return;

    // IL n'y à pas d'erreur :
    try {
      const formData = new FormData();
      const category = document.getElementById("categorie");
      const categoryValue = +category.options[category.selectedIndex].value;

      formData.set("image", file, file.name);
      formData.append("title", title);
      formData.append("category", categoryValue);

      // Réinitialiser le message d'erreur
      modalErrorElement.innerHTML = "";

      const init = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      };

      const response = await fetchData("works", init);

      if (response) {
        console.log("Réponse du serveur :", response);
        resetForm();
      } else {
        console.error("Erreur lors de la requête :", response);
      }
    } catch (error) {
      console.error(error);
    }
  });
};

submitWorkForm();

// Fonction pour afficher un message d'erreur
const addError = (errorElement, message) => {
  errorElement.classList.add("form-error");
  modalErrorElement.innerHTML = `<p>${message}</p>`;
};

// Réinitialise le formulaire
const resetForm = () => {
  document.getElementById("file").value = "";
  document.getElementById("title").value = "";
  document.getElementById("categorie").value = "";
  document.getElementById("containerModal").style.display = "none";
};

// --------------------------------

// Preview IMG
document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("file");
  const previewImage = document.getElementById("previewImage");

  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewImage.style.display = "block";
      };

      reader.readAsDataURL(file);
    } else {
      previewImage.style.display = "none";
    }
  });
});
