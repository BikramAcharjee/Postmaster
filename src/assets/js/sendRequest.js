var ajaxRequest;
var secretKey = "123456789";
var startTime = new Date().getTime();
var endTime = new Date().getTime();

class PostMan {
	constructor() {
		let form = document.getElementById("postmanForm");
		form.onsubmit = function(e) {
			e.preventDefault();
			const postManForm = e.target;
			const formdataForm = document.getElementById("formDataForm");
			const headersForm = document.getElementById("headersForm");
			const paramsForm = document.getElementById("paramsForm");
			const jsonForm = document.getElementById("jsonForm");
			const rawForm = document.getElementById("rawForm");
			const secretForm = document.getElementById("encryptionForm");
			const contentTypeForm = document.getElementById("contentTypeForm");
			const otherForm = document.getElementById("otherForm");

			new Configuration(
				postManForm,
				formdataForm,
				headersForm,
				paramsForm,
				jsonForm,
				rawForm,
				contentTypeForm,
				secretForm,
				otherForm
			);
		};
	}
}

new PostMan();

class Configuration {
	constructor(postMan, formdata, headers, params, json, raw, dataType, secret, other) {
		this.PostMan = new FormData(postMan);
		this.Form = new FormData(formdata);
		this.Headers = new FormData(headers);
		this.Params = new FormData(params);
		this.Json = new FormData(json);
		this.Raw = new FormData(raw);
		this.DataType = new FormData(dataType);
		this.Secret = new FormData(secret);
		this.Other = new FormData(other);

		this.DataTypeSetup(this.DataType.get("contentType"));
	}

	DataTypeSetup(type) {
		let jsonKey = [];
		let jsonValue = [];
		let JsonData = {};
		let formKey = [];
		let formValue = [];
		let formData = {};
		if (type === "formdata") {
			for (const [key, value] of this.Form.entries()) {
				if (key === "key[]") {
					formKey.push(value);
				}
				if (key === "value[]") {
					formValue.push(value);
				}
			}
			formKey.forEach((data, index) => {
				if (data != "") {
					formData[data] = formValue[index];
				}
			});

			new LocalStorage("__postmanForm", formData);
			this.AjaxSetting(this.Form, true);
		}
		if (type === "json") {
			for (const [key, value] of this.Json.entries()) {
				if (key === "jsonKey[]") {
					jsonKey.push(value);
				}
				if (key === "jsonValue[]") {
					jsonValue.push(value);
				}
			}

			jsonKey.forEach((data, index) => {
				if (jsonValue[index].indexOf(',') != -1) {
					let val = jsonValue[index].split(',').filter((el) => {
						return el !== '' && el !== null && el !== undefined;
					})
					data ? (JsonData[data] = val) : null;
				} else {
					data ? (JsonData[data] = jsonValue[index]) : null;
				}
			});

			let readyToSendData = JsonData;
			if (otherData != undefined) {
				let olddata = JsonData;
				for (const [key, value] of Object.entries(otherData)) {
					olddata = {...olddata, [key]: value
					};
				}
				readyToSendData = olddata;
			}
			new LocalStorage("__postmanJson", JsonData);

			this.AjaxSetting(readyToSendData, false);
		}
		if (type === "raw") {
			let textData = {
				text: this.Raw.get("textData")
			};
			if (this.Raw.get("textData") != null && this.Raw.get("textData") != '') {
				new LocalStorage("__postmanRaw", this.Raw.get("textData"));
				this.AjaxSetting(textData, false);
			} else {
				new LocalStorage("__postmanRaw", this.Raw.get("textData"));
				this.AjaxSetting(null, false);
			}
		}
		if (type === "none") {
			this.AjaxSetting(null, false);
		} else {
			return null;
		}
	}

	AjaxSetting(data, isForm) {
		let url = this.PostMan.get("url");
		let protocol = this.PostMan.get("protocol");
		let type = this.PostMan.get("method");
		new LocalStorage("__postmanUrl", url);
		this.HeadersSetting(url, protocol, type, data, isForm);
	}

	HeadersSetting(url, protocol, type, data, isForm) {
		let keys = this.Headers.getAll("headersKey[]");
		let values = this.Headers.getAll("headersValue[]");
		let headers = {};

		for (let key in keys) {
			if (keys[key] != "") {
				headers[keys[key]] = values[key];
			}
		}
		new LocalStorage("__postmanHeader", headers);
		this.ParamsSetting(type, protocol, url, data, isForm, headers);
	}

	ParamsSetting(type, protocol, url, data, isForm, headers) {
		let keys = this.Params.getAll("paramsKey[]");
		let params = [];

		for (let key in keys) {
			if (keys[key] != "") {
				params.push(keys[key]);
			}
		}
		new LocalStorage("__postmanParams", params);
		this.EncryptionSetting(data, params, url, type, protocol, isForm, headers);
	}

	EncryptionSetting(data, params, url, type, protocol, isForm, headers) {
		let secret = this.Secret.get("secret") ? this.Secret.get("secret") : secretKey;
		let dataEncrypt = this.Secret.get("encryptdata");
		let encryptAll = this.Secret.get("encryptall");

		let isDataEncrypt = dataEncrypt === null ? false : true;
		let isEncryptAll = encryptAll === null ? false : true;
		new LocalStorage("__postmanSecret", secret);
		let encryptedData = {};
		var keyName = 'data';

		if (this.Secret.get('encryptKeyName') != null && this.Secret.get('encryptKeyName') != '') {
			keyName = this.Secret.get('encryptKeyName').trim();
		}
		if (isDataEncrypt) {
			encryptedData = {
				[keyName]: CryptoJS.AES.encrypt(JSON.stringify(data), secret).toString(),
			};
			new AjaxRequest(type, protocol, url, encryptedData, isForm, headers);
		} else if (isEncryptAll) {
			encryptedData = {
				[keyName]: CryptoJS.AES.encrypt(JSON.stringify(data), secret).toString(),
			};
			let encryptURL = url;
			if (params.length != 0) {
				for (let param of params) {
					var encryptParam = encodeURIComponent(
						CryptoJS.AES.encrypt(JSON.stringify(param), secret).toString()
					);
					encryptURL = encryptURL.replace(param, encryptParam);
				}
			}

			new AjaxRequest(
				type,
				protocol,
				encryptURL,
				encryptedData,
				isForm,
				headers
			);
		} else {
			new AjaxRequest(type, protocol, url, data, isForm, headers);
		}
		new LocalStorage('__postmanEncKey', keyName);
	}
}

class AjaxRequest {
	constructor(type, protocol, url, data, isForm, headers) {
		ajaxRequest = $.ajax({
			type: type,
			url: protocol + url,
			headers: headers,
			data: data,
			processData: isForm ? false : true,
			contentType: isForm ? false : "application/x-www-form-urlencoded; charset=UTF-8",
			beforeSend: function() {
				startTime = new Date().getTime();
				document.getElementById("loading").classList.remove("d-none");
			},
			success: function(res, statusText, xhr) {
				new SuccessResponse(res, statusText, xhr);
			},
			error: function(err) {
				new ErrorResponse(err);
			},
		});
	}
}

class SuccessResponse {
	constructor(res, status, xhr) {
		endTime = new Date().getTime();
		var estimateTime = endTime - startTime;
		var Response = document.getElementById("response");
		var ResponseType = document.getElementById("responseType");
		var ResponseText = document.getElementById("textResponse");

		var json = xhr.responseJSON === undefined ? false : true;
		if (json) {
			Response.classList.add("textSmall");
			ResponseType.innerHTML = "Response Type: <b>JSON</b>";
			Response.innerHTML = JSON.stringify(xhr.responseJSON, null, 2);
			ResponseText.innerHTML = "";
			ResponseText.classList.add("d-none");
			document
				.getElementsByClassName("jsonResponse")[0]
				.classList.remove("d-none");
		} else {
			Response.classList.remove("textSmall");
			ResponseType.innerHTML = "Response Type: <b>TEXT</b>";
			ResponseText.innerHTML = res;
			Response.innerHTML = "";
			document
				.getElementsByClassName("jsonResponse")[0]
				.classList.add("d-none");
			ResponseText.classList.remove("d-none");
		}
		document.getElementById("loading").classList.add("d-none");
		document.getElementById("statusCode").classList.remove("text-danger");
		document.getElementById("statusCode").classList.add("text-success");
		ResponseType.classList.remove("text-danger");
		ResponseType.classList.add("text-success");
		document.getElementById("statusCode").innerHTML =
			"Status: <b>" + xhr.status + "</b> " + xhr.statusText;
		document.getElementById("time").classList.remove("text-danger");
		document.getElementById("time").classList.add("text-success");
		document.getElementById("time").innerHTML =
			"Time: <b>" + estimateTime + "</b> ms";
		Prism.highlightAll();
	}
}

class ErrorResponse {
	constructor(err) {
		endTime = new Date().getTime();
		var estimateTime = endTime - startTime;
		var Response = document.getElementById("response");
		var ResponseType = document.getElementById("responseType");
		var ResponseText = document.getElementById("textResponse");

		var json = err.responseJSON === undefined ? false : true;
		if (json) {
			Response.classList.add("textSmall");
			ResponseType.innerHTML = "Response Type: <b>JSON</b>";
			Response.innerHTML = JSON.stringify(err.responseJSON, null, 2);
			ResponseText.innerHTML = "";
			ResponseText.classList.add("d-none");
			document
				.getElementsByClassName("jsonResponse")[0]
				.classList.remove("d-none");
		} else {
			Response.classList.remove("textSmall");
			ResponseType.innerHTML = "Response Type: <b>TEXT</b>";
			ResponseText.innerHTML = err.responseText;
			Response.innerHTML = "";
			document
				.getElementsByClassName("jsonResponse")[0]
				.classList.add("d-none");
			ResponseText.classList.remove("d-none");
		}

		document.getElementById("loading").classList.add("d-none");
		document.getElementById("statusCode").classList.remove("text-success");
		document.getElementById("statusCode").classList.add("text-danger");
		ResponseType.classList.remove("text-success");
		ResponseType.classList.add("text-danger");
		document.getElementById("time").classList.remove("text-success");
		document.getElementById("time").classList.add("text-danger");
		document.getElementById("time").innerHTML =
			"Time: <b>" + estimateTime + "</b> ms";
		document.getElementById("statusCode").innerHTML =
			"Status: <b>" + err.status + "</b> " + err.statusText;
		Prism.highlightAll();
	}
}

class CancelRequest {
    constructor() {
        document.getElementById('cancelRequest').onclick = () => {
            ajaxRequest.abort();
        }
    }
}

new CancelRequest();