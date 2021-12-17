//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

package com.nashtech.rookies.AssetManagement.security.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nashtech.rookies.AssetManagement.security.UserDetailImpl;
import com.nashtech.rookies.AssetManagement.utils.JwtUtils;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

public class CustomAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;

    public CustomAuthenticationFilter(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(username, password);
        return this.authenticationManager.authenticate(usernamePasswordAuthenticationToken);
    }

    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException {
        String jwt = JwtUtils.generateJwtToken(authentication);
        UserDetailImpl userDetail = (UserDetailImpl)authentication.getPrincipal();
        response.setHeader("Authorization", "Bearer " + jwt);
        List<GrantedAuthority> roles = (List)userDetail.getAuthorities();
        String roleName = ((GrantedAuthority)roles.get(0)).getAuthority();
        Map<Object, Object> json = new HashMap();
        json.put("id", userDetail.getId());
        json.put("username", userDetail.getUsername());
        json.put("fullName", userDetail.getFullName());
        json.put("locationId",userDetail.getLocationId());
        json.put("locationName", userDetail.getLocationName());
        json.put("roleName", roleName);
        json.put("first", userDetail.isFirstTime());
        response.setContentType("application/json");
        response.setHeader("Access-Control-Expose-Headers","Authorization");
        (new ObjectMapper()).writeValue(response.getOutputStream(), json);
    }

    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException {
        Map<Object, Object> msg = new HashMap();
        msg.put("timestamp", LocalDateTime.now().toString());
        if(failed.toString().contains("DisabledException")){
            msg.put("msg", "Cannot use disabled user to login");
            msg.put("status", HttpStatus.NOT_ACCEPTABLE);
            response.setStatus(HttpStatus.NOT_ACCEPTABLE.value());
        }
        else{
            msg.put("msg", "Username or password is incorrect. Please try again.");
            msg.put("status", HttpStatus.FORBIDDEN);
            response.setStatus(HttpStatus.FORBIDDEN.value());
        }
        msg.put("path", request.getRequestURI());
        response.setContentType("application/json");
        (new ObjectMapper()).writeValue(response.getOutputStream(), msg);
    }
}
