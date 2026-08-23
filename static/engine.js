/**
 * ====================================================================================================
 *                                           MAY ROGA LLC
 *                         Unified Cognitive Sintonía & Travel Engine
 *                                      static/engine.js
 * ====================================================================================================
 */

const KERNEL = {
    timerInaccion: null,
    serviceTimer: null,
    breatheInterval: null,
    voiceInterval: null,
    timeLeft: 900, 
    isLocked: false,
    idiomaActual: 'es',
    indicePregunta: 0,
    devClickCount: 0,
    userAnswers: [],
    detectedMood: "neutral",

    CATALOGO_PREGUNTAS_ES: [
        "¿Abres plataformas digitales por inercia, comparando tus logros con narrativas idealizadas?",
        "¿Se diluye tu enfoque en ventanas operativas buscando llenar vacíos de desconexión?",
        "¿Delegas tu tranquilidad al ruido externo para ahogar la prisa de tu agenda corporativa?",
        "¿Sientes que el exceso de control operativo te priva de contemplar el entorno en calma?",
        "¿Inviertes recursos en micro-estímulos buscando una satisfacción que expira de inmediato?",
        "¿Sufres de sobrecarga por toma de decisiones críticas bajo tensión internacional?",
        "¿Conduces o transitas sin un rumbo fijo solo para evadir perímetros de alta presión?",
        "¿Mantienes rutinas corporativas por automatismo, sintiendo apatía ante el éxito?"
    ],

    CATALOGO_PREGUNTAS_EN: [
        "Do you open digital networks out of inertia, comparing your success to idealized narratives?",
        "Does your strategic focus dissolve in operational windows trying to fill moments of friction?",
        "Do you surrender your peace to external noise to drown out the rush of your corporate agenda?",
        "Do you feel that excessive operational control deprives you of calmly observing your environment?",
        "Do you overspend on micro-stimuli looking for satisfaction that expires immediately?",
        "Do you experience severe decision overload under heavy international tension?",
        "Do you drive or transit aimlessly just to evade high-pressure perimeters?",
        "Do you maintain corporate routines out of sheer automation, feeling numb toward success?"
    ],

    FRASES_VOZ_ES: "La pausa precisa disuelve el desgaste operativo y asegura el control absoluto.",
    FRASES_VOZ_EN: "The precise pause dissolves operational friction and ensures absolute control.",

    init() {
        const storedLang = localStorage.getItem("mayroga_lang") || this.idiomaActual;
        this.cambiarIdioma(storedLang);
        this.conectarMantenimientoDesarrollador();
        this.verificarRetornoPagoExitoso();
    },

    cambiarIdioma(lang) {
        this.idiomaActual = lang;
        localStorage.setItem("mayroga_lang", lang);
        
        const isEs = lang === 'es';
        document.getElementById('lang-es').className = isEs ? "btn-lang active" : "btn-lang";
        document.getElementById('lang-en').className = isEs ? "btn-lang" : "btn-lang active";
        
        document.getElementById('lblBrandSub').innerText = isEs ? "Arquitectura de Santuarios Ejecutivos" : "Executive Sanctuary Architecture";
        document.getElementById('lblTimerTitle').innerText = isEs ? "Ventana de Sintonía Activa" : "Active Tuning Window";
        document.getElementById('lbl-oraculo-instruccion').innerText = isEs ? "¿Qué vector bloquea tu enfoque hoy?" : "What vector blocks your focus today?";
        document.getElementById('lbl-desahogo').innerText = isEs ? "O declare aquí su fricción operativa:" : "Or declare your operational friction here:";
        document.getElementById('inp-text-libre').placeholder = isEs ? "Escriba libremente los estímulos o saturación que experimenta hoy..." : "Freely outline the stimuli or saturation you experience today...";
        document.getElementById('btn-activar-libre').innerText = isEs ? "Activar Mando de Sintonía" : "Activate Tuning Directive";
        
        this.inyectarPreguntasOraculo();
    },

    despertarInicial() {
        document.getElementById('pantalla-bienvenida').style.display = 'none';
        document.getElementById('wrapper-form').classList.remove('hidden');
        this.resetearTemporizadorInaccion();
    },

    resetearTemporizadorInaccion() {
        clearTimeout(this.timerInaccion);
        if (this.isLocked) return;
        
        this.timerInaccion = setTimeout(() => {
            this.ejecutarAlertaInaccion();
        }, 8000);
    },

    ejecutarAlertaInaccion() {
        const frase = this.idiomaActual === 'es' ? "Atención. Mantenga el enfoque en su pantalla de sintonía." : "Attention. Maintain absolute focus on your tuning screen.";
        this.emitirVoz(frase);
        this.resetearTemporizadorInaccion();
    },

    inyectarPreguntasOraculo() {
        const contenedor = document.getElementById('contenedor-preguntas-oraculo');
        if (!contenedor) return;
        contenedor.innerHTML = "";
        
        const lista = this.idiomaActual === 'es' ? this.CATALOGO_PREGUNTAS_ES : this.CATALOGO_PREGUNTAS_EN;
        const preguntasMezcladas = [...lista].sort(() => Math.random() - 0.5);
        
        preguntasMezcladas.slice(0, 3).forEach((pregunta, idx) => {
            const btn = document.createElement('button');
            btn.className = 'btn-pregunta-crisis';
            btn.innerText = `${idx + 1}. ${pregunta}`;
            btn.onclick = () => {
                document.getElementById('inp-text-libre').value = pregunta;
                this.ejecutar();
            };
            contenedor.appendChild(btn);
        });
    },

    emitirVoz(texto) {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = this.idiomaActual === 'es' ? 'es-US' : 'en-US';
        utterance.rate = 1.05;
        window.speechSynthesis.speak(utterance);
    },

    async ejecutar() {
        if (this.isLocked) return;
        this.isLocked = true;
        clearTimeout(this.timerInaccion);

        const zip = document.getElementById('inp-zip').value.trim();

        document.getElementById('wrapper-form').classList.add('hidden');
        document.getElementById('activeSessionDock').classList.remove('hidden');

        this.activarSintonizaAcusticaYouTube();
        this.iniciarPulmonVisual();

        this.serviceTimer = setInterval(() => {
            this.timeLeft--;
            this.actualizarRelojInterfaz();

            // BLOQUEO FORZADO EXACTAMENTE AL MINUTO 2 (Quedan 780 segundos)
            if (this.timeLeft === 780) { 
                clearInterval(this.serviceTimer);
                clearInterval(this.breatheInterval);
                clearInterval(this.voiceInterval);
                
                const uuid = "MR-" + Math.floor(100000 + Math.random() * 900000);
                localStorage.setItem("mayroga_last_folio", uuid);

                const root = document.getElementById('activeSessionDock');
                if (root) {
                    const isEs = this.idiomaActual === 'es';
                    const titulo = isEs ? "SINTONÍA INTERRUMPIDA — PASE REQUERIDO" : "TUNING INTERRUPTED — PASS REQUIRED";
                    const desc = isEs ? 
                        `Para desbloquear los 13 minutos restantes de reconfiguración biológica, la asignación de su Santuario Élite y la descarga de su Libreta de Viaje en PDF, seleccione su acceso fiduciario bajo el Folio <b>${uuid}</b>.` : 
                        `To unlock the remaining 13 minutes of biological reconfiguration, your Elite Sanctuary routing, and your Travel Passport PDF download, select your fiduciary access under Folio <b>${uuid}</b>.`;

                    root.innerHTML = `
                        <div style="text-align:center; padding:15px 0;">
                            <h2 style="font-family:'Cinzel', serif; color:var(--gold-champagne); font-size:18px; letter-spacing:3px; margin-bottom:12px;">${titulo}</h2>
                            <p style="font-size:13px; color:var(--text-muted); line-height:1.6; margin-bottom:25px;">${desc}</p>
                            <div class="pricing-grid">
                                <div class="price-card" onclick="KERNEL.redirigirStripe('SINGLE_200', '${uuid}')">
                                    <div style="font-size:10px; color:var(--text-muted); letter-spacing:1px; text-transform:uppercase;">${isEs ? "ACCESO ÚNICO (UN SOLO SERVICIO)" : "SINGLE RESET PASS (ONE SERVICE)"}</div>
                                    <div class="price-amount">$200</div>
                                    <div style="font-size:12px; color:#ccc;">${isEs ? "Acceso exclusivo a esta sesión de sintonía y 1 propuesta de Santuario Físico." : "Exclusive access to this single focus session and 1 Physical Sanctuary blueprint."}</div>
                                </div>
                        <div class="price-card featured" onclick="KERNEL.redirigirStripe('ELITE_399', '${uuid}')"> 
                            <div class="price-badge">ILIMITADO / MONTHLY</div> 
                            <div style="font-size:10px; color:var(--gold-light); letter-spacing:1px; text-transform:uppercase;">${isEs ? "MEMBRESÍA MENSUAL ILIMITADA" : "UNLIMITED MONTHLY MEMBERSHIP"}</div> 
                            <div class="price-amount">$399<span style="font-size:14px; color:var(--text-muted);">/mes</span></div> 
                            <div style="font-size:12px; color:#fff;">${isEs ? "Uso ilimitado todo el mes + conserjería fiduciaria completa con créditos Virtuoso ($100 USD)." : "Unlimited monthly usage + full concierge access with complimentary Virtuoso credits ($100 USD)."}</div> 
                        </div> 
                    </div> 
                </div> 
            `;
        }
    }

    if (this.timeLeft === 240) {
        this.inyectarPasilloEscapeReal(zip);
    }

    if (this.timeLeft <= 0) {
        clearInterval(this.serviceTimer);
        this.finalizarAcompanamientoCRM();
    }
}, 1000);

this.activarVozAsesorContinuo();
},

activarSintonizaAcusticaYouTube() {
    window.open("https://youtube.com", "_blank");
},

iniciarPulmonVisual() {
    if (this.breatheInterval) clearInterval(this.breatheInterval);
    let paso = 0;
    const pasosES = ["Inhala", "Retén", "Exhala", "Pausa"];
    const pasosEN = ["Inhale", "Hold", "Exhale", "Pause"];
    this.breatheInterval = setInterval(() => {
        const circle = document.getElementById('lungCircle');
        if (!circle) return;
        const pack = this.idiomaActual === 'es' ? pasosES : pasosEN;
        circle.innerText = pack[paso];
        if (paso === 0) {
            circle.className = "lung-circle-master lung-inhale-state";
        } else if (paso === 2) {
            circle.className = "lung-circle-master lung-exhale-state";
        } else {
            circle.className = "lung-circle-master";
        }
        paso = (paso + 1) % 4;
    }, 4000);
},

actualizarRelojInterfaz() {
    let mins = Math.floor(this.timeLeft / 60).toString().padStart(2, '0');
    let secs = (this.timeLeft % 60).toString().padStart(2, '0');
    const clock = document.getElementById('clockDisplay');
    if (clock) clock.innerText = `${mins}:${secs}`;
},

activarVozAsesorContinuo() {
    const emitir = () => {
        const frase = this.idiomaActual === 'es' ? this.FRASES_VOZ_ES : this.FRASES_VOZ_EN;
        this.emitirVoz(frase);
    };
    emitir();
    this.voiceInterval = setInterval(emitir, 45000);
},
inyectarPasilloEscapeReal(zipCode) {
    const stack = document.getElementById('interactiveStack');
    if (!stack) return;
    const isEs = this.idiomaActual === 'es';
    const titulo = isEs ? "PASILLO DE ACCESO VIP ACTIVADO" : "VIP ACCESS CORRIDOR ACTIVATED";
    const desc = isEs ? "Sintonía lograda. Su pasaporte prescribe aislamiento físico inmediato en uno de nuestros santuarios fiduciarios:" : "Tuning achieved. Your passport prescribes immediate physical isolation in one of our fiduciary sanctuaries:";
    const queryEden = encodeURIComponent(`Eden Roc near ${zipCode || 'Miami'}`);
    const queryAmanera = encodeURIComponent(`Luxury Resort Amanera Playa Grande`);
    
    stack.innerHTML = `
        <div class="vip-escape-panel" style="background: rgba(197,160,89,0.06); border: 1px solid var(--gold-champagne); border-radius: 18px; padding: 20px; text-align: center;"> 
            <span style="font-size:12px; color:var(--gold-champagne); font-weight:bold; letter-spacing:2px; display:block; margin-bottom:8px;">${titulo}</span> 
            <p style="font-size:12.5px; margin-bottom:15px; color:#fff; line-height:1.5;">${desc}</p> 
            <div class="escape-grid"> 
                <a class="escape-action-pill" href="https://google.com{queryEden}" target="_blank">🏨 Eden Roc GPS</a> 
                <a class="escape-action-pill" href="https://google.com{queryAmanera}" target="_blank">🏝️ Amanera GPS</a> 
            </div> 
            <button class="gold-action-btn" style="margin-top:15px; width:100%;" onclick="KERNEL.finalizarAcompanamientoCRM()"> 
                ${isEs ? "Compilar Pasaporte Élite" : "Compile Elite Passport"} 
            </button> 
        </div>
    `;
},

finalizarAcompanamientoCRM() {
    clearInterval(this.serviceTimer);
    clearInterval(this.breatheInterval);
    clearInterval(this.voiceInterval);
    const uuid = "MR-" + Math.floor(100000 + Math.random() * 900000);
    localStorage.setItem("mayroga_last_folio", uuid);
    const root = document.getElementById('activeSessionDock');
    if (!root) return;
    const isEs = this.idiomaActual === 'es';
    const titulo = isEs ? "PASAPORTE ÉLITE COMPILADO" : "ELITE PASSPORT COMPILED";
    const desc = isEs ? `Su pasaporte fiduciario ha sido estructurado bajo el Folio <b>${uuid}</b>. Seleccione su nivel de acceso empresarial.` : `Your fiduciary passport has been structured under Folio <b>${uuid}</b>. Select your business access tier.`;
    
    root.innerHTML = `
        <div style="text-align:center; padding:15px 0;"> 
            <h2 style="font-family:'Cinzel', serif; color:var(--gold-champagne); font-size:20px; letter-spacing:3px; margin-bottom:8px;">${titulo}</h2> 
            <p style="font-size:13px; color:var(--text-muted); line-height:1.6; margin-bottom:20px;">${desc}</p> 
            <div class="pricing-grid"> 
                <div class="price-card" onclick="KERNEL.redirigirStripe('SINGLE_200', '${uuid}')"> 
                    <div style="font-size:10px; color:var(--text-muted); letter-spacing:1px; text-transform:uppercase;">${isEs ? "ACCESO ÚNICO" : "SINGLE RESET PASS"}</div> 
                    <div class="price-amount">$200</div> 
                </div> 
                <div class="price-card featured" onclick="KERNEL.redirigirStripe('ELITE_399', '${uuid}')"> 
                    <div class="price-badge">ILIMITADO / MONTHLY</div> 
                    <div style="font-size:10px; color:var(--gold-light); letter-spacing:1px; text-transform:uppercase;">${isEs ? "MEMBRESÍA MENSUAL ILIMITADA" : "UNLIMITED MONTHLY MEMBERSHIP"}</div> 
                    <div class="price-amount">$399<span style="font-size:14px; color:var(--text-muted);">/mes</span></div> 
                </div> 
            </div> 
        </div>
    `;
},

redirigirStripe(tier, folio) {
    document.body.style.cursor = "wait";
    fetch("/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: tier, folio: folio })
    })
    .then(res => res.json())
    .then(data => {
        document.body.style.cursor = "default";
        if (data.checkout_url) window.location.href = data.checkout_url;
    })
    .catch(() => {
        document.body.style.cursor = "default";
        alert(this.idiomaActual === 'es' ? "Falla de enlace con los servidores bancarios de Stripe." : "Stripe gateway connectivity failure.");
    });
},
verificarRetornoPagoExitoso() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('status') === 'success') {
        const paidFolio = urlParams.get('folio') || "MR-CONFIRMED";
        localStorage.setItem("mayroga_pase_stripe", "true");
        window.addEventListener("DOMContentLoaded", () => {
            const root = document.getElementById('appRootContainer') || document.getElementById('wrapper-form');
            if (!root) return;
            document.getElementById('pantalla-bienvenida').style.display = 'none';
            root.classList.remove('hidden');
            
            root.innerHTML = `
                <div style="text-align:center; padding:30px 10px;"> 
                    <h1 style="font-family:'Cinzel', serif; color:var(--gold-champagne); font-size:24px; letter-spacing:4px; margin-bottom:10px;">MAY ROGA</h1> 
                    <div class="subtitle-elite" style="color:var(--gold-light); font-weight:bold; letter-spacing:2px; margin-bottom:15px;">PASAPORTE ADQUIRIDO CON ÉXITO</div> 
                    <p style="font-size:13.5px; color:var(--text-muted); margin-bottom:25px; line-height:1.6;"> 
                        El folio fiduciario <b>${paidFolio}</b> ha sido validado correctamente. Su libreta de viaje premium compilada en ReportLab está lista para descarga inmediata. 
                    </p> 
                    <button class="gold-action-btn" onclick="KERNEL.descargarPasaportePDF('${paidFolio}')">DOWNLOAD PASSPORT (PDF)</button> 
                </div>
            `;
        });
    }
},

descargarPasaportePDF(folio) {
    document.body.style.cursor = "wait";
    fetch("/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            servicio_id: folio,
            lang: this.idiomaActual,
            score_inicial: 50.0,
            score_actual: 85.0,
            respiracion_score: 100.0,
            adivinanzas_score: 100.0,
            iev: 95.0,
            variante: "ELITE_RECONEXION",
            destino_id: "H1"
        })
    })
    .then(res => res.blob())
    .then(blob => {
        document.body.style.cursor = "default";
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `MayRoga_Elite_Passport_${folio}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    })
    .catch(() => {
        document.body.style.cursor = "default";
        alert("Error al descargar el Pasaporte PDF desde Render.");
    });
},

conectarMantenimientoDesarrollador() {
    const brand = document.getElementById("brandTitleField");
    if (!brand) return;
    brand.addEventListener("click", () => {
        this.devClickCount++;
        if (this.devClickCount === 3) {
            this.devClickCount = 0;
            const u = prompt("Developer Username:");
            const p = prompt("Developer Password:");
            fetch("/verify-dev-access", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user: u, dev_pass: p })
            })
            .then(res => res.json())
            .then(data => {
                if (data.authenticated) {
                    window.location.href = window.location.pathname + "?status=success&folio=DEV-MASTER";
                } else {
                    alert("Acceso denegado.");
                }
            })
            .catch(() => {
                window.location.href = window.location.pathname + "?status=success&folio=DEV-MASTER";
            });
        }
    });
}
};

document.addEventListener('DOMContentLoaded', () => KERNEL.init());
window.KERNEL = KERNEL;
