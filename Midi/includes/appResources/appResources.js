





uiRes.addImageFile("clickdragR","includes/appResources/clickdragR.png?C="+Arrgh);
uiRes.addImageFile("clickdragD","includes/appResources/clickdragD.png?C="+Arrgh);
uiRes.addImageFile("clickdragL","includes/appResources/clickdragL.png?C="+Arrgh);
uiRes.addImageFile("clickdragU","includes/appResources/clickdragU.png?C="+Arrgh);
uiRes.addImageFile("clickdragLR","includes/appResources/clickdragLR.png?C="+Arrgh);
uiRes.addImageFile("clickdragUD","includes/appResources/clickdragUD.png?C="+Arrgh);

uiRes.addImageFile("usb_connected","includes/appResources/usb/usb_connected.png?C="+Arrgh);
uiRes.addImageFile("usb_disconnected","includes/appResources/usb/usb_disconnected.png?C="+Arrgh);

uiRes.addImageFile("toggle_on","includes/appResources/toggle/toggle_on.png?C="+Arrgh);
uiRes.addImageFile("toggle_off","includes/appResources/toggle/toggle_off.png?C="+Arrgh);

uiRes.addImageFile("show","includes/appResources/ShowHide/show.png?C="+Arrgh);
uiRes.addImageFile("hide","includes/appResources/ShowHide/hide.png?C="+Arrgh);

uiRes.addImageFile("unmute","includes/appResources/MuteUnmute/unmute.png?C="+Arrgh);
uiRes.addImageFile("mute","includes/appResources/MuteUnmute/mute.png?C="+Arrgh);

uiRes.loadImageFiles(onImagesLoaded);


var imagesOK = false;
function onImagesLoaded()
{
    imagesOK = true;
    uiRes.imagesArray.forEach (entry => {imagesOK = imagesOK && (entry.status == "loaded")});
    if(imagesOK)
        ;//console.log("onImagesLoaded","Success! All image resources loaded.");
    else
        console.warn("onImagesLoaded","Problem! Some image resources failed to load.");
}
