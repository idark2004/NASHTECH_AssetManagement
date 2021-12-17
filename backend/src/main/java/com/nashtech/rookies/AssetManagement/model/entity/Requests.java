package com.nashtech.rookies.AssetManagement.model.entity;

import com.nashtech.rookies.AssetManagement.model.enums.ERequestState;
import lombok.*;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Requests {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "assigned_date")
    private Date assignedDate;
    @Column(name = "returned_date")
    private Date returnedDate;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id")
    private Users requestBy;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "acceptor_id")
    private Users acceptedBy;
    @Enumerated(EnumType.STRING)
    private ERequestState state;
    private long assignmentId;
    @ManyToOne
    private Assets asset;
}
