const fs = require("fs")
const path = require("path")

const generatedPath = path.resolve("./generated")
const appPath = path.resolve("./app")

module.exports.buildSite = ()=>{
    console.log("building website")
    if(fs.existsSync(generatedPath))fs.rmSync(generatedPath,{recursive:true})
    fs.cpSync(appPath, generatedPath, {recursive: true});

    let cache = JSON.parse(fs.readFileSync("./cached.json","utf-8"))
    let res = ["",{}]
    res = buildHtml()
    fs.writeFileSync("./cached.json",JSON.stringify(res))

    let indexHtml = fs.readFileSync(path.join(generatedPath,"/index.html"),"utf-8")
    indexHtml = indexHtml.replace("%combos%",res[0])
    fs.writeFileSync(path.join(generatedPath,"/index.html"),indexHtml,"utf-8")

    console.log("done building website")
}

const buildHtml = ()=>{
    let combos = buildArray(JSON.parse(fs.readFileSync("./ability.json")))
    let combosNew = combos.map(combo=>{
        return `
        <div class="combo">
            <img src="/img/abilities/${combo[0]}.png" alt="${combo[0]}" class="ability">
            <img src="/img/abilities/${combo[1]}.png" alt="${combo[1]}" class="ability">
            <img src="/img/abilities/${combo[2]}.png" alt="${combo[2]}" class="ability">
            <span class="score">Score: ${combo[3]}</span>
        </div>
        `
    })

    return [combosNew.join(""),combos]
}

var crypto = require('crypto');
function hash(text){
    return crypto.createHash('md5').update(text).digest('hex');
}

function searchForArray(haystack, needle){
    var i, j, current;
    for(i = 0; i < haystack.length; ++i){
      if(needle.length === haystack[i].length){
        current = haystack[i];
        for(j = 0; j < needle.length && needle[j] === current[j]; ++j);
        if(j === needle.length)
          return i;
      }
    }
    return -1;
  }
const removeExtraDecimals = (num,decimal)=>{
    return parseFloat(num).toPrecision(Math.round(num).toString().length + decimal);
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
                if(a==b||a==c)score-=1.5
                if(b==c)score-=1.5


                let types = abils[a].types.concat(abils[b].types).concat(abils[c].types)
                if(types.includes("movement"))score+=1
                if(types.includes("defensive"))score+=1
                if(types.includes("offensive"))score+=1

                if(abils[a].helps.includes(b) || abils[a].helps.includes(c))score+=1
                if(abils[b].helps.includes(a) || abils[b].helps.includes(c))score+=1
                if(abils[c].helps.includes(b) || abils[c].helps.includes(a))score+=1

                if(abils[a].counters.includes(b) || abils[a].counters.includes(c))score-=1
                if(abils[b].counters.includes(a) || abils[b].counters.includes(c))score-=1
                if(abils[c].counters.includes(b) || abils[c].counters.includes(a))score-=1

                if(typeof(abils[a].score)!="undefined")score+=abils[a].score
                if(typeof(abils[b].score)!="undefined")score+=abils[b].score
                if(typeof(abils[c].score)!="undefined")score+=abils[c].score


                let final = [a,b,c].sort()
                final.push(removeExtraDecimals(score,1))
                if(searchForArray(combos,final)==-1)combos.push(final)
            }
        }
    }
    combos.sort((a,b)=>a[3]-b[3]).reverse()

    console.log("done generating "+combos.length+" possible combos and rating them")

    return combos
}