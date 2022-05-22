document.getElementById('video-url').style.visibility = "hidden";
document.getElementById('color-picker').style.visibility = "hidden";

function toggleOptions() {
    var vidbtn = document.querySelector('#vid')
    var colorbtn = document.querySelector('#color')

    if (vidbtn.checked) {
        document.getElementById('video-url').style.visibility = "visible";
        document.getElementById('color-picker').style.visibility = "hidden";
    } else {
        document.getElementById('video-url').style.visibility = "hidden";
        document.getElementById('color-picker').style.visibility = "visible";
    }
}

function addButton() {
    if (inputs.length == 6) return;
    var button = document.createElement("div");
    button.className = "button";
    var span = document.createElement("span");
    var br = document.createElement("br");
    span.innerHTML = "Button";
    var input = document.createElement("input");
    input.type = "text";
    input.id = "button-text";
    input.placeholder = "Button Text";
    var input2 = document.createElement("input");
    input2.type = "text";
    input2.id = "button-redirect";
    input2.placeholder = "Button Link";
    button.appendChild(span);
    button.appendChild(br);
    button.appendChild(input);
    button.appendChild(input2);
    document.getElementsByClassName("buttons")[0].appendChild(button);
    inputs = document.querySelectorAll("#button-text");
    // input.addEventListener('keyup', function (e) {
    //     console.log('y')
    //     if(input.value == "rmv") {
    //         if(inputs.length == 1) return;
    //         input.parentElement.remove();
    //     }
    // });
    inputs.forEach(x => {
        x.removeEventListener('keyup', x);
        x.addEventListener('keyup', function (e) {
            if (x.value !== "rmv") return;
            if (inputs.length == 1) return;
            x.parentElement.remove();
            inputs = document.querySelectorAll("#button-text");
        })
    })
}

let inputs = document.querySelectorAll("#button-text")

function checkOptions() {
    var vidbtn = document.querySelector('#vid')
    var colorbtn = document.querySelector('#color')
    var vidurl = document.querySelector('#video-url')
    var colorpicker = document.querySelector('#color-picker')
    let buttons = document.querySelectorAll(".button")
    let title = document.querySelector('#title')
    let description = document.querySelector('#description')
    let webtitle = document.querySelector('#web-title')
    if (!vidbtn.checked && !colorbtn.checked) return alert("Please select a background for the page.");
    if (vidbtn.checked && vidurl.value == '') return alert("Please give information for the background.");
    buttons.forEach(x => {
        if (x.children[2].value == "" || x.children[3].value == "") {
            return alert("Please fill out the button text and link fields");
        }
    })
    if (title.value == '') return alert("Please give a title for the page.");
    if (description.value == '') return alert("Please give a description for the page.");
    if (webtitle.value == '') return alert("Please give a title for the web page.");
    sendRequest();
}

function sendRequest() {
    if (getCookie('canCreate') == 'false') return alert("You cannot create another site for 7 days.");
    var vidbtn = document.querySelector('#vid')
    var colorbtn = document.querySelector('#color')
    var vidurl = document.querySelector('#video-url')
    var colorpicker = document.querySelector('#color-picker')
    let buttons = document.querySelectorAll(".button")
    let title = document.querySelector('#title')
    let description = document.querySelector('#description')
    let webtitle = document.querySelector('#web-title')
    let submitbtn = document.querySelector('#submit')
    let data = {
        vid: vidbtn.checked,
        color: colorbtn.checked,
        vidurl: vidurl.value,
        colorpicker: colorpicker.value,
        buttons: [],
        title: title.value,
        description: description.value,
        webtitle: webtitle.value
    }
    buttons.forEach(x => {
        data.buttons.push({
            text: x.children[2].value,
            link: x.children[3].value
        })
    });
    fetch('/api-create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    submitbtn.disabled = true;
    setTimeout(function() {
        setCookie('canCreate', 'false', 7);
    }, 5000);
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}