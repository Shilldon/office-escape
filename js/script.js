var roomData;
var itemData;
var inventory;



$(document).mousemove(function(e) {
    /*
    var x = e.pageX - $(".display-panel").offset().left;
    var y = e.pageY - $(".display-panel").offset().top;

    var displayWidth = $(".display-panel").width();
    var displayHeight = $(".display-panel").height();

    var xPercent = x/displayWidth*100;
    var yPercent = y/displayHeight*100;*/
    var currentRoom = $("body").attr("data");
    if(roomData[currentRoom].hasOwnProperty("click_option")) {
        if(roomData[currentRoom].click_option.active == true) {
            clickArea = roomData[currentRoom].click_option.area;
            var x = e.pageX - $(".display-panel").offset().left;
            var y = e.pageY - $(".display-panel").offset().top;
    
            var displayWidth = $(".display-panel").width();
            var displayHeight = $(".display-panel").height();
    
            var xPercent = x/displayWidth*100;
            var yPercent = y/displayHeight*100;
            if(confirmClick(xPercent, yPercent, clickArea)) {
                $('body').css('cursor', 'pointer');    
            }        
            else {
                $('body').css('cursor', 'default');
            }
        }
        else {
            $('body').css('cursor', 'default');
        }        
    }
   //console.log("xPercent "+xPercent+" yPercent "+yPercent)
});

$(document).ready(function() {
    var startingRoom = $("body").attr("data");
    roomData = localStorage.getItem("roomData");
    itemData = localStorage.getItem("itemData");
    inventory = JSON.parse(localStorage.getItem("inventory"));    
    if($.isEmptyObject(itemData)) {
        $.ajax({
            type: "get",    
            url: "assets/items/items.json",
            success: function(data) {
                localStorage.setItem("itemData", JSON.stringify(data));
                itemData = data;
                if(!$.isEmptyObject(inventory)) {
                    $.each(inventory, function(index, value) {
                        addItem(value);
                    })
                }                         
            }, 
            error: function (request, error) {
                console.log(arguments);
                alert(" Can't do because: " + error);
            }
        });     
    }
    else {
        itemData = JSON.parse(itemData);
        if(!$.isEmptyObject(inventory)) {
            $.each(inventory, function(index, value) {
                addItem(value);
            })
        }   
    }         
      
    if($.isEmptyObject(roomData)) {
        $.ajax({
            type: "get",    
            url: "assets/rooms/rooms.json",
            success: function(data){
                localStorage.setItem("roomData", JSON.stringify(data));
                roomData = data;
                moveToTarget(startingRoom);
            }, 
            error: function (request, error) {
                console.log(arguments);
                alert(" Can't do because: " + error);
            },
        });   
    }
    else {
        roomData = JSON.parse(roomData);
        moveToTarget(startingRoom);
    }

    var start = localStorage.getItem("timer");
    if(start == null) {
        start = new Date;
        localStorage.setItem("timer",start.toString());
    }
    else {
        start = Date.parse(start);
    }

    setInterval(function() {

        var now = new Date - start;
        var hours = Math.floor((now % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((now % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((now % (1000 * 60)) / 1000);        
        if(seconds<10) {
            seconds = "0"+seconds;
        }

        if(minutes<10) {
            minutes = "0"+minutes;
        }
        if(hours<10) {
            hours = "0"+hours;
        }
        $('.hours-ten').text(hours.toString()[0]);
        $('.hours-one').text(hours.toString()[1]);
        $('.minutes-ten').text(minutes.toString()[0]);
        $('.minutes-one').text(minutes.toString()[1]);
        $('.seconds-ten').text(seconds.toString()[0]);
        $('.seconds-one').text(seconds.toString()[1]);

    }, 1000);

})
/*
var box = $(".inventory-menu"), x;
$(".inventory-move").hover(function() {
    if ($(this).attr("data")=="right") {
        x = ((box.width() / 2)) + box.scrollLeft();
        box.animate({
          scrollLeft: x,
        })
      } else {
        x = ((box.width() / 2)) - box.scrollLeft();
        box.animate({
          scrollLeft: -x,
        })
    }
});    
*/

var box = $(".inventory-menu"), x;
$(".inventory-move").mouseover(function() {
    var itemContainerWidth = $(".item-container").width();
    var fullWidth = itemContainerWidth * $(".item-container").length;
    if ($(this).attr("data")=="right") {

        
        x = ((fullWidth / 2)) + box.scrollLeft();
        box.animate({
          scrollLeft: x,
        })
      } else {
        x = ((fullWidth / 2)) - box.scrollLeft();
        box.animate({
          scrollLeft: -x,
        })
    }
});

$(".pc-keycard-link").on("click", function() {
    moveToTarget("pc-activate-keycard")   
})

$(".display-panel").click(function(e){
    checkClick(e,$(this));
})

$(".move-button").click(function() {
    hideMagnifier();
    var currentRoom = $("body").attr("data");
    var direction = $(this).attr("id");
    var targetRoom = roomData[currentRoom].directions[direction];

    if(targetRoom!=undefined) 
        moveToTarget(targetRoom);
    
})

$("body").on("click", ".option-button", function() {
    hideMagnifier();
    var optionClicked = $(this).text();  
    var effects;
    var caller;
    if($(this).parent().hasClass("options")) {
        var currentRoom = $("body").attr("data"); 
        effects = roomData[currentRoom].options[optionClicked];
    }
    else if($(this).parent().hasClass("item-options")) {
        var item = $(this).attr("data-item");
        caller = item;
        effects = itemData[item].options[optionClicked];
    }    
    $(".magnified-item-image").css("display","none");    
    if(effects!=undefined)
    implementOption(effects, caller);
   
})

$(".reload").on("click", function() {
    localStorage.clear();
    location.reload();
})

$(".code-panel input").keypress(function(e) {
    console.log("tried")
    if(!$(this).hasClass("excel-password")) {
        if(e.which == 13) {
            tryCode($(this).attr("data-panel-id"));
        }
        else if ($(this).attr("data-wrong-guess")==1) {
            $(this).attr("data-wrong-guess",0);
            $(this).val("");      
        }
    }
})

$(".excel-password").keydown(function(e) {
    console.log(e.which)
    if((e.which == 13) || (e.which == 9)) {
        e.preventDefault(); 
        var valueInput = $(this).val();
        $(".excel-family-total").text(234+parseInt(valueInput));
        $(".excel-total").text("£   "+(6063+234+parseInt(valueInput)));
    }
})

$(".pc-logon-button").on("click", function() {
    tryCode($(this).attr("data-panel-id"));
})

$(".printer-logon-button").on("click", function() {
    tryCode($(this).attr("data-panel-id"));
})

$(".target-cover").on("click", function() {
    console.log("clicked");
    var coversClicked = $(".target-board-back").attr("data-covers-clicked");
    var clickedCover = $(this).attr("data-click-order");
    console.log("coversClicked "+coversClicked+1)
    console.log("clickedCover "+clickedCover)
    if(parseInt(clickedCover) == parseInt(coversClicked)+1) {
        $(this).css({"transform":"scale(0,0)"});     
        coversClicked=clickedCover;
        $(".target-board-back").attr("data-covers-clicked",coversClicked);  
        
    }
    else {
        $(this).css({"transform":"translate(15%,-10%)"});
        //$(this).css({"transform-origin":"top left","transform":"rotate(-15deg)"})
        var cover = $(this);
        setTimeout(function() {
             $(".target-cover").css({"transform":"translate(0,0) scale(1,1)"});        
        },750);
        $(".target-board-back").attr("data-covers-clicked",0);
    }
    if(coversClicked == 6) {        
        currentRoom = $("body").attr("data");
        console.log("current room "+currentRoom)
        console.log("data "+JSON.stringify(roomData[currentRoom]))
        roomData[currentRoom].options["Take torch"].active = true;
        moveToTarget(currentRoom);
    }

})

$(".puzzle-block").on("click", function() {
    var blockValue;
    if($(this).attr("data-position")=="up") {
        $(this).css("transform","translateY(100%)");
        $(this).attr("data-position","down");
        blockValue = 1;
    }
    else {
        $(this).css("transform","translateY(0%)");
        $(this).attr("data-position","up");   
        blockValue=0;     
    }
    var blockClasses = $(this).attr("class").split(" ");
    var blockClass = blockClasses[2];
    var blockNumber = blockClass.slice(blockClass.length-1);
    console.log("block number "+blockNumber)
    var passCode = $(".puzzle-box-locks").val();
    console.log("passcode before "+passCode)
    //console.log("passCode.substring(0,blockNumber-1) "+passCode.substring(0,blockNumber-1));
    passCode = passCode.substring(0,blockNumber-1)+blockValue+passCode.substring(blockNumber);
    $(".puzzle-box-locks").val(passCode);
    console.log("passCode "+passCode);
    tryCode("puzzle-box-locks")
})
/*
$(".code-panel button").on("click", function() {
    var panel = $(this).attr("data");
    var guess = $("#"+panel).val();
    var currentRoom = $("body").attr("data");
    if(submitCode(guess,panel)) {
        moveToTarget(roomData[currentRoom].code_panel.target)
    };
})*/

$(".magnify").on("click", function() {
    if($(".magnified-image").css("display") != "block") {
    $(".magnified-image").css("display","block");
        $(".magnify").addClass("d-none");
        $(".magnify").removeClass("d-flex");
        $(".close-magnify").removeClass("d-none");
        $(".close-magnify").addClass("d-flex");            
        magnify("room-image", 4);
    }
})

$(".magnify-item").on("click", function() {
    /*
    if($(".magnified-item-image").css("display") != "block") {
        $(".magnified-item-image").css("display","block");
        $(".magnify-item").addClass("d-none");
        $(".magnify-item").removeClass("d-flex");
        $(".close-magnify-item").removeClass("d-none");
        $(".close-magmagnify-itemnify").addClass("d-flex");                             
        magnifyItem("item-image", 4);
    }*/
    var item = $("body").attr("data-examined-item");
    var itemName = itemData[item].name;
    var imageName = itemData[item].image;
    $("#magnified-item-modal").modal('show');    
    $("#magnified-item-name").text(itemName);
    $("#magnified-item-image").attr("src","https://shilldon-escape.s3.eu-west-2.amazonaws.com/items/"+imageName+".jpg");
})

$(".close-magnify").on("click", function() {
    hideMagnifier();

})

$(".close-magnify-item").on("click", function() {
    hideMagnifier();
})

$(".toggle-options").click(function() {
    $([document.documentElement, document.body]).animate({
        scrollTop: $(".options-pane").offset().top
    }, 1000);
});

$(".examine-item").click(function() {
    if($(this).siblings().hasClass("filled")) {
        var item = $(this).siblings().attr("data-item");
        $("body").attr("data-examined-item",item);
        examineItem(item);
    }
})

$(".item").click(function() {
    var currentRoom = $("body").attr("data");
    var options = roomData[currentRoom].options;
    if($(this).hasClass("filled")) {
        var item = $(this).attr("data-item");
        if($(this).hasClass("item-selected")) {
            $(this).removeClass("item-selected");
            $("body").attr("data-item-selected",""); 
        }
        else {
            $(".item-selected").removeClass("item-selected");
            $(this).addClass("item-selected");
            $("body").attr("data-item-selected",item);       
        }
    }
    updateOptions(options);  
})

$(".phone-button").on("click", function(e) {
    var xPos = e.pageX - $(this).offset().left;
    var yPos = e.pageY - $(this).offset().top;
    var $press = $("<span class='keypress' style='transform: translate(-50%,-50%); top:"+yPos+"px; left: "+xPos+"px;'><span>").appendTo($(this));
    $press.fadeOut(250);
    setTimeout(function() {
        $press.remove();
    },250);
    var code = $(".phone-password").val();
    if($(this).attr("data-button") == "submit") {
        if($(".phone-submit").attr("data") == "active") {
            tryCode("phone-password");
            $(".phone-submit").attr("data","inactive");    
        }        
    }
    else {
        if($(this).attr("data-button") == "del")
        {
            if(code.length > 0) {
                code = code.slice(0,-1);    
           }
        }
        else if(code.length <= 5) {
            code = code.concat($(this).attr("data-button"));
        }
        $(".phone-password").val(code);
        if(code.length == 6) {
            $("#room-image").attr("src","https://shilldon-escape.s3.eu-west-2.amazonaws.com/rooms/phone_ok.jpg");
            $(".phone-submit").attr("data","active");
        }
        else {
            $("#room-image").attr("src","https://shilldon-escape.s3.eu-west-2.amazonaws.com/rooms/phone.jpg");
            $(".phone-submit").attr("data","");       
        }
    }

})

$(".briefcase").click(function(e){
    var lockLocations= {
        "left-lock": [
            [34,42],
            [45,53],
            [56,64],
            [4,26]
        ],
        "right-lock": [
            [37,44],
            [48,58],
            [59,68],
            [73,93]
        ],        
    }

    var lock = $(this).attr("class").split(/\s+/)[1];
    var currentNumber;
    var x = e.pageX - $(this).offset().left;
    var y = e.pageY - $(this).offset().top;

    var lockWidth = $(this).width();
    var lockHeight = $(this).height();

    var xPercent = x/lockWidth*100;
    var yPercent = y/lockHeight*100;

    if(yPercent < 50) {
        if(xPercent > lockLocations[lock][0][0] && xPercent <lockLocations[lock][0][1]) {
            currentNumber = $("."+lock+"-L").attr("data");
            changeBriefcaseDial(lock,"L","up",currentNumber);
        }
        else if(xPercent > lockLocations[lock][1][0] && xPercent <lockLocations[lock][1][1]) {
            currentNumber = $("."+lock+"-M").attr("data");
            changeBriefcaseDial(lock,"M","up",currentNumber);
        }
        else if(xPercent > lockLocations[lock][2][0] && xPercent <lockLocations[lock][2][1]) {
            currentNumber = $("."+lock+"-R").attr("data");
            changeBriefcaseDial(lock,"R","up",currentNumber);
        }     
    }
    else if(yPercent > 50) {
        if(xPercent > lockLocations[lock][0][0] && xPercent <lockLocations[lock][0][1]) {
            currentNumber = $("."+lock+"-L").attr("data");
            changeBriefcaseDial(lock,"L","down",currentNumber);
        }
        else if(xPercent > lockLocations[lock][1][0] && xPercent <lockLocations[lock][1][1]) {
            currentNumber = $("."+lock+"-M").attr("data");
            changeBriefcaseDial(lock,"M","down",currentNumber);
        }
        else if(xPercent > lockLocations[lock][2][0] && xPercent <lockLocations[lock][2][1]) {
            currentNumber = $("."+lock+"-R").attr("data");
            changeBriefcaseDial(lock,"R","down",currentNumber);
        }               
    }    
    if(xPercent > lockLocations[lock][3][0] && xPercent <lockLocations[lock][3][1]) {
        var combination = $("."+lock+"-L").attr("data").toString()+$("."+lock+"-M").attr("data").toString()+$("."+lock+"-R").attr("data").toString();
        tryLock(lock, combination);
    }      
}); 

function tryLock(lock,combination) {
    var currentRoom = $("body").attr("data");
    var fullCombination = roomData[currentRoom].code_panel.code[0];   
    var answer;
    if(lock == "left-lock") {
        answer=fullCombination.substring(0, fullCombination.length/2);
    }
    else {
        answer=fullCombination.substring(fullCombination.length/2,fullCombination.length);   
    }
    if(answer == combination) {
        $("."+lock+" img").first().attr("src","https://shilldon-escape.s3.eu-west-2.amazonaws.com/briefcase/"+lock+"-unlocked.png");    
        $("."+lock).attr("data-locked","unlocked");
    }
    if($(".right-lock").attr("data-locked")=="unlocked" && ($(".left-lock").attr("data-locked")=="unlocked" ))
    {
        setTimeout(function() {
            tryCode("briefcase-both-locks");
        },1500);    
    }
}

function changeBriefcaseDial(lock,location,change,currentNumber) {
    if(change == "up") {
        currentNumber++;
    }
    else {
        currentNumber--;
    }
    if(currentNumber>9) { currentNumber=0;} else if(currentNumber<0) {currentNumber=9;}
    $("."+lock+"-"+location).attr("src","https://shilldon-escape.s3.eu-west-2.amazonaws.com/briefcase/"+lock+"-"+location+currentNumber+".png");
    $("."+lock+"-"+location).attr("data",currentNumber);
    var combination = $(".left-lock-L").attr("data").toString()+$(".left-lock-M").attr("data").toString()+$(".left-lock-R").attr("data").toString();
    combination = combination +$(".right-lock-L").attr("data").toString()+$(".right-lock-M").attr("data").toString()+$(".right-lock-R").attr("data").toString();
    $(".briefcase-both-locks").val(combination);
}

function tryCode(codePanel) {
    var codePanels = $("."+codePanel);
    var guess = "";
    var pass=true;
    var currentRoom = $("body").attr("data");
    $.each(codePanels, function(index) {
        console.log(codePanel)
        console.log("inex "+index)
        guess = $("."+codePanel).eq(index).val();
        //var panel = codePanel;
        
        if(pass==false) {
            console.log("pass is "+pass)
            $("."+codePanel).eq(index).val('');
        }
        else if(!submitCode(guess,index)) {
            console.log("pass is "+pass)
            $("."+codePanel).eq(index).attr("data-wrong-guess",1); 
            if(roomData[currentRoom].code_panel.hasOwnProperty("error")) {
                $("."+codePanel).eq(index).val(roomData[currentRoom].code_panel.error[index]);
            }

            pass=false;
        }
        else {
            $("."+codePanel).eq(index).attr("data-wrong-guess",0);
        }
    });
    console.log("guess made "+guess+" pass is now "+pass)

    if(pass==true) {
        console.log("opened lock")
        console.log("current room "+currentRoom)
        console.log("target room from try lock "+roomData[currentRoom].code_panel.target)
        //remove items on successful code guess
        if(roomData[currentRoom].code_panel.hasOwnProperty("remove_item")) {
            removeItem(roomData[currentRoom].code_panel.remove_item);
            console.log("removed items")
        }
        if(roomData[currentRoom].code_panel.hasOwnProperty("replace_item")) {
            replaceItem(roomData[currentRoom].code_panel.replace_item);
        }
        if(roomData[currentRoom].code_panel.temporary_target != true) {
            roomData[currentRoom].code_panel.locked = false;
        }
        
        console.log("target room from try lock "+roomData[currentRoom].code_panel.target)
        moveToTarget(roomData[currentRoom].code_panel.target);
    }
    /*
    else {
        $.each(codePanels, function(index) { 
            $("."+codePanel).eq(index).attr("data-wrong-guess",1); 
            $("."+codePanel).eq(index).val(roomData[currentRoom].code_panel.error[index]);
        });        
 
    }    */
}

function submitCode(guess,index) {
    var currentRoom = $("body").attr("data");
    var answer = roomData[currentRoom].code_panel.code[index];
    var returnValue = false;
    console.log("guess "+guess+" answer "+answer)
    if(roomData[currentRoom].code_panel.hasOwnProperty("not_exact")) {
        $.each(roomData[currentRoom].code_panel.code, function(index,code){
            console.log("code "+code)
            if(guess.toLowerCase() == code.toLowerCase()) {
                
                console.log("correct! returning true");
                returnValue = true;
            }
        })
    }
    else if(guess === answer) {
        returnValue=true;
    }
    return returnValue;
}

function hideMagnifier() {
    $(".magnified-image").css("display","none");    
    $(".magnified-item-image").css("display","none");    

    $(".magnify-item").removeClass("d-none");
    $(".magnify-item").addClass("d-flex");
    $(".close-magnify-item").addClass("d-none");
    $(".close-magnify-item").removeClass("d-flex");    

    $(".magnify").removeClass("d-none");
    $(".magnify").addClass("d-flex");
    $(".close-magnify").addClass("d-none");
    $(".close-magnify").removeClass("d-flex");    

}

function moveToTarget(targetRoom) {
    console.log("target room "+targetRoom)
    if(targetRoom == "back") {
        targetRoom=$("body").attr("data-lastroom");
        $("body").attr("data-lastroom","");        
    }
    console.log("target room "+targetRoom)
    if(roomData[targetRoom].hasOwnProperty("stay_put")) {
        if(roomData[targetRoom].stay_put == true) {
            var lastRoom = $("body").attr("data-lastroom");
            if(lastRoom == "" || lastRoom == undefined) {
                $("body").attr("data-lastroom",$("body").attr("data"));
            }
        }
    }

    $("body").attr("data",targetRoom);    
    $(".options-pane").css("visibility","hidden");
    $(".toggle-options").hide();
    $(".toggle-options").parent().parent().removeClass("active");
    //var data = JSON.parse(localStorage.getItem("roomData"));
    var targetRoomData = roomData[targetRoom];
    showRoom(targetRoomData);
}

function showRoom(targetRoomData) {
    roomImage = targetRoomData.image;
    if(targetRoomData.hasOwnProperty("image_suffix")) {
        $.each(targetRoomData.image_suffix.images,function(index, image) {
            console.log(index+" "+image+" "+targetRoomData.image_suffix.active[index])
            if(targetRoomData.image_suffix.active[index]==true) {
                roomImage = roomImage+image;
            }
        })
    }
    if(targetRoomData.hasOwnProperty("click_option") || targetRoomData.hasOwnProperty("code_panel")) {
        $(".display-panel").css("pointer-events","all");
    }
    else {
        $(".display-panel").css("pointer-events","none");        
    }
    directions = targetRoomData.directions;
    options = targetRoomData.options;
    if(targetRoomData.hasOwnProperty("description")) {
        roomDescription = targetRoomData.description;
    }
    else {
        roomDescription="";
    }

    if(targetRoomData.hasOwnProperty("magnify")) {
        $(".magnify-icon").parent().parent().parent().addClass("active");
        $(".magnify-icon").show();
    }
    else {
        $(".magnify-icon").parent().parent().parent().parent().removeClass("active");
        $(".magnify-icon").hide();        
    }
    if(targetRoomData.image_format!=undefined){
        $("#room-image").attr("src","https://shilldon-escape.s3.eu-west-2.amazonaws.com/rooms/"+roomImage+"."+targetRoomData.image_format);            
    }
    else {
        $("#room-image").attr("src","https://shilldon-escape.s3.eu-west-2.amazonaws.com/rooms/"+roomImage+".jpg");
    }    

    //Hide all the move buttons
    $(".move-button i").css("visibility","hidden");
    $(".move-button").removeClass("active");
    //show the relevant move buttons for the room
    $.each(directions, function(direction, value) {
        $("#"+direction+" i").css("visibility","visible");
        $("#"+direction+" i").parent().addClass("active");
    });
    
    //update the room description
    $(".room-description").text(roomDescription);

    //hide all the code panels
    $(".code-panel").css("visibility","hidden");
    $(".code-panel").children().css("visibility","hidden");
    //show any relevant ones for the room
    if(!$.isEmptyObject(targetRoomData.code_panel)) {
        console.log("have a passcode panel")
        if(targetRoomData.code_panel.locked == true) {
            codePanel = targetRoomData.code_panel.name;
            $("."+codePanel).css("visibility","visible");
            $("."+codePanel).children().css("visibility","visible");
        }
        else if (targetRoomData.code_panel.temporary_target != true) {
            moveToTarget(targetRoomData.code_panel.target);
        }
    }

    if(!$.isEmptyObject(options)) {
        var toggleOptions = false;

        $.each(options, function(option, value) {
            if(value.active == true) {
                toggleOptions = true;
            }
        });
        if(toggleOptions == true) {
            $(".toggle-options").show();
            $(".toggle-options").parent().parent().addClass("active");
        }
        updateOptions(options);
    }
    if(targetRoomData.name == "end") {
        $(".end-panel").css("visibility","visible");
        $(".end-panel img").css("transform","scale(1,1)");  

        var i = 0;
        var txt = '..you got out of the office. Now you need to get out of the building!    To be continued...'; /* The text */
        var speed = 75; /* The speed/duration of the effect in milliseconds */
        setTimeout(
        function typeWriter() {
          if (i < txt.length) {
            document.getElementById("end-text").innerHTML += txt.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
          }
        },3000);

    }
}



function updateOptions(options) {
    $(".options-pane").css("visibility","hidden");
    var optionsTable=""; 
    var showOptionsPanel = false;

    /*for checking what items are in inventory and changing option values
    var inventory = JSON.parse(localStorage.getItem("inventory"));
    */
    $.each(options, function(option, value) {
        //code to check if items are or are not in inventory and then enable/disable a room option
        //no longer required - options are activated determined by whether item is selected
        /*
        if(!$.isEmptyObject(value.items_enable)) {
            value.active = true;
            $.each(value.items_enable, function(index, item){
                if($.inArray(item,inventory) < 0) {
                    value.active = false;   
                }
            });
        }
        else if(!$.isEmptyObject(value.items_disable)) {
            var itemCount = 0;
            value.active = true;
            $.each(value.items_disable, function(index, item){
                if($.inArray(item,inventory) > -1) {
                    itemCount++;  
                }  
            });           
            if(itemCount == value.items_disable.length) { value.active = false; }
        }           */
        /*just possessing the item will enable the option*/
        if(value.hasOwnProperty("items_enable")) {
    
            value.active = true;
            
            $.each(value.items_enable, function(index, item){
                if($.inArray(item,inventory) < 0) {
                    value.active = false;   
                }
            });            

        }
        /*having the item selected will enable the option */

        if(value.hasOwnProperty("selected_item")) {
            value.active = false;
            var selectedItem = $("body").attr("data-item-selected");
            if(selectedItem == value.selected_item) {
                value.active = true;
            }            
        }

        if((!value.hasOwnProperty("active_condition") && value.active == true) || (value.active_condition == undefined && value.active == true) || (value.active == true && value.active_condition == true)) {
            showOptionsPanel = true;
            optionsTable = optionsTable + "<button class='btn btn-lg btn-block option-button' tabindex='-1'>"+option+"</button>";
        }  
    })
    if(showOptionsPanel == true) {
        $(".options-pane").css("visibility","visible");
        $(".toggle-options").show();
        $(".toggle-options").parent().parent().addClass("active");
        $(".options").html(optionsTable);    
    }
    else {
        $(".options-pane").css("visibility","hidden");
        $(".toggle-options").hide();
        $(".toggle-options").parent().parent().removeClass("active");        
    }
    
}

function implementOption(effects, caller) {
    //console.log("caller "+caller+" effects "+JSON.stringify(effects))
    if(!$.isEmptyObject(effects.message)) {
        if(caller != undefined) {
            $(".message-title").text(itemData[caller].name);
        }
        else {
            $(".message-title").text("");            
        }
        $(".message p").text(effects.message);
        $("#message-modal").modal('show'); 
    }
    if(!$.isEmptyObject(effects.add_item)) {
        if($.isArray(effects.add_item)){
            $.each(effects.add_item, function(index, item) {
                addItem(item);
            })
        }
        else {
            addItem(effects.add_item);
        }
        
    }    
    if(!$.isEmptyObject(effects.remove_item)) {
        removeItem(effects.remove_item);
    }        
    if(!$.isEmptyObject(effects.replace_item)) {     
        //fade is removed from modal to enable the modal image to be seemlessly switched
        replaceItem(effects.replace_item);

    }        

    if(!$.isEmptyObject(effects.rooms_affected)) {
        $.each(effects.rooms_affected, function(room, value) {
            if(!$.isEmptyObject(value.click_option)) {
                $.each(value.click_option,function(click_option, click_setting){
                    //roomData[room].click_option = value.click_option;
                    roomData[room].click_option[click_option] = click_setting;   
                })
            }
            if(!$.isEmptyObject(value.image_format)) {
                roomData[room].image_format = value.image_format;
            }            
            if(!$.isEmptyObject(value.image)) {
                roomData[room].image = value.image;
            }
            if(!$.isEmptyObject(value.description)) {
                roomData[room].description = value.description;
            }            
            if(!$.isEmptyObject(value.options)) {
                $.each(value.options,function(option, option_keys){
                    $.each(option_keys,function(option_key, setting) {
                        //console.log("option "+option+"<br>option_key "+option_key+"<br>setting "+setting)
                        roomData[room].options[option][option_key] = setting;     
                    }) 
                })
            }
            if(!$.isEmptyObject(value.image_suffix)) {
                $.each(value.image_suffix.images,function(index, setting){
                        roomData[room].image_suffix.active[index] = setting;     
                })
            }            
            if(!$.isEmptyObject(value.directions)) {
                $.each(value.directions, function(direction, setting) {
                    if(setting != null) {
                        roomData[room].directions[direction] = setting;
                    }
                    else if(setting == null) {
                        delete roomData[room].directions[direction];    
                    }
                })
            }            
        })
        localStorage.setItem("roomData",JSON.stringify(roomData));                   
    }
    if(effects.hasOwnProperty("items_affected")) {
        $.each(effects.items_affected, function(item, value) {
            if(value.hasOwnProperty("image")) {
                if(value.image == "toggle-image") {
                    var currentImage = itemData[item].image;
                    var altImage = itemData[item].alt_image;
                    itemData[item].image = altImage;
                    itemData[item].alt_image = currentImage;
                }
                else {
                    itemData[item].image = value.image;
                }        
                var slot = $(".item[data-item='" + item +"']");
                slot.css("background-image","url(https://shilldon-escape.s3.eu-west-2.amazonaws.com//"+itemData[item].image+".jpg");                      
            }
            if(value.hasOwnProperty("change_image")) {
                itemData[item].image = value.change_image;  
                var slot = $(".item[data-item='" + item +"']");
                slot.css("background-image","url(https://shilldon-escape.s3.eu-west-2.amazonaws.com/"+itemData[item].image+".jpg");                       
            }
            if(value.hasOwnProperty("alt_image")) {
                itemData[item].alt_image = value.alt_image;    
            }
            if(!$.isEmptyObject(value.description)) {
                if(value.description == "toggle-description") {
                    var currentDescription = itemData[item].description;
                    var altDescription = itemData[item].alt_description;
                    itemData[item].description = altDescription;
                    itemData[item].alt_description = currentDescription;
                }
                else {
                    itemData[item].description = value.description;
                }                       
                $("#item-description").text(itemData[item].description);
            }            
            if(!$.isEmptyObject(value.options)) {
                $.each(value.options,function(option, setting){
                    if(setting.toggle == true) {
                        itemData[item].options[option].active = !itemData[item].options[option].active;    
                    }
                    else {
                        itemData[item].options[option].active = setting.active; 
                    }   
                    if(setting.hasOwnProperty("active_condition")) {
                        itemData[item].options[option].active_condition = setting.active_condition;    
                    }
                })
            }          
        })
        localStorage.setItem("itemData",JSON.stringify(itemData));       
    }

    /*if image to display is set then don't move room just display the image and update the options*/
    if(effects.image_to_display!=undefined) {
        if(effects.image_format!=undefined){
            $(".display-panel img").attr("src","https://shilldon-escape.s3.eu-west-2.amazonaws.com/rooms/"+effects.image_to_display+"."+effects.image_format);            
        }
        else {
            $(".display-panel img").attr("src","https://shilldon-escape.s3.eu-west-2.amazonaws.com/rooms/"+effects.image_to_display+".jpg");
        }

        currentRoom = $("body").attr("data");
        updateOptions(roomData[currentRoom].options);
    }         
    else if(!$.isEmptyObject(effects.go_to)) {
        if(caller!=null) {
            $('#item-modal').modal('hide');            
        }
        moveToTarget(effects.go_to);
    }
    else if(caller != null) {
        $(".item-display img").attr("src","https://shilldon-escape.s3.eu-west-2.amazonaws.com/items/"+itemData[caller].image+".jpg");
        //var slot = $(".item[data-item='" + caller +"']");
        //slot.css("background-image","url(../assets/images/"+itemData[caller].image+".png");
        currentRoom = $("body").attr("data");
        updateOptions(roomData[currentRoom].options);
        updateItemOptions(itemData[caller].options, caller);
    }
    else {   
        currentRoom = $("body").attr("data");
        showRoom(roomData[currentRoom]);
    }
}

function replaceItem(items) {
    $("#item-modal").removeClass("fade");   
    var examinedItem = $("body").attr("data-examined-item");
    if(examinedItem == items[0]) {
        $("body").attr("data-examined-item",items[1]);
    }    
    removeItem(items[0]);
    addItem(items[1]);
    var oldItem = items[0];
    var newItemName = items[1];

    if($("#item-name").text() == itemData[oldItem].name) {
        //delay is needed because otherwise image does no update.
        //cannot determine while.
        setTimeout(function() {                
            examineItem(newItemName);
            $("#item-modal").addClass("fade");
        },0)
    }

}

function addItem(item) {
    var slot = $('.item').not('.filled').first();
    console.log(item)
    slot.attr("data-item",item);
    slot.css("background-image","url(https://shilldon-escape.s3.eu-west-2.amazonaws.com/items/"+itemData[item].image+".jpg");
    slot.addClass("filled");
    if(inventory == null) {
        inventory = [];
    }
    if($.inArray(item, inventory) == -1) {
        inventory.push(item);
    }
    localStorage.setItem("inventory",JSON.stringify(inventory));
}

function removeItem(items) {
    if($.isArray(items)) {
        console.log("is an array")
        $.each(items, function(index,item) {
            removeFromInventory(item);
        })
    }
    else {
        item=items;
        removeFromInventory(item);   
    }
    localStorage.setItem("inventory",JSON.stringify(inventory));
}    

function removeFromInventory(item) {
    console.log("removing "+item)
    var slot = $(".item[data-item='" + item +"']");
    slot.attr("data-item","");
    slot.css("background-image","none");
    slot.removeClass("filled");
    slot.removeClass("item-selected");
    $("body").attr("data-item-selected","");
    var examinedItem = $("body").attr("data-examined-item");
    if(examinedItem == item) {
        $('#item-modal').modal('hide');
        $("body").attr("data-examined-item","");
    }
    console.log("inventory before "+inventory)
    if(inventory != null) {
        inventory = $.grep(inventory, function(value) {
            console.log("looking for "+item)
            return value != item;
        });
    }
    console.log("inventory is now "+inventory)

}

function examineItem(item) {
    var itemImage = "https://shilldon-escape.s3.eu-west-2.amazonaws.com/items/"+itemData[item].image+".jpg";
    $("#item-name").text(itemData[item].name);
    $("#item-description").text("");
    $("#item-description").text(itemData[item].description);
    $("#item-image").attr("src",itemImage);  
    $(".item-options-pane").css("visibility","hidden");
    if(itemData[item].hasOwnProperty("options")) {
        var itemOptions = itemData[item].options;     
        updateItemOptions(itemOptions, item);    
    }
    $('#item-modal').modal('show');    
}    
       
function updateItemOptions(options, item) {
    var optionsTable=""; 
    $.each(options, function(option, value) {
        if(value.hasOwnProperty("selected_item")) {
            value.active = false;
            var selectedItem = $("body").attr("data-item-selected");
            if(selectedItem == value.selected_item) {
                value.active = true;
            }            
        }

        if(value.hasOwnProperty("items_enable")) {
            value.active = true;
            $.each(value.items_enable, function(index, item){
                if($.inArray(item,inventory) < 0) {
                    value.active = false;   
                }
            });
        }
        if((!value.hasOwnProperty("active_condition") && value.active == true) || (value.active == true && value.active_condition == true)) {
            $(".item-options-pane").css("visibility","visible");
            optionsTable = optionsTable + "<button data-item="+item+" class='btn btn-lg btn-block option-button'>"+option+"</button>";
        }  
    })
    $(".item-options").html(optionsTable);    
}

function checkClick(e,displayArea) {
    var currentRoom = $("body").attr("data");
    var clickArea;
    
    if(roomData[currentRoom].hasOwnProperty("click_option")) {
        clickArea = roomData[currentRoom].click_option.area;
        var x = e.pageX - displayArea.offset().left;
        var y = e.pageY - displayArea.offset().top;

        var displayWidth = displayArea.width();
        var displayHeight = displayArea.height();

        var xPercent = x/displayWidth*100;
        var yPercent = y/displayHeight*100;

        var effects = roomData[currentRoom].click_option;
        if(effects.active == true) {    
            if(confirmClick(xPercent, yPercent, clickArea)) {
                hideMagnifier();
                implementOption(effects);
                /*
                if(!$.isEmptyObject(effects.add_item)) {
                    addItem(effects.add_item);
                }                     
                if(!$.isEmptyObject(effects.rooms_affected)) {
                    $.each(effects.rooms_affected, function(room, value) {                       
                        if(!$.isEmptyObject(value.image)) {
                            roomData[room].image = value.image;
                        }
                        if(!$.isEmptyObject(value.description)) {
                            updateDescription(room,value);
                        }            
                        if(!$.isEmptyObject(value.options)) {
                            $.each(value.options,function(option, setting){
                                roomData[room].options[option].active = setting.active;    
                                roomData[room].options[option].active_condition = setting.active_condition;    
                            })
                            updateOptions(value.options);
                        }
                        if(!$.isEmptyObject(value.directions)) {
                            $.each(value.directions, function(direction, setting) {
                                if(setting != null) {
                                    roomData[room].directions[direction] = setting;
                                }
                                else if(setting == null) {
                                    delete roomData[room].directions[direction];    
                                }
                            })
                        }            
                    })
                    localStorage.setItem("roomData",JSON.stringify(roomData));                   
                }*/
            }
        }
    }
}

function confirmClick(xPercent, yPercent, clickArea) {
    if( (xPercent > clickArea[0][0] && yPercent > clickArea[0][1]) &&
    (xPercent < clickArea[1][0] && yPercent > clickArea[1][1]) &&
    (xPercent > clickArea[2][0] && yPercent < clickArea[2][1]) &&
    (xPercent < clickArea[3][0] && yPercent < clickArea[3][1])) 
    {
        $('body').css('cursor', 'default');        
        return true;
    } else {
        return false;
    }
}


function updateDescription(room,value) {
    roomData[room].description = value.description;
    currentRoom = $("body").attr("data");
    if(currentRoom==room) {
        $(".room-description").text(value.description);
        $([document.documentElement, document.body]).animate({
            scrollTop: $(".options-pane").offset().top
        }, 1000);        
    }
}