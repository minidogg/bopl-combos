(async() => {
    start = ""
    try{
        start = await fetch('/api/lastBuild')
        if(start.status!==200)throw new Error("Failed to get build time from API. Didn't get status code 200.")
        start = await start.text()

        setInterval(async() => {
            let t = await(await fetch('./api/lastBuild')).text()
            if(t != start)window.location.reload()
        },200)
    }catch(err){
        console.warn(err+" Taking assumption that the website is being hosted statically.")
        return
    }

})()