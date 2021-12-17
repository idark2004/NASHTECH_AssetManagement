package com.nashtech.rookies.AssetManagement.model.entity;

import com.nashtech.rookies.AssetManagement.model.enums.EAssetState;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Date;
import java.util.Set;

@Entity
@Table(name = "assets", schema = "public")
@Getter
@Setter
public class Assets {
    @Id
    @Column(name = "asset_code")
    private String assetCode;
    @Column(name = "name")
    private String name;
    private String specification;
    @Column(name = "installed_date")
    private Date installedDate;
    @Enumerated(EnumType.STRING)
    private EAssetState state;
    @ManyToOne
    @JoinColumn(name = "location_id")
    private Location location;
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
    @OneToMany(mappedBy = "asset")
    private Set<Assignments> assignments;
    @OneToMany(mappedBy = "asset")
    private Set<Requests> requests;
}
