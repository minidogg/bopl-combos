const fs = require("fs")
const path = require("path")
function main(){
    const template =  {
        "name":"beam",
        "img": "img/abilities/beam.png",
        "helps": [],
        "counters": [],
        "types": [
            "none"
        ]
    }

    var abilities = {}
    const imgPath = path.resolve("./app/img/abilities/")
    fs.readdirSync(imgPath).forEach(img=>{
        console.log(img)

        let newAbil = template
        newAbil.img = path.join(imgPath,img)
        newAbil.name = /^(.+)?\..*$/.exec(img)[1]
        abilities[newAbil.name] = newAbil

        console.log(newAbil)
        
    })


    let jsonString = JSON.stringify(abilities, null, "    ")
    fs.writeFileSync(path.resolve("./ability.json"),jsonString,"utf-8")

    console.log("Done generating ability.json")
}
// main()