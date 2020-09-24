// document ready
$(function() {
    dataI18n();

    // initially check if a signature is already present
    browser.runtime.sendMessage({ type: "isSignaturePresent" }).then(response => {
        // on/off button ...
        $("#onOffButtonContainer").append(Mustache.render(ON_OFF_BUTTON, {
            class: response.result === true ? "btn-danger" : "btn-success",
            image: response.result === true ? "toggle-off" : "toggle-on",
            text: response.result === true ? i18n("composeOnOffButtonOff") : i18n("composeOnOffButtonOn")
        }));
        $("#onOffButton").on("click", () => {
            browser.runtime.sendMessage({
                type: "switchSignature",
                value: response.result === true ? "off" : "on"
            });
            window.close();
        });
        browser.storage.local.get().then(localStorage => {
            if (!localStorage.signatures || localStorage.signatures.length === 0) {
                $("#onOffButton").addClass("disabled");
            }
        });
        // signature-buttons ...
        browser.storage.local.get().then(localStorage => {
            if (localStorage.signatures) {
                localStorage.signatures.forEach(signature => {
                    $("#signatureButtonsContainer").append(Mustache.render(SIGNATURE_BUTTON, {
                        id: signature.id,
                        name: truncateString(signature.name)
                    }));
                    $("#signatureButton-" + signature.id).on("click", () => {
                        browser.runtime.sendMessage({
                            type: "insertSignature",
                            value: signature.id
                        });
                        window.close();
                    });
                });
            }
        });
    });

    // options-button ...
    $("#optionsButton").on("click", () => {
        openOptions(() => {
            window.close();
        });
    });
});

