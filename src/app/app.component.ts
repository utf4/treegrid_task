// @ts-nocheck
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { sampleData } from "../jsontreegriddata";
import {
  TreeGridComponent,
  RowDDService,
  SelectionService,
  ResizeService,
  PageService,
  ExcelExportService,
  PdfExportService,
  ColumnChooserService,
  ToolbarService,
  EditService,
  FilterService,
  SortService,
  ContextMenuService,
  ReorderService,
  EditSettingsModel,
  ToolbarItems,
} from "@syncfusion/ej2-angular-treegrid";
import { PageSettingsModel } from "@syncfusion/ej2-angular-grids";
import {
  DropDownList,
  ChangeEventArgs,
} from "@syncfusion/ej2-angular-dropdowns";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DialogEditEventArgs } from "@syncfusion/ej2-angular-grids";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
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
export class AppComponent implements OnInit {
  title = "treegrid-task";
  public data: Object[] = [];
  public updated_data: Object[] = [];
  public pageSettings: PageSettingsModel;
  public toolbar: string[];
  public filterSettings: Object;
  public templateOptions: object;
  public dropDownFilter: DropDownList = new DropDownList();
  public d1data: Object;
  public sortSettings: Object;
  public editing: EditSettingsModel;
  public toolbarOptions: ToolbarItems[];
  public contextMenuItems = [
    { text: "Add Column", target: ".e-headercontent", id: "create-column" },
    { text: "Edit", target: ".e-headercontent", id: "edit-column" },
    { text: "Delete", target: ".e-headercontent", id: "delete-column" },
    { text: "Copy", target: ".e-content", id: "customCopy" },
    { text: "Cut", target: ".e-content", id: "customCut" },
    { text: "Add Next", target: ".e-content", id: "customPasteNext" },
    { text: "Add Child", target: ".e-content", id: "customPasteChild" },
    { text: "Del Row", target: ".e-content", id: "customDeleteRow" },
    { text: "Edit Row", target: ".e-content", id: "customEditRow" },
  ];
  public ddlfields: Object;
  public d2data: Object;
  public fields: Object;
  public selectOptions: Object;
  public editparams: Object;
  public rowIndex: Number;
  public cellIndex: Number;
  public selectionOptions: Object;
  public row: Number;
  public modalTitle: String = "Add Column";

  public modalData = {
    id: "",
    field: "",
    headerText: "",
    width: "70",
    textAlign: "",
    dataType: "",
    bgColor: "",
    fontSize: "",
    fontColor: "",
    format: "",
  };
  public columns: Array<{
    field: string;
    headerText: string;
    width: string;
    dataType: string;
    bgColor: string;
    textAlign: string;
    format?: stringf;
    fontSize: string;
    fontColor: string;
  }> = [];
  public seleted_rows: Array;
  public selected_row_index: Array;
  public is_cut: Boolean;
  public customAttributes: Object;
  @ViewChild("content", { static: false }) private content;
  @ViewChild("treegrid")
  public treegrid!: TreeGridComponent;
  constructor(private modalService: NgbModal) {}
  ngOnInit(): void {
    this.data = sampleData;
    this.customAttributes = { class: "customColumn" };
    this.columns = this.ColumnVaue();
    this.pageSettings = { pageSize: 10 };
    this.editing = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: "Dialog",
    };
    this.orderIDRules = { required: true };
    this.customerIDRules = { required: true, minLength: 3 };
    this.toolbarOptions = [
      "Add",
      "Edit",
      "Delete",
      "Update",
      "Cancel",
      "ColumnChooser",
    ];

    this.filterSettings = {
      type: "FilterBar",
      hierarchyMode: "Parent",
      mode: "Immediate",
    };
    this.templateOptions = {
      create: (_args: { element: Element }) => {
        let duration: HTMLInputElement = document.createElement("input");
        duration.id = "duration";
        return duration;
      },
      write: (_args: { element: Element }) => {
        let dataSource: string[] = ["All", "1", "3", "4", "5", "6", "8", "9"];
        this.dropDownFilter = new DropDownList({
          dataSource: dataSource,
          value: "All",
          change: (e: ChangeEventArgs) => {
            let valuenum = +e.value;
            let id = <string>this.dropDownFilter.element.id;
            let value = <string>e.value;
            if (value !== "All") {
              this.treegrid.filterByColumn(id, "equal", valuenum);
            } else {
              this.treegrid.removeFilteredColsByField(id);
            }
          },
        });
        this.dropDownFilter.appendTo("#duration");
      },
    };
    this.selectOptions = { type: "Multiple" };
    this.selectionOptions = {
      type: "Multiple",
      mode: "Cell",
      cellSelectionMode: "Box",
    };
    this.pageSettings = { pageSize: 10 };
    this.editparams = { params: { format: "n" } };
  }

  ColumnVaue() {
    return [
      {
        field: "taskID",
        headerText: "Task ID",
        width: "70",
        textAlign: "Center",
        format: "",
        dataType: "string",
        bgColor: "red",
        fontSize: "15",
        fontColor: "white",
      },
      {
        field: "taskName",
        headerText: "Task Name",
        width: "200",
        textAlign: "Center",
        format: "",
        dataType: "string",
        bgColor: "red",
        fontSize: "15",
        fontColor: "white",
      },
      {
        field: "startDate",
        headerText: "Start Date",
        width: "90",
        textAlign: "Center",
        format: "yMd",
        dataType: "string",
        bgColor: "red",
        fontSize: "15",
        fontColor: "white",
      },
      {
        field: "endDate",
        headerText: "End Date",
        width: "90",
        textAlign: "Center",
        format: "yMd",
        dataType: "string",
        bgColor: "red",
        fontSize: "15",
        fontColor: "white",
      },
      {
        field: "duration",
        headerText: "Duration",
        width: "80",
        textAlign: "Center",
        format: "",
        dataType: "string",
        bgColor: "red",
        fontSize: "15",
        fontColor: "white",
      },
      {
        field: "progress",
        headerText: "Progress",
        width: "80",
        textAlign: "Center",
        format: "",
        dataType: "string",
        bgColor: "red",
        fontSize: "15",
        fontColor: "white",
      },
      {
        field: "priority",
        headerText: "Priority",
        width: "90",
        textAlign: "Center",
        format: "",
        dataType: "string",
        bgColor: "black",
        fontSize: "15",
        fontColor: "white",
      },
    ];
  }
  contextMenuOpen(args): void {
    this.rowIndex = args.rowInfo.rowIndex;
    this.cellIndex = args.rowInfo.cellIndex;
    this.treegrid.selectRows(this.selected_row_index);
  }
  customCopy() {
    this.row = this.rowIndex;
    const rows = this.treegrid.getSelectedRecords();
    this.seleted_rows = rows;
  }
  customCut() {
    this.row = this.rowIndex;
    this.is_cut = true;
    const rows = this.treegrid.getSelectedRecords();
    const rows_index = this.treegrid.getSelectedRowIndexes();
    this.selected_row_index = rows_index;
    this.seleted_rows = rows;
  }
  customPasteNext() {
    let tem_arr = this.data;
    tem_arr = [...tem_arr, ...this.seleted_rows];
    if (this.is_cut) {
      for (let i = 0; i < this.selected_row_index.length; i++) {
        delete tem_arr[this.selected_row_index[i]];
      }
      tem_arr = tem_arr.filter((item) => item !== undefined);
    }
    this.treegrid.dataSource = JSON.parse(JSON.stringify(tem_arr));
    this.is_cut = false;
    this.seleted_rows = [];
    this.selected_row_index = [];
  }
  customPasteChild() {
    let tem_arr = this.data;
    const array_obj = tem_arr[Number(this.rowIndex)];
    const new_array = [...array_obj, ...this.seleted_rows];
    array_obj.subtasks = new_array;
    tem_arr[this.rowIndex] = array_obj;
    if (this.is_cut) {
      for (let i = 0; i < this.selected_row_index.length; i++) {
        delete tem_arr[this.selected_row_index[i]];
      }
      tem_arr = tem_arr.filter((item) => item !== undefined);
    }
    this.treegrid.dataSource = JSON.parse(JSON.stringify(tem_arr));
    this.is_cut = false;
    this.seleted_rows = [];
    this.selected_row_index = [];
  }

  customDeleteRow() {
    const selectedRows = this.treegrid.getSelectedRows();
    selectedRows.map((x) => {
      this.treegrid.dataSource.splice(x, 1);
    });
    this.treegrid.refresh();
  }
  customEditRow() {
    this.treegrid.startEdit();
  }

  contextMenuClick(args?): void {
    if (args.item.id === "customCopy") {
      this.customCopy();
    } else if (args.item.id === "customCut") {
      this.customCut();
    } else if (args.item.id === "customPasteNext") {
      this.customPasteNext();
    } else if (args.item.id === "customPasteChild") {
      this.customPasteChild();
    } else if (args.item.id === "customDeleteRow") {
      this.customDeleteRow();
    } else if (args.item.id === "customEditRow") {
      this.customEditRow(args);
    } else if (args.item.id === "create-column") {
      this.addColumn();
    } else if (args.item.id === "edit-column") {
      this.editColumn(args?.column.index);
    } else if (args.item.id === "delete-column") {
      this.columns.splice(args?.column.index, 1);
    }
  }
  open(content) {
    this.modalService.open(content);
  }
  addColumn() {
    this.modalTitle = "Add Column";
    this.setModalDefaultValue();
    this.open(this.content);
  }
  editColumn(columnIndex) {
    this.modalTitle = "Edit Column";
    const data: Object = this.columns[columnIndex];
    const column = this.treegrid.getColumnByField(data.field);

    this.modalData = {
      id: columnIndex,
      field: column.field,
      headerText: column.headerText,
      width: column.width,
      bgColor: data.bgColor,
      fontSize: data.fontSize,
      fontColor: data.fontColor,
      dataType: data.type,
      textAlign: column.textAlign,
      type: column.type,
    };
    this.open(this.content);
  }
  setModalDefaultValue() {
    this.modalData = {
      id: "",
      field: "",
      headerText: "",
      dataType: "",
      bgColor: "",
      fontSize: "",
      fontColor: "",
      width: "70",
      textAlign: "Left",
      format: "",
    };
  }
  saveData() {
    if (this.modalData.headerText === "" || this.modalData.field === "") {
      alert("Plase Enter Data");
    } else if (this.modalData.id !== "") {
      this.columns[this.modalData.id].headerText = this.modalData.headerText;
      this.columns[this.modalData.id].bgColor = this.modalData.bgColor;
      this.columns[this.modalData.id].textAlign = this.modalData.textAlign;
      this.columns[this.modalData.id].fontColor = this.modalData.fontColor;
      this.columns[this.modalData.id].dataType = this.modalData.dataType;
      this.columns[this.modalData.id].format = this.modalData.format;
      this.columns[this.modalData.id].width = this.modalData.width;
      this.columns[this.modalData.id].fontSize = this.modalData.fontSize;
      console.log(this.modalData, "moda data");
      this.treegrid.refreshColumns();
      this.treegrid.refreshHeader();
      this.modalService.dismissAll();
    } else {
      this.columns.push(this.modalData);
      this.setModalDefaultValue();
      this.modalService.dismissAll();
    }
  }
}
