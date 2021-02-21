"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

document.addEventListener("DOMContentLoaded", function () {
  // Becuase of CoinMarketCap restriction of making request with javascript, i used hard coded data from their service, and mimic API calls as a prove of concept, also i left function which calls API in code but not using them.
  // Note: Making HTTP requests on the client side with Javascript is currently prohibited through CORS configuration.
  // Whole note on https://coinmarketcap.com/api/documentation/v1/#section/Quick-Start-Guide
  // setInterval(() => {
  //   apiCall();  
  // }, 60000);
  var currencyPage = localStorage.getItem("currencyPage");

  if (currencyPage === null) {
    mimicApiCall(1);
  } else {
    mimicApiCallForCurrencyInfo(currencyPage);
  }
});
var loader = document.getElementById("loader");
var dataTable = document.getElementById("dataTable");
var tbody = document.getElementById("tableBody");
var homePage = document.getElementById("homePage");
var aboutPage = document.getElementById("aboutPage");
var backToHome = document.getElementById("backToHome");
var aboutDiv = document.getElementById("aboutDiv");
var paginationDiv = document.getElementById("pagination");
var currencyInfoData;
document.addEventListener("keyup", inputKeyPress);
document.addEventListener("click", clickListener);
backToHome.addEventListener("click", backToHomeFunc);

function apiCall() {
  return _apiCall.apply(this, arguments);
}

function _apiCall() {
  _apiCall = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var target, apiKey, qStr, config, response, resData;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            target = "https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=";
            apiKey = "b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c";
            qStr = "&limit=50&sort=price";
            config = {
              "mode": "no-cors"
            };
            _context.next = 6;
            return fetch("".concat(target).concat(apiKey).concat(qStr), config);

          case 6:
            response = _context.sent;
            _context.next = 9;
            return response.json();

          case 9:
            resData = _context.sent;
            data = resData;

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _apiCall.apply(this, arguments);
}

function apiCallForCurrencyInfo(_x) {
  return _apiCallForCurrencyInfo.apply(this, arguments);
}

function _apiCallForCurrencyInfo() {
  _apiCallForCurrencyInfo = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(id) {
    var target, apiKey, qStr, config, response, resData;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            target = "https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/info?CMC_PRO_API_KEY=";
            apiKey = "b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c";
            qStr = "&id=" + id;
            config = {
              "mode": "no-cors"
            };
            _context2.next = 6;
            return fetch("".concat(target).concat(apiKey).concat(qStr), config);

          case 6:
            response = _context2.sent;
            _context2.next = 9;
            return response.json();

          case 9:
            resData = _context2.sent;
            currencyInfoData = resData.data;

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _apiCallForCurrencyInfo.apply(this, arguments);
}

function mimicApiCall(page) {
  loader.classList.remove("d-none");
  dataTable.classList.add("d-none");
  setTimeout(function () {
    displayData(data, page);
  }, 500);
}

function displayData(_ref, page) {
  var data = _ref.data;
  var html = "";

  _toConsumableArray(paginationDiv.children).forEach(function (elem) {
    if (elem.innerHTML != page) {
      elem.classList.remove("active");
    } else {
      elem.classList.add("active");
    }
  });

  if (page === 1) {
    document.getElementById("pagination").firstElementChild.classList.add("active");
  }

  data.forEach(function (element, index) {
    if (index + 1 > (page - 1) * 10 && index + 1 < page * 10 + 1) {
      var id = element.id,
          name = element.name,
          symbol = element.symbol,
          quote = element.quote;
      var value = quote.USD.price.toFixed(2);
      var changed = quote.USD.percent_change_24h.toFixed(2);
      var className = changed < 0 ? "text-danger" : "text-success";
      var userData = localStorage.getItem("currencyId" + id);

      if (userData === null) {
        userData = '0.00';
      }

      html += "\n            <tr data-id=\"".concat(id, "\" data-order=\"").concat(index, "\">\n                <td><span class='currencyName'>").concat(name, "</span></td>\n                <td>").concat(symbol, "</td>\n                <td>$ ").concat(value, "</td>\n                <td class=").concat(className, ">").concat(changed, " %</td>\n                <td>\n                    <input class='amountInput' type='text' />\n                    <br>\n                    <button class='submitBtn' disabled>Submit</button>\n                </td>\n                <td>$ ").concat(userData, "</td>\n            </tr>\n            ");
    }
  });
  tbody.innerHTML = html;
  loader.classList.add("d-none");
  dataTable.classList.remove("d-none");
  paginationDiv.classList.remove("d-none");
}

function inputKeyPress(e) {
  if (e.keyCode === 13 && e.target.classList.contains("amountInput")) {
    e.target.nextElementSibling.nextElementSibling.click();
  }

  if (e.target.classList.contains("amountInput")) {
    var value = e.target.value;
    var submitBtn = e.target.nextElementSibling.nextElementSibling;

    if (value) {
      submitBtn.disabled = false;
    } else {
      submitBtn.disabled = true;
    }
  }
}

function clickListener(e) {
  if (e.target.classList.contains("submitBtn")) {
    submited(e);
  } else if (e.target.classList.contains("currencyName")) {
    curencyInfo(e);
  } else if (e.target.parentElement.classList.contains("pagination")) {
    pagination(e.target.innerHTML);
  } else {
    return;
  }
}

function submited(e) {
  var currencyId = e.target.parentElement.parentElement.getAttribute("data-id");
  var value = e.target.previousElementSibling.previousElementSibling.value;
  var re = /^\d+(\.\d+)*$/;
  console.log(value);

  if (!re.test(value)) {
    alert("Invalid input value, enter only numbers and/or dot ");
  } else {
    var valueTd = e.target.parentElement.nextElementSibling;
    var usd = data.data.filter(function (cur) {
      return cur.id == currencyId;
    })[0].quote.USD.price;
    var usersValue = (usd * value).toFixed(2);
    localStorage.setItem("currencyId" + currencyId, usersValue);
    valueTd.innerHTML = "$ ".concat(usersValue);
  }

  e.target.disabled = true;
  e.target.previousElementSibling.previousElementSibling.value = "";
}

function curencyInfo(e) {
  var currencyId = e.target.parentElement.parentElement.getAttribute("data-id"); //apiCallForCurrencyInfo(currencyId);

  mimicApiCallForCurrencyInfo(currencyId);
}

function mimicApiCallForCurrencyInfo(currencyId) {
  localStorage.setItem("currencyPage", currencyId);
  loader.classList.remove("d-none");
  homePage.classList.add("d-none");
  currencyInfoData = data.data.filter(function (cur) {
    return cur.id == currencyId;
  })[0];
  setTimeout(function () {
    showInfoData();
  }, 500);
}

function showInfoData() {
  var _currencyInfoData = currencyInfoData,
      name = _currencyInfoData.name,
      quote = _currencyInfoData.quote,
      date_added = _currencyInfoData.date_added;
  var aboutHtml = "\n        <h1>Name: ".concat(name, " </h1>\n        <h2>Value: $ ").concat(quote.USD.price.toFixed(2), " </h2>\n        <h2>Date added: ").concat(new Date(date_added).toLocaleDateString("de-CH"), " </h2>\n    ");
  aboutDiv.innerHTML = aboutHtml;
  aboutPage.classList.remove("d-none");
  loader.classList.add("d-none");
}

function backToHomeFunc() {
  localStorage.removeItem("currencyPage");
  loader.classList.remove("d-none");
  aboutPage.classList.add("d-none");
  mimicApiCall(1);
  setTimeout(function () {
    loader.classList.add("d-none");
    homePage.classList.remove("d-none");
  }, 500);
}

function pagination(page) {
  mimicApiCall(page);
}
