import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppComponent,DialogForEditRow , FilterPipe} from './app.component';
import { DemoMaterialModule } from './material-module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Data } from './provider/data';

@NgModule({
  declarations: [
    AppComponent,
    DialogForEditRow,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    FormsModule,
    HttpClientModule

  ],
  providers: [Data],
  bootstrap: [AppComponent],
  entryComponents:[DialogForEditRow]
})
export class AppModule { }
