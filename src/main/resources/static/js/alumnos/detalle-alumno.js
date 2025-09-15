document.addEventListener('DOMContentLoaded', function() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        if (alert.classList.contains('alert-success')) {
            setTimeout(() => {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }, 5000);
        }
    });
    
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
    });
    
    configurarInformacionAdicional();
});

function configurarInformacionAdicional() {
    const timestampElement = document.querySelector('.text-muted span');
    if (timestampElement) {
        const ahora = new Date();
        const fechaFormateada = ahora.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        timestampElement.textContent = fechaFormateada;
    }
    
    const infoNavegador = document.createElement('small');
    infoNavegador.className = 'text-muted d-block mt-2';
    infoNavegador.innerHTML = `
        <i class="fas fa-info-circle me-1"></i>
        Información cargada el ${new Date().toLocaleString('es-ES')}
    `;
    
    const infoCard = document.querySelector('.card:last-of-type .card-body');
    if (infoCard) {
        infoCard.appendChild(infoNavegador);
    }
}

function copiarInformacion(tipo) {
    let texto = '';
    
    switch (tipo) {
        case 'legajo':
            const legajo = document.querySelector('.badge.bg-primary');
            texto = legajo ? legajo.textContent : '';
            break;
        case 'nombre':
            const nombre = document.querySelector('p[th\\:text="${alumno.nombre}"]');
            texto = nombre ? nombre.textContent : '';
            break;
        case 'contactos':
            const contactos = document.querySelectorAll('.contacto-item .card-text');
            texto = Array.from(contactos).map(contacto => contacto.textContent).join('\n');
            break;
        default:
            texto = 'Información no disponible';
    }
    
    if (texto) {
        navigator.clipboard.writeText(texto).then(() => {
            mostrarNotificacion(`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} copiado al portapapeles`, 'success');
        }).catch(() => {
            mostrarNotificacion('Error al copiar al portapapeles', 'error');
        });
    }
}

function exportarInformacion(formato = 'json') {
    const alumno = obtenerDatosAlumno();
    let contenido = '';
    let nombreArchivo = '';
    let tipoMime = '';
    
    switch (formato) {
        case 'json':
            contenido = JSON.stringify(alumno, null, 2);
            nombreArchivo = `alumno_${alumno.legajo}.json`;
            tipoMime = 'application/json';
            break;
        case 'csv':
            contenido = `Legajo,Nombre,Apellido,Contactos\n${alumno.legajo},${alumno.nombre},${alumno.apellido},"${alumno.contactos.join('; ')}"`;
            nombreArchivo = `alumno_${alumno.legajo}.csv`;
            tipoMime = 'text/csv';
            break;
        case 'txt':
            contenido = `INFORMACIÓN DEL ALUMNO\n====================\n\nLegajo: ${alumno.legajo}\nNombre: ${alumno.nombre}\nApellido: ${alumno.apellido}\n\nContactos:\n${alumno.contactos.map(c => `- ${c}`).join('\n')}`;
            nombreArchivo = `alumno_${alumno.legajo}.txt`;
            tipoMime = 'text/plain';
            break;
    }
    
    const blob = new Blob([contenido], { type: tipoMime });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    mostrarNotificacion(`Información exportada como ${formato.toUpperCase()}`, 'success');
}

function obtenerDatosAlumno() {
    const legajo = document.querySelector('.badge.bg-primary')?.textContent || '';
    const nombreCompleto = document.querySelector('p[th\\:text="${alumno.nombreCompleto}"]')?.textContent || '';
    const nombre = document.querySelector('p[th\\:text="${alumno.nombre}"]')?.textContent || '';
    const apellido = document.querySelector('p[th\\:text="${alumno.apellido}"]')?.textContent || '';
    
    const contactos = Array.from(document.querySelectorAll('.contacto-item .card-text')).map(contacto => contacto.textContent);
    
    return {
        legajo,
        nombreCompleto,
        nombre,
        apellido,
        contactos
    };
}

function imprimirInformacion() {
    const ventanaImpresion = window.open('', '_blank');
    const alumno = obtenerDatosAlumno();
    
    ventanaImpresion.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Información del Alumno - ${alumno.legajo}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
                .info { margin: 10px 0; }
                .contactos { margin-top: 20px; }
                .contacto { margin: 5px 0; padding: 5px; background-color: #f5f5f5; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>INFORMACIÓN DEL ALUMNO</h1>
                <p>Generado el ${new Date().toLocaleString('es-ES')}</p>
            </div>
            
            <div class="info">
                <strong>Legajo:</strong> ${alumno.legajo}
            </div>
            <div class="info">
                <strong>Nombre Completo:</strong> ${alumno.nombreCompleto}
            </div>
            <div class="info">
                <strong>Nombre:</strong> ${alumno.nombre}
            </div>
            <div class="info">
                <strong>Apellido:</strong> ${alumno.apellido}
            </div>
            
            <div class="contactos">
                <h3>Contactos:</h3>
                ${alumno.contactos.map(contacto => `<div class="contacto">${contacto}</div>`).join('')}
            </div>
        </body>
        </html>
    `);
    
    ventanaImpresion.document.close();
    ventanaImpresion.print();
    
    mostrarNotificacion('Vista de impresión abierta', 'info');
}

function mostrarNotificacion(mensaje, tipo = 'info') {
    const toastContainer = document.getElementById('toast-container') || crearToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${tipo} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${mensaje}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

function crearToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.zIndex = '1055';
    document.body.appendChild(container);
    return container;
}

function volverAtras() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = '/alumnos';
    }
}

function actualizarPagina() {
    window.location.reload();
}

document.addEventListener('keydown', function(e) {
    // Ctrl + P para imprimir
    if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        imprimirInformacion();
    }
    
    // Ctrl + E para exportar
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        exportarInformacion('json');
    }
    
    // Escape para volver atrás
    if (e.key === 'Escape') {
        volverAtras();
    }
    
    // F5 para actualizar
    if (e.key === 'F5') {
        e.preventDefault();
        actualizarPagina();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const accionesCard = document.querySelector('.card:last-of-type .card-body');
    if (accionesCard) {
        const botonesAdicionales = document.createElement('div');
        botonesAdicionales.className = 'mt-3';
        botonesAdicionales.innerHTML = `
            <div class="d-grid gap-2">
                <button class="btn btn-outline-info btn-sm" onclick="copiarInformacion('legajo')" title="Copiar legajo">
                    <i class="fas fa-copy me-1"></i>
                    Copiar Legajo
                </button>
                <button class="btn btn-outline-info btn-sm" onclick="exportarInformacion('json')" title="Exportar como JSON">
                    <i class="fas fa-download me-1"></i>
                    Exportar JSON
                </button>
                <button class="btn btn-outline-info btn-sm" onclick="imprimirInformacion()" title="Imprimir información">
                    <i class="fas fa-print me-1"></i>
                    Imprimir
                </button>
            </div>
        `;
        accionesCard.appendChild(botonesAdicionales);
    }
});
