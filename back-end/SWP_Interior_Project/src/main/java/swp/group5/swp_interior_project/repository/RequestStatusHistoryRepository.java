package swp.group5.swp_interior_project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import swp.group5.swp_interior_project.model.entity.RequestStatusHistory;
import swp.group5.swp_interior_project.model.entity.RequestVersion;
import swp.group5.swp_interior_project.utils.MonthConverter;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RequestStatusHistoryRepository extends JpaRepository<RequestStatusHistory, String> {
    @Query("SELECT YEAR(rsh.dateTime) AS year, MONTH(rsh.dateTime) AS month, SUM(r.price) AS totalPrice " +
            "FROM RequestStatusHistory rsh " +
            "JOIN rsh.requestVersion rv " +
            "JOIN rv.request r " +
            "GROUP BY YEAR(rsh.dateTime), MONTH(rsh.dateTime) " +
            "ORDER BY YEAR(rsh.dateTime) DESC, MONTH(rsh.dateTime) DESC " +
            "LIMIT 12")
    List<Object[]> getMonthlyTotalPrice();
    
    default List<Object[]> getMonthlyTotalPriceWithMonthNames() {
        List<Object[]> monthlyTotalPriceList = getMonthlyTotalPrice();
        for (Object[] obj : monthlyTotalPriceList) {
            int month = (int) obj[1];
            String monthName = MonthConverter.convertToMonthName(month);
            obj[1] = monthName;
        }
        return monthlyTotalPriceList;
    }
    
    @Query("SELECT CAST(sh1.dateTime AS date) AS date, ROUND(AVG(CAST(DATEDIFF(MINUTE, sh1.dateTime, sh2.dateTime) AS float)), 2) AS avgWaitingTime " +
            "FROM RequestStatusHistory sh1 " +
            "JOIN RequestStatusHistory sh2 ON sh1.requestVersion.id = sh2.requestVersion.id " +
            "WHERE sh1.status = 'REQUESTED' AND sh2.status = 'WAITING_FOR_PLANNING' " +
            "AND sh1.dateTime >= :startDate AND sh2.dateTime >= :startDate " +
            "GROUP BY CAST(sh1.dateTime AS date) " +
            "ORDER BY CAST(sh1.dateTime AS date) DESC")
    List<Object[]> getAverageWaitingTimeForLast7Days(LocalDateTime startDate);
    
    
    List<RequestStatusHistory> findAllByRequestVersion(RequestVersion requestVersion);
    
}
