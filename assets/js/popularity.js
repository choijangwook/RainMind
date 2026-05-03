document.addEventListener("DOMContentLoaded", function(){

let key = "views_" + window.location.pathname;
let count = localStorage.getItem(key) || 0;

count++;
localStorage.setItem(key, count);

});
