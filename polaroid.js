const fileInput = document.querySelector("#file_input"),
  uploadBtn = document.querySelector("#upload_image"),
  previewImg = document.querySelector(".preview-img img"),
  generateBtn = document.querySelector("#generate_btn"),
  saveImgBtn = document.querySelector("#save_img"),
  choose_frame = document.querySelectorAll(".frame-style"),
  previewCanvas = document.getElementById("img_canvas");

generateBtn.disabled = true;
saveImgBtn.disabled = true;

let hasGenerate = false; // to check if the user has generated an image or not

let isAndroid = /(android)/i.test(navigator.userAgent);

let previewRatio = 0.5;
const updatePreviewRatio = () => {
  // Get the device width
  let deviceWidth = window.innerWidth;
  console.log("deviceWidth: ", deviceWidth);
  if (deviceWidth >= 870) {
    previewRatio = 0.8;
  }
};
updatePreviewRatio();
window.addEventListener("resize", updatePreviewRatio);
console.log("previewRatio: ", previewRatio);
previewImg.width = 220;
previewImg.height = (220 * previewImg.naturalHeight) / previewImg.naturalWidth;

let frame = document.querySelector("#frame_1");
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
let dropTarget = document.querySelector("#img_canvas");

// ======= for android device touch event =======
if (isAndroid) {
  dragSources.forEach((dragSource) => {
    dragSource.addEventListener("touchstart", touchStart, { passive: false });
    dragSource.addEventListener("touchmove", touchMove, { passive: false });
    dragSource.addEventListener("touchend", touchEnd, { passive: false });
  });
} else {
  function dragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.id);
  }
  // drop decoration on preview image

  dropTarget.addEventListener("drop", dropped);
  dropTarget.addEventListener("dragenter", cancelDefault);
  dropTarget.addEventListener("dragover", cancelDefault);
  // handling drag and drop event
  dragSources.forEach((dragSource) => {
    dragSource.addEventListener("dragstart", dragStart);
  });
}

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

function isInsideCanvasClient(clientX, clientY) {
  const r = previewCanvas.getBoundingClientRect(); // viewport coords
  return (
    clientX >= r.left &&
    clientX <= r.right &&
    clientY >= r.top &&
    clientY <= r.bottom
  );
}

function canvasRectPage() {
  const r = previewCanvas.getBoundingClientRect();
  return {
    left: r.left + window.scrollX,
    top: r.top + window.scrollY,
    width: r.width,
    height: r.height,
  };
}

// handle image dropped
function dropped(e) {
  console.log("dropped");
  cancelDefault(e);

  let id = e.dataTransfer.getData("text/plain");
  draggedElementIds.push(id);
  let draggedElement = document.querySelector("#" + id);
  // Calculate the position relative to the preview canvas

  let rect = previewCanvas.getBoundingClientRect();
  console.log(rect);

  // Store the mouse's position when the item is dropped
  let dropPosition = { x: e.pageX, y: e.pageY };

  const clientX = e.clientX; // viewport coords
  const clientY = e.clientY;

  // 1) check inside using client coords
  if (!isInsideCanvasClient(clientX, clientY)) {
    // outside → snap back
    sticker.style.position = "static";
    return;
  }

  console.log(true);
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

// ----------------------
// TOUCH EVENT HANDLERS
// ----------------------
let currentTouchSticker = null;

function touchStart(e) {
  e.preventDefault(); // prevent scrolling while dragging
  currentTouchSticker = e.target;
  // bring sticker to top
  currentTouchSticker.style.position = "absolute";
  currentTouchSticker.style.zIndex = 9999;
}

function touchMove(e) {
  if (!currentTouchSticker) return;
  let touch = e.touches[0];

  // place sticker centered on finger
  currentTouchSticker.style.left =
    touch.pageX - (currentTouchSticker.naturalWidth * previewRatio) / 2 + "px";
  currentTouchSticker.style.top =
    touch.pageY - (currentTouchSticker.naturalHeight * previewRatio) / 2 + "px";
}

function touchEnd(e) {
  if (!currentTouchSticker) return;

  let previewCanvas = document.getElementById("img_canvas");
  let rect = previewCanvas.getBoundingClientRect();

  // final drop position
  let touch = e.changedTouches[0];

  const clientX = touch.clientX;
  const clientY = touch.clientY;

  if (!isInsideCanvasClient(clientX, clientY)) {
    // outside → reset
    currentTouchSticker.style.position = "static";
    currentTouchSticker.style.zIndex = "auto";
    currentTouchSticker = null;
    return;
  }

  let offsetX =
    touch.pageX -
    rect.x -
    window.scrollX -
    (currentTouchSticker.naturalWidth * previewRatio) / 2;
  let offsetY =
    touch.pageY -
    rect.y -
    window.scrollY -
    (currentTouchSticker.naturalHeight * previewRatio) / 2;

  currentTouchSticker.dataset.offsetX = offsetX;
  currentTouchSticker.dataset.offsetY = offsetY;
  draggedElementIds.push(currentTouchSticker.id);

  currentTouchSticker = null;
}

// load upload image
const loadImage = () => {
  console.log("load image");
  let file = fileInput.files[0];
  if (!file) return;
  previewImg.src = URL.createObjectURL(file);
  previewImg.onload = () => {
    let r = previewImg.naturalHeight / previewImg.naturalWidth;
    previewImg.height = 220 * r;
    generateBtn.disabled = false;
  };
};

// draw preview canvas
const draw = (frame) => {
  console.log("draw");
  hasGenerate = true;
  saveImgBtn.disabled = false;
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
