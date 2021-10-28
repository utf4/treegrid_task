import { Component, OnInit, ViewEncapsulation, ViewChild, Inject} from '@angular/core';
import { sampleData } from '../jsontreegriddata';
import { TreeGridComponent, RowDDService,SelectionService,ResizeService, PageService,ExcelExportService, PdfExportService, ColumnChooserService, ToolbarService,EditService, FilterService,SortService, Column, ContextMenuService} from '@syncfusion/ej2-angular-treegrid';
import {PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { removeClass, addClass } from '@syncfusion/ej2-base';
import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { SortEventArgs } from '@syncfusion/ej2-grids';
import { CheckBoxComponent } from '@syncfusion/ej2-angular-buttons';
import { CheckBoxAllModule} from '@syncfusion/ej2-angular-buttons';
import { ActionEventArgs } from '@syncfusion/ej2-grids';
import { ReorderService, EditSettingsModel } from '@syncfusion/ej2-angular-treegrid';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { BeforeOpenCloseEventArgs } from '@syncfusion/ej2-inputs';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ContextMenuClickEventArgs } from '@syncfusion/ej2-grids';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    RowDDService, 
    SelectionService,
    PageService, 
    ColumnChooserService, 
    ToolbarService,
    SortService,
    ResizeService,
    PageService,
    EditService,
    ExcelExportService,
    PdfExportService,
    ContextMenuService,
    FilterService,
    ReorderService,
  ]

})
export class AppComponent  implements OnInit {  
  title = 'treegrid-task';
  public data: Object[] = [];
  public updated_data: Object[] = [];
  public pageSettings: PageSettingsModel | undefined;
  public toolbar: string[] | undefined;
  public filterSettings: Object | undefined;
  public templateOptions: object | undefined;
  public dropDownFilter: DropDownList = new DropDownList;
  public d1data: Object | undefined;
  public sortSettings: Object | undefined;
  public editing: EditSettingsModel | undefined;
  public contextMenuItems: Object | undefined;
  public ddlfields: Object | undefined;
  public d2data: Object | undefined;
  public fields: Object | undefined;
  public columns: any;
  public selectOptions: Object | undefined;
  public editparams: Object | undefined;
  public rowIndex: any;
  public cellIndex: any;
  public selectionOptions: Object | undefined;
  public row : Number | undefined;


  @ViewChild('treegrid')
  public treegrid: TreeGridComponent;


  ngOnInit(): void {
    
    this.data = sampleData;
    this.columns = [
      { 'field': "taskID", 'headerText':"Task ID" , 'width': '70' , 'textAlign':'Right'},
      { 'field': "taskName", 'headerText':"Task Name", 'width': '200' , 'textAlign':''},
      { 'field': "startDate",'headerText':"Start Date", 'width': '90' , 'textAlign':'Right', 'format':'yMd'},
      { 'field': "endDate", 'headerText':"End Date", 'width': '90' , 'textAlign':'Right', 'format':'yMd'},
      { 'field': "duration",'headerText':"Duration", 'width': '80' , 'textAlign':'Right'},
      { 'field': "progress",'headerText':"Progress", 'width': '80' , 'textAlign':'Right' },
      { 'field': "priority",'headerText':"Priority", 'width': '90' , 'textAlign':''},

    ];
    this.pageSettings = { pageSize: 10 };
    this.editing = { allowDeleting: true, allowEditing: true, mode: 'Row' };
    this.contextMenuItems= [
      // { text: 'Add Column', target: '.e-headercontent', id: 'create-column' },
      // { text: 'Edit', target: '.e-headercontent', id: 'edit-column' },
      { text: 'Copy', target:'.e-content', id: 'customCopy' },
      { text: 'Paste', target: '.e-content', id: 'customPaste' },
      { text: 'Delete', target: '.e-headercontent', id: 'delete-column' }
    ]
    this.toolbar = ['ColumnChooser'];
    this.filterSettings = { type: 'FilterBar', hierarchyMode: 'Parent', mode: 'Immediate' };
    this.templateOptions = {
        create: (args: { element: Element }) => {
            let dd: HTMLInputElement = document.createElement('input');
            dd.id = 'duration';
            return dd;
        },
        write: (args: { element: Element }) => {
            let dataSource: string[] = ['All', '1', '3', '4', '5', '6', '8', '9'];
            this.dropDownFilter = new DropDownList({
                dataSource: dataSource,
                value: 'All',
                change: (e: ChangeEventArgs) => {
                    let valuenum: any = +e.value;
                    let id: any = <string>this.dropDownFilter.element.id;
                    let value: any = <string>e.value;
                    if ( value !== 'All') {
                        this.treegrid.filterByColumn( id, 'equal', valuenum );
                    } else {
                        this.treegrid.removeFilteredColsByField(id);
                    }
                }
            });
            this.dropDownFilter.appendTo('#duration');
     }
    };
    this.selectOptions = { type: 'Multiple' };
    this.selectionOptions = {
      type: 'Multiple',
      mode: 'Cell',
      cellSelectionMode: 'Box',
    };
    (this.editing = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: 'Batch',
    }),
    (this.pageSettings = { pageSize: 10 });
    this.editparams = { params: { format: 'n' } };
  }
  contextMenuOpen(args : any): void {
    this.rowIndex = args.rowInfo.rowIndex;
    this.cellIndex = args.rowInfo.cellIndex;
  }
  
  contextMenuClick (args?: any): void {
  
    if (args.item.id == 'customCopy') {
      this.treegrid.copy();
      this.row=this.rowIndex;
    } else if (args.item.id == 'customPaste') {
      var rowIndex = this.rowIndex;
      var cellIndex = this.cellIndex;
       let tem_arr=[];
       this.data.push(this.data[Number(this.row)]);
       tem_arr=this.data;
       this.treegrid.dataSource = JSON.parse(JSON.stringify(tem_arr));
    }else if (args.item.id === 'create-column') {

    }else if (args.item.id === 'edit-column'){
      console.log(args, args?.column.index, 'here');
    }else if (args.item.id === 'delete-column'){
      this.columns.splice(args?.column.index, 1);
    }
  }
}
  