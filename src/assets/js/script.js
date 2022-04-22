var fs = require('fs');
var paramsCount = 1;
let otherData = undefined;

class AddRow {
  constructor() {
    this.keys = [
      {
        id: "addHeaders",
        key: "headersKey[]",
        value: "headersValue[]",
        table: "headerTable",
        name: "header",
      },
      {
        id: "addData",
        key: "key[]",
        value: "value[]",
        table: "dataTable",
        name: "form",
      },
      {
        id: "addJson",
        key: "jsonKey[]",
        value: "jsonValue[]",
        table: "jsonTable",
        name: "json",
      }
    ];

    var dataCount = 1;
    var jsonCount = 1;
    var headerCount = 1;

    this.keys.map((item, index) => {
      let addBtn = document.getElementById(item.id);
      addBtn.onclick = function () {
        let no =
          item.name == "json"
            ? jsonCount
            : item.name == "header"
            ? headerCount
            : item.name == "form"
            ? dataCount
            : null;
        let design = `<tr>
                    <td>${no + 1}</td>
                    <td>
                        <input type="text" name="${
                          item.key
                        }" placeholder="Key" class="form-control">
                    </td>
                    <td>
                        <input type="text" name="${
                          item.value
                        }" placeholder="Value" class="form-control">
                    </td>
                    <td style="width:70px;">
                        <button class="btn deleteBtn" type="button" name="${
                          item.name
                        }btn">
                            <i class="fa-solid fa-trash-arrow-up text-danger"></i>
                        </button>
                    </td>
                </tr>`;
        let el = new ElementFromString(design, "TR");
        document.getElementById(item.table).appendChild(el);

        item.name == "json"
          ? jsonCount++
          : item.name == "header"
          ? headerCount++
          : item.name == "form"
          ? dataCount++
          : null;

        new Delete();
      };
    });
    document.getElementById("addParams").onclick = function () {
      var design = `<tr>
            <td> ${paramsCount + 1} </td>
            <td>
                <input type="text" name="paramsKey[]" placeholder="Key" class="form-control">
            </td>
            <td style="width:70px;">
                <button class="btn deleteBtn" type="button" name="paramsBtn">
                    <i class="fa-solid fa-trash-arrow-up text-danger"></i>
                </button>
            </td>
        </tr>`;
      let el = new ElementFromString(design, "TR");
      document.getElementById("paramsTable").appendChild(el);
      new Delete();
      new ParamsFieldSetting();
      paramsCount++;
    };

    this.addObjectData();
    let x = 1;
    document.getElementById("addObjectRow").onclick = function () {
        var design = `<tr>
            <td style="width:150px">
                <input type="text" placeholder="Name" required name="objectName[]" class="form-control">
            </td>
            <td colspan="2">
                <table class="table table-borderless">
                    <tbody>
                        <tr>
                            <td style="width: 150px;">
                                <input type="text" required placeholder="key" name="objectKey[]" class="form-control">
                            </td>
                            <td>
                                <input type="text" required placeholder="Value" name="objectValue[]" class="form-control">
                            </td>
                            <td style="width: 50px;">
                                <button class="btn addBtn addObjectData" type="button">
                                    <i class="fa-solid fa-plus"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
            <td style="width: 70px;">
            <button class="btn deleteBtn" type="button">
                <i class="fa-solid fa-trash-arrow-up text-danger"></i>
            </button>
            </td>
        </tr>`;
        let el = new ElementFromString(design, "TR");
        document.getElementById("objectMainTable").appendChild(el);
        new Delete();
        this.addObjectData();
        x++;
        }.bind(this);
    }

    addObjectData() {
        let addObjectDataAllBtn = document.getElementsByClassName("addObjectData");
        for(var i = 0; i < addObjectDataAllBtn.length; i++) {
            addObjectDataAllBtn[i].onclick = function () {
                var TBODY = this.parentElement.parentElement.parentElement;
                var design = `<tr>
                <td style="width:150px">
                    <input type="text" required name="objectKey[]" placeholder="Key" class="form-control">
                </td>
                <td>
                    <input type="text" required name="objectValue[]" placeholder="Value" class="form-control">
                </td>
                <td style="width: 50px;">
                <button class="btn deleteBtn" type="button">
                    <i class="fa-solid fa-trash-arrow-up text-danger"></i>
                </button>
                </td>
            </tr>`;
                let el = new ElementFromString(design, "TR");
                TBODY.appendChild(el);
                new Delete();
            };
        }
    }
}

new AddRow();

class ElementFromString {
  constructor(string, element) {
    let el = document.createElement(element);
    el.innerHTML = string;
    return el;
  }
}

class EncryptionOnOffSetting {
  constructor() {
    this.allEncrypt = document.getElementById("encryptall");
    this.dataEncrypt = document.getElementById("encryptdata");
    this.secretBox = document.getElementById("secretBox");
    this.secretInput = document.getElementsByName("secret")[0];
    this.visibility = document.getElementById("visibility");

    this.allEncrypt.onchange = function (e) {
      e.target.checked
        ? this.secretBox.classList.remove("d-none")
        : this.secretBox.classList.add("d-none");
      this.dataEncrypt.checked = false;
    }.bind(this);

    this.dataEncrypt.onchange = function (e) {
      e.target.checked
        ? this.secretBox.classList.remove("d-none")
        : this.secretBox.classList.add("d-none");
      this.allEncrypt.checked = false;
    }.bind(this);

    this.secretInput.oninput = function () {
      secretKey = this.value;
    };

    this.visibility.onclick = function () {
      let icon = document.getElementById("eye");
      if (icon.classList.contains("fa-eye-slash")) {
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
        this.secretBox.getElementsByTagName("input").secret.type = "password";
      } else {
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
        this.secretBox.getElementsByTagName("input").secret.type = "text";
      }
    }.bind(this);
  }
}

new EncryptionOnOffSetting();



class LocalStorage {
  constructor(key, data) {
    this.stringData = JSON.stringify(data);
    localStorage.setItem(key, this.stringData);
  }
}

class Delete {
  constructor() {
    let deleteBtn = document.getElementsByClassName("deleteBtn");
    for (var i = 0; i < deleteBtn.length; i++) {
      deleteBtn[i].onclick = function () {
        let parent = this.parentElement.parentElement;
        if (this.name === "paramsBtn") {
          var paramsValue = parent.getElementsByTagName("input")[0].value;
          if (paramsValue != "") {
            var url = document.getElementsByName("url")[0].value;
            if (url.indexOf(paramsValue) != -1) {
              let newUrl = url.replace("/" + paramsValue, "");
              document.getElementsByName("url")[0].value = newUrl;
              parent.remove();
            }
          } else {
            parent.remove();
          }
        } else {
          parent.remove();
        }
      };
    }
  }
}
new Delete();

class ParamsFieldSetting {
  constructor() {
    this.paramsField = document.getElementsByName("paramsKey[]");
    this.paramsField.forEach((data, index) => {
      data.onfocus = function () {
        let URL = document.getElementsByName("url")[0].value;
        if (this.value != "") {
          if (URL.indexOf(this.value) != -1) {
            var split = URL.split(this.value);
            this.oninput = function () {
              document.getElementsByName("url")[0].value =
                split[0] + this.value + split[1];
            };
          } else {
            this.oninput = function () {
              document.getElementsByName("url")[0].value =
                URL + "/" + this.value;
            };
          }
        } else {
          this.oninput = function () {
            document.getElementsByName("url")[0].value = URL + "/" + this.value;
          };
        }
      };
    });
  }
}

new ParamsFieldSetting();

class ParamChangeFromUrl {
  constructor() {
    this.UrlField = document.getElementsByName("url")[0];
    let allParamsField = document.getElementsByName("paramsKey[]");

    this.UrlField.onfocus = function () {
      var oldURL = this.value;
      this.oninput = function () {
        var splitCurrentUrl = this.value.split("/");
        var newURL = this.value;
        var splitOldUrl = oldURL.split("/");
        for (var i = 1; i < splitCurrentUrl.length; i++) {
          for (var j = 0; j < allParamsField.length; j++) {
            if (splitOldUrl[i] == allParamsField[j].value) {
              allParamsField[j].value = splitCurrentUrl[i];
              oldURL = newURL;
            }
          }
        }
      };
    };
  }
}

new ParamChangeFromUrl();

class AboutUs {
    constructor(){
        document.getElementById("aboutUs").onclick = () => {
            var myModal = new bootstrap.Modal(document.getElementById('aboutModal'));
            myModal.show();
            var version = document.getElementsByClassName('version')[0].innerHTML;
            document.getElementById("versionModal").innerHTML = version.trim();
        }
    }
}

new AboutUs();

class License {
  constructor() {
    document.getElementById("license").onclick = () => {
      var myModal = new bootstrap.Modal(document.getElementById("licenseModal"));
      myModal.show();
      fs.readFile(__dirname + '/assets/license.md', function (err, data) {
          document.getElementById('licenseBody').innerHTML = data.toString();
      });
    };
  }
}

new License();

class OtherForm {
    constructor(){
        var modal = new bootstrap.Modal(document.getElementById("otherModal"));
        const Form = document.getElementById('otherForm');
        document.getElementById('otherModalBtn').onclick = function(){
            modal.show();
            new Delete();
            new AddRow();
        }

        document.getElementById('deleteData').onclick = function() {
            Form.reset();
            otherData = undefined;
            modal.hide();
        }
        
        Form.onsubmit = function(e) {
            e.preventDefault();
            let  mainBody = document.getElementById("objectMainTable");
            let TR = mainBody.children;
            let objectFinalData = {};
            for(var i = 0; i < TR.length; i++) {
                let objectData = {};
                let inputName = TR[i].firstElementChild.firstElementChild.value;
                let objectKeys = TR[i].children[1].querySelectorAll("input[name='objectKey[]']");
                let objectValues = TR[i].children[1].querySelectorAll("input[name='objectValue[]']");
                for(var j = 0; j < objectKeys.length; j++) {
                    objectData[objectKeys[j].value] = objectValues[j].value
                }
                objectFinalData[inputName] = objectData;

            }
            new LocalStorage('__postmanObject',objectFinalData);
            otherData = objectFinalData;
            modal.hide();
        }
    }
}

new OtherForm();

class SetCookies{
    constructor(){
        const CookiesForm = document.getElementById('cookiesForm');
        CookiesForm.onsubmit = function(e) {
            e.preventDefault();
            var Form = new FormData(e.target);
            let name = Form.get("cookieName");
            let value = Form.get("cookieData");
            // document.getElementById('cookieMessage').textContent = "Sory. We are working on it.."
        }
    }
}

new SetCookies();