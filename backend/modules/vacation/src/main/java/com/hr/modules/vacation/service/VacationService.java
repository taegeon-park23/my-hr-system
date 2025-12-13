package com.hr.modules.vacation.service;

import com.hr.modules.approval.api.ApprovalModuleApi;
import com.hr.modules.approval.api.dto.ApprovalRequestCommand;
import com.hr.modules.vacation.domain.VacationBalance;
import com.hr.modules.vacation.domain.VacationRequest;
import com.hr.modules.vacation.domain.VacationType;
import com.hr.modules.vacation.repository.VacationBalanceRepository;
import com.hr.modules.vacation.repository.VacationRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class VacationService {

    private final VacationBalanceRepository balanceRepository;
    private final VacationRequestRepository requestRepository;
    private final ApprovalModuleApi approvalApi;

    @Transactional(readOnly = true)
    public VacationBalance getBalance(Long companyId, Long userId, int year) {
        return balanceRepository.findByCompanyIdAndUserIdAndYear(companyId, userId, year)
                .orElse(new VacationBalance(companyId, userId, year, 15.0)); // Default 15 days for new
    }

    @Transactional(readOnly = true)
    public List<VacationRequest> getMyRequests(Long userId) {
        return requestRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public VacationRequest requestVacation(Long companyId, Long userId, VacationType type, LocalDate start, LocalDate end, String reason) {
        // 1. Calculate days
        // MVP: Simple calculation (end - start + 1), treating all as 1.0 or 0.5 based on type.
        // Complex logic (weekends, holidays) ommitted for MVP.
        double days = calculateDays(start, end, type);

        // 2. Check Balance (Optimistic Lock by @Version is better, but simple check here)
        int year = start.getYear(); // Assuming single year
        VacationBalance balance = getBalance(companyId, userId, year);
        
        if (!balance.canDeduct(days)) {
            // For now, simple exception. In real app, return error enum.
            throw new IllegalArgumentException("Insufficient vacation balance.");
        }
        
        // 3. Create Request
        VacationRequest vacationRequest = VacationRequest.builder()
                .companyId(companyId)
                .userId(userId)
                .vacationType(type)
                .startDate(start)
                .endDate(end)
                .requestDays(days)
                .reason(reason)
                .build();
        
        VacationRequest saved = requestRepository.save(vacationRequest);

        // 4. Create Approval Request
        String title = String.format("%s 휴가 신청 (%s ~ %s)", type.toString(), start, end);
        
        ApprovalRequestCommand approvalCommand = ApprovalRequestCommand.builder()
                .companyId(companyId)
                .requesterId(userId)
                .resourceType("VACATION")
                .resourceId(saved.getId())
                .title(title)
                .description(reason)
                .build();
        
        Long approvalId = approvalApi.createApproval(approvalCommand);
        saved.connectApproval(approvalId);
        
        return saved;
    }

    private double calculateDays(LocalDate start, LocalDate end, VacationType type) {
        if (type == VacationType.HALF_AM || type == VacationType.HALF_PM) {
            return 0.5;
        }
        // Simple day diff + 1
        long diff = java.time.temporal.ChronoUnit.DAYS.between(start, end) + 1;
        return (double) diff;
    }
}
