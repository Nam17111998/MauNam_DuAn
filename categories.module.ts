import { DxButtonModule, DxTextBoxModule, DxNumberBoxModule, DxToolbarModule, DxDataGridModule, DxSelectBoxModule, DxScrollViewModule, DxTextAreaModule, DxValidationGroupModule, DxValidatorModule, DxLoadPanelModule, DxTreeListModule, DxPopupModule, DxCheckBoxModule, DxRadioGroupModule, DxTabPanelModule, DxListModule, DxTreeViewModule, DxDropDownBoxModule } from 'devextreme-angular';
import { ComponentsSharedModule } from './../../../../shared/components/components-shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesRoutingModule } from './categories-routing.module';
import { SharedDirectivesModule } from 'src/app/shared';
import { DmDonviComponent } from './dm-donvi/dm-donvi.component';
import { FormDonviComponent } from './dm-donvi/form-donvi/form-donvi.component';
import { DMKhoidonviComponent } from './dm-khoidonvi/dm-khoidonvi.component';
import { FormKhoidonviComponent } from './dm-khoidonvi/form-khoidonvi/form-khoidonvi.component';
import { DmNhomtrangthietbiComponent } from './dm-nhomtrangthietbi/dm-nhomtrangthietbi.component';
import { FormNhomtrangthietbiComponent } from './dm-nhomtrangthietbi/form-nhomtrangthietbi/form-nhomtrangthietbi.component';
import { DmNoibaoduongsuachuaComponent } from './dm-noibaoduongsuachua/dm-noibaoduongsuachua.component';
import { FormNoibaoduongsuachuaComponent } from './dm-noibaoduongsuachua/form-noibaoduongsuachua/form-noibaoduongsuachua.component';
import { DmNguonxangdauComponent } from './dm-nguonxangdau/dm-nguonxangdau.component';
import { FormNguonxangdauComponent } from './dm-nguonxangdau/form-nguonxangdau/form-nguonxangdau.component';
import { DmNhomhienvatComponent } from './dm-nhomhienvat/dm-nhomhienvat.component';
import { FormNhomhienvatComponent } from './dm-nhomhienvat/form-nhomhienvat/form-nhomhienvat.component';
import { DmLoaiXangDauComponent } from './dm-loaixangdau/dm-loaixangdau.component';
import { FormLoaiXangDauComponent } from './dm-loaixangdau/form-loaixangdau/form-loaixangdau.component';

@NgModule({
  declarations: [
    FormDonviComponent,
    DmDonviComponent,
    DMKhoidonviComponent,
    FormKhoidonviComponent,
    DmNhomtrangthietbiComponent,
    FormNhomtrangthietbiComponent,
    DmNoibaoduongsuachuaComponent,
    FormNoibaoduongsuachuaComponent,
    DmNguonxangdauComponent,
    FormNguonxangdauComponent,
    DmNhomhienvatComponent,
    FormNhomhienvatComponent,
    DmLoaiXangDauComponent,
    FormLoaiXangDauComponent,
  ],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    ComponentsSharedModule,
    SharedDirectivesModule,
        //3rd
    DxButtonModule,
    DxTextBoxModule,
    DxNumberBoxModule,
    DxToolbarModule,
    DxDataGridModule,
    DxSelectBoxModule,
    DxScrollViewModule,
    DxTextAreaModule,
    DxValidationGroupModule,
    DxValidatorModule,
    DxLoadPanelModule,
    DxTreeListModule,
    DxTreeViewModule,
    DxPopupModule,
    DxCheckBoxModule,
    DxRadioGroupModule,
    DxTabPanelModule,
    DxPopupModule,
    DxListModule,
    DxDropDownBoxModule,
    ComponentsSharedModule
  ]
})
export class CategoriesModule { }

