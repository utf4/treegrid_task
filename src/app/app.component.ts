import { Component, OnInit, ViewEncapsulation, ViewChild, Inject} from '@angular/core';
import { sampleData } from '../jsontreegriddata';
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
  public selectOptions: Object | undefined;
  public editparams: Object | undefined;
  public rowIndex: any;
  public cellIndex: any;
  public selectionOptions: Object | undefined;
  public row : Number | undefined;
  public modalTitle ='Add Column';
  public modalData = {id: '',field: '',headerText:'',width: '70', textAlign:'' };
  public columns: Array<{field: string, headerText: string, width: string, textAlign: string, format?:string}> = [];
  public seleted_rows : any | undefined;
  public selected_row_index : any | undefined;
  public is_cut : Boolean | undefined;

  @ViewChild('content', { static: false }) private content: any;
  @ViewChild('treegrid')
  public treegrid: TreeGridComponent;

  constructor(private modalService: NgbModal) {
   
  }
  ngOnInit(): void {
    
    this.data = sampleData;
    this.columns = this.ColumnVaue();
    this.pageSettings = { pageSize: 10 };
    this.editing = { allowDeleting: true, allowEditing: true, mode: 'Row' };
    this.contextMenuItems= [
      { text: 'Add Column', target: '.e-headercontent', id: 'create-column' },
      { text: 'Edit', target: '.e-headercontent', id: 'edit-column' },
      { text: 'Delete', target: '.e-headercontent', id: 'delete-column' },
      { text: 'Copy', target:'.e-content', id: 'customCopy' },
      { text: 'Cut', target: '.e-content', id: 'customCut' },
      { text: 'PasteNext', target: '.e-content', id: 'customPasteNext' },
      { text: 'PasteChild', target: '.e-content', id: 'customPasteChild' },
    ]
    this.toolbar = ['ColumnChooser'];
    this.filterSettings = { type: 'FilterBar', hierarchyMode: 'Parent', mode: 'Immediate' };
    this.templateOptions = {
      // Add Types
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

  ColumnVaue(){
    return [       
      { field : "taskID", headerText:"Task ID" , width: '70' , textAlign:'Right',format:''},
      { field: "taskName", headerText:"Task Name", width: '200' , textAlign:'' ,format:''},
      { field: "startDate",headerText:"Start Date", width: '90' , textAlign:'Right', format:'yMd'},
      { field: "endDate", headerText:"End Date", width: '90' , textAlign:'Right', format:'yMd'},
      { field: "duration",headerText:"Duration", width: '80' , textAlign:'Right',format:''},
      { field: "progress",headerText:"Progress", width: '80' , textAlign:'Right',format:'' },
      { field: "priority",headerText:"Priority", width: '90' , textAlign:'',format:''},
      ]
  }
  contextMenuOpen(args : any): void {
    this.rowIndex = args.rowInfo.rowIndex;
    this.cellIndex = args.rowInfo.cellIndex;
  }
  customCopy(){
    this.row=this.rowIndex;
    let rows=this.treegrid.getSelectedRecords(); 
    this.seleted_rows=rows;
  }
  customCut(){
    this.row=this.rowIndex;
    this.is_cut=true;
    let rows=this.treegrid.getSelectedRecords(); 
    let rows_index=this.treegrid.getSelectedRowIndexes(); 
    this.selected_row_index=rows_index;
    this.seleted_rows=rows;
  }
  customPasteNext(){
    let tem_arr=this.data;
    tem_arr=tem_arr.concat(this.seleted_rows);
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
    let array_obj: any =tem_arr[Number(this.rowIndex)];
    let new_array=array_obj.subtasks.concat(this.seleted_rows);
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
  contextMenuClick (args?: any): void {
    if (args.item.id == 'customCopy') {
      this.customCopy();
    }else if(args.item.id == 'customCut'){
      this.customCut();
    }else if (args.item.id == 'customPasteNext') {
     this.customPasteNext();
    }else if(args.item.id =='customPasteChild'){
      this.customPasteChild();
    }else if (args.item.id === 'create-column') {
      this.addColumn();
    }else if (args.item.id === 'edit-column'){
      this.editColumn(args?.column.index);
    }else if (args.item.id === 'delete-column'){
      this.columns.splice(args?.column.index, 1);
    }
  }
  open(content:any) {
    this.modalService.open(content);
  }
  addColumn(){
    this.modalTitle = 'Add Column';
    this.setModalDefaultValue();
    this.open(this.content);
  }
  editColumn(columnIndex:any){
    this.modalTitle = 'Edit Column';
    let data = this.columns[columnIndex];
    this.modalData = {
      id: columnIndex,
      field: data.field,
      headerText: data.headerText,
      width: data.width,  
      textAlign:data.textAlign
    }
    this.open(this.content);
  }
  setModalDefaultValue(){
    this.modalData = {
      id: '',
      field: '',
      headerText:'',
      width: '70', 
      textAlign:''
    }
  }
  saveData(){
    if(this.modalData.headerText === '' || this.modalData.field === ''){
      alert('Plase enter Data');
    }else if(this.modalData.id !== ''){
      let data : any =  this.ColumnVaue()
      data[this.modalData.id].headerText = 'asdasda';
      this.columns = [...data];
    }else{
      this.columns.push(this.modalData)
      this.setModalDefaultValue();
      this.modalService.dismissAll();
    }
  }
 
}
  