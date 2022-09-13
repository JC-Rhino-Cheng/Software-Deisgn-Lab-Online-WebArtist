# Software Studio 2021 Spring
## Assignment 01 Web Canvas


### Scoring

| **Basic components**                             | **Score** | **Check** |
| :----------------------------------------------- | :-------: | :-------: |
| Basic control tools                              | 30%       | Y         |
| Text input                                       | 10%       | Y         |
| Cursor icon                                      | 10%       | Y         |
| Refresh button                                   | 10%       | Y         |

| **Advanced tools**                               | **Score** | **Check** |
| :----------------------------------------------- | :-------: | :-------: |
| Different brush shapes                           | 15%       | Y         |
| Un/Re-do button                                  | 10%       | Y         |
| Image tool                                       | 5%        | Y         |
| Download                                         | 5%        | Y         |

| **Other useful widgets**                         | **Score** | **Check** |
| :----------------------------------------------- | :-------: | :-------: |
| Name of widgets                                  | 1~5%     | N         |


---

### How to use 

    我的工具選單在上方置中，前6個是畫畫種類（畫筆、橡皮擦、文字、三角形、長方形、圓形），後面5個是工具（Undo、Redo、清空、下載圖片、上傳）。
前面6種，一次只能選定其中一個，被選定的種類會有灰底來顯示，預設的是畫筆被顯示。
Undo一次還原一個步驟，如果到底了會有提示視窗。Redo也是一次還原一個步驟，到底了也會有提示視窗。
清空除了表面上畫布清空之外，也會把Undo、Redo的步驟們全部清空。
下載的副檔名是png，而上傳的檔案僅限圖片，但不限於png。

    另外有顏色選定功能、大小選定功能、字體選定功能、填滿與否的選定功能。
顏色選定會影響到畫筆、文字、三角形、長方形、圓形。
大小選定會影響到畫筆、橡皮擦、文字、三角形（僅限不填滿時，會影響到邊框）、長方形（僅限不填滿時，會影響到邊框）、圓形（僅限不填滿時，會影響到邊框）。
字體選定會影響到文字。
填滿與否會影響到三角形、長方形、圓形是實心或空心（空心的中間是透明的）。

    畫布在之前的段落所描述的選單的下方。

### Function description

    因為function很多，所以只大略描述它們各自所做的事情。

Stationery_clicked：在六個畫畫種類的圖案onclick的時候會被呼叫，來把原本的畫畫種類取消灰底顯示，把新的畫畫種類灰底顯示。另外也切換cursor icon。

CancelHighlight：取消六個畫畫種類的灰底顯示。

MakeHighlight：新增六個畫畫種類的灰底顯示。

Init：在window.onload會被呼叫，除了初始化所有變數之外，也註冊很多EventListener，例如mouseup、mousedown、mousemove。如果字體、大小、顏色、是否填滿有被使用者改動，也會有註冊的EventListener相應調整。另外也註冊了download、clear的EvnetListener。

DrawAndWipe：負責畫筆、橡皮擦的實際繪製。

NewingTextBox、create_InputTxtBox、TB_Key_Monitor、TB_Entered：一連串的callBackFunc來處理文字。

imgUped：處理被上傳的圖片，裡面也有一連串的callBackFunc，但是沒有名字。

record_cur_frame：把目前畫布上的圖樣儲存起來，會在Undo、Redo用到。

undo：處理Undo。

redo：處理Redo。

makingRect：畫（暫態的以及長久的）長方形。

makingCirc：畫（暫態的以及長久的）圓形。

makingTri：畫（暫態的以及長久的）三角形。



### Gitlab page link

    https://108062124.gitlab.io/AS_01_WebCanvas/
