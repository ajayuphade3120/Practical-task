import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/common/services/api/api.service';
import { MatDialog } from '@angular/material/dialog';
import { viewMedicineResponse , Medicine} from 'src/app/common/interfaces/patient.interface';
import { PlaceOrderComponent } from '../place-order/place-order.component';
@Component({
  selector: 'app-checkout-medicine',
  templateUrl: './checkout-medicine.component.html',
  styleUrls: ['./checkout-medicine.component.css']
})
export class CheckoutMedicineComponent implements OnInit {


 
  id: string = '';
    medicinedata!: Medicine;

    constructor(public dialog: MatDialog,private route: ActivatedRoute, private apiService: ApiService ) { }

    ngOnInit(): void {
      // Get patient id from query param
      this.route.queryParams.subscribe(params => {
          this.id = params['medicine_id'];
          this.loadMedicines();
      });
  }

  loadMedicines(): void {
    // Get patient data
    this.apiService.viewMedicine({medicine_id:this.id}).subscribe((data: viewMedicineResponse) => {
        if (data.status_code === '1') {
          console.log('api response', data);
          
            this.medicinedata = data.data;
        }
    });
}

openDialog(medicine_id?: string) {
  this.dialog.open(PlaceOrderComponent, {
      data: {
          medicine_id
      },
  });
}

}
