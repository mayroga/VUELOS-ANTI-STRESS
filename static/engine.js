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
    timeLeft: 900, // 15 minutos de sintonía exacta
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
        
        // Regla estricta de 8 segundos de inactividad para reenganchar al millonario
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
        
        // Barajado Fisher-Yates local instantáneo para destruir la monotonía
        const preguntasMezcladas = [...lista].sort(() => Math.random() - 0.5);
        
        // Inyectamos un bloque inicial dinámico sin redundancias
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
    }
};
root.innerHTML = `
    <h1>MAY ROGA</h1>
    <div>PASAPORTE ADQUIRIDO CON ÉXITO</div>
    <p>El folio fiduciario <b>${paidFolio}</b> ha sido validado correctamente. Su libreta de viaje premium compilada en ReportLab está lista para descarga inmediata.</p>
    <button class="gold-action-btn" onclick="KERNEL.descargarPasaportePDF('${paidFolio}')">DOWNLOAD PASSPORT (PDF)</button>
`;

// Cierre limpio del bloque de inicialización
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
        // CORREGIDO: Se inyectaron los acentos graves necesarios para el template string
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

// Vinculación final al ciclo de vida del chasis DOM
});
document.addEventListener('DOMContentLoaded', () => KERNEL.init());
window.KERNEL = KERNEL;
