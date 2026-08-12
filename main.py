from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import stripe
import os
import uuid
from scraper import obtener_vuelos_google, ejecutar_inyeccion
from database import guardar_sesion_viajero, obtener_sesion_viajero, limpiar_sesion_viajero

app = FastAPI(title="Vuelos Sin Estrés API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Stripe listo para producción o modo prueba gratuito
stripe.api_key = os.getenv("STRIPE_API_KEY", "sk_test_tu_llave_aqui")

class BusquedaData(BaseModel):
    origen: str
    destino: str
    fecha: str

class UserTravelData(BaseModel):
    session_id: str
    nombres_completos: str
    apellidos_latino: str
    documento_pasaporte: str
    email: str
    whatsapp_contacto: str
    airline_url: str

@app.post("/api/buscar-vuelos-google")
async def buscar_vuelos(data: BusquedaData):
    """Llama a Google por detrás del telón y nos da las 3 opciones limpias."""
    resultados = await obtener_vuelos_google(data.origen, data.destino, data.fecha)
    return {"success": True, "opciones": resultados}

@app.post("/api/guardar-datos-viajero")
def guardar_datos_previos(data: UserTravelData):
    """Guarda la información obligatoria antes de que el algoritmo dinámico reaccione."""
    session_id = str(uuid.uuid4())
    guardar_sesion_viajero(session_id, data.dict())
    return {"success": True, "session_id": session_id}

@app.post("/api/inyectar-vuelo-seleccionado")
async def inyectar_vuelo(session_id: str, airline_url: str):
    """Recupera los datos del cliente y los dispara hacia la aerolínea de inmediato."""
    datos_usuario = obtener_sesion_viajero(session_id)
    if not datos_usuario:
        raise HTTPException(status_code=404, detail="Sesión expirada o no encontrada.")
    
    resultado = await ejecutar_inyeccion(airline_url, datos_usuario)
    return {"success": True, "resultado": resultado}

@app.post("/api/cobrar-comision-exito")
def cobrar_comision(session_id: str, payment_method_id: str):
    """Cobra los USD 25.99 fijos solo si todo salió perfecto en la aerolínea."""
    try:
        intent = stripe.PaymentIntent.create(
            amount=2599,  # $25.99 dólares en centavos
            currency="usd",
            payment_method=payment_method_id,
            confirm=True,
            automatic_payment_methods={'enabled': True, 'allow_redirects': 'never'}
        )
        limpiar_sesion_viajero(session_id)
        return {"success": True, "payment_intent_id": intent.id}
    except stripe.error.CardError as e:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=f"HARD LOCK ACTIVADO: {e.user_message}"
        )
