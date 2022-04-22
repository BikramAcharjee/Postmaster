var fs = require('fs');

class LoadModalDynamic {
    constructor() {
        fs.readFile(__dirname + '/components/modal/aboutModal.html', function (err, data) {
            document.getElementById('loadAboutModal').innerHTML = data.toString();
        });
        fs.readFile(__dirname + '/components/modal/licenseModal.html', function (err, data) {
            document.getElementById('loadLicenseModal').innerHTML = data.toString();
        });
    }
}

new LoadModalDynamic();
