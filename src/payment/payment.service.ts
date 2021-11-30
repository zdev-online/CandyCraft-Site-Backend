import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { createHash } from 'crypto';
import { Sequelize } from 'sequelize';
import { Users } from 'src/users/users.entity';
import { UnitpayCallbackDto } from './dto/unitpay-callback.dto';
import { Payment } from './payment.entity';

@Injectable()
export class PaymentService {
	private unitapayIPs: string[] = ["31.186.100.49", "178.132.203.105", "52.29.152.23", "52.19.56.234"];
	private unitpayPayLink = `https://unitpay.ru/pay/${process.env.UNITPAY_PUBLIC_KEY}`;

	constructor(
		@InjectModel(Payment) private paymentEntity: typeof Payment,
		@InjectModel(Users) private usersEntity: typeof Users,
		@InjectConnection() private connection: Sequelize
	) { }

	async unitpayCallback(ip: string, data: UnitpayCallbackDto) {
		if (!this.unitapayIPs.includes(ip)) {
			throw new BadRequestException({ message: 'Неверный IP' });
		}
		let { method, params } = data;

		switch (method) {
			case 'CHECK': {
				let isExists = await this.paymentEntity.findOne({
					where: {
						email: params.account
					}
				});
				if (!isExists) {
					throw new BadRequestException({
						error: {
							message: `Заказ для ${params.account} не найден`
						}
					});
				}
				return {
					result: {
						message: 'Готово к оплате'
					}
				}
			}
			case 'PAY': {
				const t = await this.connection.transaction();
				try {
					let payment = await this.paymentEntity.findOne({
						where: {
							uuid: params.account
						},
						transaction: t
					});
					if (payment.status) {
						return {
							result: {
								message: 'Успешное зачисление'
							}
						}
					}
					let user = await this.usersEntity.findOne({
						where: {
							email: payment.email
						},
						transaction: t
					});
					user.money += Math.floor(payment.sum);
					await user.save({ transaction: t });
					await t.commit();
					return {
						result: {
							message: 'Успешное зачисление'
						}
					}
				} catch (e) { 
					await t.rollback();
					throw new BadRequestException({ 
						error: {
							message: 'Не зачислить средства'
						}
					});
				}
			}
			case 'ERROR': {
				break;
			}
			default: {
				throw new BadRequestException({
					error: {
						message: "Неверный метод"
					}
				});
			}
		}
	}

	async createPaymentLink(email: string, currency: string, desc: string, sum: number): Promise<string> {
		let params = new URLSearchParams();
		let payment = await this.paymentEntity.create({ email, sum });
		let signature = this.getUnitpaySignature(payment.uuid, currency, desc, sum);
		params.append('account', payment.uuid);
		params.append('currency', currency);
		params.append('desc', desc);
		params.append('sum', sum.toString());
		params.append('signature', signature);
		return `${this.unitpayPayLink}?${params.toString()}`;
	}

	private getUnitpaySignature(account: string, currency: string, desc: string, sum: number): string {
		let signature: string = `${account}{up}${currency}{up}${desc}{up}${sum}{up}${process.env.UNITPAY_SECRET_KEY}`;
		return createHash('sha256').update(signature).digest('hex');
	}
}