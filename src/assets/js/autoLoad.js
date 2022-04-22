/*!
 * Postmaster
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license
 *
 * Date: 2022-03-02T17:08Z
 */

class AutoLoadData {
	constructor() {
        // setting all fileds for autoload saved data
		this.Keys = [{
			key: "__postmanJson",
			id: "addJson",
			inputName: null,
			inputKey: "jsonKey[]",
			inputValue: "jsonValue[]",
			pair: true,
			clickable: true,
		}, {
			key: "__postmanForm",
			id: "addData",
			inputName: null,
			inputKey: "key[]",
			inputValue: "value[]",
			pair: true,
			clickable: true,
		}, {
			key: "__postmanHeader",
			id: "addHeaders",
			inputName: null,
			inputKey: "headersKey[]",
			inputValue: "headersValue[]",
			pair: true,
			clickable: true,
		}, {
			key: "__postmanParams",
			id: "addParams",
			inputName: null,
			inputKey: null,
			inputValue: "paramsKey[]",
			pair: false,
			clickable: true,
		}, {
			key: "__postmanUrl",
			id: null,
			inputName: null,
			inputKey: null,
			inputValue: "url",
			pair: false,
			clickable: false,
		}, {
			key: "__postmanSecret",
			id: null,
			inputName: null,
			inputKey: null,
			inputValue: "secret",
			pair: false,
			clickable: false,
		}, {
			key: "__postmanRaw",
			id: null,
			inputName: null,
			inputKey: null,
			inputValue: "textData",
			pair: false,
			clickable: false,
		}, {
			key: "__postmanEncKey",
			id: null,
			inputName: null,
			inputKey: null,
			inputValue: "encryptKeyName",
			pair: false,
			clickable: false,
		}, {
			key: "__postmanHeader",
			id: "addHeaders",
			inputName: null,
			inputKey: "headersKey[]",
			inputValue: "headersValue[]",
			pair: true,
			clickable: true,
		}, {
			key: "__postmanObject",
			id: "addObjectRow",
			inputName: "objectName[]",
			inputKey: "objectKey[]",
			inputValue: "objectValue[]",
			pair: false,
			clickable: true
		}];

		this.Keys.map((item, index) => {
			let datas = localStorage.getItem(item.key);
			if (datas != null) {
				let data = JSON.parse(datas);
				if (Object.keys(data).length != 0) {
					this.WriteData(data, item);
				}
			}
		});
	}

	WriteData(data, item) {
		let count = 0;
		var keys = [];
		var values = [];
		if (item.key === '__postmanObject') {
			var name = document.getElementsByName(item.inputName);
			var key = document.getElementsByName(item.inputKey);
			var value = document.getElementsByName(item.inputValue);
			for (const [key, value] of Object.entries(data)) {
				count++;
				keys.push(key);
				values.push(value);
			}
			for (var i = 1; i < count; i++) {
				document.getElementById(item.id).click();
			}

			for (var i = 0; i < name.length; i++) {
				name[i].value = keys[i];
			}
			let index = 0;
			for (var i = 0; i < values.length; i++) {
				let lastKey = Object.keys(values[i]).pop();
				let lastValue = values[i][Object.keys(values[i]).pop()];
				for (const [key, value] of Object.entries(values[i])) {
					if (key != lastKey && value != lastValue) {
						document.getElementsByClassName('addObjectData')[i].click();
					}
					document.getElementsByName(item.inputKey)[index].value = key;
					document.getElementsByName(item.inputValue)[index].value = value;
					index++;
				}
			}
		} else {
			if (item.clickable) {
				for (const [key, value] of Object.entries(data)) {
					count++;
					keys.push(key);
					values.push(value);
				}
				for (var i = 1; i < count; i++) {
					document.getElementById(item.id).click();
				}
				if (item.pair) {
					var key = document.getElementsByName(item.inputKey);
					var value = document.getElementsByName(item.inputValue);
					for (var i = 0; i < key.length; i++) {
						key[i].value = keys[i];
					}

					for (var i = 0; i < value.length; i++) {
						value[i].value = values[i];
					}
				} else {
					var value = document.getElementsByName(item.inputValue);
					for (var i = 0; i < value.length; i++) {
						value[i].value = values[i];
					}
				}
			} else {
				if (data.text) {
					document.getElementsByName(item.inputValue)[0].value = data.text;
				} else {
					document.getElementsByName(item.inputValue)[0].value = data;
				}
			}
		}

	}
}

new AutoLoadData();