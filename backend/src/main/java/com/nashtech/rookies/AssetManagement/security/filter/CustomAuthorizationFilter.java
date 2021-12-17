

package com.nashtech.rookies.AssetManagement.security.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nashtech.rookies.AssetManagement.service.Impl.UsersServiceImpl;
import com.nashtech.rookies.AssetManagement.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CustomAuthorizationFilter extends OncePerRequestFilter {

    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        if (request.getServletPath().equals("/api/login")) {
            filterChain.doFilter(request, response);
        } else {
                String jwt = this.parseJwt(request);
                if (jwt != null) {
                    try {
                    String username = JwtUtils.getUserNameFromJwtToken(jwt);
                    Collection<SimpleGrantedAuthority> authorities = JwtUtils.getAuthorities(jwt);
                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, (Object)null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    filterChain.doFilter(request, response);
                    } catch (Exception var9) {
                        response.setStatus(HttpStatus.FORBIDDEN.value());
                        Map<String, String> error = new HashMap();
                        error.put("error_message", var9.getMessage());
                        response.setContentType("application/json");
                        (new ObjectMapper()).writeValue(response.getOutputStream(), error);
                    }
                } else{
                    filterChain.doFilter(request, response);
                }
        }
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        return StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ") ? headerAuth.substring("Bearer ".length()) : null;
    }
}
