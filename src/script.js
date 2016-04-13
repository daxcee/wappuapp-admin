"use strict";

var minId = null;

window.onload = function() {
  search();

 $(window).scroll(function () {
    if ($(document).height() <= $(window).scrollTop() + $(window).height()) {
      search(minId);
    }
 });
};

function handleEvents(events) {
  var images = document.getElementById("images");
  events.filter(function(e) {
    return e.type === "IMAGE"
  }).forEach(function(item) {
    addImage(item, images);
    minId = item.id;
  });

  $("img.lazy").lazyload({effect: "fadeIn"});
}

function addImage(event, images) {
  var div = document.createElement("div");
  div.setAttribute("class", "Cell -3of12");

  var user = document.createElement("div");
  user.innerHTML = event.author.name;
  div.appendChild(user);

  var oImg=document.createElement("img");
  oImg.setAttribute('data-original', event.url);
  oImg.setAttribute('src', "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");
  oImg.setAttribute('alt', 'na');
  oImg.setAttribute('class', 'lazy');
  div.appendChild(oImg);

  images.appendChild(div);
}

function search(beforeId) {
    var url = "/feed" + (beforeId !== undefined ? "?beforeId=" + beforeId : "");

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.withCredentials = true;

    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var events = JSON.parse(xmlhttp.responseText);
        console.log(events);
        handleEvents(events);
      }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}
