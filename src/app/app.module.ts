import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import {
  TreeGridModule,
  EditService,
  ToolbarService,
  PageService,
  SortService,
  FilterService,
} from "@syncfusion/ej2-angular-treegrid";
import { AppComponent } from "./app.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, TreeGridModule, NgbModule, FormsModule],
  providers: [
    EditService,
    ToolbarService,
    PageService,
    SortService,
    FilterService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
