import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from '../shared/components/app.component';
import { config } from '../providers/app.config.server';

const bootstrap = (context: BootstrapContext) =>
    bootstrapApplication(AppComponent, config, context);

export default bootstrap;
