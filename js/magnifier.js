function magnify(imgID, zoom) {
    console.log("called")
    var img, glass, w, h, bw;
    img = document.getElementById(imgID);
  
    /* Create magnifier glass: */
    var imageTop = $(".display-panel").position().top;
    var imageLeft = $(".display-panel").position().left;  
    console.log("top "+imageTop+" left "+imageLeft)  
    $(".img-magnifier-container").css({
        "position": "absolute",
        "top":imageTop+"px",
        "left":imageLeft+"px",
    })
    $(".magnified-image").css({
        "background-image":"url('"+img.src+"')",
        "background-repeat":"no-repeat",
        "background-size":(img.width*zoom)+"px "+(img.height*zoom)+"px",
        "border": "solid black 2px",
        "border-radius": "50%"
    });

    var imageTop = $(".display-panel").offset().top;
    var imageLeft = $(".display-panel").offset().left;
    var imageBottom = $(".display-panel").height();
    var imageRight = $(".display-panel").width();
    var magnifierWidth = $(".magnified-image").width()/2;
    var magnifierHeight = $(".magnified-image").height()/2;
    //console.log("image bottom and right "+magnifierWidth+" "+magnifierHeight)

    $(document).mousemove(function(event) {
        var currentMousePos = { x: -1, y: -1 };
        currentMousePos.x = event.pageX;
        currentMousePos.y = event.pageY;
        var xPos = currentMousePos.x-imageLeft;
        var yPos = currentMousePos.y-imageTop;
        if(xPos<magnifierWidth/zoom) { xPos = magnifierWidth/zoom; }
        if(yPos<magnifierHeight/zoom) { yPos = magnifierHeight/zoom; }
        if(xPos>imageRight-(magnifierWidth/zoom)) { xPos = imageRight-(magnifierWidth/zoom); }
        if(yPos>imageBottom-(magnifierHeight/zoom)) { yPos = imageBottom-(magnifierHeight/zoom); }
        $(".magnified-image").css("top",yPos-magnifierHeight);
        $(".magnified-image").css("left",xPos-magnifierWidth);

        var backgroundLeft = (xPos*zoom)-magnifierWidth;
        var backgroundTop = (yPos*zoom)-magnifierHeight;

        $(".magnified-image").css("background-position","-"+backgroundLeft+"px -"+backgroundTop+"px")
    });    
}

function magnifyItem(imgID, zoom, item) {
    console.log("called")
    var img, glass, w, h, bw;
    img = document.getElementById(imgID);
  
    /* Create magnifier glass: */
    var imageTop = $(".item-display").position().top;
    var imageLeft = $(".item-display").position().left;  
    console.log("top "+imageTop+" left "+imageLeft)  
    $(".img-magnifier-container-item").css({
        "position": "absolute",
        "top":imageTop+"px",
        "left":imageLeft+"px",
    })
    $(".magnified-item-image").css({
        "background-image":"url('"+img.src+"')",
        "background-repeat":"no-repeat",
        "background-size":(img.width*zoom)+"px "+(img.height*zoom)+"px",
        "border": "solid black 2px",
        "border-radius": "50%"
    });

    var imageTop = $(".item-display").offset().top;
    var imageLeft = $(".item-display").offset().left;
    var imageBottom = $(".item-display").height();
    var imageRight = $(".item-display").width();
    var magnifierWidth = $(".magnified-item-image").width()/2;
    var magnifierHeight = $(".magnified-item-image").height()/2;
    //console.log("image bottom and right "+magnifierWidth+" "+magnifierHeight)

    $(document).mousemove(function(event) {
        var currentMousePos = { x: -1, y: -1 };
        currentMousePos.x = event.pageX;
        currentMousePos.y = event.pageY;
        var xPos = currentMousePos.x-imageLeft;
        var yPos = currentMousePos.y-imageTop;
        if(xPos<magnifierWidth/zoom) { xPos = magnifierWidth/zoom; }
        if(yPos<magnifierHeight/zoom) { yPos = magnifierHeight/zoom; }
        if(xPos>imageRight-(magnifierWidth/zoom)) { xPos = imageRight-(magnifierWidth/zoom); }
        if(yPos>imageBottom-(magnifierHeight/zoom)) { yPos = imageBottom-(magnifierHeight/zoom); }
        $(".magnified-item-image").css("top",yPos-magnifierHeight);
        $(".magnified-item-image").css("left",xPos-magnifierWidth);

        var backgroundLeft = (xPos*zoom)-magnifierWidth;
        var backgroundTop = (yPos*zoom)-magnifierHeight;

        $(".magnified-item-image").css("background-position","-"+backgroundLeft+"px -"+backgroundTop+"px")
    });    
}