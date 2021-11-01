// @ts-nocheck
import { Component, OnInit, ViewEncapsulation, ViewChild, Inject} from '@angular/core';
import { columnData, sampleData } from '../jsontreegriddata';
import {  TreeGridComponent, RowDDService,SelectionService, ResizeService,
          PageService,ExcelExportService, PdfExportService, ColumnChooserService,
          ToolbarService,EditService, FilterService,SortService, Column,
          ContextMenuService} from '@syncfusion/ej2-angular-treegrid';
import {PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import { ReorderService, EditSettingsModel } from '@syncfusion/ej2-angular-treegrid';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
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
  ],
  encapsulation: ViewEncapsulation.None,

})
export class AppComponent  implements OnInit {  
  title = 'treegrid-task';
  public data: Object[] = [];
  public updated_data: Object[] = [];
  public pageSettings: PageSettingsModel;
  public toolbar: string[];
  public filterSettings: Object;
  public templateOptions: object;
  public dropDownFilter: DropDownList = new DropDownList;
  public d1data: Object;
  public sortSettings: Object;
  public editing: EditSettingsModel;
  public contextMenuItems= [
    { text: 'Add Column', target: '.e-headercontent', id: 'create-column' },
    { text: 'Edit', target: '.e-headercontent', id: 'edit-column' },
    { text: 'Delete', target: '.e-headercontent', id: 'delete-column' },
    { text: 'Copy', target:'.e-content', id: 'customCopy' },
    { text: 'Cut', target: '.e-content', id: 'customCut' },
    { text: 'PasteNext', target: '.e-content', id: 'customPasteNext' },
    { text: 'PasteChild', target: '.e-content', id: 'customPasteChild' },
  ];
  public ddlfields: Object;
  public d2data: Object;
  public fields: Object;
  public selectOptions: Object;
  public editparams: Object;
  public rowIndex:Number;
  public cellIndex:Number;
  public selectionOptions: Object;
  public row : Number;
  public modalTitle ='Add Column';
  public modalData = {id: '',field: '',headerText:'',width: '70', textAlign:'' };
  public columns: Array<{field: string, headerText: string, width: string, textAlign: string, format?:string}> = [];
  public seleted_rows: Array;
  public selected_row_index: Array;
  public is_cut : Boolean;

  @ViewChild('content', { static: false }) private content;
  @ViewChild('treegrid')
  public treegrid!: TreeGridComponent;

  constructor(private modalService: NgbModal) {
   
  }
  ngOnInit(): void {
    
    this.data = sampleData;
    this.columns = this.ColumnVaue();
    this.pageSettings = { pageSize: 10 };
    this.editing = { allowDeleting: true, allowEditing: true, mode: 'Row' };
    this.toolbar = ['ColumnChooser'];
    this.filterSettings = { type: 'FilterBar', hierarchyMode: 'Parent', mode: 'Immediate' };
    this.templateOptions = {
        create: (_args: { element: Element }) => {
            let duration: HTMLInputElement = document.createElement('input');
            duration.id = 'duration';
            return duration;
        },
        write: (_args: { element: Element }) => {
            let dataSource: string[] = ['All', '1', '3', '4', '5', '6', '8', '9'];
            this.dropDownFilter = new DropDownList({
                dataSource: dataSource,
                value: 'All',
                change: (e: ChangeEventArgs) => {
                    let valuenum = +e.value;
                    let id = <string>this.dropDownFilter.element.id;
                    let value = <string>e.value;
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

  ColumnVaue(){
    return [       
      { field : "taskID", headerText:"Task ID" , width: '70' , textAlign:'Right',format:''},
      { field: "taskName", headerText:"Task Name", width: '200' , textAlign:'Right' ,format:''},
      { field: "startDate",headerText:"Start Date", width: '90' , textAlign:'Right', format:'yMd'},
      { field: "endDate", headerText:"End Date", width: '90' , textAlign:'Right', format:'yMd'},
      { field: "duration",headerText:"Duration", width: '80' , textAlign:'Right',format:''},
      { field: "progress",headerText:"Progress", width: '80' , textAlign:'Right',format:'' },
      { field: "priority",headerText:"Priority", width: '90' , textAlign:'Right',format:''},
      ]
  }
  contextMenuOpen(args): void {
    this.rowIndex = args.rowInfo.rowIndex;
    this.cellIndex = args.rowInfo.cellIndex;
  }
  customCopy(){
    this.row=this.rowIndex;
    const rows=this.treegrid.getSelectedRecords(); 
    this.seleted_rows=rows;
  }
  customCut(){
    this.row=this.rowIndex;
    this.is_cut=true;
    const rows=this.treegrid.getSelectedRecords(); 
    const rows_index=this.treegrid.getSelectedRowIndexes(); 
    this.selected_row_index=rows_index;
    this.seleted_rows=rows;
  }
  customPasteNext(){
    let tem_arr=this.data;
    tem_arr=[...tem_arr,...this.seleted_rows];
     if(this.is_cut==true){
        for(let i=0;i<this.selected_row_index.length;i++){
        delete tem_arr[this.selected_row_index[i]]
      }
      tem_arr = tem_arr.filter(item => item != undefined);
    }
     this.treegrid.dataSource = JSON.parse(JSON.stringify(tem_arr));
     this.is_cut=false;
     this.seleted_rows=[];
     this.selected_row_index=[]
  }
  customPasteChild(){
    let tem_arr=this.data;
    const array_obj =tem_arr[Number(this.rowIndex)];
    const new_array=[...array_obj,...this.seleted_rows];
    array_obj.subtasks=new_array;
    tem_arr[this.rowIndex]=array_obj;
    if(this.is_cut==true){
      for(let i=0;i<this.selected_row_index.length;i++){
        delete tem_arr[this.selected_row_index[i]]
      }
      tem_arr = tem_arr.filter(item => item != undefined);
    }
    this.treegrid.dataSource = JSON.parse(JSON.stringify(tem_arr));
    this.is_cut=false;
    this.seleted_rows=[];
    this.selected_row_index=[];
  }
  contextMenuClick (args?): void {
    if (args.item.id === 'customCopy') {
      this.customCopy();
    }else if(args.item.id === 'customCut'){
      this.customCut();
    }else if (args.item.id === 'customPasteNext') {
     this.customPasteNext();
    }else if(args.item.id === 'customPasteChild'){
      this.customPasteChild();
    }else if (args.item.id === 'create-column') {
      this.addColumn();
    }else if (args.item.id === 'edit-column'){
      this.editColumn(args?.column.index);
    }else if (args.item.id === 'delete-column'){
      this.columns.splice(args?.column.index, 1);
    }
  }
  open(content) {
    this.modalService.open(content);
  }
  addColumn(){
    this.modalTitle = 'Add Column';
    this.setModalDefaultValue();
    this.open(this.content);
  }
  editColumn(columnIndex){
    this.modalTitle = 'Edit Column';
    const data = this.columns[columnIndex];
    const column = this.treegrid.getColumnByField(data.field);
    this.modalData = {
      id: columnIndex,
      field: column.field,
      headerText: column.headerText,
      width: column.width,  
      textAlign:column.textAlign
    }
    this.open(this.content);
  }
  setModalDefaultValue(){
    this.modalData = {
      id: '',
      field: '',
      headerText:'',
      width: '70', 
      textAlign:'Right'
    }
  }
  saveData(){
    if(this.modalData.headerText === '' || this.modalData.field === ''){
      alert('Plase Enter Data');
    }else if(this.modalData.id !== ''){
      const column = this.treegrid.getColumnByField(this.modalData.field);
      column.headerText = this.modalData.headerText;
      column.width = this.modalData.width;
      column.textAlign = this.modalData.textAlign;
      this.treegrid.refreshColumns(); 
      this.modalService.dismissAll();
    }else{
      this.columns.push(this.modalData)
      this.setModalDefaultValue();
      this.modalService.dismissAll();
    }
  }
 
}
  