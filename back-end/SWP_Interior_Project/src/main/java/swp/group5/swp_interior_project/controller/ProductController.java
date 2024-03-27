package swp.group5.swp_interior_project.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp.group5.swp_interior_project.model.dto.ProductDto;
import swp.group5.swp_interior_project.service.interfaces.ProductService;

@RestController
@RequestMapping("/api/v1/product")
public class ProductController {
    
    private final ProductService productService;
    
    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }
    
    // Endpoint to delete a product
    /**
     * API Endpoint: /api/v1/product/delete?productId=<productId>
     * Method: DELETE
     * Description: Delete a product from the system based on its ID.
     * Input Parameters: productId (Long) - ID of the product to be deleted.
     * Expected Output: Confirmation message of successful deletion.
     */
    @DeleteMapping("/delete/{productId}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.ok("Delete successfully");
    }
    
    // Endpoint to update a product
    /**
     * API Endpoint: /api/v1/product/update/{productId}
     * Method: PUT
     * Description: Update details of a product in the system based on its ID.
     * Input Parameters:
     * productId (Long) - ID of the product to be updated (path variable).
     * productDto (ProductDto) - Updated details of the product (request body).
     * Expected Output: Updated details of the product (ProductDto).
     */
    @PutMapping("/update/{productId}")
    public ResponseEntity<ProductDto> updateProduct(
            @PathVariable Long productId,
            @Valid @RequestBody ProductDto productDto
    ) {
        ProductDto updateProductDto = productService.updateProductById(productId, productDto);
        return ResponseEntity.ok(updateProductDto);
    }
    
    // Endpoint for retrieving a product by ID
    
    /**
     * API Endpoint: /api/v1/product/{productId}
     * Method: GET
     * Description: Retrieves details of a product identified by productId.
     * Input Parameters:
     *   - productId (Long): ID of the product to be retrieved (path variable).
     * Expected Output:
     *   - Returns the details of the product as a ProductDto object.
     * Note: This endpoint retrieves details of a specific product based on the provided productId.
     *       If the productId does not exist, a NOT_FOUND response will be returned.
     *       The productService is responsible for retrieving and converting the product details.
     */
    @GetMapping("/{productId}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Long productId) {
        return ResponseEntity.ok(productService.convertProduct(productService.getProductById(productId)));
    }
}
