import { Component,Inject } from '@angular/core';
import { OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Pipe, PipeTransform } from '@angular/core';
import { Data } from './provider/data';


export interface Documents {
  set_id: number;
  doc_id: number;
  name: string;
  status: string;
  uploader: string;
  preview_url: string;
  date_uploaded: string;
}
export interface TabDetails{
  set_id : number;
  name : string;
  status : string;
  date_uploaded : string,
  documents : Array<Documents>;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  displayedColumns: string[] = ['set_id', 'doc_id', 'name', 'status', 'uploader','preview_url', 'date_uploaded'];
  dataSource: MatTableDataSource<Documents>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

public showPagination = false;
  public items = [];
  public selectDocument = [];
  title = 'dashboard';
  constructor(public dialog: MatDialog, public data : Data) {
  }
  ngOnInit() {
    this.data.getData()
    .subscribe(
          (data : any) => {
            this.items = data;
              
          },
          error => {
              console.log("Error", error);
          }
      );
}
openItem($event,item){
  event.stopPropagation()
  this.selectDocument = item.documents;
  if(this.selectDocument.length > 3){
    this.showPagination = true;
  }else{
    this.showPagination = false;
  }
  this.dataSource = new MatTableDataSource(this.selectDocument);
  this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
}
applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  rowClick(item){
    const dialogRef = this.dialog.open(DialogForEditRow, {
      width: '1000px',
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
   
      var set = item.set_id;
      if(result == 'delete'){
        var remInd = this.items.findIndex(function(item, i){
          return item.set_id === set;
        });
      var index =   this.items[remInd].documents.indexOf(item);
      this.items[remInd].documents.splice(index,1);
    
      this.selectDocument = this.items[remInd].documents;
      this.dataSource = new MatTableDataSource(this.selectDocument);
      this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }

    });
  }

}

@Component({
  selector: 'DialogForEditRow',
  templateUrl: 'DialogForEditRow.html',
  styleUrls: ['./app.component.css']
})
export class DialogForEditRow {
public  editBtn : boolean;
public docid: any;
public name : any;
public status : any;
public uploader : any;
public url : any;
  constructor(
    public dialogRef: MatDialogRef<DialogForEditRow>,
    @Inject(MAT_DIALOG_DATA) public data: Documents) {
      this.editBtn = false;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  edit(){
    this.docid =this.data.doc_id;
    this.url = this.data.preview_url;
    this.uploader = this.data.uploader;
    this.name = this.data.name;
    this.status = this.data.status;
    this.editBtn = !this.editBtn;
  }
  save(){
    this.data.doc_id = this.docid;
    this.data.preview_url = this.url;
    this.data.uploader = this.uploader;
    this.data.name = this.name;
    this.data.status = this.status;
    this.editBtn = !this.editBtn;
  }
  Delete(){
    this.dialogRef.close("delete");
  }

}

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any, searchText: string): any[] {
    if(!items) return [];
    if(!searchText) return items;
searchText = searchText.toLowerCase();
return items.filter( it => {
  
       if(it.name.includes(searchText) || it.status.includes(searchText) ){
         return it;
       }
    });
   }
}
