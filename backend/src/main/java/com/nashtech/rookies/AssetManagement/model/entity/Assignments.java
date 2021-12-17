package com.nashtech.rookies.AssetManagement.model.entity;

import com.nashtech.rookies.AssetManagement.model.enums.EAssignState;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.lang.Nullable;

import javax.persistence.*;
import java.sql.Date;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(schema = "public",name = "assignments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Assignments {
    @Id
    private Long id;
    @ManyToOne
    @JoinColumn(name = "assignee_id")
    private Users assignee;
    @ManyToOne
    @JoinColumn(name = "assigner_id")
    private Users assigner;
    @Column (name = "assigned_date")
    private Date assignedDate;
    @ManyToOne
    @JoinColumn(name = "asset_code")
    private Assets asset;
    @Enumerated(EnumType.STRING)
    @Column (name = "state")
    private EAssignState state;
    @Nullable
    @Column (name = "note")
    private String note;
    private String specification;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Assignments)) return false;
        Assignments that = (Assignments) o;
        return Objects.equals(getId(), that.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }
}
