const exclude = document.getElementById("exclude")
const search = document.getElementById("search")
const combos = Array.from(document.querySelector(".container").children)


setInterval(()=>{
    let excludeArray =
     exclude.value.split(",")
    let makeVisible = false
    if(exclude.value=="")makeVisible = true
    combos.forEach(e=>{
        e.style.display = "flex"
        if(makeVisible==true)return;
        excludeArray.forEach(a=>{
            Array.from(e.querySelectorAll("img")).forEach(b=>{
                if(b.alt.toLowerCase().includes(a.toLowerCase()))e.style.display="none"
            })
        })
    })

    makeVisible = false
    let searchArray = search.value.split(",")
    if(search.value=="")makeVisible = true
    if(makeVisible==false){
        combos.forEach(e=>{
            searchArray.forEach(a=>{
                let show = true
                Array.from(e.querySelectorAll("img")).forEach(b=>{
                    if(b.alt.toLowerCase().includes(a.toLowerCase()))show = false
                })
                if(show==true)e.style.display="none"
            })
        })
    }


    let visible = combos.filter(e=>e.style.display=="flex").length
    document.getElementById("visibleCount").textContent = "Shown Combos: "+visible
},500)
