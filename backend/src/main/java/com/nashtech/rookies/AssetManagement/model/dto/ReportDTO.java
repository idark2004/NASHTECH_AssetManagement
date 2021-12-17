package com.nashtech.rookies.AssetManagement.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ReportDTO {
    private String category;
    private int total;
    private int assigned;
    private int available;
    private int notAvailable;
    private int waiting;
    private int recycled;
}
