/*Chat Homework
Этапы.
Используя функцию jsonPost на адрес http://students.a-level.com.ua:10012 напишите чат-клиент, который:
Stage 0
Для поиграться скопируйте в консоль функцию jsonPost(или запустите её с этой страницы) и вызовите её с теми или иными объектами в качестве второго параметра.см.RPC.
    jsonPost("http://students.a-level.com.ua:10012", { func: 'addMessage', nick: "Anon", message: 'Я не умею копипастить в консоль, зато умею жать красную кнопку.' })
Если после объявления функции jsonPost запустить пример выше, то вы напишите в чат.
    Stage 1
Отправляет сообщения в чат.Для проверки отслеживайте приходящий с сервера nextMessageId, который должен увеличиваться.Интерфейс: поле ввода ника, поле ввода сообщения, кнопка отправки.
    Stage 2
Читает все сообщения из чата и выводит их в отдельном контейнере.Интерфейс: некий div - контейнер, в котором на каждое сообщение создается div(или иной блочный контейнерный тэг) и в него помещается ник и сообщение.Также там есть timestamp который может показывать время отправки сообщения.
    Stage 3
Читает только новые сообщения из чата.Для этого надо после каждого получения запоминать nextMessageId и отправлять его при следующем запросе новых сообщений.Изначально nextMessageId равен нулю, что бы вычитать всю историю сообщений с сервера.
    Stage 4
Делаем Stage 3 в setInterval для периодической проверки сообщений(раз в 2 - 5 секунд).
    Stage 5
Напишите асинхронную функцию отправки, которая внутри себя будет делать два запроса: на отправку и на проверку, для того что бы минимизировать задержку между отправкой сообщения пользователя и его появлением в окне чата.Оформите отдельно функции отправки и проверки новых сообщений как асинхронные(async, возвращает Promise):
async function sendMessage(nick, message) отсылает сообщение.
async function getMessages() получает сообщения и отрисовывает их в DOM
async function sendAndCheck() использует две предыдущие для минимизации задержки между отправкой сообщения и приходом их.Именно эта функция должна запускаться по кнопке.
async function checkLoop() использует delay и бесконечный цикл для периодического запуска getMessages().
    Stage 6
Прогуглить и разобраться с fetch и заменить внутренности jsonPost на код, использующий fetch вместо XMLHttpRequest.
    Информация
jsonPost
Данная промисифицированная функция(кстати, сделайте из неё асинхронную) умеет общаться с моим чат - сервером отправляя RPC запросы используя JSON.Remote Procedure Call - вызов функций удаленно, имя функции и параметры передаются AJAX - ом в формате(например) JSON.
function jsonPost(url, data) {
    return new Promise((resolve, reject) => {
        var x = new XMLHttpRequest();
        x.onerror = () => reject(new Error('jsonPost failed'))
        //x.setRequestHeader('Content-Type', 'application/json');
        x.open("POST", url, true);
        x.send(JSON.stringify(data))

        x.onreadystatechange = () => {
            if (x.readyState == XMLHttpRequest.DONE && x.status == 200) {
                resolve(JSON.parse(x.responseText))
            }
            else if (x.status != 200) {
                reject(new Error('status is not 200'))
            }
        }
    })
}
Первым параметром указывается URL(см.выше) на который отправляется методом POST с JSON, вторым - готовый к JSONификации объект, который вы хотите отправить на сервер.
    RPC
addMessage
Если вы отправите подобный JSON на сервер(см jsonPost), то сервер запишет ваше сообщение во внутренний массив и отдаст новую длину массива.После этого другие могут прочесть это сообщение, используя метод getMessages.
{ func: "addMessage", nick: 'msg', message: 'msg' }
Поле func является обязательным и содержит имя функции, которая должна быть вызвана на сервере.Функция на сервере получает параметром остальной объект(поля nick и message) В ответ вы получите так же объект:
{ nextMessageId: 100500 } 
где 100500: новая длина массива сообщений на сервере после добавления вашего сообщения.
    getMessages
Позволяет прочесть часть массива сообщений от отпределенного индекса и до конца.Используется для последовательной дочитки новых сообщений.Для этого надо передать в jsonPost подобный объект:
{ func: "getMessages", messageId: 0 }
При значении 0 в messageId сервер отдаст сообщения от 0 до конца, т.е.весь массив:
{
    "data": [
        {
            "nick": "test",
            "message": "test",
            "timestamp": 1524225450317
        },
        {
            "nick": "test",
            "message": "test2",
            "timestamp": 1524225460973
        },
        {
            "nick": "test",
            "message": "test3",
            "timestamp": 1524225504849
        },
        {
            "nick": "SirkoSobaka",
            "message": "Hello!",
            "timestamp": 1524226323310
        },
        {
            "nick": "SirkoSobaka",
            "message": "Hello!",
            "timestamp": 1524226326628
        },
    ],
        "nextMessageId": 5
}
После чего вы итерируете по data и выводите каждый отдельный объект как DOM - элемент с текстом, и, возможно, вложенной версткой(время в отдельном элементе и т.п.)
nextMessageId вы запоминаете для того, что бы отправить следующий запрос начиная с него(т.е.с 5 в примере выше).Тогда сервер отдаст вам только сообщения новее последнего запроса.
Chat Server
Можно глянуть тут: сервер Обратите внимание на массив messages и на функции в ассоциативном массиве RPCFuncs.А также на эти строки кода
Спойлер
чатик
Но вам все равно надо переписать это на async, await, Promise и DOM.
Где это делать ?
    Если у вас не чрезмерно свежий хром, то это можно делать даже на локалхосте и открывать файл из браузера с диска.Сервер позволяет соединятся с собой с любого домена.
        Удачи : -)*/


function variables(){
    let url = '';
    let nickname = '';
    let messageCount = 0;
    let isStart = true;
    let isScroll = false;
    let showedMessages = 0;
    let previousShowedMessages = 0;
    let minShowedMEssages = 50;
    let interval = 5000;

    return{
        seturl: (val)=>url = val,
        setnickname: (val)=>nickname = val,
        setmessageCount: (val)=>messageCount = val,
        setisStart: (val)=>isStart = val,
        setisScroll: (val)=>isScroll = val,
        setshowedMessages: (val)=>showedMessages = val,
        setpreviousShowedMessages: (val)=>previousShowedMessages = val,

        geturl: ()=>url,
        getnickname: ()=>nickname,
        getmessageCount: ()=>messageCount,
        getisStart: ()=>isStart,
        getisScroll: ()=>isScroll,
        getshowedMessages: ()=> showedMessages,
        getpreviousShowedMessages: ()=> previousShowedMessages,
        getminShowedMEssages: ()=> minShowedMEssages,
        getinterval: ()=> interval,
    }
}

const myVariables = variables();

window.addEventListener('load', () => {
    let nicknameInput = document.getElementById("nickname");
        nicknameInput.value = "Default User";
        myVariables.setnickname(nicknameInput.value);
        myVariables.seturl("http://students.a-level.com.ua:10012");
        getMessages(0);
})

function getMessages(id){
    let loading = document.getElementById("loading");
    let promise = jsonPost_fetch(myVariables.geturl(), {func: "getMessages", messageId: id});
    loading.classList.add("on");


    promise.then((result)=>result.json())
    .then((result)=>{
        loading.classList.remove("on");
        myVariables.setmessageCount(result.nextMessageId);

        if(myVariables.getisStart()){
            myVariables.setisStart(false);
            myVariables.setshowedMessages(0);

            if(result.nextMessageId > myVariables.getminShowedMEssages()){
                myVariables.setshowedMessages( result.nextMessageId = myVariables.getminShowedMEssages());
                let messagesArray = result.data.slice(myVariables.getshowedMessages());
                showChat(messagesArray);
                checkLoop.start();
            }
        }else{
            if(result.data.length > 0){
                showChat(result.data);
                myVariables.setmessageCount(result.nextMessageId);
            }
        }
    })
    .catch((error)=>console.error("Error is: ", error));
}

const showChat = (showArray) =>{
    if(showArray.length === 0){
        return;
    }
    let showDiv = document.getElementById("message-list");
    if(myVariables.getisScroll()){
        showDiv.innerHTML = '';
    }
    showArray.forEach((element,key) => {
        if(element.nickname.length === 0){
            return
        }
        if(element.message.length === 0){
            return;
        }
        let elementDiv = document.createElement("div");
        let elementParagraph = document.createElement("p");
        let elementTime = document.createElement("span");
        let elementNickname = document.createElement("span");
        let elementMessage = document.createElement("span");
        elementDiv.className = "message__item";
        if(key === myVariables.getpreviousShowedMessages()){elementDiv.id = "scroll";}
        elementTime.className = "message-time__item";
        elementTime.innerHTML = new Date(element.timestamp).toLocaleString().slice(0,-3);
        elementNickname.className = "message-nickname__item";
        elementNickname.innerText = element.nickname;
        elementMessage.className = "messages__item";
        elementMessage.innerText = element.message;
        elementDiv.append(elementParagraph);
        elementParagraph.append(elementTime,elementNickname,elementMessage);
        showDiv.append(elementDiv);

    });
    if(!myVariables.getisScroll()){
        showDiv.scrollTop = showDiv.scrollHeight;
    }else{
        document.getElementById("scroll").scrollIntoView();
        myVariables.setisScroll(false);
    }
}

const setNickname = () =>{
    let source = document.getElementById("nickname");
    if(source.value.length > 0){
        myVariables.setnickname(source.value);
    }else{
        source.value = myVariables.getnickname();
    }
}


async function sendCheck(){
    let source = document.getElementById("message");
    if(source.value.length === 0){
        return;
    }
    checkLoop.stop();
    let promise = jsonPost_fetch(myVariables.geturl(), {func: 'addMessage', nickname: myVariables.getnickname(), message: source.value});
    source.value = '';

    let result = await promise.then((result)=>result.json(),(error)=>console.error("Error is: ", error));
    checkLoop.start();
}

function myCheckLoop(){
    let setinterval;
    return{
        start : ()=>{
            setinterval = setInterval(()=>{
                getMessages(myVariables.getmessageCount());
            },
            myVariables.getinterval());
        },
        stop: ()=>{clearTimeout(setinterval);
        }
    }
}
const checkLoop = myCheckLoop();

document.getElementById('message-list').addEventListener('scroll',()=>{
    if(document.getElementById('message-list').scrollTop < 1){
        myVariables.setisScroll(true);
        let messageNumber = myVariables.getshowedMessages();
        let minShow =  myVariables.getminShowedMEssages();

        if(messageNumber === 0){myVariables.setisScroll(false);
        return;
    }
        if(messageNumber > minShow){
            myVariables.setpreviousShowedMessages(minShow);
            messageNumber -= minShow;
        }else{
            myVariables.setpreviousShowedMessages(minShow - messageNumber);
            messageNumber = 0;
        }
        getMessages(messageNumber);
        myVariables.setshowedMessages(messageNumber);
        console.log(myVariables.getpreviousShowedMessages());
    }
})

function jsonPost(url, data){
    return new Promise((resolve,reject)=> {
        var x = new XMLHttpRequest();
        x.onerror = () => reject(new Error('jsonPost failed'))
        x.open("POST", url. true);
        x.send(JSON.stringify(data))
        x.onreadystatechange = () => {
            if(x.readyState == XMLHttpRequest.DONE && x.status == 200){
                resolve(JSON.parse(x.responseText))
            }
            else if (x.status != 200){
                reject(new Error('status is not 200'))
            }
        }
    });
}

function jsonPost_fetch(url, data){
    let objectData = {
        method: 'POST',
        body: JSON.stringify(data),
    };
    return fetch(url, objectData);
}