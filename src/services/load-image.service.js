
export const loadImage = url => new Promise(resolve=>{
    const img = new Image();
    img.onload = () => {
        setTimeout(()=>{
            resolve();
        },500);
    }
    img.src = url;
});
