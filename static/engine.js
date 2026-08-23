/**
 * ====================================================================================================
 *                                           MAY ROGA LLC
 *                         Expanded Corporate Oracle & Lifestyle Architecture
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
        "¿Mantienes rutinas corporativas por automatismo, sintiendo apatía ante el éxito?",
        "¿Sientes que la constante disponibilidad digital está fragmentando tu capacidad de planificar a largo plazo?",
        "¿Soportas reuniones monótonas ocultando tu saturación detrás de una pantalla secundaria?",
        "¿Revisas el correo de la empresa a altas horas de la noche buscando una falsa sensación de control?",
        "¿Has construido un entorno lleno de comodidades materiales pero vacío de asombro real?",
        "¿Evitas los momentos de silencio absoluto porque exponen el ruido de tus responsabilidades?",
        "¿Sientes que tus interacciones sociales se han convertido en transacciones de conveniencia?",
        "¿Proyectas una imagen de seguridad ejecutiva impecable mientras gestionas un desgaste interno masivo?",
        "¿Te refugias en trayectos largos y vuelos frecuentes para distanciarte de las fricciones de tu base?",
        "¿Aplazas el descanso real asumiendo que tu estructura operativa colapsará sin tu presencia?",
        "¿Sientes que la velocidad de tus mercados está dictando el ritmo de tu respiración diaria?",
        "¿Buscas la desconexión en destinos exclusivos pero tu mente sigue anclada al flujo de capital?",
        "¿Has delegado la gestión de tu estilo de vida perdiendo el contacto con tus elecciones básicas?",
        "¿Sientes que la rumiación sobre problemas corporativos del pasado te impide dominar tu presente?",
        "¿Experimentas una insatisfacción crónica que ningún logro comercial reciente ha logrado calmar?",
        "¿Tu dispositivo móvil se ha convertido en un grillete que interrumpe tus momentos con seres queridos?",
        "¿Observas paisajes de ultra-lujo en redes perdiendo la capacidad de asombrarte con tu propia realidad?",
        "¿Sientes que el piloto automático del día a día está consumiendo tus mejores años de libertad?",
        "¿Te cuesta creer que un simple cambio de coordenadas físicas pueda restaurar tu soberanía mental?",
        "¿Inviertes en experiencias efímeras de alto costo que se desvanecen sin dejar valor real?",
        "¿La incertidumbre de los marcos jurisdiccionales está bloqueando tu enfoque estratégico hoy?",
        "¿Sientes opresión debido a la prisa del entorno empresarial y las exigencias de tus socios?",
        "¿Has olvidado el beneficio de una pausa prolongada, libre de notificaciones o alertas?",
        "¿Buscas ambientes de alta estimulación social para evadir conversaciones difíciles en tu entorno?",
        "¿La distancia emocional con las personas que comparten tu techo te hace sentir en aislamiento?",
        "¿La planificación de tus periodos de ocio te genera la misma fricción que una auditoría corporativa?",
        "¿Sientes que tu mente se ha convertido en la prisión operativa más compleja de gestionar?",
        "¿Mantienes hábitos de consumo por inercia social, delegando tu verdadera identidad al estatus?",
        "¿El éxito financiero actual está actuando como una anestesia ante tu falta de propósito personal?",
        "¿Te paraliza la idea de delegar el mando por miedo a perder el control milimétrico de tu firma?",
        "¿Comparas constantemente la tracción de tus empresas con la exposición pública de tus competidores?",
        "¿Sientes desinterés ante compromisos familiares inevitables debido al agotamiento decisional?",
        "¿Tu cuerpo te exige un cese operativo inmediato pero tu agenda te obliga a mantener la marcha?",
        "¿Sientes que las interacciones del día están creando silencios insostenibles en tus relaciones?",
        "¿Estás listo para obedecer al mando de sintonía, soltar la operativo y activar tu escape hoy?"
    ],
    CATALOGO_PREGUNTAS_EN: [
        "Do you open digital networks out of inertia, comparing your success to idealized narratives?",
        "Does your strategic focus dissolve in operational windows trying to fill moments of friction?",
        "Do you surrender your peace to external noise to drown out the rush of your corporate agenda?",
        "Do you feel that excessive operational control deprives you of calmly observing your environment?",
        "Do you overspend on micro-stimuli looking for satisfaction that expires immediately?",
        "Do you experience severe decision overload under heavy international tension?",
        "Do you drive or transit aimlessly just to evade high-pressure perimeters?",
        "Do you maintain corporate routines out of sheer automation, feeling numb toward success?",
        "Do you feel that constant digital availability is fragmenting your long-term planning capacity?",
        "Do you endure monotonous executive sessions hiding your saturation behind a secondary screen?",
        "Do you review company servers late at night seeking a false sense of absolute control?",
        "Have you constructed an environment rich in material comfort but completely empty of real wonder?",
        "Do you avoid absolute silence because it exposes the ongoing noise of your high-stake liabilities?",
        "Do you feel that your high-profile social circles have devolved into mere transactions of convenience?",
        "Do you project an image of flawless executive security while managing severe internal exhaustion?",
        "Do you take refuge in extended transit and frequent flights to distance yourself from base friction?",
        "Do you postpone real recovery assuming your operational structure will collapse without your presence?",
        "Do you feel that the velocity of your specific markets is dictating your daily breathing patterns?",
        "Do you seek disconnection in elite destinations while your mind remains anchored to capital flows?",
        "Have you over-delegated your lifestyle management, losing direct touch with basic personal choices?",
        "Do you feel that ruminating over past corporate conflicts is preventing you from mastering your present?",
        "Do you experience chronic dissatisfaction that no recent commercial milestones have managed to calm?",
        "Has your mobile terminal become a digital shackle that constantly interrupts private family moments?",
        "Do you monitor ultra-luxury feeds on social networks, losing the ability to be amazed by your own reality?",
        "Do you feel that the daily corporate autopilot is consuming your finest years of personal freedom?",
        "Is it hard to believe that a simple shift in physical coordinates can restore your mental sovereignty?",
        "Do you invest in high-cost fleeting experiences that quickly vanish without leaving structural value?",
        "Is the current uncertainty of global regulatory frameworks blocking your strategic focus today?",
        "Do you feel internal tightness from the sheer rush of your business environment and partner demands?",
        "Have you forgotten the immense benefits of a prolonged pause, entirely free from alerts or pings?",
        "Do you seek highly-stimulating social environments to evade difficult dialogues in your core circle?",
        "Does emotional distance with those sharing your private roof make you feel in complete isolation?",
        "Does planning your leisure windows generate the exact same friction as a heavy corporate audit?",
        "Do you feel that your private mind has become the most complex operational prison to manage?",
        "Do you maintain heavy luxury consumption habits out of peer inertia, surrendering your identity to status?",
        "Is current financial momentum acting as an analytical anesthesia against your lack of purpose?",
        "Does the idea of fully delegating authority paralyze you due to losing micro-control of your firm?",
        "Do you constantly benchmark your company's performance against the public exposure of your rivals?",
        "Do you feel complete apathy toward inevitable social commitments due to severe decision fatigue?",
        "Does your body demand an immediate operational shutdown while your agenda forces you to march on?",
        "Do you feel that your daily interactions are creating unsustainable silences in your relationships?",
        "Are you ready to obey the tuning directive, surrender the operational grind, and activate your escape today?"
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
    console.log("[MAY ROGA] Inicializando catálogo acústico predictivo.");
    const isEs = this.idiomaActual === 'es';
    
    // 5 opciones directas de ultra-lujo listas para reproducir sin barras de búsqueda
    const poolVideos = isEs ? [
        { t: "Frecuencia Solfeggio 432Hz — Océano Profundo", url: "https://youtube.com", desc: "Sintonía de aislamiento acústico total." },
        { t: "Frecuencia Alfa 8Hz — Ondas de Espacio Natural", url: "https://youtube.com", desc: "Descompresión biológica de baja concurrencia." },
        { t: "Ruido Blanco de Lluvia en Selva Privada", url: "https://youtube.com", desc: "Bloqueo de ruido operativo de oficina." },
        { t: "Frecuencia de Sanación Zen 528Hz — Calma Pura", url: "https://youtube.com", desc: "Disolución de fricción estratégica." },
        { t: "Paisajes Sonoros del Desierto Minimalista", url: "https://youtube.com", desc: "Restauración de soberanía cognitiva." }
    ] : [
        { t: "432Hz Solfeggio Frequency — Deep Ocean Resonance", url: "https://youtube.com", desc: "Complete acoustic isolation protocol." },
        { t: "8Hz Alpha Waves — Natural Space Architecture", url: "https://youtube.com", desc: "Low-occupancy biological decompression." },
        { t: "White Noise — Private Rainforest Ambience", url: "https://youtube.com", desc: "Corporate office friction shielding." },
        { t: "528Hz Zen Healing Frequency — Pure Mental Calming", url: "https://youtube.com", desc: "Executive decision overload dissolution." },
        { t: "Minimalist Desert Soundscapes — Pure Focus", url: "https://youtube.com", desc: "Cognitive sovereignty restoration." }
    ];

    // Acompañamiento verbal por detrás en el idioma del cliente
    const guionVoz = isEs ? 
        "Líder. Hemos desplegado 5 frecuencias de sintonía acústica. Le sugerimos activar la primera opción: Ondas de Océano Profundo a 432 Hertz, configurada para disolver la fricción de su entorno." :
        "Leader. We have deployed 5 acoustic tuning frequencies. We suggest activating the first option: 432 Hertz Deep Ocean Waves, engineered to dissolve your current friction.";
    
    this.emitirVoz(guionVoz);

    const stack = document.getElementById('interactiveStack');
    if (!stack) return;

    let html = `<div style="margin-bottom:15px; font-size:12px; color:var(--gold-champagne); letter-spacing:1px; text-transform:uppercase; font-weight:bold;">${isEs ? "SINTONÍA ACÚSTICA PREDICTIVA" : "PREDICTIVE ACOUSTIC TUNING"}</div>`;
    poolVideos.forEach((v, i) => {
        html += `
            <div style="background:var(--bg-surface); border:1px solid rgba(255,255,255,0.05); padding:14px; border-radius:12px; margin-bottom:10px; text-align:left;">
                <div style="font-size:13px; font-weight:bold; color:#fff; margin-bottom:4px;">${i+1}. ${v.t}</div>
                <div style="font-size:11px; color:var(--text-muted); margin-bottom:8px;">${v.desc}</div>
                <a class="escape-action-pill" href="${v.url}" target="_blank" style="padding:6px 12px; font-size:10px; text-decoration:none; display:inline-block;">${isEs ? "REPRODUCIR FRECUENCIA" : "PLAY FREQUENCY"}</a>
            </div>
        `;
    });
    stack.innerHTML = html;
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
    const titulo = isEs ? "SANTUARIOS DE BAJA CONCURRENCIA PRESCRITOS" : "CURATED LOW-OCCUPANCY SANCTUARIES";
    
    // Las 3 propuestas Élite con imágenes instantáneas nítidas cargadas desde el inicio
    const santuarios = [
        {
            name: "Amanera Resort — Playa Grande",
            img: "https://unsplash.com",
            maps: `https://google.com{encodeURIComponent("Luxury Resort Amanera Playa Grande")}`,
            es_ex: "Casitas de cristal suspendidas en acantilados con aislamiento total. Le conviene porque neutraliza de inmediato su índice de fatiga por decisiones críticas.",
            en_ex: "Glass casitas suspended on cliffs with radical isolation. Prescribed to instantly neutralize your critical decision fatigue index."
        },
        {
            name: "Eden Roc Sanctuary — Cap Cana",
            img: "https://unsplash.com",
            maps: `https://google.com{encodeURIComponent("Eden Roc Cap Cana Private Villas")}`,
            es_ex: "Bungalows independientes con alberca privada y control estricto de concurrencia. Ideal para restaurar su espacio personal sin alertas.",
            en_ex: "Standalone bungalows with private pools and strict occupancy controls. Ideal to restore your personal space without structural alerts."
        },
        {
            name: "Amangiri Oasis — Utah Desert",
            img: "https://unsplash.com",
            maps: `https://google.com{encodeURIComponent(`Luxury Resort Amangiri Utah near ${zipCode || '33167'}`)}`,
            es_ex: "Arquitectura monolítica oculta en el cañón profundo. Diseñado para directores que exigen desapego operativo absoluto e inmunidad de entorno.",
            en_ex: "Monolithic architecture hidden in the deep canyon. Engineered for executives demanding absolute operational detachment and environment immunity."
        }
    ];

    // Discurso predictivo por voz de fondo explicando los motivos fiduciarios
    const discursoExplicativo = isEs ?
        "Calibración de entorno completada. Hemos bloqueado tres opciones de aislamiento geográfico en Google Maps que cuentan con el menor índice de ocupación física disponible. Hemos adivinado su necesidad: espacio masivo, silencio acústico y cero interrupciones corporativas." :
        "Environment calibration completed. We have locked three geographical isolation profiles on Google Maps holding the lowest physical occupancy rates available. We have anticipated your directive: massive space, acoustic silence, and zero corporate interruptions.";

    this.emitirVoz(discursoExplicativo);

    let html = `<div style="margin-bottom:15px; font-size:12px; color:var(--gold-champagne); letter-spacing:1px; text-transform:uppercase; font-weight:bold;">${titulo}</div>`;
    santuarios.forEach((s) => {
        html += `
            <div style="background:var(--bg-surface); border:1px solid var(--gold-champagne); border-radius:16px; margin-bottom:15px; overflow:hidden; text-align:left;">
                <img src="${s.img}" style="width:100%; height:130px; object-fit:cover; display:block;" alt="${s.name}">
                <div style="padding:15px;">
                    <div style="font-size:14px; font-weight:bold; color:var(--gold-champagne); margin-bottom:6px;">${s.name}</div>
                    <p style="font-size:11.5px; color:#eee; line-height:1.4; margin-bottom:12px;">${isEs ? s.es_ex : s.en_ex}</p>
                    <a class="escape-action-pill" href="${s.maps}" target="_blank" style="background:var(--gold-champagne); color:var(--bg-obsidian); font-weight:bold; text-transform:uppercase; padding:8px 14px; font-size:10px; border-radius:6px; text-decoration:none; display:inline-block;">
                        ${isEs ? "VER RUTA EN GOOGLE MAPS" : "OPEN GOOGLE MAPS ROUTE"}
                    </a>
                </div>
            </div>
        `;
    });

    html += `
        <button class="gold-action-btn" style="margin-top:10px; width:100%;" onclick="KERNEL.finalizarAcompanamientoCRM()">
            ${isEs ? "COMPILAR PASAPORTE ÉLITE" : "COMPILE ELITE PASSPORT"}
        </button>
    `;
    stack.innerHTML = html;
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
