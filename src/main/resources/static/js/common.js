/**
 * Funcionalidades comunes compartidas entre todas las páginas
 * Funcionalidades: eliminación de alumnos, notificaciones, utilidades
 */

/**
 * Elimina un alumno con confirmación
 * @param {string} legajo - Legajo del alumno a eliminar
 * @param {string} nombreCompleto - Nombre completo del alumno (opcional)
 */
function eliminarAlumno(legajo, nombreCompleto = '') {
    console.log('Eliminando alumno:', legajo);
    
    // Crear modal de confirmación si no existe
    let modal = document.getElementById('modalEliminar');
    if (!modal) {
        modal = crearModalEliminacion();
    }
    
    // Configurar el formulario de eliminación
    const formEliminar = modal.querySelector('#formEliminar');
    if (formEliminar) {
        // Limpiar action anterior
        formEliminar.action = '';
        formEliminar.action = '/alumnos/' + legajo + '/eliminar';
        
        // Limpiar inputs CSRF anteriores
        const csrfInputs = formEliminar.querySelectorAll('input[name="_csrf"]');
        csrfInputs.forEach(input => input.remove());
        
        // Agregar token CSRF
        const csrfToken = document.querySelector('meta[name="_csrf"]');
        if (csrfToken) {
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = '_csrf';
            csrfInput.value = csrfToken.getAttribute('content');
            formEliminar.appendChild(csrfInput);
        }
        
        // Limpiar event listeners anteriores
        const btnConfirmar = formEliminar.querySelector('button[type="submit"]');
        if (btnConfirmar) {
            const btnConfirmarNuevo = btnConfirmar.cloneNode(true);
            btnConfirmar.parentNode.replaceChild(btnConfirmarNuevo, btnConfirmar);
            
            // Restaurar texto original
            btnConfirmarNuevo.innerHTML = '<i class="fas fa-trash me-1"></i>Eliminar';
            btnConfirmarNuevo.disabled = false;
            
            // Agregar nuevo event listener
            btnConfirmarNuevo.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Mostrar spinner de carga
                this.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status"></span>Eliminando...';
                this.disabled = true;
                
                // Enviar formulario
                formEliminar.submit();
            });
        }
        
        // Actualizar mensaje del modal si se proporciona el nombre
        if (nombreCompleto) {
            const modalBody = modal.querySelector('.modal-body p:first-child');
            if (modalBody) {
                modalBody.innerHTML = `¿Estás seguro de que deseas eliminar al alumno <strong>${nombreCompleto}</strong>?`;
            }
        }
        
        // Mostrar el modal
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }
}

/**
 * Crea el modal de eliminación si no existe
 * @returns {HTMLElement} - El modal creado
 */
function crearModalEliminacion() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'modalEliminar';
    modal.setAttribute('tabindex', '-1');
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="fas fa-exclamation-triangle text-warning me-2"></i>
                        Confirmar Eliminación
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p>¿Estás seguro de que deseas eliminar este alumno?</p>
                    <p class="text-muted">Esta acción no se puede deshacer.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <form id="formEliminar" method="post" style="display: inline;">
                        <button type="submit" class="btn btn-danger">
                            <i class="fas fa-trash me-1"></i>
                            Eliminar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    return modal;
}

/**
 * Muestra una notificación toast
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - Tipo de notificación (success, error, warning, info)
 */
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

/**
 * Crea el contenedor de toasts si no existe
 * @returns {HTMLElement} - El contenedor creado
 */
function crearToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.zIndex = '1055';
    document.body.appendChild(container);
    return container;
}

/**
 * Inicializa funcionalidades comunes en todas las páginas
 */
function inicializarFuncionesComunes() {
    // Configurar auto-hide para alertas
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        if (alert.classList.contains('alert-success')) {
            setTimeout(() => {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }, 5000);
        }
    });
    
    // Inicializar tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Inicializar funciones comunes cuando se carga el DOM
document.addEventListener('DOMContentLoaded', inicializarFuncionesComunes);
