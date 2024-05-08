const fileInput = document.querySelector("#file_input"),
  uploadBtn = document.querySelector("#upload_image"),
  previewImg = document.querySelector(".preview-img img"),
  generateBtn = document.querySelector("#generate_btn"),
  saveImgBtn = document.querySelector("#save_img"),
  choose_frame = document.querySelectorAll(".frame-style");

let previewRatio = 0.5;
const updatePreviewRatio = () => {
  // Get the device width
  let deviceWidth = window.innerWidth;
  if (deviceWidth >= 800) {
    previewRatio = 0.8;
  } else {
    previewRatio = 0.5;
  }
};
updatePreviewRatio();
window.addEventListener("resize", updatePreviewRatio);

previewImg.width = 220;
previewImg.height = 277;

let frame = document.querySelector("#frame_1");
let hasGenerate = false; // to check if the user has generated an image or not
// click on frame to change frame style
const chooseStyle = (id) => {
  if (!hasGenerate) return;
  console.log(id);
  frame = document.getElementById(id);
  draw(frame);
};

for (let i = 0; i < choose_frame.length; i++) {
  choose_frame[i].addEventListener("click", () => {
    chooseStyle(choose_frame[i].id);
  });
}

// decoration images
// Define a global array to store the IDs of dragged elements
let draggedElementIds = [];
let dragSources = document.querySelectorAll('[draggable="true"]');
dragSources.forEach((dragSource) => {
  dragSource.addEventListener("dragstart", dragStart);
  dragSource.addEventListener("touchstart", touchStart);
});

function touchStart(e) {
  // Prevent default touch behavior to prevent scrolling
  e.preventDefault();
  let touch = e.touches[0];
  // Initiate the drag operation
  dragStart({
    dataTransfer: {
      setData: function () {}, // Touch events don't support dataTransfer
    },
    target: e.target,
    clientX: touch.clientX,
    clientY: touch.clientY,
  });
}

function touchMove(e) {
  e.preventDefault();
  // Get the touch position
  let touch = e.touches[0];
  // Update the position of the dragged element
  draggedElement.style.left = touch.clientX + "px";
  draggedElement.style.top = touch.clientY + "px";
}

function touchEnd(e) {
  e.preventDefault();
  // Remove touch move and end event listeners
  //document.removeEventListener("touchmove", touchMove);
  //document.removeEventListener("touchend", touchEnd);
}

function dragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.id);
}
// drop decoration on preview image
let dropTarget = document.querySelector("#img_canvas");
dropTarget.addEventListener("drop", dropped);
dropTarget.addEventListener("dragenter", cancelDefault);
dropTarget.addEventListener("dragover", cancelDefault);
dropTarget.addEventListener("touchmove", touchMove); // Add touch move event listener
dropTarget.addEventListener("touchend", touchEnd);

// adjust sticker images size
const adjustImagesSize = (ratio) => {
  // Select all images that need to be adjusted
  let imagesToAdjust = document.querySelectorAll(".sticker");

  // Loop through each image and adjust its width and height
  imagesToAdjust.forEach((image) => {
    let naturalWidth = image.naturalWidth;
    let naturalHeight = image.naturalHeight;
    image.style.width = naturalWidth * ratio + "px";
    image.style.height = naturalHeight * ratio + "px";
  });
};
window.addEventListener("load", () => {
  adjustImagesSize(previewRatio);
});

// handle image dropped
function dropped(e) {
  console.log("dropped");
  cancelDefault(e);

  let id = e.dataTransfer.getData("text/plain");
  draggedElementIds.push(id);
  let draggedElement = document.querySelector("#" + id);
  // Calculate the position relative to the preview canvas
  let previewCanvas = document.getElementById("img_canvas");
  let rect = previewCanvas.getBoundingClientRect();

  // Store the mouse's position when the item is dropped
  let dropPosition = { x: e.pageX, y: e.pageY };
  console.log("dropPosition: ", dropPosition);

  // Position the dragged element over the preview image
  draggedElement.style.position = "absolute";
  let stickerPositionX =
    dropPosition.x - (draggedElement.naturalWidth * previewRatio) / 2;
  console.log("draggedElement.naturalHeight", draggedElement.naturalHeight);
  let stickerPositionY =
    dropPosition.y - (draggedElement.naturalHeight * previewRatio) / 2;
  draggedElement.style.left = stickerPositionX + "px";
  draggedElement.style.top = stickerPositionY + "px";
  console.log("draggedElement.style.left: ", draggedElement.style.left);
  console.log("draggedElement.style.top: ", draggedElement.style.top);
  // Store the dragged element and its original position for later use
  let offsetX = stickerPositionX - rect.x - window.scrollX;
  let offsetY = stickerPositionY - rect.y - window.scrollY;
  draggedElement.dataset.offsetX = offsetX;
  draggedElement.dataset.offsetY = offsetY;
  draggedElement.dataset.id = id;
}

function cancelDefault(e) {
  e.preventDefault();
  e.stopPropagation();
  return false;
}

// load upload image
const loadImage = () => {
  console.log("load image");
  let file = fileInput.files[0];
  if (!file) return;
  previewImg.src = URL.createObjectURL(file);
};

// draw preview canvas
const draw = (frame) => {
  console.log("draw");
  hasGenerate = true;
  let imgRatio = previewImg.naturalHeight / previewImg.naturalWidth;
  let canvas = document.getElementById("img_canvas");
  // Get the device width
  let deviceWidth = window.innerWidth;
  console.log("deviceWidth: ", deviceWidth);

  if (deviceWidth >= 800) {
    previewRatio = 0.8;
  }

  canvas.width = frame.naturalWidth * previewRatio;
  canvas.height = (468 * imgRatio + 182) * previewRatio;
  let ctx = canvas.getContext("2d");
  ctx.drawImage(
    frame,
    0,
    0,
    frame.naturalWidth * previewRatio,
    (468 * imgRatio + 182) * previewRatio
  );
  ctx.drawImage(
    previewImg,
    19 * previewRatio,
    38 * previewRatio,
    468 * previewRatio,
    468 * imgRatio * previewRatio
  );
};

// downlod image
const save = (canvas) => {
  const link = document.createElement("a");
  link.download = "image.jpg";
  link.href = canvas.toDataURL();
  link.click();
};

// draw result image and download
const drawImg = (frame) => {
  console.log("save image");
  let imgRatio = previewImg.naturalHeight / previewImg.naturalWidth;
  let canvas = document.createElement("canvas");
  canvas.width = frame.naturalWidth;
  canvas.height = 468 * imgRatio + 182;
  let ctx = canvas.getContext("2d");
  ctx.drawImage(frame, 0, 0, frame.naturalWidth, 468 * imgRatio + 182);
  ctx.drawImage(previewImg, 19, 38, 468, 468 * imgRatio);

  draggedElementIds.forEach((id) => {
    // Retrieve the dragged element using its ID
    let draggedElement = document.getElementById(id);

    // Ensure the dragged element exists before attempting to draw it
    if (draggedElement) {
      // Retrieve the original position from the dataset
      let offsetX = parseFloat(draggedElement.dataset.offsetX);
      let offsetY = parseFloat(draggedElement.dataset.offsetY);
      console.log("offsetX: ", offsetX);
      console.log("offsetY: ", offsetY);
      // Draw the dragged element onto the canvas at the adjusted position
      ctx.drawImage(
        draggedElement,
        offsetX / previewRatio,
        offsetY / previewRatio
      );
    }
  });

  save(canvas);
};

uploadBtn.addEventListener("click", () => {
  fileInput.click();
});
fileInput.addEventListener("change", loadImage);
generateBtn.addEventListener("click", () => {
  draw(frame);
});
saveImgBtn.addEventListener("click", () => {
  drawImg(frame);
});
