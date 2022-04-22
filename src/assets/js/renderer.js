const { ipcRenderer, shell } = require('electron');


function openBlog() {
    shell.openExternal('https://blog.postmaster.official.blogspot.com');
}

function windowClose() {
	ipcRenderer.send('close','windowClose');
}

function windowMinimize() {
	ipcRenderer.send('minimize','windowMinimize');
}

function windowMaximize() {
	ipcRenderer.send('maximize','windowMaximize');
}

ipcRenderer.on('ping',function(event,text) {
    document.getElementsByClassName("version")[0].innerHTML = text;
    document.getElementsByClassName("version")[1].innerHTML = text;
})