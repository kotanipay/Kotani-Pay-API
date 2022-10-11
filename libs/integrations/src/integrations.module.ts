import { Module } from '@nestjs/common';
import { EmergentModule } from '@kotanicore/integrations/emergent/emergent.module';
import { BittwobigModule } from '@kotanicore/integrations/bit2big/bittwobig.module';
//import { IntegrationsService } from './integrations.service';

@Module({
  imports: [EmergentModule, BittwobigModule],
})
export class IntegrationsModule {}
