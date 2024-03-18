package swp.group5.swp_interior_project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp.group5.swp_interior_project.model.entity.RequestDetailProduct;

@Repository
public interface RequestDetailProductRepository extends JpaRepository<RequestDetailProduct, Long> {
}
