import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { clone, NotificationService } from 'src/app/shared';
import { DMNguonXangDauService } from 'src/app/shared/services/dm-nguonxangdau.service';
import { dxButtonConfig, PaginatorConfig } from 'src/app/shared/config';
import { ResponseData } from 'src/app/shared/models';
import DataSource from 'devextreme/data/data_source';
import { DxDataGridComponent } from 'devextreme-angular';
import { SummaryConfig,GroupConfig } from 'src/app/shared/components/print/print.component';
@Component({
  selector: 'app-dm-nguonxangdau',
  templateUrl: './dm-nguonxangdau.component.html',
  styleUrls: ['./dm-nguonxangdau.component.scss']
})



export class DmNguonxangdauComponent implements OnInit {
  @ViewChild('dataGrid', { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild('detail', { static: false }) detail: any;
  placeholderSearch = 'Nhập tên Nguồn xăng dầu...';
  title = 'Danh sách nguồn xăng dầu';
  optionsBtnFilter = {
    icon: 'find',
    type: 'default',
    visible: true,
    onClick: this.onFilter.bind(this),
  };
  dxButtonConfig = dxButtonConfig;

  //status
  isShowDetail = true;
  focusKey = '';
  state: string = 'detail';
  autoNavigateToFocusedRow = true;
  loading = false;
  isLa: boolean = true;

  //pagination
  pageSize: number = PaginatorConfig.pageSize;
  pageSizes: number[] = PaginatorConfig.allowedPageSizes;
  pageIndex: number = 1;
  totalRows: number = 0;

  textSearch: string = '';

  //data
  allData: any[] = [];
  listData = [];

  currentEntity: any = {};
  expandedIds: any[] = [];
  dataSource: DataSource;
  constructor(
    private DMNguonXangDauService: DMNguonXangDauService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.dataSource = new DataSource({
      key: 'IdNhienLieu', 
      load: (loadOptions: any) => {
          return this.DMNguonXangDauService.processCommand('DM_NGUONXANGDAU_LIST', {
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
  });
  }


  ngOnInit(): void {
    this.getInitial();
  }
  loadData() {
    this.loading = true;
    const payload = { KeyWord: this.textSearch };
    console.log('Sending payload:', payload);
    this.DMNguonXangDauService.processCommand('DM_NGUONXANGDAU_LIST', { KeyWord: this.textSearch }).subscribe(
      (response: any) => {
        if (response.ReturnStatus.Code == 0) {
          this.allData = response.ReturnData;
          if (response.ReturnData.length > 0) {
            this.paging();
            this.currentEntity = this.allData[0];
            this.focusKey = this.currentEntity.MaNguonXangDau;
          } else {
            this.focusKey = '';
            this.currentEntity = {};
            setTimeout(() => {
              this.detail.validationEntity.instance.reset();
            }, 10);
            this.state = 'detail';
          }
          this.totalRows = response.ReturnData.length;
        } else {
          this.notificationService.showError('Dữ liệu tải lỗi!');
          this.totalRows = 0;
        }
        this.loading = false;
      },
      (_: any) => {
        this.notificationService.showError('Hệ thống xảy ra lỗi!');
        this.totalRows = 0;
        this.loading = false;
      }
    );
  }

  getInitial() {
    const paramsFromRouter = this.route.snapshot.queryParamMap;
    let queryParams: any = {};
    if (!paramsFromRouter.get('pageSize')) {
      queryParams.pageSize = this.pageSize.toString();
    }
    if (!paramsFromRouter.get('pageIndex')) {
      queryParams.pageIndex = this.pageIndex.toString();
    }
    if (!paramsFromRouter.get('textSearch')) {
      queryParams.textSearch = this.textSearch;
    }
    this.router
      .navigate(['./categories/nguonxangdau'], {
        queryParams,
        queryParamsHandling: 'merge',
      })
      .then(() => {
        this.getParams();
        this.loadData();
      });
  }
  getParams() {
    const queryParams = this.route.snapshot.queryParamMap;
    const queryPageSize = queryParams.get('pageSize');
    const queryPageIndex = queryParams.get('pageIndex');
    const queryText = queryParams.get('textSearch');

    this.pageSize =
      queryPageSize &&
      !isNaN(parseInt(queryPageSize, 10)) &&
      PaginatorConfig.allowedPageSizes.includes(parseInt(queryPageSize, 10))
        ? parseInt(queryPageSize, 10)
        : PaginatorConfig.pageSize;
    this.pageIndex =
      queryPageIndex && parseInt(queryPageIndex, 10) > 0
        ? parseInt(queryPageIndex, 10)
        : 1;
    this.textSearch = queryText && queryText.length > 0 ? queryText : '';
  }
  paging() {
    const fromIndex = this.pageSize * (this.pageIndex - 1);
    const toIndex = fromIndex + this.pageSize;
    this.listData = this.allData.slice(fromIndex, toIndex);
  }
  pageChanged(event: any) {
    if (this.totalRows > 0) {
      this.router.navigate(['/categories/nguonxangdau'], { queryParams: { pageIndex: event.page }, queryParamsHandling: 'merge' })
        .then(() => this.paging());
    }
  }
  pageSizeChanged(event: any) {
    if (this.totalRows > 0) {
      this.router.navigate(['/categories/nguonxangdau'], { queryParams: { pageSize: event.pageSize }, queryParamsHandling: 'merge' })
        .then(() => this.paging());
    }
  }
  onFilter() {
    this.router
      .navigate(['/categories/nguonxangdau'], {
        queryParams: { textSearch: this.textSearch },
        queryParamsHandling: 'merge',
      })
      .then(() => this.loadData());
  }
  add() {
    this.detail.entity = {};//Khởi tạo đối tượng rỗng cho entity
    this.detail.entity.KichHoat = false;
    this.state = 'insert';//Hiển thị nút thêm mới 
    this.detail.validationEntity.instance.reset();//đặt lại trạng thái validation để tránh việc dữ liệu cũ làm ảnh hưởng
  }
  edit() {
    this.state = 'edit';
  }
  cancel() {
    this.state = 'detail';
    this.detail.entity.MaNguonXangDau = -1;
    setTimeout(() => {
      this.detail.entity = this.currentEntity;
    }, 10);
  }
  save() {
    if (!this.detail.validationEntity.instance.validate().isValid) {
      this.notificationService.showError('Thông tin nhập không hợp lệ!');
      return;
    }
    const body = clone(this.detail.entity);

    if (this.state == 'insert') {
      //
      this.DMNguonXangDauService.processCommand('DM_NGUONXANGDAU_ADD', body).subscribe(
        (response: ResponseData) => {
          if (response.ReturnStatus.Code == 0) {
            this.notificationService.showSuccess(
              'Thêm mới thành công !'
            );
            // this.loadData();
            this.allData.push(body);
            // this.paging();
            this.currentEntity = clone(body);
            this.focusKey = this.currentEntity.MaNguonXangDau;
            // this.getTreeDonvi(this.allData);
            setTimeout(() => {
              this.state = 'detail';
              this.detail.validationEntity.instance.reset();
              this.totalRows = this.allData.length;
            }, 100);
            this.totalRows++;
          } else {
            this.notificationService.showError('Không thành công!' + response.ReturnStatus.Message);
          }
        },
        (_: any) => {
          this.notificationService.showError('Lỗi hệ thống!');
        }
      );
    } else {
      this.DMNguonXangDauService.processCommand('DM_NGUONXANGDAU_UPDATE', body).subscribe(
        (response: ResponseData) => {
          if (response.ReturnStatus.Code == 0) {
            this.notificationService.showSuccess('Cập nhật thành công!');
            this.loadData(); // load lại trang 
            // const index1 = this.listData.findIndex(
            //   (o) => o.MaKhoiDonVi == response.Data
            // );
            // this.listData[index1] = this.detail.entity;
            const index2 = this.allData.findIndex(
              (o) => o.MaNhomTrangBi == response.ReturnData
            );
            this.allData[index2] = this.detail.entity;
            this.state = 'detail';
          } else {
            this.notificationService.showError('Không thành công!' + response.ReturnStatus.Message);
          }
        },
        (_: any) => {
          this.notificationService.showError('Lỗi hệ thống!');
        }
      );
    }
  }
  delete(id: any, name: string) {
    this.notificationService.showConfirmation(
      "Bạn có chắc chắn muốn xóa nguồn xăng dầu '" + name + "'?",
      () => {
          this.DMNguonXangDauService.processCommand('DM_NGUONXANGDAU_DELETE', { MaNguonXangDau: id }).subscribe(
            (response: ResponseData) => {
              if (response.ReturnStatus.Code == 0) {
                this.allData = this.allData.filter((o) => o.MaNguonXangDau != id);
                this.totalRows = this.allData.length;
                // this.paging();
                this.notificationService.showSuccess(
                  "Đã xóa thành công  '" + name + "'!"
                );
              } else {
                this.notificationService.showError('Xoá nguồn xăng dầu không thành công!' + response.ReturnStatus.Message);
              }
            },
            (_: any) => {
              this.notificationService.showError('Lỗi hệ thống!');
            }
          );
        if (this.allData.length <= 0) {
          this.currentEntity = {};
          this.currentEntity.KichHoat = false;
        } else {
          this.currentEntity = this.allData[0];
        }
        this.focusKey = this.currentEntity.MaNguonXangDau;
        this.state = 'detail';
      }
    );
  }

  toggleDetail() {
    this.isShowDetail = !this.isShowDetail;
  }
  onFocusedRowChanged(e: any) {
    this.currentEntity = clone(e.row.data);
    this.state = 'detail';
  }
  summaryConfigs:SummaryConfig[]= [
 
  ];

  groupConfigs:GroupConfig[] = [

  ];
}

