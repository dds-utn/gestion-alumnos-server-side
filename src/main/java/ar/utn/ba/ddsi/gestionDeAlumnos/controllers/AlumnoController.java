package ar.utn.ba.ddsi.gestionDeAlumnos.controllers;

import ar.utn.ba.ddsi.gestionDeAlumnos.exceptions.DuplicateLegajoException;
import ar.utn.ba.ddsi.gestionDeAlumnos.exceptions.NotFoundException;
import ar.utn.ba.ddsi.gestionDeAlumnos.exceptions.ValidationException;
import ar.utn.ba.ddsi.gestionDeAlumnos.models.dto.AlumnoDTO;
import ar.utn.ba.ddsi.gestionDeAlumnos.services.AlumnoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/alumnos")
@RequiredArgsConstructor
public class AlumnoController {
    private final AlumnoService alumnoService;

    @GetMapping
    public String listarAlumnos(Model model) {
        List<AlumnoDTO> alumnos = alumnoService.obtenerTodosLosAlumnos();
        model.addAttribute("alumnos", alumnos);
        model.addAttribute("titulo", "Listado de alumnos");
        model.addAttribute("totalDeAlumnos", alumnos.size());
        return "alumnos/lista";
    }

    @GetMapping("/{legajo}")
    public String verDetalleAlumno(@PathVariable String legajo, Model model, RedirectAttributes redirectAttributes) {
        try {
            AlumnoDTO alumno = alumnoService.obtenerAlumnoPorLegajo(legajo).get();

            model.addAttribute("alumno", alumno);
            model.addAttribute("titulo", "Detalle del Alumno");
            model.addAttribute("tieneContactos", !alumno.getContactos().isEmpty());

            return "alumnos/detalle";
        }
        catch (NotFoundException ex) {
            redirectAttributes.addFlashAttribute("mensaje", ex.getMessage());
            return "redirect:/404";
        }
    }

    @GetMapping("/nuevo")
    public String mostrarFormularioCrear(Model model) {
        model.addAttribute("alumno", new AlumnoDTO());
        model.addAttribute("titulo", "Crear Nuevo Alumno");
        return "alumnos/crear";
    }

    @PostMapping("/crear")
    public String crearAlumno(@ModelAttribute("alumno")AlumnoDTO alumnoDTO,
                              BindingResult bindingResult,
                              Model model,
                              RedirectAttributes redirectAttributes) {
        try {
            AlumnoDTO alumnoCreado = alumnoService.crearAlumno(alumnoDTO);

            redirectAttributes.addFlashAttribute("mensaje", "Alumno creado exitosamente");
            redirectAttributes.addFlashAttribute("tipoMensaje", "success");
            return "redirect:/alumnos/" + alumnoCreado.getLegajo();
        }
        catch (DuplicateLegajoException ex) {
            bindingResult.rejectValue("legajo", "error.legajo", ex.getMessage());
            model.addAttribute("titulo", "Crear Nuevo Alumno");
            return "alumnos/crear";
        }
        catch (ValidationException e) {
            convertirValidationExceptionABindingResult(e, bindingResult);
            model.addAttribute("titulo", "Crear Nuevo Alumno");
            return "alumnos/crear";
        }
        catch (Exception e) {
            model.addAttribute("error", "Error al crear el alumno: " + e.getMessage());
            model.addAttribute("titulo", "Crear Nuevo Alumno");
            return "alumnos/crear";
        }
    }

    @GetMapping("/{legajo}/editar")
    public String mostrarFormularioEditar(@PathVariable String legajo, Model model, RedirectAttributes redirectAttributes) {
        try {
            AlumnoDTO alumnoDTO = alumnoService.obtenerAlumnoPorLegajo(legajo).get();
            model.addAttribute("alumno", alumnoDTO);
            model.addAttribute("titulo", "Editar Alumno");
            return "alumnos/editar";
        }
        catch (NotFoundException ex) {
            redirectAttributes.addFlashAttribute("mensaje", ex.getMessage());
            return "redirect:/404";
        }
    }

    @PostMapping("/{legajo}/actualizar")
    public String actualizarAlumno(@PathVariable String legajo,
                                 @ModelAttribute("alumno") AlumnoDTO alumnoDTO,
                                 BindingResult bindingResult,
                                 Model model,
                                 RedirectAttributes redirectAttributes
    ){
        try {
            AlumnoDTO alumnoActualizado = alumnoService.actualizarAlumno(legajo, alumnoDTO);

            redirectAttributes.addFlashAttribute("mensaje", "Alumno actualizado exitosamente");
            redirectAttributes.addFlashAttribute("tipoMensaje", "success");
            return "redirect:/alumnos/" + alumnoActualizado.getLegajo();
        }
        catch (NotFoundException ex) {
            redirectAttributes.addFlashAttribute("mensaje", ex.getMessage());
            return "redirect:/404";
        }
        catch (DuplicateLegajoException ex) {
            bindingResult.rejectValue("legajo", "error.legajo", ex.getMessage());
            model.addAttribute("titulo", "Editar Alumno");
            return "alumnos/editar";
        }
        catch (ValidationException e) {
            convertirValidationExceptionABindingResult(e, bindingResult);
            model.addAttribute("titulo", "Editar Alumno");
            return "alumnos/editar";
        }
        catch (Exception e) {
            model.addAttribute("error", "Error al actualizar el alumno: " + e.getMessage());
            model.addAttribute("titulo", "Editar Alumno");
            return "alumnos/editar";
        }
    }

    @PostMapping("/{legajo}/eliminar")
    public String eliminarAlumno(@PathVariable String legajo,
                                   @ModelAttribute("alumno") AlumnoDTO alumnoDTO,
                                   BindingResult bindingResult,
                                   Model model,
                                   RedirectAttributes redirectAttributes
    ) {
        try {
            alumnoService.eliminarAlumno(legajo);
            redirectAttributes.addFlashAttribute("mensaje", "Alumno eliminado exitosamente");
            redirectAttributes.addFlashAttribute("tipoMensaje", "success");
            return "redirect:/alumnos";
        }
        catch (NotFoundException ex) {
            redirectAttributes.addFlashAttribute("mensaje", ex.getMessage());
            return "redirect:/404";
        }
        catch (ValidationException e) {
            convertirValidationExceptionABindingResult(e, bindingResult);
            model.addAttribute("titulo", "Crear Nuevo Alumno");
            return "alumnos/crear";
        }
        catch (Exception e) {
            model.addAttribute("error", "Error al crear el alumno: " + e.getMessage());
            model.addAttribute("titulo", "Crear Nuevo Alumno");
            return "alumnos/crear";
        }
    }

    private void convertirValidationExceptionABindingResult(ValidationException e, BindingResult bindingResult) {
        if(e.hasFieldErrors()) {
            e.getFieldErrors().forEach((field, error) -> bindingResult.rejectValue(field, "error." + field, error));
        }
    }
}
