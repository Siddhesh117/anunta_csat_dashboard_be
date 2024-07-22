interface DashboardRequestParams {
    airportId: number;
    terminalId: number;
    fromDateTime: string;
    toDateTime: string;
    atrsIdList: Array<number>;
}

export type { DashboardRequestParams };
