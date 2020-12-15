import { EntityRepository, Repository } from "typeorm";
import { UnapprovedPayment } from "./unapproved-payment.entity";

@EntityRepository(UnapprovedPayment)
export class UnapprovedPaymentRepository extends Repository<UnapprovedPayment> {}