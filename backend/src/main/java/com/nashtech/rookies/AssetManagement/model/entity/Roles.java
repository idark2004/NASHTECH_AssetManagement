package com.nashtech.rookies.AssetManagement.model.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(
        name = "roles",
        schema = "public"
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Roles {
    @Id
    private int id;
    private String name;
    @OneToMany(
            mappedBy = "roles"
    )
    private Set<Users> users;

}
