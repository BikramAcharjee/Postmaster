ipcRenderer.on('message', function(event,text,data) {
    if(text === 'checking'){
        document.getElementById('updateMainBox').classList.remove('d-none');
        document.getElementById('downloadLabel').innerHTML = 'Checking Updates..';
    }
    else if(text === 'updateAvailable'){
        document.getElementById('updateMainBox').classList.remove('d-none');
        document.getElementById('downloadLabel').innerHTML = 'Updates Found !';
    }
    else if(text === 'up-to-date'){
        document.getElementById('updateMainBox').classList.remove('d-none');
        document.getElementById('downloadLabel').innerHTML = 'Up-To-Date';
        setTimeout(()=> {
            document.getElementById('updateMainBox').classList.add('d-none');
        },5000);
    }
    else if(text === 'error'){
        document.getElementById('updateMainBox').classList.remove('d-none');
        document.getElementById('downloadLabel').innerHTML = 'Update Failed !';
    }
    else if(text === 'downloading'){
        document.getElementById('updateMainBox').classList.remove('d-none');
        document.getElementById('downloadLabel').innerHTML = 'Downloading..';
        let progress = document.getElementById('download');
        progress.value = data.percent;
    }
    else if(text === 'downloaded'){
        document.getElementById('updateMainBox').classList.remove('d-none');
        document.getElementById('downloadLabel').innerHTML = 'Downloaded';
        setTimeout(()=> {
            document.getElementById('updateMainBox').classList.add('d-none');
        },5000);
    }
    else {
        console.log(text,data);
    }
})