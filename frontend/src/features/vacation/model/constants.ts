export enum VacationType {
    ANNUAL = 'ANNUAL',
    HALF_AM = 'HALF_AM',
    HALF_PM = 'HALF_PM',
    SICK = 'SICK',
    UNPAID = 'UNPAID',
}

export enum VacationStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export const VACATION_TYPE_LABELS: Record<VacationType, string> = {
    [VacationType.ANNUAL]: '연차',
    [VacationType.HALF_AM]: '오전반차',
    [VacationType.HALF_PM]: '오후반차',
    [VacationType.SICK]: '병가',
    [VacationType.UNPAID]: '무급휴가',
};

export const VACATION_STATUS_LABELS: Record<VacationStatus, string> = {
    [VacationStatus.PENDING]: '승인 대기',
    [VacationStatus.APPROVED]: '승인됨',
    [VacationStatus.REJECTED]: '반려됨',
};
