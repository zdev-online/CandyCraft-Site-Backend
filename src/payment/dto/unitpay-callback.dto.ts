export class UnitpayCallbackDto {
  method: string;
  params: {
    account: string;
    date: string;
    operator: string;
    paymentType: string;
    projectId: number;
    phone: string;
    payerSum: number;
    payerCurrency: string;
    signature: string;
    orderSum: number;
    orderCurrency: string;
    unitpayId: number;
    test: number;
    profit: number;
    errorMessage: string;
  };
}
