const path = require("path")
const fs = require('fs')
const express = require('express')

const app = express()
const port = 3000

const generatedPath = path.resolve("./generated")
const appPath = path.resolve("./app")

const buildTime = Date.now().toString()
app.get("/api/lastBuild",(req,res)=>{
    res.status(200)
    res.send(buildTime)
})

console.log("building website")
if(fs.existsSync(generatedPath))fs.rmSync(generatedPath,{recursive:true})
fs.cpSync(appPath, generatedPath, {recursive: true});
console.log("done building website")

app.use(express.static(path.resolve("./generated")))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})