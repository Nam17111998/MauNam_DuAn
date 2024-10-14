import { Component, OnInit, ViewChild,ElementRef  } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { clone, NotificationService,SystemConstants } from 'src/app/shared';
import { dxButtonConfig, PaginatorConfig } from 'src/app/shared/config';
import { ResponseData } from 'src/app/shared/models';
import { DuLieuLichXeNguonNhienLieuService } from "src/app/shared/services/dulieu_lichxe_nguonnhienlieu.service";
import { DxDataGridComponent } from "devextreme-angular";
//in
import DataSource from 'devextreme/data/data_source';
import { SummaryConfig, GroupConfig } from "src/app/shared/components/print/print.component"
@Component({
    selector: 'app-dulieu-lichxe-nguonlieu',
    templateUrl: './dulieu-lichxe-nguonnhienlieu.component.html',
    styleUrls: ['./dulieu-lichxe-nguonnhienlieu.component.scss']
})
export class DuLieuLichXeNguonNhienLieuComponent implements OnInit {
    @ViewChild('dataGrid', { static: false }) dataGrid: DxDataGridComponent;
    @ViewChild('detail', { static: false }) detail: any;
    placeholderSearch = 'Nhập tên nguồn nhiên liệu';
    title = 'Danh sách nguồn nhiên liệu hàng năm';
    autoNavigateToFocusedRow = true;
    //Lấy thông tin người dùng 
    user: any;

    nameData:string='Nguồn Nhiên Liệu';

    items: any[] = [];//lấy hết dữ liệu về
    item:any={};
    //focus
    focusKey = '';
    currentEntity: any = {};
  
    nam: number = new Date().getFullYear();

    pageSize: number = PaginatorConfig.pageSize;
    pageSizes: number[] = PaginatorConfig.allowedPageSizes;
    pageIndex: number = 1;
    totalRows: number = 0;

    dxButtonConfig = dxButtonConfig;
    gridTitle: string = 'Nguồn nhiên liệu'; // Thêm tiêu đề cho bảng
    dataSource: DataSource;
    constructor(
        private DuLieuLichXeNguonNhienLieuService: DuLieuLichXeNguonNhienLieuService,
        private notificationService: NotificationService,
        private router: Router,
        private route: ActivatedRoute,

    ) {   this.dataSource = new DataSource({
        key: 'IdNhienLieu', 
        load: (loadOptions: any) => {
            return this.DuLieuLichXeNguonNhienLieuService.processCommand('DULIEU_LICHXE_NGUONNHIENLIEU_LIST', {
                Number: null,
                PageIndex: null,
                PageSize: null
            }).toPromise()
            .then((response: any) => {
                if (response.ReturnStatus.Code === 0) {
                    return {
                        data: response.ReturnData,
                        totalCount: response.ReturnData.length > 0 ? response.ReturnData[0].TotalRow : 0
                    };
                } else {
                    this.notificationService.showError('Dữ liệu tải lỗi!');
                    return { data: [], totalCount: 0 };
                }
            })
            .catch((error) => {
                this.notificationService.showError('Hệ thống xảy ra lỗi!');
                console.error('Error loading data:', error);
                return { data: [], totalCount: 0 };
            });
        }
    });}

    ngOnInit(): void {
        this.loadData();
    }
//Thêm mới
    //Mở popup
    // mở form thêm mới 
    isOpenAddForm: boolean=false;
    OpenPopUp(){
        this.currentId = null;
        this.isOpenAddForm=true;
    }
    //Đóng popup
    closePopup(event){
        this.isOpenAddForm=event;
      
    }
    //Sau khi thêm mới thành công để nó tự động load lại bảng qua items
    //lấy id từ khi lúc thêm mới để gọi selectOne
    id:any;
    getId(event){
        this.id=event;
        this.DuLieuLichXeNguonNhienLieuService.processCommand('DULIEU_LICHXE_NGUONNHIENLIEU_GET_INFO',{IdNhienLieu:this.id}).subscribe(
            (Response:any) => {
                this.item=Response.ReturnData;
                if(this.item.Nam==this.nam)
                this.items.push(Response.ReturnData);//push là thêm vào cuối unshift() là đầu
                this.totalRows=this.totalRows+1;//để mỗi lần thêm thì tổng số bản ghi sẽ tăng lên 1 
            })
    }
//Kết thức thêm mới

    loadData() {
 
        this.DuLieuLichXeNguonNhienLieuService.processCommand('DULIEU_LICHXE_NGUONNHIENLIEU_LIST', { Number: this.nam, PageIndex: this.pageIndex, PageSize:this.pageSize }).subscribe(
            (response: any) => {
                if (response.ReturnStatus.Code == 0) {
                    this.items = response.ReturnData;
                    //có dữ liệu trả về thì mới gán giá trị không thì chi bằng null hết
                    if (response.ReturnData.length > 0) {
                        this.currentEntity = this.items[0];
                        this.focusKey = this.currentEntity.IdNhienLieu;
                        this.totalRows=this.currentEntity.TotalRow;
                    } else {
                        this.focusKey = '';
                        this.currentEntity = {};
                        this.totalRows=0;
                        setTimeout(() => {
                            this.detail.validationEntity.instance.reset();
                        }, 10);
                    
                    }
       
                } else {
                    this.notificationService.showError('Dữ liệu tải lỗi!');
                }
             
            },
            (_: any) => {
                this.notificationService.showError('Hệ thống xảy ra lỗi!');
          
           
            }
        );
    }
    delete(id: any, name: string) {
        this.notificationService.showConfirmation(
            "Bạn có chắc chắn muốn xóa nguồn nhiên liệu '" + name + "'?",
            () => {
                this.DuLieuLichXeNguonNhienLieuService.processCommand('DULIEU_LICHXE_NGUONNHIENLIEU_DELETE', { IdNhienLieu: id }).subscribe(
                    (response: ResponseData) => {
                        if (response.ReturnStatus.Code == 0) {
                            this.items = this.items.filter((o) => o.IdNhienLieu != id);
                            this.notificationService.showSuccess(
                                "Đã xóa thành công  '" + name + "'!"
                            );
                        } else {
                            this.notificationService.showError('Xoá không thành công!' + response.ReturnStatus.Message);
                        }
                    },
                    (_: any) => {
                        this.notificationService.showError('Lỗi hệ thống!');
                    }
                );
                if (this.items.length <= 0) {
                    this.currentEntity = {};
                    this.currentEntity.KichHoat = false;
                } else {
                    this.currentEntity = this.items[0];
                }
                this.focusKey = this.currentEntity.IdNhienLieu;
                // this.state = 'detail';
            }
        );
    }

    onFocusedRowChanged(e: any) {
        this.currentEntity = clone(e.row.data);
        // this.state = 'detail';
    }
    // năm thay đổi (truyền biến cha con) thì load lại trang
    handleChangeNam($event){
        this.loadData();

    }
    //khi ấn nút edit
    currentId:any;
    update(id:any){
        this.isOpenAddForm=true;
        this.currentId=id;
    }
// ---------------------------
//Khi update xong ta thay giá trị cũ vào mảng items
onDataUpdated(updatedData: any) {
    const index = this.items.findIndex(item => item.IdNhienLieu === updatedData.IdNhienLieu);
    if (index !== -1 ) {
      // Cập nhật dữ liệu trong mảng
      this.items[index] = { ...this.items[index], ...updatedData };
      if(updatedData.nam!=this.nam)
      this.loadData();
    }
  }
  
//=======================================phân trang
  pageChanged(event: any) {
    // this.pageIndex = event.page;
    this.pageIndex=event;
    this.loadData();
  }

  pageSizeChanged(event: any) {
    // this.pageSize = event.pageSize;
    this.pageSize=event;
    this.pageIndex = 1;
    this.loadData();
  }
  summaryConfigs: SummaryConfig[] = [
    { fieldName: 'KhoiLuong', summaryType: 'sum', caption: 'Tổng khối lượng' },
    { fieldName: 'KhoiLuong', summaryType: 'avg', caption: 'Trung bình khối lượng' }
  ];

  groupConfigs: GroupConfig[] = [
    { fieldName: 'Nam', caption: 'Năm' },
    { fieldName: 'TenNguonXangDau', caption: 'Nguồn xăng dầu' },
    { fieldName: 'TenLoaiXangDau', caption: 'Loại xăng dầu' }
  ];

}



