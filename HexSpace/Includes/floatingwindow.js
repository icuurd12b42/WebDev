//the movement code works on floating-window and it expects the header element
//<div class="floating-window">
//		<div class="header"> REQUIRES THIS ELEMENT to pass to setFloatingWindowHeader
//		  Console
//		  <button class="xbutton">&#10006</button>
//		</div>
//...

let __hasCapture = null;

function setFloatingWindowHeader(headerElement) {
    headerElement.addEventListener('mousedown', (event) => {
        setCapture(event.target);
        document.addEventListener('mousemove', onMouseMove);
    });
}

function setCapture(element) {
    releaseCapture();

    __hasCapture = element;
    element.addEventListener('mouseup', releaseCapture);
}

function releaseCapture() {
    if (__hasCapture) {
        __hasCapture.removeEventListener('mouseup', releaseCapture);
        document.removeEventListener('mousemove', onMouseMove);

        __hasCapture = null;
    }
}

function onMouseMove(event) {
    if (!__hasCapture) {
        return;
    }

    const deltaX = event.movementX;
    const deltaY = event.movementY;
    const left = parseInt(window.getComputedStyle(__hasCapture.parentNode).getPropertyValue('left'));
    const top = parseInt(window.getComputedStyle(__hasCapture.parentNode).getPropertyValue('top'));
    __hasCapture.parentNode.style.left = `${left + deltaX}px`;
    __hasCapture.parentNode.style.top = `${top + deltaY}px`;
}
