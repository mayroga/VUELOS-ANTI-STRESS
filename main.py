from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import stripe
import os
from scraper import ejecutar_inyeccion  # Importamos nuestro módulo Playwright

app = FastAPI(title="Vuelos Sin Estrés API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

stripe.api_key = os.getenv("STRIPE_API_KEY", "sk_test_tu_llave_de_prueba")

class UserTravelData(BaseModel):
    nombres_completos: str
    apellidos_latino: str
    fecha_nacimiento: str
    genero: str
    documento_pasaporte: str
    pais_emision: str
    whatsapp_contacto: str
    email: str
    direccion_facturacion: str
    airline_url: str  # URL de la aerolínea elegida por el usuario

@app.get("/")
def read_root():
    return {"status": "El motor de Vuelos Sin Estrés está activo y listo"}

@app.post("/api/seleccionar-y-comprar-vuelo")
async def seleccionar_y_comprar(data: UserTravelData):
    """
    Endpoint principal: El cliente elige su vuelo y el bot dispara 
    la inyección a la velocidad de la luz para ganarle al algoritmo.
    """
    # Convertimos los datos del modelo a diccionario para el scraper
    datos_dict = data.dict()
    
    # Ejecutamos la automatización en segundo plano con Playwright
    resultado_scraper = await ejecutar_inyeccion(data.airline_url, datos_dict)
    
    if resultado_scraper.get("status") == "error":
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error en la automatización: {resultado_scraper.get('detalle')}"
        )
        
    return {
        "success": True,
        "resultado_navegacion": resultado_scraper
    }

@app.post("/api/cobrar-comision-exito")
def cobrar_comision(payment_method_id: str, amount: int = 2599):
    # Cobro condicional de los USD 25.99 vía Stripe solo si el vuelo fue exitoso
    try:
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency="usd",
            payment_method=payment_method_id,
            confirm=True,
            automatic_payment_methods={
                'enabled': True,
                'allow_redirects': 'never'
            }
        )
        return {"success": True, "payment_intent_id": intent.id}
    except stripe.error.CardError as e:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=f"Fallo en la comisión de servicio: {e.user_message}"
        )
