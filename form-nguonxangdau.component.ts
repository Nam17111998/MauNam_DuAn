import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { clone } from 'src/app/shared';
import { DMNguonXangDauService } from 'src/app/shared/services/dm-nguonxangdau.service';
@Component({
  selector: 'app-form-nguonxangdau',
  templateUrl: './form-nguonxangdau.component.html',
  styleUrls: ['./form-nguonxangdau.component.scss']
})
export class FormNguonxangdauComponent implements OnInit {




  @ViewChild('validationEntity', { static: false }) validationEntity: any;
  @Input() entity : any = {};
    
  g
  @Input() listData: any[] = [];
  private _state = 'detail';
  @Input() set state(value) {
    this._state = value;
    this.readOnly = value == 'detail';
  }
  get state() {
    return this._state;
  }
  readOnly: boolean = true;
  
  constructor(
    private service: DMNguonXangDauService
  ) {
    this.validationExiting = this.validationExiting.bind(this);
  }

  ngOnInit(): void {}


  validationExiting(e){
    if (this.state == 'insert') {
      let index = this.listData.findIndex(x => x.MaNguonXangDau == e.value);

      if (index > -1) return false;
      return true;
    } else if (this.state == 'edit') {
      let index = this.listData.findIndex(x => x.MaNguonXangDau == e.value && x.MaNguonXangDau != this.entity.MaNguonXangDau);
      if (index > -1) return false;
      return true;
    } else {
      return true;
    }
    
  }
}
