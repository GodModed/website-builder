var express = require('express');
var router = express.Router();
var config = require('../config.json');
var fs = require('fs')

let template;
fs.readFile('./routes/template.html', (err, buff) => {
    if (err) throw err;
    template = buff.toString();
});

var names;
fs.readdir('./static/site/', (err, files) => {
    //remove the file extension
    names = files.map(x => x.replace('.html', ''));
});

let buttonTemplate =
    `
<button type="button">
    {text}
</button>
`

let scriptTemplate =
    `
<script>
document.addEventListener('click', function (e) {
    // if (e.target !== ) return
    switch (e.target.innerText) {
        {buttons}
        default:
            console.log('Missed button', e.target)
            break;
    }
})
</script>
`

let insideScriptTemplate =
    `
case "{text}":
    window.open("{link}");
    break;
`

router.post('/', function (req, res, next) {
    if (req.cookies['canCreate'] == 'false') return res.status(403).send("You cannot create another site for 7 days.");
    let data = req.body;
    if (names.includes(data.website)) return res.status(403).send("That website name is already taken.");
    let editTemplate = template;
    editTemplate = editTemplate.replace('{title}', data.title);
    editTemplate = editTemplate.replace('{title}', data.title);
    if (req.body.description == '') {
        editTemplate = editTemplate.replace('{description}', '');
    } else {
        editTemplate = editTemplate.replace('{description}', data.description);
    }
    let newButtons = [];
    data.buttons.forEach(x => {
        let buttonTemplateEdit = buttonTemplate;
        buttonTemplateEdit = buttonTemplateEdit.replace('{text}', x.text);
        newButtons.push(buttonTemplateEdit);
    })
    newButtons = newButtons.join('\n');
    editTemplate = editTemplate.replace('{buttons}', newButtons);
    res.status(200);
    let script = scriptTemplate;
    let insideScript = insideScriptTemplate;
    let scripts = [];
    data.buttons.forEach(x => {
        let insideScriptEdit = insideScript;
        insideScriptEdit = insideScriptEdit.replace('{text}', x.text);
        insideScriptEdit = insideScriptEdit.replace('{link}', x.link);
        scripts.push(insideScriptEdit);
    });
    scripts = scripts.join('\n');
    script = script.replace('{buttons}', scripts);
    editTemplate = editTemplate.replace('{script}', script);
    if (data.vid == true) {
        var video = 
        `
        <video playsinline autoplay loop muted>
            <source src="${data.vidurl}" type="video/mp4">
        </video>
        `
        editTemplate = editTemplate.replace('{background-video}', video);
        editTemplate = editTemplate.replace('{color-background}', '');
    } else {
        var coloredstyle =
        `
        <script>
            document.body.style.background = '${data.colorpicker}';
            document.body.parentNode.style.background = '${data.colorpicker}';
        </script>
        `
        editTemplate = editTemplate.replace('{color-background}', coloredstyle);
        editTemplate = editTemplate.replace('{background-video}', '');
    }
    fs.writeFile('./static/site/' + data.webtitle + '.html', editTemplate, (err) => {
        if (err) throw err;
    });

    const sent = {
        website: data.webtitle
    }
    res.status(200).send(JSON.stringify(sent));
})

module.exports = router;