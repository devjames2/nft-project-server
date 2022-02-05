import { Test, TestingModule } from '@nestjs/testing';
import { CreateEmailSubscriberDto } from './dto/create-email-subscriber.dto';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('should create new email subscriber', async () => {
  //   // Given

  //   // When
  //   const newEmailSubscriber = new CreateEmailSubscriberDto()
  //   newEmailSubscriber.emailAddress = 'test1@test.com'

  //   // Then
  //   expect(service.create(newEmailSubscriber)).toBe('');
});
