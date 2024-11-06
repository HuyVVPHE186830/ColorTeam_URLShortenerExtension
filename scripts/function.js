export function showSuccessMessage(message, alertBox) {
    const icon = alertBox.querySelector("#icon");
    const messageDiv = alertBox.querySelector("#message");
    icon.classList.remove("fa-times-circle");
    icon.classList.add("fa-check-circle");
    messageDiv.innerText = message;
    alertBox.style.background = "#23c552";
    alertBox.style.right = '30px';
    setTimeout(() => {
        alertBox.style.right = '-500px';
    }, 3000);
}

export function showErrorMessage(message, alertBox) {
    const icon = alertBox.querySelector("#icon");
    const messageDiv = alertBox.querySelector("#message");
    icon.classList.remove("fa-check-circle");
    icon.classList.add("fa-times-circle");
    messageDiv.innerText = message;
    alertBox.style.background = "#da4328";
    alertBox.style.right = '30px';
    setTimeout(() => {
        alertBox.style.right = '-500px';
    }, 3000);
}

export function copyToClipboard(text, alertBox) {
    navigator.clipboard.writeText(text).then(() => {
        setTimeout(() => {
            alertBox.style.width = '180px';
            showSuccessMessage("Copy successfully!", alertBox);
        }, 0);
    }).catch(err => {
        setTimeout(() => {
            alertBox.style.width = '150px';
            showErrorMessage("Copy failed!", alertBox);
        }, 0);
    });
}

export function customURL(longURL, customURL, alertBox) {
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: 'pk_LsZXk3YkRRlLYURK'
        },
        body: JSON.stringify({
            domain: 'colorteam.site',
            originalURL: longURL,
            path: customURL
        })
    };

    fetch('https://api.short.io/links/public', options)
        .then(response => response.json())
        .then(response => {
            if (response.shortURL) {
                const shortURL = response.shortURL;
                document.getElementById("shorturl").value = shortURL;
                setTimeout(() => {
                    alertBox.style.width = '190px';
                    showSuccessMessage("Custom successfully!", alertBox);
                }, 0); 
            } else {
                showErrorMessage(response.message, alertBox);
            }


        })
        .catch(err => console.error(err))
}

export function customURL2(longURL, alertBox) {
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: 'pk_LsZXk3YkRRlLYURK'
        },
        body: JSON.stringify({
            domain: 'colorteam.site',
            originalURL: longURL
        })
    };

    fetch('https://api.short.io/links/public', options)
        .then(response => response.json())
        .then(response => {
            if (response.shortURL) {
                const shortURL = response.shortURL;
                document.getElementById("shorturl").value = shortURL;
                setTimeout(() => {
                    alertBox.style.width = '190px';
                    showSuccessMessage("Custom successfully!", alertBox);
                }, 0); 
            } else {
                showErrorMessage(response.message, alertBox);
            }


        })
        .catch(err => console.error(err))
}


export function addDescriptionToList(description, url, alertBox) {
    if (description && url) {
        chrome.storage.sync.get({ urls: [] }, function (result) {
            const urls = result.urls;
            urls.push({ description: description, url: url });
            chrome.storage.sync.set({ urls: urls }, function () {
                setTimeout(() => {
                    alertBox.style.width = '200px';
                    showSuccessMessage("URL added to the list!", alertBox);
                }, 0);
                document.getElementById('add-form').classList.add('hidden');
                document.querySelector('.form').style.height = '335px';
                document.getElementById('add').textContent = 'ADD URL TO LIST';
                document.getElementById('add').style.background = '#19b445';
            });
        });
    } else {
        setTimeout(() => {
            alertBox.style.width = '210px';
            showErrorMessage("Please add description!", alertBox);
        }, 0);
    }
}