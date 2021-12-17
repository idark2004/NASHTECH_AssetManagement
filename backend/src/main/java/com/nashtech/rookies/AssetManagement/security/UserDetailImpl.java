package com.nashtech.rookies.AssetManagement.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.nashtech.rookies.AssetManagement.model.entity.Users;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserDetailImpl implements UserDetails {
    private String id;
    private String username;
    @JsonIgnore
    private String password;
    private String fullName;
    private String locationName;
    private Long locationId;
    private boolean firstTime;
    private boolean isActive;
    private Collection<? extends GrantedAuthority> authorities;

    public static UserDetailImpl build(Users user) {
        List<GrantedAuthority> authorities = new ArrayList();
        authorities.add(new SimpleGrantedAuthority(user.getRoles().getName()));
        return new UserDetailImpl(user.getId(), user.getUsername(), user.getPassword(), user.getFirstName() + " " + user.getLastName(), user.getLocation().getName(), user.getLocation().getId(),user.isFirstLogin(),user.isActive(), authorities);
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        if (this.isActive) return true;
        else return false;
    }
}