import { Test, TestingModule } from '@nestjs/testing';
import { DailyVoucherService } from './daily-voucher.service';

describe('DailyVoucherService', () => {
  let service: DailyVoucherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailyVoucherService],
    }).compile();

    service = module.get<DailyVoucherService>(DailyVoucherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
