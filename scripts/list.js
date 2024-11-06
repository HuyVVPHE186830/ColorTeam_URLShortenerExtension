import { showSuccessMessage, showErrorMessage, copyToClipboard } from './function.js';

document.addEventListener('DOMContentLoaded', function () {
    const buttonBack = document.getElementById("back");
    buttonBack.addEventListener('click', async () => {
        await chrome.action.setPopup({ popup: 'popup.html' });
        window.location.assign('popup.html');
    });
    const alertBox = document.querySelector('.alert');
    const urlListContainer = document.getElementById('url-list');

    // Load URLs from Chrome storage
    chrome.storage.sync.get({ urls: [] }, function (result) {
        const urls = result.urls;

        // Clear existing content
        urlListContainer.innerHTML = '';

        // Display URLs and descriptions
        urls.slice().reverse().forEach(({ description, url }, reversedIndex) => {
            const listItem = document.createElement('div');
            listItem.className = 'url-item';

            const urlHeader = document.createElement('div');
            urlHeader.className = 'url-header';

            const descriptionElement = document.createElement('strong');
            descriptionElement.textContent = description;
            descriptionElement.onclick = () => window.open(url, '_blank');

            const toggleButton = document.createElement('button');
            toggleButton.innerHTML = '▼';
            toggleButton.className = 'accordion-toggle';
            toggleButton.onclick = () => {
                listItem.classList.toggle('open');
            };

            urlHeader.appendChild(descriptionElement);
            urlHeader.appendChild(toggleButton);

            // URL content with actions (initially hidden)
            const urlContent = document.createElement('div');
            urlContent.className = 'url-content';

            // Create delete button
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteButton.className = 'delete-btn';
            deleteButton.title = 'Delete';
            deleteButton.onclick = function () {
                // Calculate the correct index in the original (non-reversed) array
                const originalIndex = urls.length - 1 - reversedIndex;

                // Remove the URL from the storage
                urls.splice(originalIndex, 1);
                chrome.storage.sync.set({ urls: urls }, function () {
                    // Remove the list item from the UI
                    listItem.remove();
                    console.log('URL removed:', url); // Debugging output
                });
            };

            // Shorturl input
            const inputContainerLink = document.createElement('div');
            inputContainerLink.className = 'input-container';

            const inputFieldLink = document.createElement('input');
            inputFieldLink.type = 'text';
            inputFieldLink.className = 'input';
            inputFieldLink.value = url;

            const copyButton = document.createElement('button');
            copyButton.className = 'input-button btn btn1';
            copyButton.title = 'Copy to Clipboard';
            copyButton.innerHTML = '<i class="fa fa-copy"></i>';

            copyButton.onclick = function () {
                inputFieldLink.select();
                navigator.clipboard.writeText(inputFieldLink.value).then(() => {
                    copyToClipboard(inputFieldLink.value, alertBox);
                });
            };

            const cutDiv = document.createElement('div');
            cutDiv.className = 'cut c2';

            const label = document.createElement('label');
            label.htmlFor = 'shorturl';
            label.className = 'placeholder';
            label.textContent = 'Shortened URL';
            
            inputContainerLink.appendChild(inputFieldLink);
            inputContainerLink.appendChild(copyButton);
            inputContainerLink.appendChild(cutDiv);
            inputContainerLink.appendChild(label);

            // Description input
            const inputContainerDescription = document.createElement('div');
            inputContainerDescription.className = 'input-container description';
            const inputFieldDescription = document.createElement('input');
            inputFieldDescription.type = 'text';
            inputFieldDescription.value = description;
            inputFieldDescription.className = 'input';
            inputFieldDescription.placeholder = 'Description here';
            
            const editButton = document.createElement('button');
            editButton.className = 'input-button btn btn1';
            editButton.title = 'Edit Description';
            editButton.innerHTML = '<i class="fa fa-pencil"></i>';
            
            editButton.onclick = function () {
                alert("Description input value: " + inputFieldDescription.value);
            };

            const label2 = document.createElement('label');
            label2.htmlFor = 'shorturl';
            label2.className = 'placeholder';
            label2.textContent = 'Description';

            inputContainerDescription.appendChild(inputFieldDescription);
            inputContainerDescription.appendChild(editButton);
            inputContainerDescription.appendChild(cutDiv);
            inputContainerDescription.appendChild(label2);

            // Custom input
            const inputContainerCustom = document.createElement('div');
            inputContainerCustom.className = 'input-container custom';
            const inputFieldCustom = document.createElement('input');
            inputFieldCustom.type = 'text';
            inputFieldCustom.className = 'input';
            inputFieldCustom.value = 'Custom URL here';

            const customButton = document.createElement('button');
            customButton.className = 'input-button btn btn1';
            customButton.title = 'Customize URL';
            customButton.innerHTML = '<i class="fa fa-angle-double-right"></i>';

            customButton.onclick = function () {
                alert("Custom URL value: " + inputFieldCustom.value);
            };

            inputContainerCustom.appendChild(inputFieldCustom);
            inputContainerCustom.appendChild(customButton);

            urlContent.appendChild(deleteButton);
            urlContent.appendChild(inputContainerLink);
            urlContent.appendChild(inputContainerDescription);
            urlContent.appendChild(inputContainerCustom);

            listItem.appendChild(urlHeader);
            listItem.appendChild(urlContent);
            urlListContainer.appendChild(listItem);
        });
    });
});
