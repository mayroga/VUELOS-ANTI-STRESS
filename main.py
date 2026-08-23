# ====================================================================================================
#                                           MAY ROGA LLC
#                         Wellness Travel Architecture & Lifestyle Optimization
#                                    Miami, Florida | USA
#                               PRODUCTION UNIFIED ENGINE - V3.5
# ====================================================================================================

import os
import re
import random
import urllib.parse
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse, FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import stripe

# Componentes del Motor ReportLab para Pasaportes de Alta Gama
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

app = FastAPI(
    title="MAY ROGA LLC - Executive Sanctuary Architecture Gateway",
    version="3.5.0"
)

# ----------------------------------------------------------------------------------------------------
# CONFIGURACIÓN DE SEGURIDAD Y PASARELAS CRIPTOGRÁFICAS (RENDER ENV)
# ----------------------------------------------------------------------------------------------------
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

# Configuración única de Price IDs Élite
STRIPE_PRICE_ID1 = os.getenv("STRIPE_PRICE_ID1", "price_1TtbjXBOA5mT4t0PMCJSext6")  # Un Solo Servicio: $200
STRIPE_PRICE_ID2 = os.getenv("STRIPE_PRICE_ID2", "price_1TtblSBOA5mT4t0PGiYvT2l9")  # Mensual Ilimitado: $399

ADMIN_USER = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASS = os.getenv("ADMIN_PASSWORD", "mayroga2026")

LINK_BASE_MAPS = "https://google.com"

# Asegurar directorios de persistencia temporal
os.makedirs("temp", exist_ok=True)
if os.path.exists("static"):
    app.mount("/static", StaticFiles(directory="static"), name="static")

# ----------------------------------------------------------------------------------------------------
# VECTORES DE CONFIGURACIÓN Y DICCIONARIOS BILINGÜES DE LUJO
# ----------------------------------------------------------------------------------------------------
DEFAULT_NECESSITY_VECTOR = {
    "movimiento": 50, "naturaleza": 50, "silencio": 50, "agua": 50, "sol": 50,
    "sombra": 50, "aire_fresco": 50, "creatividad": 50, "comunidad": 50, "aprendizaje": 50,
    "juego": 50, "contemplacion": 50, "descanso": 50, "organizacion": 50,
    "alimentacion": 50, "musica": 50, "risa": 50, "esperanza": 50, "indicador_ansiedad": 0
}

DICTIONARY_BILINGUAL = {
    "ES": {
        "doc_title": "LIBRETA DE VIAJE INDIVIDUAL (PRIVADA Y EXCLUSIVA)",
        "folio": "Folio de Acompañamiento VIP", 
        "status": "Estatus: Procesado en Servidor Render",
        "sec1_title": "1. BALANCE Y AVANCE DE ENFOQUE PERSONAL",
        "m1": "Indicador Evaluado", "m2": "Nivel Inicial", "m3": "Nivel de Cierre",
        "m_pace": "Índice de Fricción Ejecutiva", "m_breathe": "Tasa de Calibración Biológica", "m_logic": "Eficiencia del Enfoque Cognitivo",
        "sec2_title": "2. ENRUTAMIENTO EXCLUSIVO DE VIAJE (HOST AGENCY GATEWAY)",
        "stay_lbl": "Santuario de Ultra-Lujo Curado", "desc_lbl": "Perfil de Aislamiento Físico",
        "air_lbl": "Logística Aérea VIP", "sea_lbl": "Corredor Marítimo Élite",
        "consorcio": "Beneficios Exclusivos Consorcio: Elegible automáticamente para créditos de cortesía Virtuoso/Signature ($100 USD para experiencias de bienestar y mejoras de suite prioritarias mediante su folio).",
        "sec3_title": "3. CONCLUSIONES DE SINTONÍA COMPILADA",
        "cta": "Este pasaporte resume su optimización neurobiológica. Diseñado para disolver el desgaste operativo y asegurar el control absoluto sobre su agenda.",
        "sec4_title": "4. COMPLIANCE DE PRIVACIDAD MAY ROGA LLC",
        "disclaimer": "Toda la información de sintonía se procesa localmente bajo estrictos estándares de anonimato en terminales fiduciarias (localStorage). El líder global retiene el control absoluto de sus registros.",
        "ai_foot": "Este documento es estrictamente confidencial y para fines informativos de estilo de vida premium. No constituye asesoramiento clínico formal."
    },
    "EN": {
        "doc_title": "PERSONAL TRAVEL PASSPORT (CONFIDENTIAL BLUEPRINT)",
        "folio": "Executive Service ID Folio", 
        "status": "Status: Processed on Secure Render Node",
        "sec1_title": "1. WELLNESS BALANCE & ENHANCEMENT SUMMARY",
        "m1": "Executive Metric Evaluated", "m2": "Initial Baseline", "m3": "Closing Balance",
        "m_pace": "Executive Friction & Pace Index", "m_breathe": "Biological Calibration Rate", "m_logic": "Cognitive Focus & Clarity Rate",
        "sec2_title": "2. YOUR EXCLUSIVE TRAVEL ROUTING (HOST AGENCY GATEWAY)",
        "stay_lbl": "Curated Luxury Oasis", "desc_lbl": "Wellness Profile Detail",
        "air_lbl": "Premium Air Logistics", "sea_lbl": "Maritime Cruise Corridor",
        "consorcio": "Exclusive Consortium Privileges: Eligible for complimentary Virtuoso/Signature luxury benefits ($100 resort credits for relaxation therapies and priority room upgrades processed automatically via credentials).",
        "sec3_title": "3. ACTIONABLE PERFORMANCE FOCUS POINTS",
        "cta": "This travel passport serves as a concise summary of your progress. It benchmarks your clarity index and outlines the stabilization parameters achieved against routine corporate exhaustion.",
        "sec4_title": "4. CORPORATE LIFESTYLE PRIVACY ASSURANCE",
        "disclaimer": "All digital metrics gathered to compile this travel passport are processed strictly locally and anonymously on the user's browser terminal via local behavior algorithms (localStorage).",
        "ai_foot": "This document is for informational and promotional travel purposes only. For clinical or medical advice, consult a certified healthcare professional."
    }
}

BACKEND_HOTELES = {
    "H1": {
        "es": {"name": "Eden Roc Cap Cana / Eden Roc Miami Beach", "desc": "Bungalows de ultra-lujo con albercas propias, acceso restringido a playas privadas y aislamiento acústico total."},
        "en": {"name": "Eden Roc Cap Cana / Eden Roc Miami Beach", "desc": "Ultra-luxury standalone bungalows with plunge pools, pristine restricted beachfronts, and complete acoustic silence."}
    },
    "H2": {
        "es": {"name": "Amanera Resort (Playa Grande)", "desc": "Casitas minimalistas de cristal zen suspendidas sobre acantilados masivos de la selva virgen del Caribe."},
        "en": {"name": "Amanera Resort (Playa Grande)", "desc": "Zen minimalist glass casitas suspended over massive Caribbean jungle cliffs providing radical environmental isolation."}
    }
}
# ----------------------------------------------------------------------------------------------------
# MODELOS DE VALIDACIÓN PYDANTIC (ESTÁNDAR DE ALTO RENDIMIENTO)
# ----------------------------------------------------------------------------------------------------
class PDFPayload(BaseModel):
    servicio_id: str
    lang: str
    score_inicial: float
    score_actual: float
    respiracion_score: float
    adivinanzas_score: float
    iev: float
    variante: str
    destino_id: str

class CheckoutPayload(BaseModel):
    tier: str
    folio: str

class DevAuthPayload(BaseModel):
    user: str
    dev_pass: str

# ----------------------------------------------------------------------------------------------------
# CONTROLADORES DE RUTA Y ENLACES BANCARIOS ÉLITE
# ----------------------------------------------------------------------------------------------------
@app.post("/verify-dev-access")
def verify_dev_access(payload: DevAuthPayload):
    if payload.user == ADMIN_USER and payload.dev_pass == ADMIN_PASS:
        return {"authenticated": True}
    raise HTTPException(status_code=401, detail="Access Denied.")

@app.post("/create-checkout-session")
def create_checkout_session(payload: CheckoutPayload):
    # Enlace exacto a la matriz corporativa de Stripe configurada en Render
    price_id = STRIPE_PRICE_ID1 if "SINGLE" in payload.tier else STRIPE_PRICE_ID2
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{'price': price_id, 'quantity': 1}],
            mode='payment' if "SINGLE" in payload.tier else 'subscription',
            success_url="https://wellness-travel.onrender.com" + os.getenv("RENDER_EXTERNAL_HOSTNAME", "localhost:8000") + "/?status=success&folio=" + payload.folio,
            cancel_url="https://wellness-travel.onrender.com" + os.getenv("RENDER_EXTERNAL_HOSTNAME", "localhost:8000") + "/",
            metadata={'folio_crm': payload.folio, 'billing_tier': payload.tier}
        )
        return {"checkout_url": session.url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ----------------------------------------------------------------------------------------------------
# MOTOR DE GENERACIÓN ASÍNCRONA DE PASAPORTES (REPORTLAB CORP)
# ----------------------------------------------------------------------------------------------------
@app.post("/generate-pdf")
def generate_pdf(payload: PDFPayload):
    pdf_filename = f"MayRoga_Elite_Passport_{payload.servicio_id}.pdf"
    pdf_path = os.path.join("temp", pdf_filename)
    
    doc = SimpleDocTemplate(
        pdf_path, pagesize=letter,
        rightMargin=45, leftMargin=45, topMargin=45, bottomMargin=45,
        title=f"Passport_{payload.servicio_id}"
    )
    styles = getSampleStyleSheet()
    
    # Paleta corporativa purgada de elementos informales
    c_primary = colors.HexColor("#030305")
    c_gold = colors.HexColor("#A3704C")
    c_text = colors.HexColor("#222222")
    c_legal = colors.HexColor("#777777")
    
    title_style = ParagraphStyle('CorpTitle', parent=styles['Heading1'], fontSize=24, leading=28, textColor=c_primary, alignment=1)
    subtitle_style = ParagraphStyle('CorpSub', parent=styles['Normal'], fontSize=9, leading=13, textColor=c_legal, alignment=1)
    h2_style = ParagraphStyle('SectionHeader', parent=styles['Heading2'], fontSize=11, leading=15, textColor=c_gold, spaceBefore=18, spaceAfter=8)
    body_style = ParagraphStyle('CorpBody', parent=styles['Normal'], fontSize=9.5, leading=14, textColor=c_text)
    disclaimer_style = ParagraphStyle('LegalText', parent=styles['Normal'], fontSize=7.5, leading=11, textColor=c_legal, alignment=4)

    story = []
    lang_key = "EN" if payload.lang.upper() == "EN" else "ES"
    lang_map = DICTIONARY_BILINGUAL[lang_key]

    # Construcción de la Libreta de Viaje Fiduciaria
    story.append(Paragraph("MAY ROGA LLC", title_style))
    story.append(Paragraph("Wellness Travel Architecture & Lifestyle Optimization<br/>Miami, Florida | USA", subtitle_style))
    story.append(Spacer(1, 15))
    story.append(Paragraph(f"{lang_map['doc_title']}", ParagraphStyle('RepTitle', parent=styles['Heading3'], fontSize=11, leading=14, alignment=1, textColor=c_primary, spaceAfter=15)))
    story.append(Paragraph(f"<b>{lang_map['folio']}</b>: {payload.servicio_id} | {lang_map['status']}", body_style))
    story.append(Spacer(1, 12))
    
    story.append(Paragraph(lang_map['sec1_title'], h2_style))
    metrics_data = [
        [Paragraph(lang_map['m1'], body_style), Paragraph(lang_map['m2'], body_style), Paragraph(lang_map['m3'], body_style)],
        [Paragraph(lang_map['m_pace'], body_style), f"{payload.score_inicial}%", f"{payload.score_actual}%"],
        [Paragraph(lang_map['m_breathe'], body_style), "0%", f"{payload.respiracion_score}%"],
        [Paragraph(lang_map['m_logic'], body_style), "0%", f"{payload.adivinanzas_score}%"]
    ]
    t = Table(metrics_data)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F9F9F9")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E5E5E5")),
        ('PADDING', (0,0), (-1,-1), 6),
        ('ALIGN', (1,1), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE')
    ]))
    story.append(t)
    
    story.append(Paragraph(lang_map['sec2_title'], h2_style))
    h_info = BACKEND_HOTELES.get(payload.destino_id, BACKEND_HOTELES["H1"])[lang_key.lower()]

    dest_html = f"• <b>{lang_map['stay_lbl']}</b>: {h_info['name']}<br/>• <b>{lang_map['desc_lbl']}</b>: {h_info['desc']}<br/>• <b>{lang_map['air_lbl']}</b>: Gulfstream G650 Private Charter Executive Flight.<br/>• <b>{lang_map['sea_lbl']}</b>: The Ritz-Carlton Yacht Collection Ocean Terrace Suite.<br/><br/>{lang_map['consorcio']}"
    story.append(Paragraph(dest_html, body_style))
    
    story.append(Spacer(1, 15))
    story.append(Paragraph(lang_map['sec3_title'], h2_style))
    story.append(Paragraph(lang_map['cta'], body_style))
    story.append(Spacer(1, 15))
    story.append(Paragraph(lang_map['sec4_title'], h2_style))
    story.append(Paragraph(lang_map['disclaimer'], disclaimer_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph(lang_map['ai_foot'], disclaimer_style))

    doc.build(story)
    return FileResponse(pdf_path, media_type='application/pdf', filename=pdf_filename)

@app.get("/", response_class=HTMLResponse)
def read_index():
    index_path = "static/index.html"
    if os.path.exists(index_path):
        with open(index_path, "r", encoding="utf-8") as f:
            return f.read()
    return "MAY ROGA LLC - index.html no localizado en /static"
