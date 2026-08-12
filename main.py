from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import stripe
import os
import uuid
from scraper import ejecutar_inyeccion
from database import guardar_sesion_viajero, obtener_sesion_viajero, limpiar_sesion_viajero

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
    airline_url: str

@app.get("/")
def read_root():
    return {"status": "El motor de Vuelos Sin Estrés está activo y listo"}

@app.post("/api/guardar-datos-viajero")
def guardar_datos_previos(data: UserTravelData):
    """
    Paso 2 del flujo: Guarda los datos antes de ver los vuelos 
    para ganar velocidad y bloquear el algoritmo dinámico de la aerolínea.
    """
    session_id = str(uuid.uuid4())
    guardar_sesion_viajero(session_id, data.dict())
    return {
        "success": True,
        "session_id": session_id,
        "mensaje": "Datos obligatorios guardados temporalmente con éxito."
    }

@app.post("/api/seleccionar-y-comprar-vuelo")
async def seleccionar_y_comprar(session_id: str, airline_url: str):
    """
    Paso 3 y 4: Recupera la sesión guardada y dispara el bot de Playwright de inmediato.
    """
    datos_usuario = obtener_sesion_viajero(session_id)
    
    if not datos_usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se encontraron los datos del viajero. Por favor reinicia el proceso."
        )
    
    # Ejecutamos la automatización con los datos recuperados
    resultado_scraper = await ejecutar_inyeccion(airline_url, datos_usuario)
    
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
def cobrar_comision(session_id: str, payment_method_id: str, amount: int = 2599):
    """
    Cobro final de los USD 25.99 vía Stripe tras confirmar la emisión del boleto.
    """
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
        # Limpiamos la memoria temporal por privacidad del usuario
        limpiar_sesion_viajero(session_id)
        return {"success": True, "payment_intent_id": intent.id}
    except stripe.error.CardError as e:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=f"Fallo en la comisión de servicio: {e.user_message}"
        )
