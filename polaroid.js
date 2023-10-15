const fileInput = document.querySelector('#file_input'),
uploadBtn = document.querySelector('#upload_image'),
previewImg = document.querySelector('.preview-img img'),
generateBtn = document.querySelector('#generate_btn'),
saveImgBtn = document.querySelector('#save_img'),
choose_frame = document.querySelectorAll('.frame-style')

previewImg.width = 220
previewImg.height = 277

let frame = document.querySelector('#frame_1')
let hasGenerate = false  // to check if the user has generated an image or not

// click on frame to change frame style
const chooseStyle = (id) => {
    if(!hasGenerate) return
    console.log(id)
    frame = document.getElementById(id)
    draw(frame)
}

for(let i = 0;i < choose_frame.length;i++) {
    choose_frame[i].addEventListener('click',() => {chooseStyle(choose_frame[i].id)})
}

// load upload image
const loadImage = () => {
    console.log('load image')
    let file = fileInput.files[0]
    if(!file) return
    previewImg.src = URL.createObjectURL(file)
}

// draw preview canvas
const draw = (frame) => {
    console.log('draw')
    hasGenerate = true
    let imgRatio = previewImg.naturalHeight / previewImg.naturalWidth
    let canvas = document.getElementById("img_canvas")

    if(506*imgRatio < 620) {
        
        canvas.width = frame.naturalWidth
        canvas.height = (506*imgRatio + 182)
        let ctx = canvas.getContext('2d')
        ctx.fillStyle = "#fff"
        ctx.fillRect(0,0,506,(506*imgRatio + 182))
        ctx.drawImage(previewImg, 19, 38, 468, 506*imgRatio)
        ctx.drawImage(frame, 0, 0, frame_1.naturalWidth, (506*imgRatio + 182))
        
    } else {
        canvas.width = frame.naturalWidth
        canvas.height = frame.naturalHeight
        let ctx = canvas.getContext('2d')
        ctx.drawImage(previewImg, 19, 38, 468, 506*imgRatio)
        ctx.drawImage(frame, 0, 0)
    }
    
}

// downlod image
const save = (canvas) => {
    const link = document.createElement("a")
    link.download = "image.jpg"
    link.href = canvas.toDataURL()
    link.click()
}

// draw result image and download
const drawImg = (frame) => {
    console.log('save image')
    let imgRatio = previewImg.naturalHeight / previewImg.naturalWidth
    let canvas = document.createElement("canvas")
    
    if(506*imgRatio < 620) {
        
        canvas.width = frame.naturalWidth
        canvas.height = 506*imgRatio + 182
        let ctx = canvas.getContext('2d')
        ctx.fillStyle = "#fff"
        ctx.fillRect(0,0,506,506*imgRatio + 182)
        ctx.drawImage(previewImg, 19, 38, 468, 506*imgRatio)
        ctx.drawImage(frame, 0, 0, frame.naturalWidth, 506*imgRatio + 182)
        
    } else {
        
        canvas.width = frame.naturalWidth
        canvas.height = frame.naturalHeight
        let ctx = canvas.getContext('2d')
        ctx.drawImage(previewImg, 19, 38, 468, 506*imgRatio)
        ctx.drawImage(frame, 0, 0)
    }

    save(canvas)
}

uploadBtn.addEventListener('click',()=>{fileInput.click()})
fileInput.addEventListener('change',loadImage)
generateBtn.addEventListener('click',() => {draw(frame)})
saveImgBtn.addEventListener('click', () => {drawImg(frame)})
