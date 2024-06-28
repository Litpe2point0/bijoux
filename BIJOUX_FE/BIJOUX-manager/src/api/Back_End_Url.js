export const backend_url= process.env.REACT_APP_BACKEND_URL
export const image_url= process.env.REACT_APP_BACKEND_IMAGE_URL

export const get_diamond_imageUrl=(color, clarity)=>{
    return image_url+"/Diamond/"+color+"_"+clarity+"/main.jpg"
}