const appForm = document.getElementById("application-form");
const thankYouPopup = document.querySelector(".application-thankyou");
const closeButton = thankYouPopup.querySelector(".close");

// console.log("app form", appForm);
const formFields = appForm.elements;

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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
      const files = field.files;
      const validExtensions = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      const fileTypes = Array.from(files).map((item) => item.type);

      const isInvalid = fileTypes.some(
        (type) => !validExtensions.includes(type)
      );

      if (isInvalid) {
        isValid = false;
        const message = document.createElement("div");
        message.className = "validation-message";
        message.style.color = "#9A0C16";
        message.style.marginTop = "8px"; // Add margin-top to the validation message
        message.innerText = `${capitalizeFirstLetter(
          field.name
        )} must be a .docx or .pdf file.`;

        // Append the message inside the .form-item
        if (formItem) {
          formItem.appendChild(message);
        }

        // Hide preview-upload and show preview-noupload
        previewUpload.style.display = "none";
        previewNoUpload.style.display = "flex";
      } else {
        // Insert filename and file size inside .preview-upload
        previewUpload.innerHTML = Array.from(files)
          .map((item) => {
            return `<div class="preview-file">
            <div class="preview-file-wrapper">
              <div class="title">${item.name}</div>
              <div class="size">${(item.size / 1024).toFixed(2)} KB</div>
              <div class="file-type">${item?.type.split("/")[1]}</div>
            </div>
            </div>`;
          })
          .join("");

        // Create and append remove button
        const removeButton = document.createElement("button");
        removeButton.classList.add("remove-file");
        removeButton.innerText = "Remove Files";
        removeButton.addEventListener("click", function (e) {
          e.preventDefault(); // Prevent form submission
          field.value = ""; // Clear the file input
          previewUpload.style.display = "none";
          previewNoUpload.style.display = "flex";
        });
        previewUpload.appendChild(removeButton);

        // Show preview-upload and hide preview-noupload
        previewUpload.style.display = "flex";
        previewNoUpload.style.display = "none";
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
    // Show the thank you popup
    thankYouPopup.classList.remove("hidden");
    // Reset the form
    appForm.reset();
    // Hide the preview-upload and show the preview-noupload
    document.querySelector(".preview-upload").style.display = "none";
    document.querySelector(".preview-noupload").style.display = "flex";
  }
});

// Add event listener to close button to hide the thank you popup
closeButton.addEventListener("click", function () {
  thankYouPopup.classList.add("hidden");
});
