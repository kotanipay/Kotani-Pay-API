import { Module } from '@nestjs/common';
import { EmergentService } from '@kotanicore/integrations/emergent/emergent.service';

@Module({
  exports: [EmergentService],
  providers: [EmergentService],
})
export class EmergentModule {}
