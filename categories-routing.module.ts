import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DmDonviComponent } from './dm-donvi/dm-donvi.component';
import { DMKhoidonviComponent } from './dm-khoidonvi/dm-khoidonvi.component';
import { DmNhomtrangthietbiComponent } from './dm-nhomtrangthietbi/dm-nhomtrangthietbi.component';
import { DmNoibaoduongsuachuaComponent } from './dm-noibaoduongsuachua/dm-noibaoduongsuachua.component';
import { DmNguonxangdauComponent } from './dm-nguonxangdau/dm-nguonxangdau.component';
import { DmNhomhienvatComponent } from './dm-nhomhienvat/dm-nhomhienvat.component';
import { DmLoaiXangDauComponent } from './dm-loaixangdau/dm-loaixangdau.component';

const routes: Routes = [
  {
    path: 'donvi',
    component: DmDonviComponent,
  },
  {
    path: 'khoidonvi',
    component: DMKhoidonviComponent,
  },
  {
    path:'nhomtrangthietbi',
    component: DmNhomtrangthietbiComponent
  },
  {
    path:'noibaoduongsuachua'
    ,component: DmNoibaoduongsuachuaComponent
  },
  {
    path:'nguonxangdau'
    ,component: DmNguonxangdauComponent
  },
  {
    path:'nhomhienvat'
    ,component: DmNhomhienvatComponent
  },
  {
    path:'loaixangdau'
    ,component: DmLoaiXangDauComponent
  }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CategoriesRoutingModule { }
