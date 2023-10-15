const fileInput = document.querySelector('#file_input'),
uploadBtn = document.querySelector('#upload_image'),
previewImg = document.querySelector('.preview-img img'),
generateBtn = document.querySelector('#generate_btn'),
frame_1 = document.querySelector('#frame_1'),
saveImgBtn = document.querySelector('#save_img')

previewImg.width = 220
previewImg.height = 277




const loadImage = () => {
    console.log('load image')
    let file = fileInput.files[0]
    if(!file) return
    previewImg.src = URL.createObjectURL(file)
}

const draw = () => {
    console.log('draw')
    let canvas = document.getElementById("img_canvas")
    canvas.width = frame_1.naturalWidth
    canvas.height = frame_1.naturalHeight
    let imgRatio = previewImg.naturalHeight / previewImg.naturalWidth
    let ctx = canvas.getContext('2d')
    ctx.drawImage(previewImg, 19, 38, 468, 506*imgRatio)
    if(506*imgRatio < 620) {
        ctx.drawImage(frame_1, 0, 0, frame_1.naturalWidth, 506*imgRatio + 182)
    } else {
        ctx.drawImage(frame_1, 0, 0)
    }
    
}

const saveImg = () => {
    console.log('save image')
    

    let imgRatio = previewImg.naturalHeight / previewImg.naturalWidth
    let canvas = document.createElement("canvas")
    
    if(506*imgRatio < 620) {
        
        canvas.width = frame_1.naturalWidth
        canvas.height = 506*imgRatio + 182
        let ctx = canvas.getContext('2d')
        ctx.fillStyle = "#fff"
        ctx.fillRect(0,0,506,506*imgRatio + 182)
        ctx.drawImage(previewImg, 19, 38, 468, 506*imgRatio)
        ctx.drawImage(frame_1, 0, 0, frame_1.naturalWidth, 506*imgRatio + 182)
        
    } else {
        
        canvas.width = frame_1.naturalWidth
        canvas.height = frame_1.naturalHeight
        let ctx = canvas.getContext('2d')
        ctx.drawImage(previewImg, 19, 38, 468, 506*imgRatio)
        ctx.drawImage(frame_1, 0, 0)
    }

    const link = document.createElement("a")
    link.download = "image.jpg"
    link.href = canvas.toDataURL()
    link.click()
}

uploadBtn.addEventListener('click',()=>{fileInput.click()})
fileInput.addEventListener('change',loadImage)
generateBtn.addEventListener('click',draw)
saveImgBtn.addEventListener('click', saveImg)
