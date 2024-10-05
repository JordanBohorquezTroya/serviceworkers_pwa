from django.shortcuts import render
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from fcm_django.models import FCMDevice

@csrf_exempt
@require_http_methods(['POST'])
def guardar_token(request):
    body = request.body.decode('utf-8')
    bodyDict = json.loads(body)
    token = bodyDict['token']

    # Guarda o actualiza el token en la base de datos
    dispositivo, created = FCMDevice.objects.update_or_create(
        registration_id=token,
        defaults={'active': True, 'user': request.user if request.user.is_authenticated else None}
    )

    return JsonResponse({'Mensaje': 'Token guardado' if created else 'Token actualizado'})

def home(request):
    return render(request, 'index.html')
