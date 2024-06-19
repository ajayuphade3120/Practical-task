import { Component, Inject, OnInit } from '@angular/core';
import {  FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { placeorderPayload, placeorderResponse, viewMedicineResponse, Medicine } from 'src/app/common/interfaces/patient.interface';
import { ApiService } from 'src/app/common/services/api/api.service';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent implements OnInit {

  placeorderForm!: FormGroup;
  medicinedata!: Medicine;
 
  userData: any = {};
  filteredOptions!: Observable<string[]>;

  constructor(
    public dialogRef: MatDialogRef<PlaceOrderComponent>,
    private fb: FormBuilder,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: { medicine_id: string }
  ) { 
    console.log(this.data.medicine_id);
  }

  ngOnInit(): void {
    const data = localStorage.getItem('patient');
    if (data) {
      this.userData = JSON.parse(data);
    }
    this.createForm();
    this.getmedicine(); // Call getmedicine to fetch and set the medicine details
  }

  createForm(): void {
    this.placeorderForm = this.fb.group({
      mobile: ['', [Validators.required, Validators.min(1000000000), Validators.max(9999999999)]],
      patient_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      delivery_type: ['', [Validators.required]],
      address: [''],
      state: [''],
      city: [''],
      items: this.fb.array([this.createItem()]),
      zipcode: ['', [Validators.required]],
      full_address: ['', [Validators.required]]
    });
  }

  createItem(): FormGroup {
    return this.fb.group({
      medicine_id: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]]
    });
  }

  get items(): FormArray {
    return this.placeorderForm.get('items') as FormArray;
  }

  addItem(): void {
    this.items.push(this.createItem());
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }
  getmedicine(): void {
    this.apiService.viewMedicine({ medicine_id: this.data.medicine_id }).subscribe((data: viewMedicineResponse) => {
      if (data.status_code === '1') {
        console.log('Response',data.data.id);
        this.medicinedata = data.data;
        this.placeorderForm.patchValue({
          medicine_id: this.medicinedata.id,
          
        });
      }
    });
  }
addPatient(): void {
  // Serialize the items array to a JSON string
  const itemsJsonString = JSON.stringify(this.placeorderForm.value.items.map((item: any) => ({
    medicine_id: item.medicine_id,
    quantity: item.quantity
  })));

  const payload: placeorderPayload = {
    apikey: 'wFIMP75eG1sQEh8vVAdXykgzF4mLhDw3', 
    mobile: this.placeorderForm.value.mobile,
    items: itemsJsonString, // Pass the JSON string to the API
    delivery_type: this.placeorderForm.value.delivery_type,
    address: this.placeorderForm.value.address,
    patient_name: this.placeorderForm.value.patient_name,
    last_name: this.placeorderForm.value.last_name,
    zipcode: this.placeorderForm.value.zipcode,
    state: this.placeorderForm.value.state,
    full_address: this.placeorderForm.value.full_address,
    city: this.placeorderForm.value.city
  };

  console.log('Payload to send:', payload); // Debugging line

  this.apiService.placeorder(payload).subscribe(
    (data: placeorderResponse) => {
      if (data.status_code === '1') {
        this.dialogRef.close();
      } else {
        alert(data.status_message); // Show the error message to the user
      }
    },
    (error) => {
      console.error('API Error:', error);
      alert('An error occurred while placing the order.');
    }
  );
}

  
}
