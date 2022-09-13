/*----------------------------------------*/
/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
//使用者按下了上排的按鈕，代表程式需要切換輸入模式（文字/畫筆/橡皮擦/三種形狀），或執行特定行為（清空/上一步下一步/下上載）
//按下按鈕以後，需要切換在canvas時的鼠標
var InputType = ["Pencil"/* 0 */, "Eraser"/* 1 */, "Text"/* 2 */, "Tri"/* 3 */, "Rect"/* 4 */, "Circ"/* 5 */],
    curInputType = 0,//預設為Pencil
    prevInputType = -1;//因為還沒有prev，所以預設為-1
/*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
/*----------------------------------------*/



/*----------------------------------------*/
/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
//因為牽扯到一些html的順序問題，所以要等瀏覽器把html全部讀完之後才能做相關的抓取。所以真正的初始化放在Init()，這裡只是宣告而已
var CanvObj, ctx,
    mouseX, mouseY,
    mousedown;
/*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
/*----------------------------------------*/



/*----------------------------------------*/
/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
//因為牽扯到一些html的順序問題，所以要等瀏覽器把html全部讀完之後才能做canvas相關的抓取。所以真正的初始化放在Init()，這裡只是宣告而已
var ColourObj, ColourValue;
var FontObj, FontValue;
var SizeObj, SizeValue;
var FillObj, FillValue;
/*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
/*----------------------------------------*/



/*----------------------------------------*/
/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
//儲存原始的Canvas樣貌用，在Clear功能會用到
var NakedCanvas;
//儲存目前顯示幀的「之前」以及「之後」的所有幀，也就是要記錄每一個步驟的足跡。不採取類似IPB的相近比對方法，而是每一步驟會出現的每個筆畫都記錄起來，這樣比較簡單。
//使用stack（a.k.a. array）
//給undo、redo使用
var prevFrames/*如果要undo，用這個*/, succFrames/*如果要redo，用這個*/;
/*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
/*----------------------------------------*/



/*----------------------------------------*/
/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
//Pencil、Eraser用
var prevMouseX, prevMouseY;
/*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
/*----------------------------------------*/



/*----------------------------------------*/
/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
//TextBox用
var TB, TB_flag_removed, TB_x, TB_y, UserInputTxt;
/*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
/*----------------------------------------*/



/*----------------------------------------*/
/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
//三種形狀用
var bufferCanvas, clickedPos_x, clickedPos_y;
/*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
/*----------------------------------------*/


function Stationery_clicked(ID){
    console.log(ID + " button clicked");

    //記錄起來原本的InputType，新舊比較，如果確定不同，就更改Icon，並且把curInputType相應改變。
    const isStrSame = (element) =>element == ID;
    if (prevInputType == InputType.findIndex(isStrSame)) return;
    var prevInputType = curInputType;
    switch (ID) {
        case "Pencil": 
        case "Eraser":
        case "Text":
        case "Tri":
        case "Rect":
        case "Circ":
            curInputType = InputType.findIndex(isStrSame);
            IconFile_str = ID + "Icon.png";
            console.log("Stationery ID changed from " + prevInputType + " to " + curInputType);
            break;
        default:
            //測試時使用，因為目前cur檔案都還壞掉中
            //IconFile_str = "Arrow.cur"//測試完畢，所以這個不再需要了
            break;
    }
    var IconFilePath = "./src/CursorIcon/" + IconFile_str;
    var CompleteIconFilePath = "url('" + IconFilePath + "'), auto";
    document.getElementsByTagName("canvas")[0].style.cursor = CompleteIconFilePath;

    //把原本的Stationery取消highlight顯示，並且把新的Stationery設定成highlight顯示。
    CancelHighlight(prevInputType);
    MakeHighlight(curInputType);
}
function CancelHighlight(prevInputType) {
    if (prevInputType == -1) return;//prev為-1，代表是程式正在初始化當中，所以不用cancel

    var targetCSS = document.getElementById(InputType[prevInputType]).style;
    targetCSS.backgroundColor = "whitesmoke";
}
function MakeHighlight(curInputType) {
    var targetCSS = document.getElementById(InputType[curInputType]).style;
    targetCSS.backgroundColor = "gray";
}



window.onload = function() {
    Init();
}


function Init() {
    /*----------------------------------------*/
    /*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
    Stationery_clicked("Pencil");
    /*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
    /*----------------------------------------*/



    /*----------------------------------------*/
    /*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
    CanvObj = document.querySelector("canvas");
    ctx = CanvObj.getContext('2d');
    ctx.canvas.width  = window.innerWidth * 0.88;
    ctx.canvas.height = window.innerHeight * 0.73;
    mouseX = 0; mouseY = 0;
    mousedown = false;

    // get the mouse position on the canvas (some browser trickery involved)
    CanvObj.addEventListener('mousemove', event => {
            if (event.offsetX) {
                mouseX = event.offsetX;
                mouseY = event.offsetY;
                if (curInputType == 0 || curInputType == 2) mouseY += 20;//如果是畫筆、橡皮擦、文字，因為是從畫筆處開始畫（左下角），但是電腦計算是從圖片的左上角開始算，所以要平移20
                else if (curInputType == 3 || curInputType == 5) mouseX += 10;//同理於上一行的備註
            }

            if (curInputType == 0 || curInputType == 1) DrawAndWipe(curInputType, event.offsetX, event.offsetY);
            else if (curInputType == 3) makingTri(event.offsetX, event.offsetY);
            else if (curInputType == 4) makingRect(event.offsetX, event.offsetY);
            else if (curInputType == 5) makingCirc(event.offsetX, event.offsetY);
        }, 
        false 
    );
    CanvObj.addEventListener('mousedown', event => {
            mousedown = true;

            record_cur_frame();
            prevMouseX = event.offsetX;
            prevMouseY = event.offsetY;

            if (curInputType == 2/*Text*/) NewingTextBox(event);
            else if (curInputType == 3 || curInputType == 4 || curInputType == 5) {
                bufferCanvas = ctx.getImageData(0, 0, CanvObj.width, CanvObj.height);
                clickedPos_x = event.offsetX;
                clickedPos_y = event.offsetY;
            }
            
        }, 
        false 
    );
    CanvObj.addEventListener('mouseup', event => {
            mousedown = false;
        }, 
        false 
    );
    /*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
    /*----------------------------------------*/



    /*----------------------------------------*/
    /*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
    ColourObj = document.getElementById("colour");
    ColourValue = ColourObj.value;
    ColourObj.addEventListener('change', event => {
            var prevColour = ColourValue;
            
            ColourValue = ColourObj.value;
            console.log("Colour changed from " + prevColour + " to " + ColourValue);
        }, 
        false 
    );
    /*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
    /*----------------------------------------*/



    /*----------------------------------------*/
    /*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
    FontObj = document.getElementById("font");
    FontValue = FontObj.value;
    FontObj.addEventListener('change', event => {
            var prevFont = FontValue;

            FontValue = FontObj.value;
            console.log("Font changed from " + prevFont + " to " + FontValue);
        }, 
        false 
    );
    /*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
    /*----------------------------------------*/



    /*----------------------------------------*/
    /*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
    SizeObj = document.getElementById("size");
    SizeValue = SizeObj.value;
    SizeObj.addEventListener('change', event => {
            var prevSize = SizeValue;

            SizeValue = SizeObj.value;
            console.log("Size changed from " + prevSize + " to " + SizeValue);
        }, 
        false 
    );
    /*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
    /*----------------------------------------*/



    /*----------------------------------------*/
    /*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
    FillObj = document.getElementById("fillShape");
    FillValue = true;
    FillObj.addEventListener('change', event => {
            var prevFill = FillValue;

            FillValue = FillObj.checked;
            console.log("Fill changed from " + prevFill + " to " + FillValue);
        }, 
        false 
    );
    /*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
    /*----------------------------------------*/



    /*----------------------------------------*/
    /*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
    //下載用
    Down.addEventListener('click', event => {
            DownLink = document.getElementById('DownLink'/*為了這個功能，有在html裡面多加一個這個tag*/);
            DownLink.setAttribute('download', 'Canvas_Graffiti.png');
            DownLink.setAttribute('href', CanvObj.toDataURL("image/png").replace("image/png", "image/octet-stream"));
            DownLink.click();//不能只留這行在addEventListener裡面，因為CanvObj的內容需要被更新到link裡面，否則存不到
        }, 
        false 
    );
    /*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
    /*----------------------------------------*/



    /*----------------------------------------*/
    /*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
    //Reset(a.k.a. Clear)用
    Clear.addEventListener('click', event => {
            prevFrames = [];
            succFrames = [];

            ctx.putImageData(NakedCanvas, 0, 0);
        }, 
        false 
    );
    /*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
    /*----------------------------------------*/



    /*----------------------------------------*/
    /*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
    //雜項

    //TB狀態用
    TB_flag_removed = true;

    //儲存原始Canvas的樣貌
    NakedCanvas = ctx.getImageData(0, 0, CanvObj.width, CanvObj.height);

    //儲存所有frame，以供undo、redo使用
    prevFrames = new Array();
    succFrames = new Array();
    //雜項
    /*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
    /*----------------------------------------*/
}


function DrawAndWipe(InputType, x, y) {
    if (mousedown) {
        if (InputType == 0/*Pencil*/) {
            ctx.fillStyle = ColourValue; 
            ctx.lineWidth = SizeValue;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            ctx.beginPath();
            ctx.moveTo(prevMouseX, prevMouseY);
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.closePath();

            prevMouseX = x;
            prevMouseY = y;
        }
        else if (InputType == 1/*Eraser*/) {
            ctx.lineCap = "round";
            ctx.clearRect(mouseX, mouseY, SizeValue, SizeValue);
        }
    }
}


function NewingTextBox (ev) {
    TB_x = ev.offsetX;
    TB_y = ev.offsetY;
    create_InputTxtBox(ev.clientX, ev.clientY);
}


//生成文字方塊
function create_InputTxtBox(x, y) {
    if (!TB_flag_removed) { //防止使用者上一個TB沒有按Enter正確輸出就離開，導致那個textBox一直在那邊
        document.body.removeEventListener(TB, TB_Key_Monitor);
        document.body.removeChild(TB);
        TB_flag_removed = true;
    }

    TB = document.createElement("input");
    TB.setAttribute("type", "text");
    TB.setAttribute("id", "TextBox");
    TB.setAttribute("style", "left: " + x + "px; top: " + y + "px; width: " + 5 * SizeValue + "px; position: absolute;");
    document.body.appendChild(TB);
    
    TB_flag_removed = false;

    TB.addEventListener("keydown", TB_Key_Monitor);
}



function TB_Key_Monitor(event) {
    if (event.key == "Enter") {
        UserInputTxt = TB.value;
        console.log("UserInputTxt = " + UserInputTxt);
        TB_Entered();
    }
}


function TB_Entered() {
    document.body.removeEventListener(TB, TB_Key_Monitor);
    document.body.removeChild(TB);
    TB_flag_removed = true;

    ctx.font = (SizeValue * 1.5 + 5) + "px " + FontValue;
    ctx.fillStyle = ColourValue;
    ctx.fillText(UserInputTxt, TB_x, TB_y)

    mousedown = false;
}


function imgUped(ref) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var newImg = new Image();
        newImg.src = event.srcElement.result;//或者event.target.result

        newImg.onload = function(){
            record_cur_frame();

            ctx.drawImage(newImg, 0, 0, CanvObj.width, CanvObj.height);
        }
    }
    reader.readAsDataURL(ref.files[0]);
}


function record_cur_frame() {
    var cur_canvas_img = ctx.getImageData(0, 0, CanvObj.width, CanvObj.height);
    prevFrames.push(cur_canvas_img);
}

function undo(){
    if (prevFrames.length) {
        var cur_canvas_img = ctx.getImageData(0, 0, CanvObj.width, CanvObj.height);
        //把目前顯示的畫面丟到succFrames裡面，這樣如果日後需要redo，才能再叫出來
        succFrames.push(cur_canvas_img);

        var next_frame_to_show = prevFrames.pop();
        ctx.putImageData(next_frame_to_show, 0, 0);
    }
    else alert("It is currently the endmost (for undo) status!");
}
function redo(){
    if (succFrames.length) {
        var cur_canvas_img = ctx.getImageData(0, 0, CanvObj.width, CanvObj.height);
        prevFrames.push(cur_canvas_img);

        var next_frame_to_show = succFrames.pop();
        ctx.putImageData(next_frame_to_show, 0, 0);
    }
    else alert("It is currently the endmost (for redo) status!");
}


function makingRect(x, y) {
    if (mousedown) {
        var tempRectWidth = Math.abs(x - clickedPos_x);
        var tempRectHeight = Math.abs(y - clickedPos_y);

        //把上一秒的temp畫面（整個畫面）刪除
        ctx.clearRect(0, 0, CanvObj.width, CanvObj.height);
        //換上原本的buffer畫面（沒有預覽形狀的畫面）
        ctx.putImageData(bufferCanvas, 0, 0);
        //開始畫這一秒的形狀預覽畫面
        ctx.lineWidth = SizeValue;
        ctx.strokeStyle = ColourValue;
        ctx.fillStyle = ColourValue;

        if (FillValue) {
            ctx.fillRect(
                (x < clickedPos_x ? x : clickedPos_x /*取小的數字來開始畫，因為一律從長方形的“！！左上！！”角開始畫*/),
                (y < clickedPos_y ? y : clickedPos_y),
                tempRectWidth, tempRectHeight
            );
        }
        else {
            ctx.strokeRect(
                (x < clickedPos_x ? x : clickedPos_x /*取小的數字來開始畫，因為一律從長方形的“！！左上！！”角開始畫*/),
                (y < clickedPos_y ? y : clickedPos_y),
                tempRectWidth, tempRectHeight
            );
        }
    }
    
}


function makingCirc(x, y) {
    if (mousedown) {
        var deltaX = x - clickedPos_x;
        var deltaY = y - clickedPos_y;
        var r_of_Circ = Math.sqrt( deltaX * deltaX + deltaY * deltaY);

        //把上一秒的temp畫面（整個畫面）刪除
        ctx.clearRect(0, 0, CanvObj.width, CanvObj.height);
        //換上原本的buffer畫面（沒有預覽形狀的畫面）
        ctx.putImageData(bufferCanvas, 0, 0);
        //開始畫這一秒的形狀預覽畫面
        ctx.lineWidth = SizeValue;
        ctx.strokeStyle = ColourValue;
        ctx.fillStyle = ColourValue;

        ctx.beginPath();
        ctx.arc(clickedPos_x, clickedPos_y, r_of_Circ, Math.PI, -Math.PI, false/*Clockwise*/);
        ctx.closePath();
        if (FillValue) {ctx.fill();} else {ctx.stroke();}
    }
}


function makingTri(x, y) {
    if (mousedown) {
        //clickedPoint的x會一直是左邊點的x
        //clickedPoint的y會一直是中間點（頂點）的y
        //------>那麼，左邊點的y呢？Ans: 就會是滑鼠所在點的y。
        //------>那麼，中間點的x呢？Ans: 就會是滑鼠所在點的x，以及clickedPoint的x，的中間。
        //所以上面兩行，已經處理好左邊點，以及中間點。剩下的一點（a.k.a. 右邊點）的座標，就是滑鼠所在點的座標

        //把上一秒的temp畫面（整個畫面）刪除
        ctx.clearRect(0, 0, CanvObj.width, CanvObj.height);
        //換上原本的buffer畫面（沒有預覽形狀的畫面）
        ctx.putImageData(bufferCanvas, 0, 0);
        //開始畫這一秒的形狀預覽畫面
        ctx.lineWidth = SizeValue;
        ctx.strokeStyle = ColourValue;
        ctx.fillStyle = ColourValue;

        //從滑鼠所在點開始畫
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo((x + clickedPos_x)/2, clickedPos_y);
        ctx.lineTo(clickedPos_x, y);
        ctx.closePath();
        if (FillValue) {ctx.fill();} else {ctx.stroke();}
    }
}