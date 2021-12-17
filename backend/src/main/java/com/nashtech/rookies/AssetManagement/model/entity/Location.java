package com.nashtech.rookies.AssetManagement.model.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.Set;

@Entity
@Table(
        name = "locations"
)
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Location {
    @Id
    private Long id;
    private String name;
    @OneToMany(
            mappedBy = "location"
    )
    private Set<Users> users;

}
