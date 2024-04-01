package swp.group5.swp_interior_project.service.report;

import org.apache.poi.ss.usermodel.*;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import swp.group5.swp_interior_project.model.entity.RequestDetail;
import swp.group5.swp_interior_project.model.entity.RequestDetailProduct;
import swp.group5.swp_interior_project.model.entity.RequestVersion;
import swp.group5.swp_interior_project.model.enums.ProductUnit;

import java.io.*;

@Service
public class ExcelService {
    private final ResourceLoader resourceLoader;
    
    private static final int startRowWriteRequestVersionToExcel = 14;
    private static final String templateFilePathWriteRequestVersionToExcel = "classpath:/templates/ProposalRequestVersionTemplate.xlsx";
    
    public ExcelService(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }
    
    public String writeRequestVersionToExcel(String outputDirectory, RequestVersion requestVersion) throws IOException {
        String newFileName = "FurnitureDesign-BaoGiaThiCongNoiThat-" + requestVersion.getId() + ".xlsx";
        String outputFilePath = outputDirectory + File.separator + newFileName;
        
        Resource resource = loadTemplateFile(templateFilePathWriteRequestVersionToExcel);
        
        String cloneFilePath = cloneFile(outputFilePath, resource);
        
        try (Workbook workbook = WorkbookFactory.create(new FileInputStream(cloneFilePath))) {
            Sheet sheet = workbook.getSheetAt(0);
            
            int rowIndex = startRowWriteRequestVersionToExcel;
            
            for (RequestDetail requestDetail : requestVersion.getRequestDetails()) {
                writeRequestDetailHeader(sheet, rowIndex, requestDetail);
                rowIndex++;
                int productIndex = 1;
                for (RequestDetailProduct detailProduct : requestDetail.getRequestDetailProducts()) {
                    writeRequestDetailProduct(sheet, rowIndex, detailProduct, productIndex);
                    productIndex++;
                    rowIndex++;
                }
            }
            try (FileOutputStream fileOutputStream = new FileOutputStream(outputFilePath)) {
                workbook.write(fileOutputStream);
            }
        }
        return outputFilePath;
    }
    
    
    private String cloneFile(String outputFilePath, Resource resource) throws IOException {
        try (
                InputStream inputStream = resource.getInputStream();
                FileOutputStream outputStream = new FileOutputStream(outputFilePath)
        ) {
            byte[] bytes = new byte[1024];
            int length;
            while ((length = inputStream.read(bytes)) != -1) {
                outputStream.write(bytes, 0, length);
            }
        }
        return outputFilePath;
    }
    
    private void writeRequestDetailHeader(Sheet sheet, int rowIndex, RequestDetail requestDetail) {
        Row row = sheet.createRow(rowIndex);
        
        //Column B: workspaceName
        Cell cellB = row.createCell(1);
        cellB.setCellValue(requestDetail.getWorkspace().getWorkspaceName());
        
        //Column C: requestDetail's length
        Cell cellC = row.createCell(2);
        cellC.setCellValue(requestDetail.getLength().doubleValue());
        
        //Column D: requestDetail's width
        Cell cellD = row.createCell(3);
        cellD.setCellValue(requestDetail.getWidth().doubleValue());
        
        //Column J: requestDetail's description
        Cell cellJ = row.createCell(9);
        cellJ.setCellValue(requestDetail.getDescription());
        
        CellStyle style = sheet.getWorkbook().createCellStyle();
        style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        
        requestDetailStyleRow(row, style);
    }
    
    private void requestDetailStyleRow(Row row, CellStyle style) {
        BorderStyle borderStyle = BorderStyle.THIN;
        style.setBorderBottom(borderStyle);
        style.setBorderTop(borderStyle);
        style.setBorderLeft(borderStyle);
        style.setBorderRight(borderStyle);
        style.setWrapText(true);
        for (int i = 0; i <= 9; i++) {
            Cell currentCell = row.getCell(i);
            if (currentCell == null) {
                currentCell = row.createCell(i);
            }
            if (i == 1 || i == 5 || i == 9) {
                style.setAlignment(HorizontalAlignment.LEFT);
            } else {
                style.setAlignment(HorizontalAlignment.CENTER);
            }
            style.setVerticalAlignment(VerticalAlignment.CENTER);
            currentCell.setCellStyle(style);
        }
    }
    
    private void writeRequestDetailProduct(Sheet sheet, int rowIndex, RequestDetailProduct detailProduct, int productIndex) {
        Row row = sheet.createRow(rowIndex);
        
        //Column A: index
        Cell cellA = row.createCell(0);
        cellA.setCellValue(productIndex);
        
        //Column B: product's name
        Cell cellB = row.createCell(1);
        cellB.setCellValue(detailProduct.getProduct().getName());
        
        //Column C: requestDetailProduct's length
        Cell cellC = row.createCell(2);
        cellC.setCellValue(detailProduct.getLength());
        
        //Column D: requestDetailProduct's width
        Cell cellD = row.createCell(3);
        cellD.setCellValue(detailProduct.getWidth());
        
        //Column E: requestDetailProduct's height
        Cell cellE = row.createCell(4);
        cellE.setCellValue(detailProduct.getHeight());
        
        //Column F: product's description
        Cell cellF = row.createCell(5);
        cellF.setCellValue(detailProduct.getProduct().getDescription());
        
        //Column G: requestDetailProduct's quantity
        Cell cellG = row.createCell(6);
        cellG.setCellValue(detailProduct.getQuantity());
        
        //Column H: product's price
        Cell cellH = row.createCell(7);
        cellH.setCellValue(detailProduct.getProduct().getPrice().doubleValue());
        
        //Column I: requestDetailProduct's price
        Cell cellI = row.createCell(8);
        cellI.setCellValue(getDetailProductPrice(detailProduct));
        
        //Column J: requestDetailProduct's description
        Cell cellJ = row.createCell(9);
        cellJ.setCellValue(detailProduct.getDescription());
        
        CellStyle style = sheet.getWorkbook().createCellStyle();
        requestDetailStyleRow(row, style);
    }
    
    public Resource loadTemplateFile(String templateFilePathWriteRequestVersionToExcel) {
        return resourceLoader.getResource(templateFilePathWriteRequestVersionToExcel);
    }
    
    private double getDetailProductPrice(RequestDetailProduct detailProduct) {
        if (detailProduct.getProduct().getUnit().equals(ProductUnit.m2)) {
            return detailProduct.getProduct().getPrice().doubleValue() * detailProduct.getLength() * detailProduct.getWidth() * detailProduct.getQuantity();
        } else {
            return detailProduct.getProduct().getPrice().doubleValue() * detailProduct.getQuantity();
        }
    }
    
}
