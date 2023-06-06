window.addEventListener("DOMContentLoaded", function () {
    let video = document.getElementById('video');
    let canvas = document.getElementById('canvas');
    let snap = document.getElementById('snap');
    let resultContainer = document.getElementById('result-container');
    let result = document.getElementById('result');
    let tickMark = document.getElementById('tick-mark');

    navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
        video.srcObject = stream;
        video.play();
    }).catch(function (err) {
        console.log(`Error: ${err}`);
    });

    snap.addEventListener("click", function () {
        let context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, 640, 480);

        // show canvas, hide video
        canvas.style.display = 'block';
        video.style.display = 'none';

        let image = canvas.toDataURL('image/png');

        // Remove the "data:image/png;base64," part from the data URL
        let imageData = image.split(",", 2)[1];

        let csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/take_photo/");
        xhr.setRequestHeader('X-CSRFToken', csrfToken);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let response = JSON.parse(xhr.responseText);
                let resultText = response.result;

                // Apply styles based on result value
                if (resultText === "Not Hotdog") {
                    result.classList.add('red');
                    result.classList.remove('green');
                } else {
                    result.classList.add('green');
                    result.classList.remove('red');
                }                
                result.classList.add('up-top');
                // update result and display tick mark
                result.textContent = resultText;
                resultContainer.style.display = 'block';
            }
        };

        xhr.send("image=" + encodeURIComponent(imageData));
    });

    // reset the application when clicking on canvas
    canvas.addEventListener("click", function () {
        if (canvas.style.display !== 'none') {
            // hide canvas, show video
            canvas.style.display = 'none';
            video.style.display = 'block';

            // clear canvas
            let context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);

            // hide result and tick
            resultContainer.style.display = 'none';
            tickMark.style.display = 'none';
        }
    });
});
