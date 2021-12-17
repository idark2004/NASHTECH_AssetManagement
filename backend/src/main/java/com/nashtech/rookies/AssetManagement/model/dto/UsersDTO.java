package com.nashtech.rookies.AssetManagement.model.dto;

import com.nashtech.rookies.AssetManagement.model.enums.Gender;
import com.nashtech.rookies.AssetManagement.model.entity.Users;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import java.sql.Date;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UsersDTO
{
    private String id;
    private String username;
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
    @NotBlank
    private Gender gender;
    @NotBlank
    private Date dateOfBirth;
    private Date joinDate;
    @NotBlank
    private long locationId;
    @NotBlank
    private int roleId;

    public UsersDTO(Users user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.gender = user.getGender();
        this.dateOfBirth = user.getDateOfBirth();
        this.joinDate = user.getJoinDate();
        this.locationId = user.getLocation().getId();
        this.roleId = user.getRoles().getId();
    }

    @Override
    public String toString() {
        return "UserDTO{" +
                "id='" + id + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", gender=" + gender +
                ", dateOfBirth=" + dateOfBirth +
                ", joinDate=" + joinDate +
                ", locationId=" + locationId +
                ", roleId=" + roleId +
                '}';
    }
}
