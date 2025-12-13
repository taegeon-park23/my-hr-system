package com.hr.modules.vacation.domain;

public enum VacationType {
    ANNUAL("연차", 1.0),
    HALF_AM("오전반차", 0.5),
    HALF_PM("오후반차", 0.5),
    SICK("병가", 0.0), // 병가는 연차 차감 안 함 (회사 내규에 따라 다름, 여기서는 0으로 가정하거나 별도 로직) -> 일단 1일로 잡고 차감 여부는 서비스에서 결정
    UNPAID("무급휴가", 0.0);

    private final String description;
    private final double deductionDays; // 기본 차감 일수

    VacationType(String description, double deductionDays) {
        this.description = description;
        this.deductionDays = deductionDays;
    }

    public double getDeductionDays() {
        return deductionDays;
    }
}
