package com.nashtech.rookies.AssetManagement.model.entity;


import com.nashtech.rookies.AssetManagement.model.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.sql.Date;
import java.util.Objects;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(schema = "public", name = "users")
@Getter
@Setter
public class Users {
    @Id
    @GeneratedValue(generator = "user-generator")
    @GenericGenerator(name = "user-generator",
            parameters = @org.hibernate.annotations.Parameter(name = "prefix", value = "SD"),
            strategy = "com.nashtech.rookies.AssetManagement.utils.MyGenerator")
    private String id;
    @NotBlank
    @Column(name = "first_name")
    @Length(min = 1, max = 25)
    private String firstName;
    @NotBlank
    @Column(name = "last_name")
    @Length(min = 1, max = 25)
    private String lastName;
    @Column(name = "gender")
    private Gender gender;
    @Column(name = "date_of_birth")
    private Date dateOfBirth;
    @Column(name = "join_date")
    private Date joinDate;
    @Column(name = "is_first_login")
    private boolean isFirstLogin;
    @Column(name = "password")
    private String password;
    @Column(name = "username")
    private String username;
    @NotNull
    @ManyToOne
    @JoinColumn(name = "location_id")
    private Location location;
    @NotNull
    @ManyToOne
    @JoinColumn(name = "role_id")
    private Roles roles;
    @OneToMany(mappedBy = "assignee")
    private Set<Assignments> assignTo;
    @OneToMany(mappedBy = "assigner")
    private Set<Assignments> assignBy;

    @Column(name="is_active")
    private boolean isActive;

    @Override
    public String toString() {
        return "Users{" +
                "id='" + id + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", gender=" + gender +
                ", dateOfBirth=" + dateOfBirth +
                ", joinDate=" + joinDate +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Users)) return false;
        Users users = (Users) o;
        return getId().equals(users.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }
}
