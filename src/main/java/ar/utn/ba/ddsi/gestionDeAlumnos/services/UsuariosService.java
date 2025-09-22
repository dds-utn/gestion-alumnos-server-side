package ar.utn.ba.ddsi.gestionDeAlumnos.services;

import ar.utn.ba.ddsi.gestionDeAlumnos.models.repositories.UsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UsuariosService implements UserDetailsService {
    @Autowired
    private UsuariosRepository usuariosRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var usuario = usuariosRepository.findByNombreDeUsuario(username).orElseThrow(() -> new UsernameNotFoundException(username));
        List<GrantedAuthority> authorities = new ArrayList<>();
        usuario.getPermisos().forEach(permiso -> {
            authorities.add(new SimpleGrantedAuthority(permiso.name()));
        });
        authorities.add(new SimpleGrantedAuthority("ROLE_" + usuario.getRol().name()));
        return User.withUsername(usuario.getNombreDeUsuario())
                .password(usuario.getContrasenia())
                .authorities(authorities)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
