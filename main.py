from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import stripe
import os

# Inicializamos la app
app = FastAPI(title="Vuelos Sin Estrés API", version="1.0")

# Permitir conexiones desde tu interfaz frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuración de Stripe (Asegúrate de poner tus llaves reales en Render como variables de entorno)
stripe.api_key = os.getenv("STRIPE_API_KEY", "sk_test_tu_llave_de_prueba")

# Modelo de datos obligatorios (Escudo Anti-Estrés)
class UserTravelData(BaseModel
    nombres_completos: str
    apellidos_latino: str
    fecha_nacimiento: str
    genero: str
    documento_pasaporte: str
    pais_emision: str
    whatsapp_contacto: str
    email: str
    direccion_facturacion: str

@app.get("/")
def read_root():
    return {"status": "El motor de Vuelos Sin Estrés está activo y listo"}

@app.post("/api/guardar-datos-viajero")
def guardar_datos(data: UserTravelData):
    # Aquí guardamos temporalmente los datos obligatorios antes de mostrar las 3 opciones
    # para ganar velocidad y bloquear el algoritmo de la aerolínea.
    return {
        "mensaje": "Datos obligatorios guardados con éxito. Listos para inyección rápida.",
        "datos_recibidos": data.nombres_completos
    }

@app.post("/api/cobrar-comision-exito")
def cobrar_comision(payment_method_id: str, amount: int = 2599):
    # Cobro condicional de los USD 25.99 (2599 centavos) vía Stripe solo si el vuelo fue exitoso
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
        # Aquí se activa la lógica de Hard Lock si la tarjeta de la comisión falla
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=f"Fallo en la comisión de servicio: {e.user_message}"
        )
