package com.nashtech.rookies.AssetManagement.model.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import java.util.Date;
@Getter
@Setter
public class UserDTO
{
    private String id;
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
    @NotBlank
    private String username;
    @NotBlank
    private String gender;
    @NotBlank
    private Date dateOfBirth;
    @NotBlank
    private Date joinDate;
    @NotBlank
    private String role;
}