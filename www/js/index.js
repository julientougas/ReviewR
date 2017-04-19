/*****************************************************************
File: index.js
Author: Julien Tougas
Description: ReviewR app
Version: 0.0.1
Updated: April 7, 2017
*****************************************************************/
var key = "reviewr-toug0008"
    , reviewsLocal = {
        reviews: []
    }
    , stars = null
    , rating = 0
    , currentId = ""
    , imageLocal = null
    , closeMod = new CustomEvent('touchend', {
        bubbles: true
        , cancelable: true
    });
var app = {
    initialize: function () {
        document.addEventListener('deviceready', app.deviceReady);
    }
    , deviceReady: function () {
        console.log("1 deviceReady " + Date.now());
        if (StatusBar.isVisible) {
            StatusBar.hide();
        }
        else {
            StatusBar.show();
        }
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, JSON.stringify(reviewsLocal));
        }
        else {
            reviewsLocal = JSON.parse(localStorage.getItem(key));
        }
        document.querySelector("#takePicBtn").addEventListener('touchend', app.takePic);
        document.querySelector("#cancelBtn").addEventListener('touchend', app.closeModal);
        document.querySelector("#saveBtn").addEventListener('touchend', app.save);
        app.addStarListeners();
        app.display();
    }
    , takePic: function (ev) {
        console.log("takePic");
        ev.preventDefault();
        navigator.camera.getPicture(app.successCallback, app.errorCallback, {
            quality: 50
            , destinationType: Camera.DestinationType.FILE_URI
            , allowEdit: true
            , targetWidth: 300
            , targetHeight: 300
        });
    }
    , addStarListeners: function () {
        console.log("2 addStarListeners");
        stars = document.querySelectorAll(".star");
        rating = 0;
        app.setRating();
        stars.forEach.call(stars, function (star, index) {
            star.addEventListener('click', (function (idx) {
                return function () {
                    rating = idx + 1;
                    console.log('Rating is now', rating)
                    app.setRating();
                }
            })(index));
        });
    }
    , successCallback: function (imageURI) {
        console.log("successCallback");
        imageLocal = imageURI;
    }
    , errorCallback: function (message) {
        alert('Failed because: ' + message);
    }
    , closeModal: function (ev) {
        console.log("closeModal");
        ev.preventDefault();
        document.querySelector('#closePic').dispatchEvent(closeMod);
    }
    , setRating: function () {
        console.log("setRating");
        stars.forEach.call(stars, function (star, index) {
            if (rating > index) {
                star.classList.add('rated');
            }
            else {
                star.classList.remove('rated');
            }
        });
    }
    , save: function (ev) {
        console.log("save");
        ev.preventDefault();
        var item = document.querySelector("#itemForm");
        console.log(imageLocal);
        var reviewOBJ = {
            id: Date.now()
            , item: item.value
            , rating: rating
            , img: imageLocal
        }
        console.log(reviewOBJ);
        reviewsLocal.reviews.push(reviewOBJ);
        localStorage.setItem(key, JSON.stringify(reviewsLocal));
        document.querySelector('#closePic').dispatchEvent(closeMod);
        app.display();
    }
    , display: function () {
        console.log("3 display " + document.querySelector("#itemForm").value);
        document.querySelector("#itemForm").value = "";
        var ul = document.querySelector('#reviewList');
        ul.innerHTML = "";
        reviewsLocal.reviews.forEach(function (review, index) {
            var li = document.createElement("li")
                , a = document.createElement("a")
                , img = document.createElement("img")
                , div = document.createElement("div")
                , p = document.createElement("p");
            for (i = 0; i < 5; i++) {
                var span = document.createElement("span");
                if (i < review.rating) {
                    span.classList.add("rated");
                }
                span.classList.add("star");
                span.innerHTML = "&nbsp;";
                div.appendChild(span);
            }
            //app.setRating(review.rating);
            li.classList.add("table-view-cell", "media");
            li.setAttribute("data-num", review.id);
            a.classList.add("navigate-right");
            a.setAttribute("href", "#delModal");
            img.classList.add("media-object", "pull-left");
            img.setAttribute("src", review.img);
            div.classList.add("media-body");
            p.innerHTML = review.item;
            li.appendChild(a);
            a.appendChild(img);
            a.appendChild(p);
            a.appendChild(div);
            a.addEventListener('touchend', app.displayDelete);
            ul.appendChild(li);
        })
        console.log(reviewsLocal);
    }
    , displayDelete: function (ev) {
        currentId = ev.currentTarget.parentElement.getAttribute("data-num");
        console.log(currentId);
        document.querySelector("#delBtn").addEventListener('touchend', app.delete);
        var delContent = document.querySelector("#delContent");
        delContent.innerHTML = "";
        reviewsLocal.reviews.forEach(function (review) {
            if (review.id == currentId) {
                var delImg = document.createElement("img")
                    , delDiv = document.createElement("div")
                    , delP = document.createElement("p");
                delP.innerHTML = review.item;
                for (i = 0; i < 5; i++) {
                    var delSpan = document.createElement("span");
                    if (i < review.rating) {
                        delSpan.classList.add("rated");
                    }
                    delSpan.classList.add("star");
                    delSpan.innerHTML = "&nbsp;";
                    delDiv.appendChild(delSpan);
                }
                delImg.classList.add("media-object");
                delImg.id = "delImg";
                delImg.setAttribute("src", review.img);
                delDiv.classList.add("media-body");
                delContent.appendChild(delImg);
                delContent.appendChild(delP);
                delContent.appendChild(delDiv);
                document.querySelector("#delImg").style.width = "20rem";
                document.querySelector("#delImg").style.height = "20rem";
            }
        });
    }
    , delete: function () {
        reviewsLocal.reviews.forEach(function (review, index) {
            if (review.id == currentId) {
                reviewsLocal.reviews.splice(index, 1);
            }
        });
        localStorage.setItem(key, JSON.stringify(reviewsLocal));
        document.querySelector('#closeDel').dispatchEvent(closeMod);
        document.querySelector('#delBtn').removeEventListener('touchend', app.delete);
        app.display();
    }
};
app.initialize();