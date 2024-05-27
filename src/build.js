const fs = require("fs")
const path = require("path")

const generatedPath = path.resolve("./generated")
const appPath = path.resolve("./app")

module.exports.buildSite = ()=>{
    console.log("building website")
    if(fs.existsSync(generatedPath))fs.rmSync(generatedPath,{recursive:true})
    fs.cpSync(appPath, generatedPath, {recursive: true});
    let res = buildHtml()
    let indexHtml = fs.readFileSync(path.join(generatedPath,"/index.html"),"utf-8")
    indexHtml = indexHtml.replace("%combos%",res)
    fs.writeFileSync(path.join(generatedPath,"/index.html"),indexHtml,"utf-8")

    console.log("done building website")
}

const buildHtml = ()=>{
    let combos = buildArray(JSON.parse(fs.readFileSync("./ability.json")))
    combos = combos.map(combo=>{
        return `
        <div class="combo">
            <img src="/img/abilities/${combo[0]}.png" alt="${combo[0]}" class="ability">
            <img src="/img/abilities/${combo[1]}.png" alt="${combo[1]}" class="ability">
            <img src="/img/abilities/${combo[2]}.png" alt="${combo[2]}" class="ability">
            <span class="score">Score: ${combo[3]}</span>
        </div>
        `
    })

    return combos.join("\n")
}

const buildArray = (abils)=>{
    const possibleCombos = Object.keys(abils).length**3
    console.log("generating "+possibleCombos+" possible combos and rating them")

    let combos = []
    for(let aa = 0;aa<Object.keys(abils).length;aa++){
        for(let bb = 0;bb<Object.keys(abils).length;bb++){
            for(let cc = 0;cc<Object.keys(abils).length;cc++){
                let score = 0;
                let a = Object.keys(abils)[aa]
                let b = Object.keys(abils)[bb]
                let c = Object.keys(abils)[cc]
                let types = abils[a].types.concat(abils[b].types).concat(abils[c].types)
                if(types.includes("movement"))score+=1
                if(types.includes("defensive"))score+=1
                if(types.includes("offensive"))score+=1
                if(types.includes("timestop"))score+=1


                combos.push([a,b,c,score])
            }
        }
    }
    combos.sort((a,b)=>a[3]-b[3]).reverse()

    console.log("done generating "+possibleCombos+" possible combos and rating them")

    return combos
}