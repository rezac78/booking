let hearts = document.querySelectorAll(".fa-heart")

hearts.forEach(heart=>{
    heart.addEventListener("click",()=>{
        if(heart.className==="far fa-heart"){
            heart.setAttribute("class","fas fa-heart")
            heart.style.color="red"
        }else{
            heart.setAttribute("class","far fa-heart")
            heart.style.color="green"
        }

    })
})
