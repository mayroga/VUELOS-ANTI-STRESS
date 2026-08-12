import asyncio
from playwright.async_api import async_playwright

class AirlineInjector:
    def __init__(self, airline_url: str):
        self.airline_url = airline_url

    async def llenar_datos_vuelo(self, user_data: dict):
        """
        Automatiza la navegación e inyección de datos a la velocidad de la luz
        para evitar que el algoritmo dinámico de la aerolínea suba el precio.
        """
        async with async_playwright() as p:
            # Lanzamos el navegador en segundo plano (headless=False si quieres verlo en pruebas)
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            
            try:
                # 1. Entrar directo a la página de la aerolínea elegida
                await page.goto(self.airline_url, timeout=60000)
                
                # 2. Inyección rápida de datos obligatorios (Nombres, pasaporte, etc.)
                # Nota: Los selectores ('#input-name', etc.) cambiarán según la aerolínea objetivo
                await page.fill("#input-first-name", user_data.get("nombres_completos", ""))
                await page.fill("#input-last-name", user_data.get("apellidos_latino", ""))
                await page.fill("#input-passport", user_data.get("documento_pasaporte", ""))
                await page.fill("#input-email", user_data.get("email", ""))
                await page.fill("#input-phone", user_data.get("whatsapp_contacto", ""))
                
                # 3. Detección preventiva de Captcha o bloqueo de seguridad
                captcha_element = await page.query_selector("img[alt*='captcha'], iframe[src*='captcha']")
                
                if captcha_element:
                    # Extraemos la captura de pantalla del captcha para enviarla al Frontend
                    screenshot_path = "captcha_actual.png"
                    await captcha_element.screenshot(path=screenshot_path)
                    return {
                        "status": "requiere_captcha",
                        "imagen_captcha": screenshot_path,
                        "mensaje": "¡Atención! La aerolínea pide verificar que eres humano."
                    }
                
                # 4. Si no hay captcha, avanzamos a la pasarela de pago directa de la aerolínea
                # Dejamos la página lista para que el cliente introduzca su tarjeta de crédito.
                return {
                    "status": "listo_para_pago",
                    "mensaje": "Datos inyectados con éxito. Esperando tarjeta del cliente."
                }
                
            except Exception as e:
                return {
                    "status": "error",
                    "detalle": str(e)
                }
            finally:
                await browser.close()

# Función de prueba asíncrona para ejecutar el bot
async def ejecutar_inyeccion(url: str, datos: dict):
    injector = AirlineInjector(airline_url=url)
    resultado = await injector.llenar_datos_vuelo(datos)
    return resultado
