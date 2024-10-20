const appForm = document.getElementById("profile-update");
const thankYouPopup = document?.querySelector(".thank-you-popup");
const closeButton = thankYouPopup?.querySelector(".close");

// console.log("app form", appForm);
const formFields = appForm.elements;

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getProfileData = () => {
  // Retrieve and parse profile data from local storage
  const profileData = localStorage.getItem("profileData");
  const profile = profileData ? JSON.parse(profileData) : {};

  // Set default values if profile data is not available
  const name = profile?.["First Name"]
    ? `${profile?.["First Name"]} ${profile?.["Middle Name"]} ${profile?.["Last Name"]}`
    : "John Doe";
  const bio = profile?.bio || "Your bio here.";
  const phone = profile?.phone || "09xxxxxxxxx";
  const email = profile?.email || "john@doe.com";
  const fileData = profile?.fileData || "./images/profile-default.png";

  // Set the value of displayName
  const displayName = document.querySelector(".name");
  if (displayName) {
    displayName.innerText = name;
  }

  // Similarly, you can set other fields if needed
  const displayBio = document.querySelector(".bio");
  if (displayBio) {
    displayBio.innerText = bio;
  }

  const displayPhone = document.querySelector(".phone");
  if (displayPhone) {
    displayPhone.innerText = phone;
  }

  const displayEmail = document.querySelector(".email");
  if (displayEmail) {
    displayEmail.innerText = email;
  }

  // If you need to display the file, you can handle it here
  if (fileData) {
    const displayFile = document.querySelector(".file");
    if (displayFile) {
      displayFile.src = fileData;
    }
  }
};

// Function to validate a single field
function validateField(field) {
  // Remove existing validation message for this field
  const formItem = field.closest(".form-item");
  const existingMessage = formItem.querySelector(".validation-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  let isValid = true;

  // Check if the field is empty

  if (field.value.startsWith(" ")) {
    field.value = field.value.trim();
  }

  if (field.value.trim() === "") {
    isValid = false;
    const message = document.createElement("div");
    message.className = "validation-message";
    message.style.color = "#9A0C16";
    message.style.marginTop = "8px"; // Add margin-top to the validation message
    message.innerText = `${capitalizeFirstLetter(field.name)} is required.`;

    // Append the message inside the .form-item
    if (formItem) {
      formItem.appendChild(message);
    }
  } else if (field.id === "phone" || field.name === "phone") {
    // Additional validation for phone input
    const phonePattern = /^(09|\+639)\d{9}$/;
    if (!phonePattern.test(field.value.trim())) {
      isValid = false;
      const message = document.createElement("div");
      message.className = "validation-message";
      message.style.color = "#9A0C16";
      message.style.marginTop = "8px"; // Add margin-top to the validation message
      message.innerText =
        "Invalid phone number format. Must be 11 digits (09xxxxxxxxx).";

      // Append the message inside the .form-item
      if (formItem) {
        formItem.appendChild(message);
      }
    }
  }

  // Additional validation for file input
  if (field.type === "file") {
    const previewUpload = document.querySelector(".preview-upload");
    const previewNoUpload = document.querySelector(".preview-noupload");

    if (field.files.length > 0) {
      const file = field.files[0];
      const validExtensions = ["image/png", "image/webp", "image/jpeg"];
      if (!validExtensions.includes(file.type)) {
        isValid = false;
        const message = document.createElement("div");
        message.className = "validation-message";
        message.style.color = "#9A0C16";
        message.style.marginTop = "8px"; // Add margin-top to the validation message
        message.innerText = `${capitalizeFirstLetter(
          field.name
        )} invalid file format. Please only upload: .jpg, .png, .webp, .gif.`;

        // Append the message inside the .form-item
        if (formItem) {
          formItem.appendChild(message);
        }

        // Hide preview-upload and show preview-noupload
        previewUpload.style.display = "none";
        previewNoUpload.style.display = "flex";
      } else {
        // Insert image preview inside .preview-upload
        const reader = new FileReader();
        reader.onload = function (e) {
          previewUpload.innerHTML = `<img src="${e.target.result}" alt="Image Preview" style="max-width: 100%; height: 250px; object-fit: contain; background-color: #000;" />`;

          // Create and append remove button
          const removeButton = document.createElement("button");
          removeButton.innerText = "Remove";
          removeButton.classList.add("remove-file");
          removeButton.addEventListener("click", function (e) {
            e.preventDefault(); // Prevent form submission
            field.value = ""; // Clear the file input
            previewUpload.style.display = "none";
            previewNoUpload.style.display = "flex";
          });
          previewUpload.appendChild(removeButton);

          // Show preview-upload and hide preview-noupload
          previewUpload.style.display = "block";
          previewNoUpload.style.display = "none";
        };
        reader.readAsDataURL(file);
      }
    } else {
      // Hide preview-upload and show preview-noupload
      previewUpload.style.display = "none";
      previewNoUpload.style.display = "flex";
    }
  }

  return isValid;
}

// Function to validate all fields
function validateFields() {
  let isValid = true;

  for (let field of formFields) {
    if (field?.getAttribute("data-required") == "true") {
      if (field.tagName === "INPUT" || field.tagName === "TEXTAREA") {
        if (!validateField(field)) {
          isValid = false;
        }
      }
    }
  }

  return isValid;
}

// Function to store form data in local storage
function storeFormData(callback) {
  const formData = {};
  for (let field of formFields) {
    if (field.tagName === "INPUT" || field.tagName === "TEXTAREA") {
      formData[field.name] = field.value;
    }
  }

  // Store file data if file input is present
  const fileInput = document.querySelector('input[type="file"]');
  if (fileInput && fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      formData["fileData"] = e.target.result;
      localStorage.setItem("profileData", JSON.stringify(formData));
      if (callback) callback();
    };
    reader.readAsDataURL(file);
  } else {
    localStorage.setItem("profileData", JSON.stringify(formData));
    if (callback) callback();
  }
}

// Add event listeners to fields to validate on change/input
for (let field of formFields) {
  if (field?.getAttribute("data-required") == "true") {
    if (field.tagName === "INPUT" || field.tagName === "TEXTAREA") {
      field.addEventListener("input", function () {
        validateField(field);
      });

      if (field.type === "file") {
        field.addEventListener("change", function () {
          validateField(field);
        });
      }
    }
  }
}

// Validate fields on form submit
appForm.addEventListener("submit", function (e) {
  e.preventDefault();
  if (validateFields()) {
    // Store form data in local storage and then get profile data
    storeFormData(() => {
      getProfileData();
      // Show the thank you popup
      thankYouPopup?.classList.remove("hidden");
      // Reset the form
      appForm.reset();
      document.querySelector(".preview-upload").style.display = "none";
      document.querySelector(".preview-noupload").style.display = "flex";
    });
  }
});

getProfileData();

// Add event listener to close button to hide the thank you popup
closeButton?.addEventListener("click", function () {
  thankYouPopup.classList.add("hidden");
});
