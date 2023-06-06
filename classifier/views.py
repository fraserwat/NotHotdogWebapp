from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render
from gradio_client import Client
import tempfile
import base64
import json


def predict_image(image_stream):
    # Pass the path of the temporary file to the predict method
    client = Client("https://fraserwatt-not-hotdog.hf.space/")
    result_file_path = client.predict(image_stream, api_name="/predict")

    with open(result_file_path, "r") as f:
        result = json.load(f)["label"]
    return result

# Create your views here.
def home(request):
    return render(request, "classifier/home.html")

@csrf_exempt
def take_photo(request):
    if request.method == "POST":
        # The image is sent as a data URL
        image_data_url = request.POST["image"]
        image_data = base64.b64decode(image_data_url.split(",", 1)[-1])

        # Create a temporary file
        with tempfile.NamedTemporaryFile(delete=True) as temp:
            # Write the uploaded file to the temporary file
            temp.write(image_data)
            temp.flush()  # Ensure all data is written

            result = predict_image(temp.name)

            return JsonResponse({"result": result})
    elif request.method == "GET":
        return render(request, "classifier/take_photo.html")
    else:
        return HttpResponse("Invalid request", status=400)
