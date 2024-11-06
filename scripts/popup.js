// popup.js (hoặc file khác của bạn)

import { showSuccessMessage, showErrorMessage, copyToClipboard, customURL, customURL2, addDescriptionToList } from './function.js';

document.addEventListener('DOMContentLoaded', function () {
    var shortenButton = document.getElementById("shorten");
    var listButton = document.getElementById("list");

    function loadPage(page) {
        fetch(page)
            .then(response => response.text())
            .then(html => {
                document.getElementById("popup-content").innerHTML = html;
                if (page === 'list.html') {
                    setupListPage();
                }
            })
            .catch(err => console.error('Error loading page:', err));
    }

    listButton.addEventListener('click', function () {
        loadPage('list.html');
    });

    function getCurrentTabURL(callback) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const currentTab = tabs[0];
            const url = currentTab.url;
    
            // Kiểm tra xem URL có bắt đầu bằng "chrome://", "about://", hoặc "file://" không
            const invalidProtocols = ['chrome://', 'about://', 'file://'];
            const isValidURL = !invalidProtocols.some(protocol => url.startsWith(protocol));
    
            if (isValidURL) {
                callback(url);
            } else {
                console.error('Invalid URL:', url);
                callback(null); // Hoặc xử lý trường hợp URL không hợp lệ
            }
        });
    }

    const alertBox = document.querySelector('.alert');

    getCurrentTabURL(function (longURL) {
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
            })
          };
          
          fetch('https://api.short.io/links/public', options)
            .then(response => response.json())
            .then(response => {
                if (response.shortURL) {
                    const shortURL = response.shortURL;
                    document.getElementById("shorturl").value = shortURL;
                } else {
                    console.log('This website cannot shorten URL');
                    alertBox.style.width = '240px';
                    setTimeout(() => {
                        alertBox.style.width = '240px';
                        showErrorMessage("This site cannot shorten URL", alertBox);
                    }, 0); 
                }
                
                
            })
            .catch(err => console.error(err))
    });

    shortenButton.addEventListener('click', function () {
        getCurrentTabURL(function (longURL) {
            var customURLValue = document.getElementById("customurl").value;
            if (!customURLValue) {
                customURL2(longURL, alertBox);
            } else {
                customURL(longURL, customURLValue, alertBox);
            }
        });
    });

    document.getElementById("copy").addEventListener('click', function () {
        var shortURL = document.getElementById("shorturl").value;
        copyToClipboard(shortURL, alertBox);
    });

    const buttonList = document.getElementById("list");
    buttonList.addEventListener('click', async () => {
        await chrome.action.setPopup({popup: 'list.html'});
        window.location.assign('list.html');
    });

    const addButton = document.getElementById('add');
    const addForm = document.getElementById('add-form');
    const addDescription = document.getElementById('add-description');
    const formContainer = document.querySelector('.form');

    addButton.addEventListener('click', function () {
        addForm.classList.toggle('hidden');
        if (!addForm.classList.contains('hidden')) {
            formContainer.style.height = '415px';
            addButton.textContent = 'CANCEL';
            addButton.style.background = '#da4328';
            setTimeout(() => {
                addForm.classList.remove('hidden');
                addForm.classList.add('show');
            }, 200);
        } else {
            formContainer.style.height = '335px';
            addButton.textContent = 'ADD URL TO LIST';
            addButton.style.background = '#19b445';
            addForm.classList.add('hidden');
            addForm.classList.remove('show');
        }
    });

    addDescription.addEventListener('click', function() {
        const description = document.getElementById('description').value;
        const url = document.getElementById('shorturl').value;
        addDescriptionToList(description, url, alertBox);
    });
});
