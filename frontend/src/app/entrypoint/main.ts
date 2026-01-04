import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from '../providers/app.config';
import { AppComponent } from '../shared/components/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
