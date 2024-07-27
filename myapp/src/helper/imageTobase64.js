const imageTobase64 = async(image) =>{
    const reader = new FileReader()
    reader.readAsDataURL(image)

    const data = await new Promise((resolve,reject)=>{
        reader.onload = () => resolve(reader.result)

        reader.onerror = error => reject(error)
    })

    return data

}

export default imageTobase64

// export default function convertToBase64(file){
//     return new Promise((resolve, reject) => {
//         const fileReader = new FileReader(); 
//         fileReader.readAsDataURL(file);

//         fileReader.onload = () => {
//             resolve(fileReader.result)
//         }

//          fileReader.onerror = (error) => {
//             reject(error)
//         }
//     })
// }