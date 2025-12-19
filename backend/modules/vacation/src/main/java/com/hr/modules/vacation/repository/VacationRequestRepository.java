package com.hr.modules.vacation.repository;

import com.hr.modules.vacation.domain.VacationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VacationRequestRepository extends JpaRepository<VacationRequest, Long> {
    List<VacationRequest> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<VacationRequest> findByUserIdInAndStartDateGreaterThanEqualOrderByStartDateAsc(java.util.Collection<Long> userIds, java.time.LocalDate startDate);

}
