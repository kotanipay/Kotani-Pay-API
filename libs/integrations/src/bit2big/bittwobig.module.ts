import { Module } from '@nestjs/common';
import { BitService } from '@kotanicore/integrations/bit2big/bit.service';

@Module({
  exports: [BitService],
  providers: [BitService],
})
export class BittwobigModule {}
