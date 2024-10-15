import { Component, OnInit,Input,Output,EventEmitter,ViewChild, } from '@angular/core';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-phantrang',
  templateUrl: './phantrang.component.html',
  styleUrls: ['./phantrang.component.scss']
})
export class PhantrangComponent implements OnInit {
  ngOnInit(): void {
    
  }
// Hiện ô chọn để thay đổi kích cỡ trang
  @Input() pageSizes: any[]=[];
  @Input() pageSize:number;// nhận và truyền qua lại cha con
  @Output() pageSizeChange=new EventEmitter<number>();
  onValueChanged(pageSize){
    this.pageSizeChange.emit(pageSize);
  }
//Hiện phần mô tả tổng quan
  @Input() nameData: string='Bản ghi'
  @Input() totalRows: number;


  @Input() page: number=1; // Thêm input cho trang hiện tại
  @Output() pageChange=new EventEmitter<number>();
  
  onPageChanged(page:number){
    this.pageChange.emit(page)
  }

}
