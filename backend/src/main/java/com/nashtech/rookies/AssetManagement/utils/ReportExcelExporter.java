package com.nashtech.rookies.AssetManagement.utils;

import com.nashtech.rookies.AssetManagement.model.dto.ReportDTO;
import com.nashtech.rookies.AssetManagement.model.entity.Assets;
import com.nashtech.rookies.AssetManagement.model.entity.Category;
import com.nashtech.rookies.AssetManagement.repository.AssetRepository;
import com.nashtech.rookies.AssetManagement.repository.CategoryRepository;
import com.nashtech.rookies.AssetManagement.service.AssetService;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ReportExcelExporter {

    private XSSFWorkbook workbook;
    private XSSFSheet sheet;
    private List<ReportDTO> listReport;

    public ReportExcelExporter(List<ReportDTO> listReport) {
        this.listReport = listReport;
        workbook = new XSSFWorkbook();
        sheet = workbook.createSheet("Report");
    }

    private void writeHeaderRow() {
        List<String> columnHeaders = Arrays.asList(
                "Category",
                "Total",
                "Assigned",
                "Available",
                "Not Available",
                "Waiting for recycling",
                "Recycled");
        Row row = sheet.createRow(0);

        for(int i = 0; i < columnHeaders.size(); i++) {
            Cell cell = row.createCell(i);
            cell.setCellValue(columnHeaders.get(i));
        }
    }

    private void writeDataRows() {
        int countRow = 1;
        for (ReportDTO reportDTO : listReport) {
            Row row = sheet.createRow(countRow);
            ReportDTO report = reportDTO;

            Cell cellCategory = row.createCell(0);
            cellCategory.setCellValue(report.getCategory());

            Cell cellTotal = row.createCell(1);
            cellTotal.setCellValue(report.getTotal());

            Cell cellAssigned = row.createCell(2);
            cellAssigned.setCellValue(report.getAssigned());

            Cell cellAvailable = row.createCell(3);
            cellAvailable.setCellValue(report.getAvailable());

            Cell cellNotAvailable = row.createCell(4);
            cellNotAvailable.setCellValue(report.getNotAvailable());

            Cell cellWaiting = row.createCell(5);
            cellWaiting.setCellValue(report.getWaiting());

            Cell cellRecycled = row.createCell(6);
            cellRecycled.setCellValue(report.getRecycled());

            countRow++;
        }
    }

    public void export(HttpServletResponse response) throws IOException {

        writeHeaderRow();
        writeDataRows();

        ServletOutputStream outputStream = response.getOutputStream();
        workbook.write(outputStream);
        workbook.close();
        outputStream.close();
    }

}
