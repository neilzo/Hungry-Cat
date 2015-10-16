(function() {
  'use strict';
  var index = 0;
  var images = document.getElementById('carousel').children;
  var slideTime = 5000; //5s

  function reset() {
    for (var i = 1; i < images.length; i++) {
      images[i].style.opacity = 0;
    };
  }

  function carousel() {
    index++;
    if (index >= images.length) {
      reset();
      index = 0;
    }
    images[index].style.opacity = 1;
  }

  reset();
  setInterval(carousel, slideTime);
})();
