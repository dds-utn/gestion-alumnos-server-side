document.addEventListener('DOMContentLoaded', function() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        if (alert.classList.contains('alert-success')) {
            setTimeout(() => {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }, 5000);
        }
    });
    
    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';
        setTimeout(() => {
            row.style.transition = 'all 0.3s ease';
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

function confirmarEliminacion(legajo, nombreCompleto) {
    const confirmacion = confirm(`¿Estás seguro de que deseas eliminar al alumno "${nombreCompleto}" (${legajo})?\n\nEsta acción no se puede deshacer.`);
    
    if (confirmacion) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = `/alumnos/${legajo}/eliminar`;
        
        const csrfToken = document.querySelector('meta[name="_csrf"]');
        if (csrfToken) {
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = '_csrf';
            csrfInput.value = csrfToken.getAttribute('content');
            form.appendChild(csrfInput);
        }
        
        document.body.appendChild(form);
        form.submit();
    }
}

function filtrarAlumnos(termino) {
    const filas = document.querySelectorAll('tbody tr');
    const terminoLower = termino.toLowerCase();
    
    filas.forEach(fila => {
        const textoFila = fila.textContent.toLowerCase();
        const mostrar = textoFila.includes(terminoLower);
        
        fila.style.display = mostrar ? '' : 'none';
        
        if (mostrar) {
            fila.classList.add('fade-in');
        }
    });
    
    const filasVisibles = document.querySelectorAll('tbody tr[style=""]').length;
    const contador = document.getElementById('contador-resultados');
    if (contador) {
        contador.textContent = `${filasVisibles} alumno(s) encontrado(s)`;
    }
}

function ordenarTabla(indiceColumna) {
    const tabla = document.querySelector('table');
    const tbody = tabla.querySelector('tbody');
    const filas = Array.from(tbody.querySelectorAll('tr'));
    
    const esAscendente = tabla.getAttribute('data-orden') !== 'asc';
    tabla.setAttribute('data-orden', esAscendente ? 'asc' : 'desc');
    
    filas.sort((a, b) => {
        const valorA = a.cells[indiceColumna].textContent.trim();
        const valorB = b.cells[indiceColumna].textContent.trim();
        
        let comparacion = 0;
        if (valorA < valorB) comparacion = -1;
        if (valorA > valorB) comparacion = 1;
        
        return esAscendente ? comparacion : -comparacion;
    });
    
    filas.forEach(fila => tbody.appendChild(fila));
    
    const headers = tabla.querySelectorAll('th');
    headers.forEach((header, index) => {
        header.classList.remove('sort-asc', 'sort-desc');
        if (index === indiceColumna) {
            header.classList.add(esAscendente ? 'sort-asc' : 'sort-desc');
        }
    });
}

function exportarDatos() {
    console.log('Función de exportación no implementada aún');
    alert('Función de exportación próximamente disponible');
}

function refrescarLista() {
    const container = document.querySelector('.container');
    container.style.opacity = '0.5';
    container.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        window.location.reload();
    }, 300);
}

document.addEventListener('keydown', function(e) {
    // Atajo de teclado para nuevo alumno (Ctrl + N)
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        window.location.href = '/alumnos/nuevo';
    }
    
    // Atajo de teclado para buscar (Ctrl + F)
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.getElementById('buscar-alumnos');
        if (searchInput) {
            searchInput.focus();
        }
    }
});

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
