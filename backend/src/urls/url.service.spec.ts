import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { Url } from './schemas/url.schema';

type MockModel = {
  exists: jest.Mock;
  create: jest.Mock;
  findOne: jest.Mock;
  updateOne: jest.Mock;
  deleteOne: jest.Mock;
  find: jest.Mock;
  countDocuments: jest.Mock;
};

function execResolvedWith<T>(value: T) {
  return { exec: jest.fn().mockResolvedValue(value) };
}

describe('UrlService', () => {
  let service: UrlService;
  let model: MockModel;

  beforeEach(async () => {
    model = {
      exists: jest.fn(),
      create: jest.fn(),
      findOne: jest.fn(),
      updateOne: jest.fn().mockReturnValue(execResolvedWith(undefined)),
      deleteOne: jest.fn().mockReturnValue(execResolvedWith(undefined)),
      find: jest.fn(),
      countDocuments: jest.fn().mockReturnValue(execResolvedWith(0)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        { provide: getModelToken(Url.name), useValue: model },
      ],
    }).compile();

    service = module.get(UrlService);
  });

  describe('createUrl', () => {
    it('rejects a custom slug that is already taken', async () => {
      model.exists.mockResolvedValue(true);

      await expect(
        service.createUrl({
          originalUrl: 'https://example.com',
          shortUrl: 'taken',
          userId: 'u1',
        }),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(model.create).not.toHaveBeenCalled();
    });

    it('creates a link with a free custom slug', async () => {
      model.exists.mockResolvedValue(false);
      model.create.mockResolvedValue({
        url: 'https://example.com',
        shortUrl: 'free',
        clicks: 0,
      });

      const result = await service.createUrl({
        originalUrl: 'https://example.com',
        shortUrl: 'free',
        userId: 'u1',
      });

      expect(result).toEqual({
        url: 'https://example.com',
        shortUrl: 'free',
        clicks: 0,
      });
    });
  });

  describe('deleteUrl', () => {
    it('throws NotFoundException when the link does not exist', async () => {
      model.findOne.mockReturnValue(execResolvedWith(null));

      await expect(service.deleteUrl('missing', 'u1')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('throws ForbiddenException when the requester does not own the link', async () => {
      model.findOne.mockReturnValue(execResolvedWith({ userId: 'owner' }));

      await expect(
        service.deleteUrl('code', 'someone-else'),
      ).rejects.toBeInstanceOf(ForbiddenException);
      expect(model.deleteOne).not.toHaveBeenCalled();
    });

    it('deletes the link when the requester owns it', async () => {
      model.findOne.mockReturnValue(execResolvedWith({ userId: 'owner' }));

      await service.deleteUrl('code', 'owner');

      expect(model.deleteOne).toHaveBeenCalledWith({ shortUrl: 'code' });
    });
  });
});
