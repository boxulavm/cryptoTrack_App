document.addEventListener("DOMContentLoaded", function() {

    // Becuase of CoinMarketCap restriction of making request with javascript, i used hard coded data from their service, and mimic API calls as a prove of concept, also i left function which calls API in code but not using them.
    
    // Note: Making HTTP requests on the client side with Javascript is currently prohibited through CORS configuration.
    // Whole note on https://coinmarketcap.com/api/documentation/v1/#section/Quick-Start-Guide

    // setInterval(() => {
    //   apiCall();  
    // }, 60000);
    
    const currencyPage  = localStorage.getItem("currencyPage");
        
    if(currencyPage === null){
        mimicApiCall(1);
    } else {
        mimicApiCallForCurrencyInfo(currencyPage);
    }

});

const loader     = document.getElementById("loader");
const dataTable  = document.getElementById("dataTable");
const tbody      = document.getElementById("tableBody");
const homePage   = document.getElementById("homePage");
const aboutPage  = document.getElementById("aboutPage");
const backToHome = document.getElementById("backToHome");
const aboutDiv   = document.getElementById("aboutDiv");

const paginationDiv = document.getElementById("pagination");

let currencyInfoData;

document.addEventListener("keyup",inputKeyPress);
document.addEventListener("click",clickListener);
backToHome.addEventListener("click",backToHomeFunc);

async function apiCall(){

    const target = "https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=";
    const apiKey = "b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c";
    const qStr   = "&limit=50&sort=price";

    const config = {
        "mode" : "no-cors"
    };
    
    const response = await fetch(`${target}${apiKey}${qStr}`, config);
    const resData  = await response.json();
    data = resData;
}

async function apiCallForCurrencyInfo(id){

    const target = "https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/info?CMC_PRO_API_KEY=";
    const apiKey = "b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c";
    const qStr   = "&id="+id;

    const config = {
        "mode" : "no-cors"
    };

    const response = await fetch(`${target}${apiKey}${qStr}`, config);
    const resData  = await response.json();

    currencyInfoData = resData.data;
}

function mimicApiCall(page){
    loader.classList.remove("d-none");
    dataTable.classList.add("d-none");
    setTimeout(() => {
       displayData(data,page);
    }, 500);
}

function displayData({data},page){

    let html = "";
    
    [...paginationDiv.children].forEach(function(elem) {
        if(elem.innerHTML != page){
            elem.classList.remove("active");
        } else {
            elem.classList.add("active");
        }
     });

    if(page === 1){
        document.getElementById("pagination").firstElementChild.classList.add("active");
    }
    
    data.forEach((element,index) => {

        if(index+1 > (page-1)*10 && index+1 < page*10+1){

            const { id, name, symbol, quote} = element;
            const value     = quote.USD.price.toFixed(2);
            const changed   = quote.USD.percent_change_24h.toFixed(2);
            const className = changed < 0 ? "text-danger" : "text-success";
            let userData    = localStorage.getItem("currencyId"+id);
            
            if(userData === null){
                userData = '0.00';
            }

            html += `
            <tr data-id="${id}" data-order="${index}">
                <td><span class='currencyName'>${name}</span></td>
                <td>${symbol}</td>
                <td>$ ${value}</td>
                <td class=${className}>${changed} %</td>
                <td>
                    <input class='amountInput' type='text' />
                    <br>
                    <button class='submitBtn' disabled>Submit</button>
                </td>
                <td>$ ${userData}</td>
            </tr>
            `;

        }
    });

    tbody.innerHTML = html;

    loader.classList.add("d-none");
    dataTable.classList.remove("d-none");
    paginationDiv.classList.remove("d-none");
}

function inputKeyPress(e){

    if(e.keyCode === 13 && e.target.classList.contains("amountInput")){
        e.target.nextElementSibling.nextElementSibling.click();
    }
    
    if(e.target.classList.contains("amountInput")){
        const value     = e.target.value;
        const submitBtn = e.target.nextElementSibling.nextElementSibling;

        if(value){
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }

    }
}

function clickListener(e){
    if(e.target.classList.contains("submitBtn")){
        submited(e);
    } else if (e.target.classList.contains("currencyName")){
        curencyInfo(e);
    } else if (e.target.parentElement.classList.contains("pagination")) {
        pagination(e.target.innerHTML);
    }  else {
        return;
    }
}

function submited(e){

    const currencyId = e.target.parentElement.parentElement.getAttribute("data-id");
    const value      = e.target.previousElementSibling.previousElementSibling.value;
    const re = /^\d+(\.\d+)*$/;

    console.log(value);

    if(!re.test(value)) {
       alert("Invalid input value, enter only numbers and/or dot ");
    } else {

        const valueTd    = e.target.parentElement.nextElementSibling;

        const usd = data.data.filter(cur => cur.id == currencyId)[0].quote.USD.price;
        const usersValue = (usd*value).toFixed(2);

        localStorage.setItem("currencyId"+currencyId, usersValue);
        valueTd.innerHTML = `$ ${usersValue}`;

    }

    e.target.disabled = true;
    e.target.previousElementSibling.previousElementSibling.value = "";

}

function curencyInfo(e){

    const currencyId = e.target.parentElement.parentElement.getAttribute("data-id");

    //apiCallForCurrencyInfo(currencyId);
    mimicApiCallForCurrencyInfo(currencyId);
}

function mimicApiCallForCurrencyInfo(currencyId){

    localStorage.setItem("currencyPage",currencyId);

    loader.classList.remove("d-none");
    homePage.classList.add("d-none");

    currencyInfoData = data.data.filter(cur => cur.id == currencyId)[0];

    setTimeout(() => {
        showInfoData();
    }, 500);

}

function showInfoData(){
    
    const { name, quote, date_added } = currencyInfoData;

    const aboutHtml = `
        <h1>Name: ${name} </h1>
        <h2>Value: $ ${quote.USD.price.toFixed(2)} </h2>
        <h2>Date added: ${new Date(date_added).toLocaleDateString("de-CH")} </h2>
    `;

    aboutDiv.innerHTML = aboutHtml;

    aboutPage.classList.remove("d-none");
    loader.classList.add("d-none");
}

function backToHomeFunc(){
    
    localStorage.removeItem("currencyPage");

    loader.classList.remove("d-none");
    aboutPage.classList.add("d-none");

    mimicApiCall(1);
    setTimeout(() => {
        loader.classList.add("d-none");
        homePage.classList.remove("d-none");
    }, 500);
 
}

function pagination(page){
    mimicApiCall(page);
}