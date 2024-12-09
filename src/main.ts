import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from 'app/app.component';
import { appConfig } from 'app/app.config';

bootstrapApplication(AppComponent, appConfig).then(() => {
    console.log('App Started')
}).catch((err) =>
    console.error(err)
);
