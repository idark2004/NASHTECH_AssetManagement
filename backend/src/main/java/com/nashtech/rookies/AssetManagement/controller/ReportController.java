package com.nashtech.rookies.AssetManagement.controller;

import com.nashtech.rookies.AssetManagement.model.dto.ReportDTO;
import com.nashtech.rookies.AssetManagement.model.entity.Assets;
import com.nashtech.rookies.AssetManagement.repository.AssetRepository;
import com.nashtech.rookies.AssetManagement.service.AssetService;
import com.nashtech.rookies.AssetManagement.utils.ReportExcelExporter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/v1/report")
public class ReportController {

    @Autowired
    private AssetService assetService;

    @GetMapping("/{id}")
    public void exportReportToExcel(
            @PathVariable(name = "id") int locationId,
            HttpServletResponse response) throws IOException {
        response.setContentType("application/octet-stream");
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=report.xlsx";

        response.setHeader(headerKey, headerValue);

        List<ReportDTO> listReport = assetService.getReport(locationId);

        ReportExcelExporter excelExporter = new ReportExcelExporter(listReport);
        excelExporter.export(response);
    }
}
