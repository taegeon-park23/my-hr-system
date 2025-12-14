export enum PayrollStatus {
    DRAFT = 'DRAFT',
    CONFIRMED = 'CONFIRMED',
    PAID = 'PAID',
}

export const PAYROLL_STATUS_LABELS: Record<PayrollStatus, string> = {
    [PayrollStatus.DRAFT]: '작성 중',
    [PayrollStatus.CONFIRMED]: '확정됨',
    [PayrollStatus.PAID]: '지급 완료',
};
