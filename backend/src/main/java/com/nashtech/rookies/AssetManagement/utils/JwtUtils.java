package com.nashtech.rookies.AssetManagement.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import com.nashtech.rookies.AssetManagement.security.UserDetailImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Arrays.stream;

@Component
@Slf4j
public class JwtUtils {

    private static String jwtSecret;
    private static int jwtExpirationMs;

    @Value("${project.app.jwtSecret}")
    private void setJwtSecret(String secret) {
        jwtSecret = secret;
    }

    @Value("${project.app.jwtExpirationMs}")
    private void setJwtExpirationMs(int expirationMs) {
        jwtExpirationMs = expirationMs;
    }

    public static String generateJwtToken(Authentication authentication) {
        UserDetailImpl userPrincipal = (UserDetailImpl)authentication.getPrincipal();
        Algorithm algorithm = Algorithm.HMAC512(jwtSecret);
        List<GrantedAuthority> roles = (List)userPrincipal.getAuthorities();
        String username = userPrincipal.getUsername();
        return JWT.create()
				.withSubject(username)
				.withExpiresAt(new Date(System.currentTimeMillis() + jwtExpirationMs))
				.withClaim("roles", userPrincipal.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()))
				.sign(algorithm);
    }

    public static String getUserNameFromJwtToken(String token) {

        DecodedJWT decodedJWT = decodedJWT(token);
        return decodedJWT.getSubject();
    }

    public static DecodedJWT decodedJWT(String token){
        Algorithm algorithm = Algorithm.HMAC512(jwtSecret);
        JWTVerifier verifier = JWT.require(algorithm).build();
        return verifier.verify(token);
    }

    public static Collection<SimpleGrantedAuthority> getAuthorities(String token){
        String[] roles = decodedJWT(token).getClaim("roles").asArray(String.class);
        Collection<SimpleGrantedAuthority> authorities = new ArrayList<SimpleGrantedAuthority>();
        stream(roles).forEach(role ->{
            authorities.add(new SimpleGrantedAuthority(role));
        });
        return authorities;
    }
}
