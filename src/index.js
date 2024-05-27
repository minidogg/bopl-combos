const build = require("./build.js")

const path = require("path")
const fs = require('fs')
const express = require('express')

const app = express()
const port = 3000

const generatedPath = path.resolve("./generated")

let buildTime = "building"
app.get("/api/lastBuild",(req,res)=>{
  res.status(200)
  res.send(buildTime)
})

build.buildSite()
buildTime = Date.now().toString()


app.use(express.static(path.resolve("./generated")))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})