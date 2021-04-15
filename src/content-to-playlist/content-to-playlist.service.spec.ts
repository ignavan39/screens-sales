import { Test, TestingModule } from '@nestjs/testing';
import { ContentToPlaylistService } from './content-to-playlist.service';

describe('ContentToPlaylistService', () => {
  let service: ContentToPlaylistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentToPlaylistService],
    }).compile();

    service = module.get<ContentToPlaylistService>(ContentToPlaylistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
