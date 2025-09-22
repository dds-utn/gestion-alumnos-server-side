package ar.utn.ba.ddsi.gestionDeAlumnos.models.entities.usuarios;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
public class Usuario {
    private Long id;
    private String nombre;
    private String apellido;
    private String nombreDeUsuario;
    private String contrasenia;
    private Rol rol;
    private List<Permiso> permisos = new ArrayList<>();

    public void agregarPermiso(Permiso p) {
        this.permisos.add(p);
    }
}
