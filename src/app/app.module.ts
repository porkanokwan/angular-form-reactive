import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    // FormsModule, อันนี้สำหรับ Template Driven Form
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
