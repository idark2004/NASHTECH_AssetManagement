package com.nashtech.rookies.AssetManagement.model.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(schema = "public",name = "categories")
@Getter
@Setter
@NoArgsConstructor
public class Category {
    @Id
    private String prefix;
    private String name;
    @OneToMany(mappedBy = "category")
    private Set<Assets> assets;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Category)) return false;
        Category category = (Category) o;
        return getName().equals(category.getName());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getPrefix());
    }
}
