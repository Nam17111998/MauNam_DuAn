import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';

import { event } from 'jquery';
import { dxButtonConfig, PaginatorConfig } from 'src/app/shared/config';
import { DuLieuLichXeNguonNhienLieuService } from 'src/app/shared/services/dulieu_lichxe_nguonnhienlieu.service';
import { clone, NotificationService, SystemConstants } from 'src/app/shared';
import { DMNguonXangDauService } from 'src/app/shared/services/dm-nguonxangdau.service';

@Component({
  selector: 'app-form-nguonnhienlieu',
  templateUrl: './form-nguonnhienlieu.component.html',
  styleUrls: ['./form-nguonnhienlieu.component.scss'],
})
export class FormNguonnhienlieuComponent implements OnInit {
  @Output() closePopup = new EventEmitter<boolean>();
  @Output() IdAdded = new EventEmitter<any>();

  dxButtonConfig = dxButtonConfig;

  //Thông tin ng dùng
  user: any;
  //lấy địa chỉ ID khi click vào nút sửa
  @Input() idNhienLieu: any;
  item: any = {};
  //Kết thúc ---------------------------------
  constructor(
    private DuLieuLichXeNguonNhienLieuService: DuLieuLichXeNguonNhienLieuService,
    private notificationService: NotificationService,
    private dmNguonXangDauService: DMNguonXangDauService
  ) {}

  ngOnChanges() {
    if (this.idNhienLieu != null) {
      this.DuLieuLichXeNguonNhienLieuService.processCommand(
        'DULIEU_LICHXE_NGUONNHIENLIEU_GET_INFO',
        { IdNhienLieu: this.idNhienLieu }
      ).subscribe((response: any) => {
        this.item = response.ReturnData;

      });
    } else {
      this.item = {};
    }
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USER));
  }

  //Lưu sửa dữ liệu
  @Input() add: boolean;
  @Output() updateData = new EventEmitter<any>();
  data: any = {};
  saveData(event) {
    event.preventDefault();
    if (this.idNhienLieu == null) {

        this.DuLieuLichXeNguonNhienLieuService.processCommand(
          'DULIEU_LICHXE_NGUONNHIENLIEU_ADD',
          {
            ...this.item,
            NguoiTao: this.user.Id
          }
        ).subscribe((response: any) => {
          if (response.ReturnStatus.Code == 0) {
            this.IdAdded.emit(response.ReturnData); //gán giá trị id vào sự kiện (con cha)
            this.closePopup.emit(false); //đóng popup
            this.item={};
            this.notificationService.showSuccess('Thêm mới thành công');
          }
        });
    } else {
      this.DuLieuLichXeNguonNhienLieuService.processCommand(
        'DULIEU_LICHXE_NGUONNHIENLIEU_UPDATE',
        {
          ...this.item,
          NguoiCapNhat: this.user.Id
        }
      ).subscribe(() => {
        this.DuLieuLichXeNguonNhienLieuService.processCommand(
          'DULIEU_LICHXE_NGUONNHIENLIEU_GET_INFO',
          { IdNhienLieu: this.idNhienLieu }
        ).subscribe((response: any) => {
          this.data = response.ReturnData;
          this.closePopup.emit(false);
          this.updateData.emit(this.data);
          this.notificationService.showSuccess('Cập nhật thành công');
        });
      });
    }
  }

  //
  @Input() edit: boolean;
  editData() {}
}

