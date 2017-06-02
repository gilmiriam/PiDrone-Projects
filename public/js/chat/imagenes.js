"use strict";
(function () {
    var modal = document.querySelector('.modal'); //target modal,
    var modalOverlay = document.querySelector('.modal-overlay'); //target modal overlay,
    var closeButton = document.querySelector('.modal-overlay__close'); //target close button,
    var modalImage = document.querySelector('.modal__img'); //target modal image,
    var images = document.querySelectorAll('.image-grid__img'); //target images;

    //loop through images
    for (var i = 0; i < images.length; i++) {
        //in loop, add a 'click' event listener to each image
        images[i].addEventListener('click', openModalEvent);
    }

    //in the listener: 
    //1. toggle the 'closed' class on the modal, 
    function openModalEvent(evt) {
        modal.classList.toggle('closed');

        //2. toggle the 'closed' class on the modal overlay, and
        modalOverlay.classList.toggle('closed');

        //3. set the value of the src attribute of the modal image to the target of the event's src attribute. 
        //To get the right size you'll need to use this on the src: .replace('300x200', '560x360')
        modalImage.src = evt.target.src.replace('300x200', '560x360');
    }

    //add a 'click' event listener to the close button
    closeButton.addEventListener('click', closeButtonEvent);

    //in the listener: 1. use stopPropagation() on the event (to stop bubbling), 

    function closeButtonEvent() {
        closeButtonEvent.stopPropagation();
        //2. toggle the 'closed' class on the modal, and
        modal.classList.toggle('closed');

        //3. toggle the 'closed' class on the modal overlay.
        modalOverlay.classList.toggle('closed');
    }

    //add a 'click' event listener to the modal overlay
    modalOverlay.addEventListener('click', closeModalEvent);

    //in the listener: 1. toggle the 'closed' class on the modal, and
    function closeModalEvent() {
        modal.classList.toggle('closed');

        //2. toggle the 'closed' class on the modal overlay.
        modalOverlay.classList.toggle('closed');
    }

})();