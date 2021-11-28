import { Injectable } from '@nestjs/common';
import { response } from 'express';

@Injectable()
export class PaymentService {
    async callback(type: 'unitpay');
    async callback(type: 'qiwi');
    async callback(type: 'qiwi' | 'unitpay'){
        if(type == 'unitpay'){

        }
        if(type == 'qiwi'){

        }
    }

    async createPaymentLink(type: 'qiwi' | 'unitpay'): Promise<string> {
        let link: string = '';
        if(type == 'unitpay'){
            return link;
        }
        if(type == 'qiwi'){
            return link;
        }
    };
}