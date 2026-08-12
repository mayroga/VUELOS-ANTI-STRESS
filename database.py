# database.py - Gestión temporal de datos del viajero para el sistema anti-estrés

# Usamos un diccionario en memoria temporal para almacenar los datos del usuario
# durante el flujo de la aplicación antes de inyectarlos en la aerolínea.
_memoria_temporal_viajeros = {}

def guardar_sesion_viajero(session_id: str, datos_usuario: dict):
    """
    Guarda temporalmente los datos obligatorios del usuario asociados a un ID de sesión.
    Esto permite ganar velocidad al momento de ejecutar Playwright.
    """
    _memoria_temporal_viajeros[session_id] = datos_usuario
    return True

def obtener_sesion_viajero(session_id: str):
    """
    Recupera los datos del viajero para enviarlos de inmediato al bot de inyección.
    """
    return _memoria_temporal_viajeros.get(session_id, None)

def limpiar_sesion_viajero(session_id: str):
    """
    Elimina los datos sensibles de la memoria una vez que el proceso de compra 
    y cobro con Stripe ha finalizado con éxito, protegiendo la privacidad del usuario.
    """
    if session_id in _memoria_temporal_viajeros:
        del _memoria_temporal_viajeros[session_id]
        return True
    return False
